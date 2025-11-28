import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { addSummary, getFoodItem } from '@/services/getFoodItem'
import type { FoodItem } from '@/types/FoodItem'

export type Status = 'loading' | 'success' | 'error'

interface ScanResultStore {
  status: Status
  data: FoodItem | { barcode: string } | null
  scan: (barcode: string) => Promise<void>
}

/**
 * 타입 가드: scanResult가 FoodItem인지 확인
 */
function isFoodItem(obj: unknown): obj is FoodItem {
  // null 체크 + object인지 체크
  if (obj && typeof obj === 'object') {
    const keys = Object.keys(obj)
    return 'barcode' in obj && keys.length > 1
  }
  return false
}

export const useScanResultStore = create<ScanResultStore>()(
  persist(
    set => ({
      status: 'loading',
      data: null,

      /**
       * 바코드를 받아 상품 정보를 조회하는 비동기 액션
       */
      scan: async (barcode: string) => {
        set({ status: 'loading', data: null })
        try {
          const scanResult = await getFoodItem(barcode)
          set({ data: scanResult, status: 'success' })

          // scanResult가 단순 { barcode } 객체이면 요약 건너뛰기
          if (!isFoodItem(scanResult)) {
            return
          }

          // FoodItem이면 요약 진행
          const description = await addSummary(scanResult)
          if (description) {
            set(state => ({
              ...state,
              data: {
                ...(state.data as FoodItem),
                description,
              },
              status: 'success',
            }))
          }
        } catch {
          set({ status: 'error', data: null })
        }
      },
    }),
    {
      name: 'scan-result-local',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
