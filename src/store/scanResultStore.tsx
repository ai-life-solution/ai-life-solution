import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import {
  fetchAllergyInfo,
  fetchCertificationInfo,
  fetchIngredientInfo,
  fetchNutritionInfo,
  fetchProduct,
} from '@/libs/api/food-qr'
import type { ScanResultData } from '@/types/scanData'
import transformResData from '@/utils/foodQrtransformer'

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

          const newData = transformResData({
            productRes,
            ingredientRes,
            allergyRes,
            nutritionRes,
            certRes,
            barcode,
          })

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
