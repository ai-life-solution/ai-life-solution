'use client'

import { toast } from 'sonner'
import { create } from 'zustand'

import {
  initFoodDB,
  addFoodsHistory,
  getAllFoodsHistory,
  deleteFoodsHistory,
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
}

/**
 * 기존 localStorage(food-history-storage) 데이터를 IndexedDB로 최초 1회 마이그레이션합니다.
 */
async function migrateFromLocalStorageIfNeeded(): Promise<FoodHistoryEntry[]> {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('food-history-storage')
    if (!raw) return []
    const parsed = JSON.parse(raw)
    const legacyFoods = parsed?.state?.foods as FoodHistoryEntry[] | undefined
    if (Array.isArray(legacyFoods) && legacyFoods.length > 0) {
      for (const food of legacyFoods) {
        await addFoodsHistory(food)
      }
      localStorage.removeItem('food-history-storage')
      return legacyFoods
    }
  } catch (err) {
    console.warn('Failed to migrate legacy localStorage history:', err)
  }
  return []
}

/**
 * 음식 히스토리를 관리하는 Zustand 스토어입니다.
 * - IndexedDB(`foodsHistory` 스토어)를 단일 신뢰 원천(SSOT)으로 사용합니다.
 */
export const useFoodStore = create<FoodState>()((set, get) => ({
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
      let allFoods = await getAllFoodsHistory()
      if (allFoods.length === 0) {
        const migrated = await migrateFromLocalStorageIfNeeded()
        if (migrated.length > 0) {
          allFoods = await getAllFoodsHistory()
        }
      }
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
}))

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
