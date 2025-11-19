'use client'

import { MOCK_DATA } from '../../_constants/mockData'
import { STYLE } from '../_constants/style'

import AllergenSection from './AllergenSection'
import AmountSection from './AmountSection'
import WeightSection from './WeightSection'

interface HistoryInfoContainerProps {
  order: string
}

export default function HistoryInfoContainer({ order }: HistoryInfoContainerProps) {
  const data = MOCK_DATA.find(item => item.order === Number(order))
  return (
    <article className={STYLE.HISTORY_INFO.CONTAINER}>
      {data ? (
        <>
          <h2 className={STYLE.HISTORY_INFO.H2}>{data.productName}</h2>
          <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>상품 코드: {data.productCode}</p>
          <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>주문 번호: {data.order}</p>

          <WeightSection weight={data.weight} />
          <AllergenSection allergens={data.allergens} />
          <AmountSection source={data.nutrients} title="영양 성분" />
          <AmountSection source={data.ingredients} title="원재료명 및 함량" />
        </>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </article>
  )
}
