import { DBSchema } from 'idb'

export interface Ingredient {
  name: string
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
      nutrients: { name: string; amount: number; unit: string }[]
      weight: { amount: number; unit: string }
      ingredients: Ingredient[]
    }
    indexes: { 'by-productCode': string }
  }
}
