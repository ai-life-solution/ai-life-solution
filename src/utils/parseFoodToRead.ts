import type { FoodItem } from '@/types/FoodItem'

export default function parseFoodToRead(item: FoodItem) {
  const allergensText = item.allergens.length > 0 ? item.allergens.join(', ') : '없음'
  const nutritionsText =
    item.nutritions.length > 0
      ? item.nutritions.map(nu => `${nu.name} ${nu.amount}${nu.unit}`).join(', ')
      : '없음'
  const ingredientsText = item.ingredients.length > 0 ? item.ingredients.join(', ') : '없음'

  return `${item.productName}
      총 내용량 ${item.weight}
      알레르기 유발 성분 ${allergensText}
      영양성분 ${nutritionsText}
      원재료명 및 함량 ${ingredientsText}
      AI 요약 ${item.description || '없음'}
      `.trim()
}
