export interface Certification {
  certNm: string
  certIng?: string
  certYn: 'Y' | 'N'
}

export interface Allergen {
  algCsgMtrNm: string
}

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
