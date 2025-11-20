export interface FoodQrResponse<T> {
  response: {
    header: {
      resultCode: string
      resultMsg: string
    }
    body: {
      items: {
        item: T | T[]
      }
      numOfRows: number
      pageNo: number
      totalCount: number
    }
  }
}



// 기본 정보
export interface ProductInfo {
  brcdNo: string
  prdctNm: string
  ctv:string //중량
  foodSeCdNm?: string //식품분류
}

// 인증 정보
export interface Certification {
  bsshNm:string //제조사이름
  certNm: string
  certIng?: string
  certYn: 'Y' | 'N'
}

// 알러지 유발 원재료 정보
export interface Allergen {
  algCsgMtrNm: string
}

// 원재료 정보
export interface Ingredient {
  prvwCn:string
}

// 영양 성분 정보
export interface RawNutritionItem {
  nirwmtNm: string;
  cta: number;
  igrdUcd: string;
  ntrtnRt?: number;
}

export interface Nutrition {       
  nirwmtNm: string; // 영양소 이름 (예: "나트륨")
  cta: number;  // 함량 값 (예: 1270)
  igrdUcd: string;// 단위 (예: "mg")
  ntrtnRt?: number; //일일 영양성분 기준치 (%)
}

// 스캔결과 데이터
export interface ScanResultData {
  barcode: string
  productName: string
  tags: string[]
  ingredients: string[]
  allergens: string[]
  nutrition: string[]
  certifications: Certification[]
  timestamp: number
}