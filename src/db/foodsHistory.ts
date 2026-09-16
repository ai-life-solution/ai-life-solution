'use client'

import { openDB, type IDBPDatabase } from 'idb'

import { computeEvictionKeys, sanitizeAndSortHistory } from '@/core/history/historyPolicy'
import type FoodData from '@/types/FoodData'
import type { FoodHistoryEntry } from '@/types/FoodData'

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
 * IndexedDB에 저장된 음식 히스토리 개수가 최대 개수를 넘지 않도록 오래된 항목을 삭제합니다.
 * (Imperative Shell: Core의 computeEvictionKeys 결과를 바탕으로 DB I/O 실행)
 *
 * @param db - FoodData용 IndexedDB 인스턴스
 * @param cachedEntries - 선택 사항으로, 이미 로드된 음식 히스토리 엔트리 배열
 */
async function enforceFoodsHistoryLimit(
  db: IDBPDatabase<FoodData>,
  cachedEntries?: FoodHistoryEntry[]
): Promise<void> {
  const entries = cachedEntries ?? (await db.getAll('foodsHistory'))
  const evictionKeys = computeEvictionKeys(entries)

  if (evictionKeys.length === 0) return

  await Promise.all(evictionKeys.map(key => db.delete('foodsHistory', key)))
}

/**
 * FoodData용 IndexedDB를 초기화합니다.
 * 스토어 및 인덱스가 존재하지 않을 경우 생성합니다.
 *
 * @returns 초기화된 IndexedDB 인스턴스를 나타내는 Promise
 */
export function initFoodDB(): Promise<IDBPDatabase<FoodData>> {
  dbPromise = openDB<FoodData>('FoodData', 2, {
    upgrade(db, _oldVersion, _newVersion, transaction) {
      const store = db.objectStoreNames.contains('foodsHistory')
        ? transaction.objectStore('foodsHistory')
        : db.createObjectStore('foodsHistory', { keyPath: 'key' })

      if ((store.indexNames as unknown as DOMStringList).contains('by-productCode')) {
        ;(store as unknown as { deleteIndex: (name: string) => void }).deleteIndex('by-productCode')
      }
      if (!store.indexNames.contains('by-barcode')) {
        store.createIndex('by-barcode', 'barcode')
      }
      if (!store.indexNames.contains('by-timestamp')) {
        store.createIndex('by-timestamp', 'timestamp')
      }
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
 * key 값으로 특정 음식 히스토리 엔트리를 조회합니다.
 *
 * @param key - 조회할 음식 히스토리의 key 값
 * @returns 조회된 음식 히스토리 엔트리 또는 존재하지 않으면 undefined
 */
export async function getFoodHistoryByKey(key: number): Promise<FoodHistoryEntry | undefined> {
  const db = await ensureFoodDB()
  return db.get('foodsHistory', key)
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
  return sanitizeAndSortHistory(allFoods)
}

/**
 * key 값으로 특정 음식 히스토리 엔트리를 삭제합니다.
 *
 * @param key - 삭제할 음식 히스토리의 key 값
 * @returns 삭제 작업이 완료되면 resolve되는 Promise
 */
export async function deleteFoodsHistory(key: number): Promise<void> {
  const db = await ensureFoodDB()
  await db.delete('foodsHistory', key)
}
