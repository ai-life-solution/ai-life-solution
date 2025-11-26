import type { Certification, FoodNutrient } from '@/types/FoodItem'

interface ParseFoodToReadParams {
  productName?: string
  weight?: string
  allergens?: string[]
  nutritions?: FoodNutrient[]
  ingredients?: string[]
  description?: string
  certifications?: Certification[]
}

export default function parseFoodToRead(food: ParseFoodToReadParams): string {
  const parts: string[] = []

  if (food.productName) {
    parts.push(food.productName)
  }

  if (food.weight) {
    parts.push(`총 내용량 ${food.weight}`)
  }

  if (food.allergens && food.allergens.length > 0) {
    parts.push(`알레르기 유발 성분 ${food.allergens.join(', ')}`)
  }

  if (food.nutritions && food.nutritions.length > 0) {
    const nutritionsText = food.nutritions.map(n => `${n.name} ${n.amount}${n.unit}`).join(', ')
    parts.push(`영양성분 ${nutritionsText}`)
  }

  if (food.ingredients && food.ingredients.length > 0) {
    parts.push(`원재료명 및 함량 ${food.ingredients.join(', ')}`)
  }

  if (food.description) {
    parts.push(`AI 요약 ${food.description}`)
  }

  if (food.certifications && food.certifications) {
    parts.push(`인증내역 ${food.certifications.map(cert => cert.certNm)}`)
  }

  return parts.join('\n').trim()
}
