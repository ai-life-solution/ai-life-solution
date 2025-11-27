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
import DescriptionSection from './DescriptionSection'
import IngridientSection from './IngridientSection'
import NutritionSection from './NutritionSection'
import WeightSection from './WeightSection'

interface HistoryInfoContainerProps {
  order: number
}

export default function HistoryInfoContainer({ order }: HistoryInfoContainerProps) {
  const { speak, isSpeaking, stopSpeak } = useTTSStore()
  const foods = useFoodStore(state => state.foods)
  const loadFoods = useFoodStore(state => state.loadFoods)
  const isLoading = useFoodStore(state => state.isLoading)
  const isInitialized = useFoodStore(state => state.isInitialized)
  const lastError = useFoodStore(state => state.lastError)

  const speakFoodItem = (data: FoodItem) => {
    if (!data) {
      speak('데이터가 없습니다.')
      return
    }

    try {
      if (!isSpeaking) {
        speak(parseFoodToRead(data))
      } else {
        stopSpeak()
      }
    } catch (error) {
      console.error('TTS speech failed:', error)
      toast.error('음성 출력에 실패했습니다.')
    }
  }

  useEffect(() => {
    if (isInitialized) return
    loadFoods().catch(error => {
      toast.error(`Failed to load foods history from IndexedDB: ${error}`)
    })
  }, [isInitialized, loadFoods])

  const data = foods.find(item => item.order === order)

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
        <NutritionSection source={data.nutritions} title="영양 성분" />
        <IngridientSection source={data.ingredients} title="원재료명 및 함량" />
        <DescriptionSection source={data.description ?? ''} title="AI 요약" />
      </>
    )
  }

  return <article className={STYLE.HISTORY_INFO.CONTAINER}>{content}</article>
}
