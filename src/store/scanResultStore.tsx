import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  fetchAllergyInfo,
  fetchNutritionInfo,
  fetchIngredientInfo,
  fetchCertificationInfo,
  fetchProduct,
} from '@/libs/api/food-qr'
import type { Allergen, Certification, ScanResultData } from '@/types/scanData'
import { parseHtml } from '@/utils/parseHtml'

export type Status = 'loading' | 'success' | 'error'

interface ScanResultStore {
  status: Status
  data: ScanResultData | null
  tags: string[]
  scan: (barcode: string) => Promise<void>
}

export const useScanResultStore = create<ScanResultStore>()(
  persist(
    set => ({
      status: 'loading',
      data: null,
      tags: [],

      scan: async (barcode: string) => {
        set({ status: 'loading' })
        try {
          const [productRes, ingredientRes, allergyRes, nutritionRes, certRes] = await Promise.all([
            fetchProduct(barcode),
            fetchIngredientInfo(barcode),
            fetchAllergyInfo(barcode),
            fetchNutritionInfo(barcode),
            fetchCertificationInfo(barcode),
          ])
          const standardInfo = productRes
          const itemsIngredient = ingredientRes?.response?.body?.items?.item.prvwCn ?? ''
          const itemsAllergy = allergyRes?.response?.body?.items?.item ?? []
          const itemsCert = certRes?.response?.body?.items?.item ?? []

          const productName = standardInfo.prdctNm ?? itemsAllergy[0]?.prdctNm ?? ''
          const ingredients = parseHtml(itemsIngredient)
          const allergens = itemsAllergy.map((i: Allergen) => i.algCsgMtrNm).filter(Boolean)
          const certifications = (itemsCert as Certification[])
            .filter(c => c.certYn === 'Y')
            .map(c => ({
              certNm: c.certNm,
              certIng: c.certIng,
              certYn: c.certYn,
            }))
          const tags: string[] = []
          if (productName) tags.push(`${productName}`)
          if (barcode) tags.push(`${barcode}`)
          if (standardInfo.foodSeCdNm) tags.push(`${standardInfo.foodSeCdNm}`)

          const newData: ScanResultData = {
            barcode,
            productName,
            tags,
            ingredients,
            allergens,
            nutrition: nutritionRes,
            certifications,
            timestamp: Date.now(),
          }

          // ui 상태 세팅
          set({ data: newData, status: 'success' })
        } catch (err) {
          console.error(err)
          set({ status: 'error' })
        }
      },
    }),
    {
      name: 'scan-result-local',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
