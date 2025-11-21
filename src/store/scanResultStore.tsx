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
import transformResData from '@/utils/foodQrTransformer'

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

      /**
       * 바코드를 받아 상품 정보를 조회하는 비동기 액션
       * - 5개의 푸드 QR API(기본, 원재료, 알러지, 영양, 인증)를 병렬로 호출합니다.
       * - 응답받은 데이터를 UI용 포맷으로 변환하여 data 상태에 저장합니다.
       * @param barcode - 조회할 상품의 바코드 번호
       */
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
