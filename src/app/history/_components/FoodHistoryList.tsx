'use client'

import { useEffect } from 'react'

import { toast } from 'sonner'

import { useFoodStore } from '@/store/useFoodsHistoryStore'

import { STYLE } from '../_constants/style'

import { FoodHistoryItem } from './FoodHistoryItem'

/**
 * FoodHistoryList 컴포넌트
 * 
 * 사용자의 식품 조회 히스토리를 목록 형태로 표시하는 컴포넌트입니다.
 * IndexedDB에서 저장된 식품 히스토리를 로드하고, 로딩 상태, 에러 상태, 
 * 빈 목록 상태를 처리합니다.
 * 
 * @returns 식품 히스토리 목록을 나타내는 JSX 요소
 */
export default function FoodHistoryList() {
  const foods = useFoodStore(state => state.foods)
  const loadFoods = useFoodStore(state => state.loadFoods)
  const isLoading = useFoodStore(state => state.isLoading)
  const isInitialized = useFoodStore(state => state.isInitialized)
  const lastError = useFoodStore(state => state.lastError)

  useEffect(() => {
    if (isInitialized) return

    loadFoods().catch(error => {
      toast.error(`히스토리를 불러오지 못했습니다. 다시 시도해주세요 : ${error}`)
    })
  }, [isInitialized, loadFoods])

  if (isLoading && !isInitialized) {
    return <p className={STYLE.STATUS_MESSAGE.INFO}>히스토리를 불러오는 중입니다...</p>
  }

  if (lastError) {
    return (
      <p className={STYLE.STATUS_MESSAGE.ERROR}>
        히스토리를 불러오지 못했습니다. 다시 시도해주세요 : {lastError}
      </p>
    )
  }

  if (foods.length === 0) {
    return <p className={STYLE.STATUS_MESSAGE.INFO}>저장된 히스토리가 없습니다.</p>
  }

  return (
    <ul className={STYLE.HISTORY_LIST.LIST}>
      {foods.map(item => (
        <FoodHistoryItem key={item.order} item={item} />
      ))}
    </ul>
  )
}
