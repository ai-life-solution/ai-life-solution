import { summarizeFoodItem } from '@/actions/chat'
import {
  fetchProduct,
  fetchIngredientInfo,
  fetchAllergyInfo,
  fetchNutritionInfo,
  fetchCertificationInfo,
} from '@/libs/api/food-qr'
import type { FoodItem } from '@/types/FoodItem'
import transformResData from '@/utils/foodQrTransformer'

export async function getFoodItem(barcode: string): Promise<FoodItem | { barcode: string }> {
  try {
    const [productRes, ingredientRes, allergyRes, nutritionRes, certRes] = await Promise.all([
      fetchProduct(barcode),
      fetchIngredientInfo(barcode),
      fetchAllergyInfo(barcode),
      fetchNutritionInfo(barcode),
      fetchCertificationInfo(barcode),
    ])

    const productBody = productRes.response.body
    if (productBody.totalCount === 0) {
      return { barcode }
    }

    // AI 요약 전 기본 데이터
    const newData: FoodItem = transformResData({
      productRes,
      ingredientRes,
      allergyRes,
      nutritionRes,
      certRes,
      barcode,
    })

    return newData
  } catch (err) {
    console.warn('getFoodItem 실패:', err)
    throw err
  }
}

/**
 * AI 요약만 따로 실행
 */
export async function addSummary(foodItem: FoodItem): Promise<string | null> {
  try {
    const description = await summarizeFoodItem(foodItem)
    return description
  } catch (err) {
    console.error('요약 실패:', err)
    return null
  }
}
