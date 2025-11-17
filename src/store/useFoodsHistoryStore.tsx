'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

import {
  initFoodDB,
  addFoodsHistory,
  getAllFoodsHistory,
  deleteFoodsHistory,
  getFoodHistoryByOrder,
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
   * 음식 히스토리 항목을 IndexedDB 및 Zustand 스토어에 추가합니다.
   *
   * @param food - 추가할 음식 히스토리 엔트리
   * @returns 비동기 작업을 나타내는 Promise
   */
  addFoodsHistoryItem: (food: FoodHistoryEntry) => Promise<void>

  /**
   * 주어진 order 를 가진 음식 히스토리 항목을 삭제합니다.
   * IndexedDB와 Zustand 스토어에서 모두 삭제됩니다.
   *
   * @param order - 삭제할 음식 히스토리의 order 값
   * @returns 비동기 작업을 나타내는 Promise
   */
  removeFoodItem: (order: number) => Promise<void>

  /**
   * IndexedDB 에 저장된 모든 음식 히스토리를 조회하여
   * Zustand 스토어의 foods 상태를 초기화/동기화합니다.
   *
   * @returns 비동기 작업을 나타내는 Promise
   */
  loadFoods: () => Promise<void>

  /**
   * 주어진 order 에 해당하는 단일 음식 히스토리 항목을 조회합니다.
   *
   * @param order - 조회할 음식 히스토리의 order 값
   * @returns 조회된 FoodHistoryEntry 또는 존재하지 않을 경우 undefined를 담은 Promise
   */
  getFoodItemByOrder: (order: number) => Promise<FoodHistoryEntry | undefined>
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

      async addFoodsHistoryItem(food) {
        await addFoodsHistory(food)
        set({ foods: preprocessFoodsHistory([...get().foods, food]) })
      },

      async removeFoodItem(order) {
        await deleteFoodsHistory(order)
        set({ foods: get().foods.filter(f => f.order !== order) })
      },

      async loadFoods() {
        const allFoods = await getAllFoodsHistory()
        set({ foods: preprocessFoodsHistory(allFoods) })
      },

      async getFoodItemByOrder(order) {
        return getFoodHistoryByOrder(order)
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
 */
initFoodDB()
