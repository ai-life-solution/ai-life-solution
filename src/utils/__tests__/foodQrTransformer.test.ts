import { describe, expect, it } from 'bun:test'

import type {
  Allergen,
  Certification,
  FoodQrResponse,
  Ingredient,
  RawNutrition,
  RawStandardInfo,
} from '@/types/FoodItem'

import transformResData from '../foodQrTransformer'

describe('transformResData', () => {
  it('certifications이 빈 배열이어도 크래시 없이 안전하게 변환해야 한다 (C-01)', () => {
    const mockProductRes: FoodQrResponse<RawStandardInfo> = {
      response: {
        header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
        body: {
          items: {
            item: {
              brcdNo: '8801043014854',
              prdctNm: '테스트 상품',
              ctv: '100g',
              foodSeCdNm: '과자',
            },
          },
          numOfRows: 20,
          pageNo: 1,
          totalCount: 1,
        },
      },
    }

    const mockIngredientRes: FoodQrResponse<Ingredient> = {
      response: {
        header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
        body: {
          items: {
            item: { prvwCn: '밀가루, 설탕' },
          },
          numOfRows: 20,
          pageNo: 1,
          totalCount: 1,
        },
      },
    }

    const mockAllergyRes: FoodQrResponse<Allergen> = {
      response: {
        header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
        body: {
          items: {
            item: [{ algCsgMtrNm: '밀' }],
          },
          numOfRows: 20,
          pageNo: 1,
          totalCount: 1,
        },
      },
    }

    const mockNutritionRes: FoodQrResponse<RawNutrition> = {
      response: {
        header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
        body: {
          items: {
            item: [
              { nirwmtNm: '나트륨', cta: 100, igrdUcd: 'mg', ntrtnRt: 5 },
            ],
          },
          numOfRows: 20,
          pageNo: 1,
          totalCount: 1,
        },
      },
    }

    // certifications가 비어있는 케이스
    const mockCertResEmpty: FoodQrResponse<Certification> = {
      response: {
        header: { resultCode: '00', resultMsg: 'NORMAL_SERVICE' },
        body: {
          items: {
            item: [],
          },
          numOfRows: 20,
          pageNo: 1,
          totalCount: 0,
        },
      },
    }

    const result = transformResData({
      productRes: mockProductRes,
      ingredientRes: mockIngredientRes,
      allergyRes: mockAllergyRes,
      nutritionRes: mockNutritionRes,
      certRes: mockCertResEmpty,
      barcode: '8801043014854',
    })

    expect(result.barcode).toBe('8801043014854')
    expect(result.productName).toBe('테스트 상품')
    expect(result.certifications).toEqual([])
    expect(result.tags).toContain('테스트 상품')
  })
})
