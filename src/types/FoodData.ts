import type { FoodItem } from '@/types/FoodItem'

import type { DBSchema } from 'idb'

/**
 * IndexedDB에 저장되는 식품 데이터 스키마입니다.
 */
export default interface FoodData extends DBSchema {
  /**
   * 바코드로 스캔한 식품 히스토리 컬렉션입니다.
   */
  foodsHistory: {
    /**
     * IndexedDB key 값
     * - Date.now()를 사용해 생성된 고유 키입니다.
     */
    key: number

    /**
     * 저장되는 실제 식품 히스토리 엔트리 값입니다.
     */
    value: FoodHistoryEntry

    /**
     * IndexedDB 인덱스 정의입니다.
     * - 'by-productCode': productCode 필드 기준 인덱스
     * - 'by-timestamp': timestamp 필드 기준 인덱스
     */
    indexes: {
      'by-productCode': string
      'by-timestamp': number
    }
  }
}

/**
 * 단일 식품 히스토리 엔트리를 나타내는 타입입니다.
 * - FoodItem 에 IndexedDB key 를 추가한 형태입니다.
 */
export type FoodHistoryEntry = FoodItem & { key: number }
