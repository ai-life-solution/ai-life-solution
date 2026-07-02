'use client'

import { toast } from 'sonner'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import {
  initFoodDB,
  addFoodsHistory,
  getAllFoodsHistory,
  deleteFoodsHistory,
  getFoodHistoryByKey,
  preprocessFoodsHistory,
} from '@/db/foodsHistory'
import type { FoodHistoryEntry } from '@/types/FoodData'

/**
 * 음식 히스토리 상태 인터페이스입니다.
 */
interface FoodState {
  /**
   * 메모리에 적재된 음식 히스토리 목록입니다.
   */
  foods: FoodHistoryEntry[]

  /**
   * IndexedDB에서 음식을 로딩 중인지 여부입니다.
   */
  isLoading: boolean

  /**
   * 최소 한 번 이상 IndexedDB와 동기화를 시도했는지 여부입니다.
   */
  isInitialized: boolean

  /**
   * 마지막 로딩 시도에서 발생한 에러 메시지입니다.
   */
  lastError?: string

  /**
   * 음식 히스토리 항목을 IndexedDB 및 Zustand 스토어에 추가합니다.
   *
   * @param food - 추가할 음식 히스토리 엔트리
   * @returns 비동기 작업을 나타내는 Promise
   */
  addFoodsHistoryItem: (food: FoodHistoryEntry) => Promise<void>

  /**
   * 주어진 key 를 가진 음식 히스토리 항목을 삭제합니다.
   * IndexedDB와 Zustand 스토어에서 모두 삭제됩니다.
   *
   * @param key - 삭제할 음식 히스토리의 key 값
   * @returns 비동기 작업을 나타내는 Promise
   */
  removeFoodItem: (key: number) => Promise<void>

  /**
   * IndexedDB 에 저장된 모든 음식 히스토리를 조회하여
   * Zustand 스토어의 foods 상태를 초기화/동기화합니다.
   *
   * @returns 비동기 작업을 나타내는 Promise
   */
  loadFoods: () => Promise<void>

  /**
   * 주어진 key 에 해당하는 단일 음식 히스토리 항목을 조회합니다.
   *
   * @param key - 조회할 음식 히스토리의 key 값
   * @returns 조회된 FoodHistoryEntry 또는 존재하지 않을 경우 undefined를 담은 Promise
   */
  getFoodItemByKey: (key: number) => Promise<FoodHistoryEntry | undefined>

  /**
   * 주어진 key 에 해당하는 음식 히스토리 항목을 업데이트합니다.
   *
   * @param key - 업데이트할 음식 히스토리의 key 값
   * @param updates - 업데이트할 필드들
   * @returns 비동기 작업을 나타내는 Promise
   */
  updateFoodItem: (key: number, updates: Partial<FoodHistoryEntry>) => Promise<void>
}

/**
 * 음식 히스토리를 관리하는 Zustand 스토어입니다.
 * - IndexedDB(`foodsHistory` 스토어)와 연동되어 데이터 영속성을 보장합니다.
 * - Zustand persist 미들웨어를 사용해 메모리 상태를 localStorage 에도 저장합니다.
 */
export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      foods: [],
      isLoading: false,
      isInitialized: false,
      lastError: undefined,

      async addFoodsHistoryItem(food) {
        await addFoodsHistory(food)
        set({ foods: preprocessFoodsHistory([...get().foods, food]) })
      },

      async removeFoodItem(key) {
        await deleteFoodsHistory(key)
        set({ foods: get().foods.filter(f => f.key !== key) })
      },

      async loadFoods() {
        if (get().isLoading) return

        set({ isLoading: true, lastError: undefined })

        try {
          const allFoods = await getAllFoodsHistory()
          set({ foods: preprocessFoodsHistory(allFoods) })
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Unknown error while loading foods history'
          set({ lastError: message })
          toast.error(`Failed to load foods history: ${message}`)
          throw error
        } finally {
          set({ isLoading: false, isInitialized: true })
        }
      },

      async getFoodItemByKey(key) {
        return getFoodHistoryByKey(key)
      },

      async updateFoodItem(key, updates) {
        const existing = await getFoodHistoryByKey(key)
        if (!existing) {
          throw new Error(`key ${key}에 해당하는 항목을 찾을 수 없습니다.`)
        }
        const updated = { ...existing, ...updates }
        await addFoodsHistory(updated)
        set({ foods: get().foods.map(f => (f.key === key ? updated : f)) })
      },
    }),
    {
      name: 'food-history-storage',
      /**
       * Zustand 상태를 localStorage 에 저장합니다.
       * IndexedDB 에 저장되는 실제 데이터와는 별도의 스냅샷 상태입니다.
       */
      storage: createJSONStorage(() => localStorage),
    }
  )
)

/**
 * FoodData용 IndexedDB를 초기화합니다.
 * 페이지 진입 시 애플리케이션 상단에서 한 번 호출되어야 합니다.
 * 서버 환경(SSR)에서는 indexedDB 가 없어 오류가 발생하므로 브라우저에서만 호출합니다.
 */
if (typeof window !== 'undefined') {
  initFoodDB().catch(error => {
    console.error('Failed to initialize FoodData IndexedDB', error)
  })
}
