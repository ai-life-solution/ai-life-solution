import type { DBSchema } from 'idb'

/**
 * 식품 원재료 정보를 나타내는 인터페이스입니다.
 */
export interface FoodIngredient {
  /**
   * 원재료명
   */
  name: string

  /**
   * 원재료의 양
   */
  amount: number

  /**
   * 원재료의 단위 (예: g, %, mg 등)
   */
  unit: string
}

/**
 * 식품 영양 성분 정보를 나타내는 인터페이스입니다.
 */
export interface FoodNutrients {
  /**
   * 영양 성분명 (예: 단백질, 지방 등)
   */
  name: string

  /**
   * 영양 성분의 양
   */
  amount: number

  /**
   * 영양 성분의 단위 (예: g, mg 등)
   */
  unit: string
}

/**
 * 식품 중량 정보를 나타내는 인터페이스입니다.
 */
export interface FoodWeight {
  /**
   * 중량 값
   */
  amount: number

  /**
   * 중량 단위 (예: g, kg 등)
   */
  unit: string
}

/**
 * IndexedDB에 저장되는 식품 데이터 스키마입니다.
 */
export default interface FoodData extends DBSchema {
  /**
   * 바코드로 스캔한 식품 히스토리 컬렉션입니다.
   */
  foodsHistory: {
    /**
     * 키 값 (스캔 순서를 의미하는 order)
     */
    key: number

    /**
     * 저장되는 실제 식품 히스토리 엔트리 값입니다.
     */
    value: {
      /**
       * 스캔 순서를 나타내는 고유 번호입니다.
       */
      order: number

      /**
       * 식품 바코드 번호입니다.
       */
      productCode: string

      /**
       * 식품 이름입니다.
       */
      productName: string

      /**
       * 알레르기 유발 성분 목록입니다.
       */
      allergens: string[]

      /**
       * 영양 성분 목록입니다.
       */
      nutrients: FoodNutrients[]

      /**
       * 총 중량 정보입니다.
       */
      weight: FoodWeight

      /**
       * 원재료 구성 정보입니다.
       */
      ingredients: FoodIngredient[]
    }

    /**
     * IndexedDB 인덱스 정의입니다.
     * - 'by-productCode': productCode 필드 기준 인덱스
     */
    indexes: {
      'by-productCode': string
    }
  }
}

/**
 * 단일 식품 히스토리 엔트리를 나타내는 타입입니다.
 */
export type FoodHistoryEntry = FoodData['foodsHistory']['value']
