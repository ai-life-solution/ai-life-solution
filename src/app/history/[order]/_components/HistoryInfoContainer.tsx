'use client'

import { useEffect, useState } from 'react'

import { useFoodStore } from '@/store/useFoodsHistoryStore'
import type { FoodHistoryEntry } from '@/types/FoodData'

import { STYLE } from '../_constants/style'

import AllergenSection from './AllergenSection'
import IngridientSection from './IngridientSection'
import NutritionSection from './NutritionSection'
import WeightSection from './WeightSection'

interface HistoryInfoContainerProps {
  order: number
}

export default function HistoryInfoContainer({ order }: HistoryInfoContainerProps) {
  const promise = useFoodStore(state => state.getFoodItemByOrder(order))
  const [data, setData] = useState<FoodHistoryEntry | undefined>(undefined)

  useEffect(() => {
    promise.then(setData)
  }, [promise])

  return (
    <article className={STYLE.HISTORY_INFO.CONTAINER}>
      {data ? (
        <>
          <h2 className={STYLE.HISTORY_INFO.H2}>{data.productName}</h2>
          <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>상품 코드: {data.barcode}</p>
          <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>주문 번호: {data.order}</p>

          <WeightSection data={data.weight} />
          <AllergenSection allergens={data.allergens} />
          <NutritionSection source={data.nutritions} title="영양 성분" />
          <IngridientSection source={data.ingredients} title="원재료명 및 함량" />
        </>
      ) : (
        <p className="text-center text-sm text-gray-500">데이터를 불러오지 못했습니다.</p>
      )}
    </article>
  )
}
