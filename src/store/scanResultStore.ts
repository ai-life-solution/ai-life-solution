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

let currentScanId = 0

export const useScanResultStore = create<ScanResultStore>()(
  persist(
    set => ({
      status: 'loading',
      data: null,

      /**
       * 바코드를 받아 상품 정보를 조회하는 비동기 액션
       */
      scan: async (barcode: string) => {
        const scanId = ++currentScanId
        set({ status: 'loading', data: null })
        try {
          const scanResult = await getFoodItem(barcode)
          if (scanId !== currentScanId) return

          set({ data: scanResult, status: 'success' })

          // scanResult가 단순 { barcode } 객체이면 요약 건너뛰기
          if (!isFoodItem(scanResult)) {
            return
          }

          // FoodItem이면 요약 진행
          const description = await addSummary(scanResult)
          if (scanId !== currentScanId) return

          if (description) {
            set(state => {
              if (
                !state.data ||
                !('barcode' in state.data) ||
                state.data.barcode !== scanResult.barcode
              ) {
                return state
              }
              return {
                ...state,
                data: {
                  ...state.data,
                  description,
                } as FoodItem,
                status: 'success',
              }
            })
          }
        } catch {
          if (scanId === currentScanId) {
            set({ status: 'error', data: null })
          }
        }
      },
    }),
    {
      name: 'scan-result-local',
      storage: createJSONStorage(() => localStorage),
    }
  )
)
