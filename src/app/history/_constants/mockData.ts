import type { FoodHistoryEntry } from '@/types/FoodData'

const now = Date.now()

export const MOCK_DATA: FoodHistoryEntry[] = [
  {
    barcode: '8801234000011',
    productName: '유기농 오트밀',
    weight: '500g',
    category: '시리얼',
    tags: ['유기농', '오트밀', '8801234000011'],
    ingredients: [
      '귀리',
      '설탕',
      '소금',
    ],
    allergens: ['글루텐', '견과류'],
    nutritions: [
      { name: '단백질', amount: 5, unit: 'g' },
      { name: '지방', amount: 3, unit: 'g' },
    ],
    certifications: [],
    timestamp: now - 1000 * 60 * 60 * 24 * 1,
    order: 1,
  },
  {
    barcode: '8801234000028',
    productName: '저지방 그릭 요거트',
    weight: '150g',
    category: '유제품',
    tags: ['요거트', '저지방', '8801234000028'],
    ingredients: [
      '원유',
      '유산균',
    ],
    allergens: ['우유'],
    nutritions: [
      { name: '단백질', amount: 10, unit: 'g' },
      { name: '지방', amount: 2, unit: 'g' },
    ],
    certifications: [
      { bsshNm: 'Healthy Dairy', certNm: 'HACCP', certYn: 'Y', certIng: undefined },
    ],
    timestamp: now - 1000 * 60 * 60 * 24 * 2,
    order: 2,
  },
  {
    barcode: '8801234000035',
    productName: '무가당 아몬드 음료',
    weight: '1L',
    category: '음료',
    tags: ['아몬드', '무가당', '8801234000035'],
    ingredients: [
      '정제수',
      '아몬드추출물',
    ],
    allergens: ['견과류'],
    nutritions: [
      { name: '단백질', amount: 1, unit: 'g' },
      { name: '지방', amount: 2, unit: 'g' },
    ],
    certifications: [],
    timestamp: now - 1000 * 60 * 60 * 24 * 3,
    order: 3,
  },
  {
    barcode: '8801234000042',
    productName: '현미 혼합 잡곡밥',
    weight: '210g',
    category: '즉석밥',
    tags: ['현미', '잡곡밥', '8801234000042'],
    ingredients: [
      '현미',
      '찹쌀',
      '검정콩',
      '기타잡곡',
    ],
    allergens: [],
    nutritions: [
      { name: '탄수화물', amount: 35, unit: 'g' },
      { name: '단백질', amount: 4, unit: 'g' },
    ],
    certifications: [{ bsshNm: 'Grainy', certNm: '유기가공식품', certYn: 'Y' }],
    timestamp: now - 1000 * 60 * 60 * 24 * 4,
    order: 4,
  },
  {
    barcode: '8801234000059',
    productName: '닭가슴살 샐러드',
    weight: '200g',
    category: '샐러드',
    tags: ['샐러드', '단백질', '8801234000059'],
    ingredients: [
      '닭가슴살',
      '양상추',
      '방울토마토',
      '드레싱',
    ],
    allergens: ['계란', '대두'],
    nutritions: [
      { name: '단백질', amount: 22, unit: 'g' },
      { name: '지방', amount: 6, unit: 'g' },
    ],
    certifications: [],
    timestamp: now - 1000 * 60 * 60 * 24 * 5,
    order: 5,
  },
]
