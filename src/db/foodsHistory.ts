'use client'

import { openDB, type IDBPDatabase } from 'idb'

import type FoodData from '@/types/FoodData'
import type { FoodHistoryEntry } from '@/types/FoodData'

export const MAX_FOODS_HISTORY = 200

let dbPromise: Promise<IDBPDatabase<FoodData>> | undefined

/**
 * FoodData용 IndexedDB 인스턴스를 보장해서 반환합니다.
 */
function ensureFoodDB(): Promise<IDBPDatabase<FoodData>> {
  if (!dbPromise) {
    initFoodDB()
  }
  return dbPromise as Promise<IDBPDatabase<FoodData>>
}

/**
 * 음식 히스토리 엔트리 배열을 정제 및 정렬하고 최대 개수 제한을 적용합니다.
 *
 * @param entries - 정제 및 정렬할 음식 히스토리 엔트리 배열
 * @returns 정제 및 정렬된 음식 히스토리 엔트리 배열
 */
export function preprocessFoodsHistory(
  entries?: FoodHistoryEntry[] | null
): FoodHistoryEntry[] {
  if (!entries?.length) return []

  const sanitized = entries.filter(
    (entry): entry is FoodHistoryEntry =>
      !!entry &&
      typeof entry.order === 'number' &&
      typeof entry.productCode === 'string' &&
      typeof entry.productName === 'string'
  )

  const sorted = [...sanitized].sort((a, b) => b.order - a.order)

  return sorted.slice(0, MAX_FOODS_HISTORY)
}

/**
 * IndexedDB에 저장된 음식 히스토리 개수가 최대 개수를 넘지 않도록 오래된 항목을 삭제합니다.
 *
 * @param db - FoodData용 IndexedDB 인스턴스
 * @param cachedEntries - 선택 사항으로, 이미 로드된 음식 히스토리 엔트리 배열
 */
async function enforceFoodsHistoryLimit(
  db: IDBPDatabase<FoodData>,
  cachedEntries?: FoodHistoryEntry[]
): Promise<void> {
  const entries = cachedEntries ?? (await db.getAll('foodsHistory'))

  if (entries.length <= MAX_FOODS_HISTORY) return

  const limitedEntries = preprocessFoodsHistory(entries)
  const orderWhitelist = new Set(limitedEntries.map(entry => entry.order))

  await Promise.all(
    entries
      .filter(entry => !orderWhitelist.has(entry.order))
      .map(entry => db.delete('foodsHistory', entry.order))
  )
}

/**
 * FoodData용 IndexedDB를 초기화합니다.
 * 스토어 및 인덱스가 존재하지 않을 경우 생성합니다.
 *
 * @returns 초기화된 IndexedDB 인스턴스를 나타내는 Promise
 */
export function initFoodDB(): Promise<IDBPDatabase<FoodData>> {
  dbPromise = openDB<FoodData>('FoodData', 1, {
    upgrade(db) {
      const store = db.createObjectStore('foodsHistory', { keyPath: 'order' })
      store.createIndex('by-productCode', 'productCode')
    },
  })
  return dbPromise
}

/**
 * 음식 히스토리 엔트리를 추가하거나 갱신하고,
 * 저장된 전체 히스토리 개수가 최대 개수를 넘지 않도록 정리합니다.
 *
 * @param food - 추가 또는 갱신할 음식 히스토리 엔트리
 */
export async function addFoodsHistory(food: FoodHistoryEntry): Promise<void> {
  const db = await ensureFoodDB()
  await db.put('foodsHistory', food)
  await enforceFoodsHistoryLimit(db)
}

/**
 * order 값으로 특정 음식 히스토리 엔트리를 조회합니다.
 *
 * @param order - 조회할 음식 히스토리의 order 값
 * @returns 조회된 음식 히스토리 엔트리 또는 존재하지 않으면 undefined
 */
export async function getFoodHistoryByOrder(
  order: number
): Promise<FoodHistoryEntry | undefined> {
  const db = await ensureFoodDB()
  return db.get('foodsHistory', order)
}

/**
 * 모든 음식 히스토리 엔트리를 조회하고,
 * 최대 개수 제한을 적용한 뒤 정제된 결과를 반환합니다.
 *
 * @returns 정제 및 정렬된 음식 히스토리 엔트리 배열
 */
export async function getAllFoodsHistory(): Promise<FoodHistoryEntry[]> {
  const db = await ensureFoodDB()
  const allFoods = await db.getAll('foodsHistory')
  await enforceFoodsHistoryLimit(db, allFoods)
  return preprocessFoodsHistory(allFoods)
}

/**
 * order 값으로 특정 음식 히스토리 엔트리를 삭제합니다.
 *
 * @param order - 삭제할 음식 히스토리의 order 값
 * @returns 삭제 작업이 완료되면 resolve되는 Promise
 */
export async function deleteFoodsHistory(order: number): Promise<void> {
  const db = await ensureFoodDB()
  await db.delete('foodsHistory', order)
}
