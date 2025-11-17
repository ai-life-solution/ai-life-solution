import FoodData from '@/types/FoodData'

export default function HistoryPage() {
  const MOCK_DATA: FoodData['foods']['value'] = {
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
  }
  return <div>History Page</div>
}
