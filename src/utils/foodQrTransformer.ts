import type {
  Allergen,
  Certification,
  FoodQrResponse,
  Ingredient,
  Nutrition,
  RawNutrition,
  RawStandardInfo,
  ScanResultData,
} from '@/types/scanData'

import { parseHtml } from './parseHtml'

function transfromStandardInfo(productInfoRes: FoodQrResponse<RawStandardInfo>) {
  const items = Array.isArray(productInfoRes.response.body.items.item)
    ? (productInfoRes.response.body.items.item as RawStandardInfo[])
    : [productInfoRes.response.body.items.item]
  const standardInfoArray = items.map(i => ({
    barcode: i.brcdNo,
    productName: i.prdctNm,
    weight: i.ctv,
    category: i.foodSeCdNm,
  }))
  const standardInfo = standardInfoArray[0]
  return standardInfo
}

function transformIngredients(ingredientRes: FoodQrResponse<Ingredient>): string[] {
  const prvwCn = (ingredientRes.response.body.items.item as Ingredient)?.prvwCn ?? ''
  const ingredients = parseHtml(prvwCn)
  return ingredients
}

function transformNutritions(nutritionRes: FoodQrResponse<RawNutrition>): Nutrition[] {
  const items = Array.isArray(nutritionRes.response.body.items.item)
    ? (nutritionRes.response.body.items.item as RawNutrition[])
    : [nutritionRes.response.body.items.item]
  const nutritions = items.map(i => ({
    name: i.nirwmtNm,
    amount: i.cta,
    unit: i.igrdUcd,
    dailyRatio: i.ntrtnRt,
  }))
  return nutritions
}

function transformAllergens(allergyRes: FoodQrResponse<Allergen>): string[] {
  const itmes = Array.isArray(allergyRes.response.body.items.item)
    ? (allergyRes.response.body.items.item as Allergen[])
    : [allergyRes.response.body.items.item]
  const allergens = itmes.map(i => i.algCsgMtrNm)
  return allergens
}

function transformCertifications(certRes: FoodQrResponse<Certification>): Certification[] {
  const items = Array.isArray(certRes.response.body.items.item)
    ? (certRes.response.body.items.item as Certification[])
    : [certRes.response.body.items.item as Certification]
  const certifications = items.filter(c => c.certYn === 'Y')
  return certifications
}

function transformTags(
  barcode: string,
  productName: string,
  productType?: string,
  manufacturer?: string
): string[] {
  const tags: string[] = []
  if (productName) tags.push(productName)
  if (barcode) tags.push(barcode)
  if (productType) tags.push(productType)
  if (manufacturer) tags.push(manufacturer)
  return tags
}

interface TransformParams {
  productRes: FoodQrResponse<RawStandardInfo>
  ingredientRes: FoodQrResponse<Ingredient>
  allergyRes: FoodQrResponse<Allergen>
  nutritionRes: FoodQrResponse<RawNutrition>
  certRes: FoodQrResponse<Certification>
  barcode: string
}

export default function transformResData({
  productRes,
  ingredientRes,
  allergyRes,
  nutritionRes,
  certRes,
  barcode,
}: TransformParams): ScanResultData {
  const standardInfo = transfromStandardInfo(productRes)

  // 제품명
  const productName = standardInfo.productName
  // 제품 유형, 제조사는 있으면 태그로 추가
  const category = standardInfo.category
  const weight = standardInfo.weight

  const ingredients = transformIngredients(ingredientRes)
  const allergens = transformAllergens(allergyRes)
  const certifications = transformCertifications(certRes)
  const nutritions = transformNutritions(nutritionRes)
  const manufacturer = certifications[0].bsshNm
  const tags = transformTags(barcode, productName, category, manufacturer)

  return {
    barcode,
    productName,
    weight,
    category,
    tags,
    ingredients,
    allergens,
    nutritions,
    certifications,
    timestamp: Date.now(),
  }
}
