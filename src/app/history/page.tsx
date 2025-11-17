import FoodHistoryList from './_components/FoodHistoryList'
import Header from './_components/Header'
import { PAGE } from './_constants/style'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '히스토리 | HearCode',
  description:
    '바코드를 통해 식품정보를 제공하는 HearCode에 오신 것을 환영합니다. 간편하게 바코드를 스캔하여 영양성분, 알레르기 유발 성분 등 다양한 식품 정보를 확인하세요. 건강한 식습관을 위한 최고의 도우미, HearCode와 함께하세요!',
  keywords: ['HearCode', '식품정보', '바코드스캔', '영양성분', '알레르기정보'],
  robots: {
    index: true,
    follow: true,
  },
}

export default function HistoryPage() {
  return (
    <div className={PAGE.CONTAINER}>
      <div className="max-w-[600px] mx-auto">
        <Header />
        <main className={PAGE.MAIN}>
          <FoodHistoryList />
        </main>
      </div>
    </div>
  )
}
