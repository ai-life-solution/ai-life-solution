import type { FoodHistoryEntry } from '@/types/FoodData'

export const MOCK_DATA: FoodHistoryEntry[] = [
  {
    order: 1,
    productCode: 'ABC123',
    productName: '유기농 오트밀',
    allergens: ['글루텐', '견과류'],
    nutrients: [
      { name: '단백질', amount: 5, unit: 'g' },
      { name: '지방', amount: 3, unit: 'g' },
    ],
    weight: { amount: 500, unit: 'g' },
    ingredients: [
      { name: '귀리', amount: 85, unit: '%' },
      { name: '설탕', amount: 10, unit: '%' },
      { name: '소금', amount: 5, unit: '%' },
    ],
  },
  {
    order: 2,
    productCode: 'DEF456',
    productName: '저지방 그릭 요거트',
    allergens: ['우유'],
    nutrients: [
      { name: '단백질', amount: 10, unit: 'g' },
      { name: '지방', amount: 2, unit: 'g' },
    ],
    weight: { amount: 150, unit: 'g' },
    ingredients: [
      { name: '원유', amount: 90, unit: '%' },
      { name: '유산균', amount: 10, unit: '%' },
    ],
  },
  {
    order: 3,
    productCode: 'GHI789',
    productName: '무가당 아몬드 음료',
    allergens: ['견과류'],
    nutrients: [
      { name: '단백질', amount: 1, unit: 'g' },
      { name: '지방', amount: 2, unit: 'g' },
    ],
    weight: { amount: 1000, unit: 'ml' },
    ingredients: [
      { name: '정제수', amount: 95, unit: '%' },
      { name: '아몬드추출물', amount: 5, unit: '%' },
    ],
  },
  {
    order: 4,
    productCode: 'JKL012',
    productName: '현미 혼합 잡곡밥',
    allergens: [],
    nutrients: [
      { name: '탄수화물', amount: 35, unit: 'g' },
      { name: '단백질', amount: 4, unit: 'g' },
    ],
    weight: { amount: 210, unit: 'g' },
    ingredients: [
      { name: '현미', amount: 60, unit: '%' },
      { name: '찹쌀', amount: 20, unit: '%' },
      { name: '검정콩', amount: 10, unit: '%' },
      { name: '기타잡곡', amount: 10, unit: '%' },
    ],
  },
  {
    order: 5,
    productCode: 'MNO345',
    productName: '닭가슴살 샐러드',
    allergens: ['계란', '대두'],
    nutrients: [
      { name: '단백질', amount: 22, unit: 'g' },
      { name: '지방', amount: 6, unit: 'g' },
    ],
    weight: { amount: 200, unit: 'g' },
    ingredients: [
      { name: '닭가슴살', amount: 40, unit: '%' },
      { name: '양상추', amount: 30, unit: '%' },
      { name: '방울토마토', amount: 15, unit: '%' },
      { name: '드레싱', amount: 15, unit: '%' },
    ],
  },
]
