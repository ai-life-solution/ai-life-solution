import type { FoodHistoryEntry } from '@/types/FoodData'

export const MAX_FOODS_HISTORY = 200

/**
 * 음식 히스토리 엔트리 배열의 유효성을 검증하고, 최신순으로 정렬하며 최대 개수 제한을 적용합니다.
 * (Functional Core: 순수 함수)
 *
 * @param entries - 정제 및 정렬할 음식 히스토리 엔트리 배열
 * @param limit - 최대 보관 개수 (기본값: MAX_FOODS_HISTORY)
 * @returns 정제 및 최신순 정렬된 음식 히스토리 엔트리 배열
 */
export function sanitizeAndSortHistory(
  entries?: FoodHistoryEntry[] | null,
  limit: number = MAX_FOODS_HISTORY
): FoodHistoryEntry[] {
  if (!entries?.length) return []

  const sanitized = entries.filter(
    (entry): entry is FoodHistoryEntry =>
      !!entry &&
      typeof entry.key === 'number' &&
      typeof entry.timestamp === 'number' &&
      typeof entry.barcode === 'string' &&
      typeof entry.productName === 'string'
  )

  const sorted = [...sanitized].sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0))

  return sorted.slice(0, limit)
}

/**
 * 저장 한도를 초과했을 때 IndexedDB 등 저장소에서 제거해야 할 오래된 엔트리의 Key 목록을 계산합니다.
 * (Functional Core: 순수 함수)
 *
 * @param allEntries - 현재 저장소에 있는 모든 음식 히스토리 엔트리
 * @param limit - 최대 보관 개수 (기본값: MAX_FOODS_HISTORY)
 * @returns 축출(삭제)해야 할 엔트리 키 배열
 */
export function computeEvictionKeys(
  allEntries: FoodHistoryEntry[],
  limit: number = MAX_FOODS_HISTORY
): number[] {
  if (allEntries.length <= limit) return []

  const retainedEntries = sanitizeAndSortHistory(allEntries, limit)
  const retainedKeySet = new Set(retainedEntries.map(entry => entry.key))

  return allEntries
    .filter(entry => typeof entry?.key === 'number' && !retainedKeySet.has(entry.key))
    .map(entry => entry.key)
}
