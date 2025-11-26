import type {
  Allergen,
  Certification,
  FoodQrResponse,
  Ingredient,
  FoodNutrient,
  RawNutrition,
  RawStandardInfo,
  FoodItem,
} from '@/types/FoodItem'

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
  const items = ingredientRes.response.body.items.item

  // 배열이면 첫 번째 요소 선택
  const item = Array.isArray(items) ? items[0] : items
  const prvwCn = item?.prvwCn
  const ingredients = parseHtml(prvwCn)
  return ingredients
}

function transformNutritions(nutritionRes: FoodQrResponse<RawNutrition>): FoodNutrient[] {
  const items = Array.isArray(nutritionRes.response.body.items.item)
    ? (nutritionRes.response.body.items.item as RawNutrition[])
    : [nutritionRes.response.body.items.item]
  const AllNutritions = items.map(i => ({
    name: i.nirwmtNm,
    amount: i.cta,
    unit: i.igrdUcd,
    dailyRatio: i.ntrtnRt,
  }))
  const nutritions = new Map<string, FoodNutrient>()

  AllNutritions.forEach(n => {
    nutritions.set(n.name, n)
  })

  return [...nutritions.values()]
}

function transformAllergens(allergyRes: FoodQrResponse<Allergen>): string[] {
  const itmes = Array.isArray(allergyRes.response.body.items.item)
    ? (allergyRes.response.body.items.item as Allergen[])
    : [allergyRes.response.body.items.item]

  const AllAllergens = itmes.map(i => i.algCsgMtrNm)
  const allergens = [...new Set(AllAllergens)]
  return allergens
}

function transformCertifications(certRes: FoodQrResponse<Certification>): Certification[] {
  const items = Array.isArray(certRes.response.body.items.item)
    ? (certRes.response.body.items.item as Certification[])
    : [certRes.response.body.items.item as Certification]

  const AllCertifications = items.filter(c => c.certYn === 'Y')
  const certifications = new Map<string, Certification>()

  AllCertifications.forEach(cert => {
    certifications.set(cert.certNm, cert)
  })
  return [...certifications.values()]
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
}: TransformParams): FoodItem {
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
