'use client'

import { useEffect } from 'react'

import { toast } from 'sonner'

import { useFoodStore } from '@/store/useFoodsHistoryStore'

import { STYLE } from '../_constants/style'

import { FoodHistoryItem } from './FoodHistoryItem'

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
    return <p className="text-center text-sm text-gray-500">히스토리를 불러오는 중입니다...</p>
  }

  if (lastError) {
    return (
      <p className="text-center text-sm text-red-500">
        히스토리를 불러오지 못했습니다. 다시 시도해주세요 : {lastError}
      </p>
    )
  }

  if (foods.length === 0) {
    return <p className="text-center text-sm text-gray-500">저장된 히스토리가 없습니다.</p>
  }

  return (
    <ul className={STYLE.HISTORY_LIST.LIST}>
      {foods.map(item => (
        <FoodHistoryItem key={item.order} item={item} />
      ))}
    </ul>
  )
}
