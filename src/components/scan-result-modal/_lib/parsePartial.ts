import type { FoodItem } from '@/types/FoodItem'
import parseFoodToRead from '@/utils/parseFoodToRead'

export function parsePartial(food: FoodItem, currentSlide: number): string {
  switch (currentSlide) {
    case 0:
      return parseFoodToRead({
        ingredients: food.ingredients,
        nutritions: food.nutritions,
      })
    case 1:
      return parseFoodToRead({ description: food.description })
    case 2:
      return parseFoodToRead({ allergens: food.allergens })
    case 3:
      return parseFoodToRead({
        certifications: food.certifications,
      })

    default:
      return ''
  }
}
