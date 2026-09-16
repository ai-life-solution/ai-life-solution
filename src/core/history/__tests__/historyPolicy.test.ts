import { describe, expect, it } from 'bun:test'

import type { FoodHistoryEntry } from '@/types/FoodData'

import { computeEvictionKeys, MAX_FOODS_HISTORY, sanitizeAndSortHistory } from '../historyPolicy'

function createSampleEntry(
  key: number,
  timestamp: number,
  barcode = '8801234567890',
  productName = '샘플 식품'
): FoodHistoryEntry {
  return {
    key,
    timestamp,
    barcode,
    productName,
    weight: '100g',
    tags: [],
    ingredients: [],
    allergens: [],
    nutritions: [],
    certifications: [],
  }
}

describe('historyPolicy (Functional Core)', () => {
  describe('C-01: sanitizeAndSortHistory', () => {
    it('null 또는 undefined 입력 시 빈 배열을 반환해야 한다', () => {
      expect(sanitizeAndSortHistory(null)).toEqual([])
      expect(sanitizeAndSortHistory(undefined)).toEqual([])
      expect(sanitizeAndSortHistory([])).toEqual([])
    })

    it('필수 필드(key, timestamp, barcode, productName)가 유효하지 않은 엔트리를 필터링해야 한다', () => {
      const invalidEntries = [
        createSampleEntry(1, 1000),
        {
          key: 'invalid',
          timestamp: 1000,
          barcode: '123',
          productName: 'A',
        } as unknown as FoodHistoryEntry,
        {
          key: 2,
          timestamp: null,
          barcode: '123',
          productName: 'B',
        } as unknown as FoodHistoryEntry,
        { key: 3, timestamp: 1000, barcode: 123, productName: 'C' } as unknown as FoodHistoryEntry,
        {
          key: 4,
          timestamp: 1000,
          barcode: '123',
          productName: null,
        } as unknown as FoodHistoryEntry,
        null as unknown as FoodHistoryEntry,
        undefined as unknown as FoodHistoryEntry,
      ]

      const result = sanitizeAndSortHistory(invalidEntries)
      expect(result).toHaveLength(1)
      expect(result[0].key).toBe(1)
    })

    it('timestamp 기준 내림차순(최신순)으로 정렬해야 한다', () => {
      const entries = [
        createSampleEntry(1, 1000),
        createSampleEntry(2, 3000),
        createSampleEntry(3, 2000),
      ]

      const result = sanitizeAndSortHistory(entries)
      expect(result.map(e => e.key)).toEqual([2, 3, 1])
    })

    it(`최대 ${MAX_FOODS_HISTORY}개까지만 반환해야 한다`, () => {
      const entries = Array.from({ length: 250 }, (_, i) => createSampleEntry(i, i * 100))

      const result = sanitizeAndSortHistory(entries)
      expect(result).toHaveLength(MAX_FOODS_HISTORY)
      // 최신 timestamp는 249 * 100
      expect(result[0].key).toBe(249)
      expect(result[result.length - 1].key).toBe(250 - MAX_FOODS_HISTORY)
    })
  })

  describe('C-02: computeEvictionKeys', () => {
    it('엔트리 수가 limit 이하인 경우 빈 배열을 반환해야 한다', () => {
      const entries = [createSampleEntry(1, 1000), createSampleEntry(2, 2000)]
      expect(computeEvictionKeys(entries, 200)).toEqual([])
      expect(computeEvictionKeys([], 200)).toEqual([])
    })

    it('limit을 초과한 경우 최신 limit개에 들지 못하는 오래된 엔트리 키들을 반환해야 한다', () => {
      const entries = [
        createSampleEntry(1, 1000), // 가장 오래됨 -> 제거 대상
        createSampleEntry(2, 2000), // 두 번째로 오래됨 -> 제거 대상
        createSampleEntry(3, 3000),
        createSampleEntry(4, 4000),
        createSampleEntry(5, 5000),
      ]

      // limit이 3개인 경우 최신순 상위 3개(5, 4, 3) 유지, 2와 1이 eviction 대상
      const evictionKeys = computeEvictionKeys(entries, 3)
      expect(evictionKeys.sort()).toEqual([1, 2])
    })

    it('C-07: key가 유효한 숫자가 아닌 손상된 엔트리는 축출 키에서 제외되어야 한다 (undefined 방지)', () => {
      const entries = [
        createSampleEntry(1, 1000),
        createSampleEntry(2, 2000),
        createSampleEntry(3, 3000),
        { timestamp: 500 } as unknown as FoodHistoryEntry, // key 없음
        { key: 'corrupted', timestamp: 400 } as unknown as FoodHistoryEntry, // key가 숫자가 아님
      ]

      // limit: 2 (유효한 최신 3, 2 유지, 1만 유효한 삭제 대상 키)
      const evictionKeys = computeEvictionKeys(entries, 2)
      expect(evictionKeys).toEqual([1])
    })
  })
})
