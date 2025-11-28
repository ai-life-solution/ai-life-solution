'use client'

import { useEffect } from 'react'

import { Volume1 } from 'lucide-react'
import { toast } from 'sonner'

import { useTTSStore } from '@/store/ttsStore'
import { useFoodStore } from '@/store/useFoodsHistoryStore'
import type { FoodItem } from '@/types/FoodItem'
import { parseFoodToRead } from '@/utils'

import { STYLE } from '../_constants/style'

import AllergenSection from './AllergenSection'
import CertSection from './CertSection'
import DescriptionSection from './DescriptionSection'
import IngridientSection from './IngridientSection'
import NutritionSection from './NutritionSection'
import WeightSection from './WeightSection'

interface HistoryInfoContainerProps {
  order: number
}

/**
 * HistoryInfoContainer 컴포넌트
 * 
 * 특정 주문번호의 식품 상세정보를 표시하는 컴포넌트입니다.
 * IndexedDB에서 저장된 식품 데이터를 로드하고, 로딩/에러/정상 상태를 처리합니다.
 * TTS 기능을 통해 식품 정보를 음성으로 재생할 수 있습니다.
 * 
 * @param props - HistoryInfoContainerProps 객체
 * @param props.order - 조회할 식품의 주문번호
 * @returns 식품 상세정보를 나타내는 JSX 요소
 */
export default function HistoryInfoContainer({ order }: HistoryInfoContainerProps) {
  const { speak, isSpeaking, stopSpeak } = useTTSStore()
  const { foods, isLoading, isInitialized, lastError, loadFoods } = useFoodStore(state => ({
    foods: state.foods,
    isLoading: state.isLoading,
    isInitialized: state.isInitialized,
    lastError: state.lastError,
    loadFoods: state.loadFoods,
  }))

  useEffect(() => {
    if (isInitialized) return
    loadFoods().catch(error => {
      toast.error(`Failed to load foods history from IndexedDB: ${error}`)
    })
  }, [isInitialized, loadFoods])

  const data = foods.find(item => item.order === order)

  /**
   * 식품 정보를 음성으로 재생하거나 중지하는 함수
   * 
   * @param foodData - 재생할 식품 데이터
   */
  const speakFoodItem = (foodData: FoodItem) => {
    if (!foodData) {
      speak('데이터가 없습니다.')
      return
    }

    try {
      if (!isSpeaking) {
        speak(parseFoodToRead(foodData))
      } else {
        stopSpeak()
      }
    } catch (error) {
      console.error('TTS speech failed:', error)
      toast.error('음성 출력에 실패했습니다.')
    }
  }

  let content: React.ReactNode

  if (!isInitialized || isLoading) {
    content = (
      <p className={STYLE.HISTORY_INFO.STATUS_MESSAGE.INFO}>데이터를 불러오는 중입니다...</p>
    )
  } else if (lastError) {
    content = (
      <p className={STYLE.HISTORY_INFO.STATUS_MESSAGE.ERROR}>
        데이터를 불러오지 못했습니다. 다시 시도해주세요.
      </p>
    )
  } else if (!data) {
    content = (
      <p className={STYLE.HISTORY_INFO.STATUS_MESSAGE.INFO}>해당 히스토리를 찾을 수 없습니다.</p>
    )
  } else {
    content = (
      <>
        <div className="flex justify-between">
          <h2 className={STYLE.HISTORY_INFO.H2}>{data.productName}</h2>
          <button
            type="button"
            aria-label="음성듣기"
            onClick={() => speakFoodItem(data)}
            className={`transition-all ${isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
          >
            <Volume1 />
          </button>
        </div>
        <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>상품 코드: {data.barcode}</p>

        <WeightSection data={data.weight ?? ''} />
        <AllergenSection allergens={data.allergens} />
        <IngridientSection source={data.ingredients} title="원재료명 및 함량" />
        <NutritionSection source={data.nutritions} title="영양 성분" />
        <DescriptionSection source={data.description ?? ''} title="AI 요약" />
        <CertSection data={data.certifications} />
      </>
    )
  }

  return <article className={STYLE.HISTORY_INFO.CONTAINER}>{content}</article>
}
