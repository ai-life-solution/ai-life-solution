/**
 * 공공데이터 푸드 QR API 공통 응답 래퍼
 */
export interface FoodQrResponse<T> {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      items: {
        item: T | T[] // 결과가 하나일 땐 객체, 여러 개일 땐 배열
      }
      numOfRows: number
      pageNo: number
      totalCount: number
    }
  }
}

/**
 * 기본 정보 (ProductInfo)
 */
export interface ProductInfo {
  /** 바코드 번호 */
  brcdNo: string
  /** 제품명 */
  prdctNm: string
  /** 용량/중량 (예: 150g) */
  ctv: string
  /** 식품 분류 (예: 과자, 음료 등) */
  foodSeCdNm?: string
}

/**
 * 인증 정보 (Certification)
 */
export interface Certification {
  /** 제조사/업체명 */
  bsshNm: string
  /** 인증 구분명 (예: HACCP) */
  certNm: string
  /** 인증 기관 */
  certIng?: string
  /** 인증 여부 */
  certYn: 'Y' | 'N'
}

/**
 * 알레르기 유발 원재료 정보
 */
export interface Allergen {
  /** 알레르기 유발 물질 명칭 */
  algCsgMtrNm: string
}

/**
 * 원재료 정보
 */
export interface Ingredient {
  /** 원재료명 */
  prvwCn: string
}

/**
 * API에서 넘어오는 원본 영양 성분 정보
 */
export interface RawNutritionItem {
  /** 영양소 이름 (예: 나트륨) */
  nirwmtNm: string
  /** 함량 값 (문자열로 올 수 있어 확인 필요, 예: "1270") */
  cta: number
  /** 단위 (예: mg) */
  igrdUcd: string
  /** 1일 영양성분 기준치에 대한 비율 (%) */
  ntrtnRt?: number
}

/**
 * 앱 내부에서 사용하는 가공된 영양 정보
 */
export interface Nutrition {
  /** 영양소 이름 (예: "나트륨") */
  name: string
  /** 함량 값 (예: 1270) */
  amount: number
  /** 단위 (예: "mg") */
  unit: string
  /** 일일 영양성분 기준치 (%) */
  dailyRatio?: number
}

/**
 * UI 렌더링을 위해 가공된 최종 스캔 결과 데이터
 * - 여러 API(기본정보, 영양, 알러지 등)의 응답을 하나로 병합 및 정제한 형태입니다.
 */
export interface ScanResultData {
  /** 스캔한 상품의 바코드 번호 (Key 역할) */
  barcode: string

  /** 제품명 (예: '새우깡') */
  productName: string

  /**제품 중량 */
  weight: number

  /**카테고리 */
  category: string

  /** 제품 분류 또는 특징 태그 목록 */
  tags: string[]

  /** 원재료명 목록 (긴 줄글을 파싱하여 배열로 변환됨) */
  ingredients: string[]

  /** 알레르기 유발 물질 목록 (예: ['대두', '밀', '우유']) */
  allergens: string[]

  /** 영양정보 객체 배열 (영양소이름, 함량, 단위, 일일영양성분기준치) */
  nutritions: Nutrition[]

  /** 인증 정보 객체 배열 (HACCP 등) */
  certifications: Certification[]

  /** * 데이터 생성(스캔) 시점 (Unix Timestamp)
   * - 히스토리 정렬 또는 캐시 만료 체크에 사용
   */
  timestamp: number
}
