import { DBSchema } from 'idb'

export interface FoodIngredient {
  name: string
  amount: number
  unit: string
}

export interface FoodNutrients {
  name: string
  amount: number
  unit: string
}

export interface FoodWeight {
  amount: number
  unit: string
}

export default interface FoodData extends DBSchema {
  foods: {
    key: number // order
    value: {
      order: number
      productCode: string
      productName: string
      allergens: string[]
      nutrients: FoodNutrients[]
      weight: FoodWeight
      ingredients: FoodIngredient[]
    }
    indexes: { 'by-productCode': string }
  }
}
