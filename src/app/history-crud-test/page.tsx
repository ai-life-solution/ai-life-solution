'use client'

import { type FormEvent, useEffect, useState } from 'react'

import { toast } from 'sonner'

import { summarizeFoodItem } from '@/actions/chat'
import { useFoodStore } from '@/store/useFoodsHistoryStore'
import type { FoodHistoryEntry } from '@/types/FoodData'

interface CreationFormState {
  productName: string
  barcode: string
  weight: string
  category: string
  tags: string
  ingredients: string
  allergens: string
}

const createInitialFormState = (): CreationFormState => ({
  productName: '테스트 상품',
  barcode: `${Date.now()}`,
  weight: '100g',
  category: '테스트 카테고리',
  tags: '테스트, 샘플',
  ingredients: '밀, 대두',
  allergens: '밀, 대두',
})

const parseCommaSeparatedList = (value: string): string[] =>
  value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)

const buildFoodEntry = (form: CreationFormState, nextOrder: number): FoodHistoryEntry => {
  const now = Date.now()

  return {
    barcode: form.barcode.trim() || `${nextOrder}`,
    productName: form.productName.trim() || '이름 없는 상품',
    weight: form.weight.trim() || '0g',
    category: form.category.trim() || undefined,
    tags: parseCommaSeparatedList(form.tags),
    ingredients: parseCommaSeparatedList(form.ingredients),
    allergens: parseCommaSeparatedList(form.allergens),
    nutritions: [],
    certifications: [],
    timestamp: now,
    order: nextOrder,
  }
}

export default function CreationTestPage() {
  const foods = useFoodStore(state => state.foods)
  const addFoodsHistoryItem = useFoodStore(state => state.addFoodsHistoryItem)
  const removeFoodItem = useFoodStore(state => state.removeFoodItem)
  const updateFoodItem = useFoodStore(state => state.updateFoodItem)
  const loadFoods = useFoodStore(state => state.loadFoods)
  const isLoading = useFoodStore(state => state.isLoading)
  const isInitialized = useFoodStore(state => state.isInitialized)
  const lastError = useFoodStore(state => state.lastError)

  const [form, setForm] = useState<CreationFormState>(() => createInitialFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isInitialized) return

    loadFoods().catch(error => {
      toast.error(`히스토리를 불러오지 못했습니다. 다시 시도해주세요 : ${error}`)
    })
  }, [isInitialized, loadFoods])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const maxOrder = foods.reduce((max, item) => Math.max(max, item.order ?? 0), 0)
      const nextOrder = maxOrder + 1
      const entry = buildFoodEntry(form, nextOrder)

      // 먼저 항목 저장
      await addFoodsHistoryItem(entry)
      toast.success('새 히스토리 항목을 추가했습니다.')
      setForm(createInitialFormState())

      // 비동기로 AI 요약 생성 후 업데이트
      toast.info('AI 요약을 생성 중입니다...')
      summarizeFoodItem(entry)
        .then(description => {
          updateFoodItem(nextOrder, { description })
          toast.success(`order ${nextOrder} AI 요약 완료`)
        })
        .catch(err => {
          toast.error(`AI 요약 생성 실패: ${err}`)
        })
    } catch (error) {
      toast.error(`히스토리 항목 생성에 실패했습니다. ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (order?: number) => {
    if (!order) {
      toast.error('삭제할 order 값이 없습니다.')
      return
    }

    try {
      await removeFoodItem(order)
      toast.success(`order ${order} 항목을 삭제했습니다.`)
    } catch (error) {
      toast.error(`히스토리 항목 삭제에 실패했습니다. ${error}`)
    }
  }

  const handleRefresh = async () => {
    try {
      await loadFoods()
      toast.success('IndexedDB로부터 최신 데이터를 불러왔습니다.')
    } catch (error) {
      toast.error(`데이터 동기화에 실패했습니다. ${error}`)
    }
  }

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSummarize = (item: FoodHistoryEntry) => {
    if (item.description) {
      toast(item.description, { duration: 10000 })
    } else {
      toast.warning('AI 요약이 없습니다.')
    }
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-6">
      <header className="space-y-2 rounded-lg bg-gray-100 p-4">
        <h1 className="text-2xl font-bold">Foods History Creation Test</h1>
        <p className="text-sm text-gray-600">
          IndexedDB + Zustand 스토어가 정상적으로 동작하는지 빠르게 검증하기 위한 임시 페이지입니다.
        </p>
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>총 {foods.length}건</span>
          {isLoading && <span className="text-blue-600">불러오는 중...</span>}
          {lastError && <span className="text-red-500">에러: {lastError}</span>}
          <button
            type="button"
            className="rounded bg-blue-600 px-3 py-1 text-white"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            IndexedDB 동기화
          </button>
        </div>
      </header>

      <section className="rounded-lg border border-dashed border-gray-300 p-4">
        <h2 className="text-lg font-semibold">새 히스토리 항목 생성</h2>
        <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col text-sm font-medium">
              상품명
              <input
                className="mt-1 rounded border border-gray-300 p-2"
                name="productName"
                value={form.productName}
                onChange={onInputChange}
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium">
              바코드
              <input
                className="mt-1 rounded border border-gray-300 p-2"
                name="barcode"
                value={form.barcode}
                onChange={onInputChange}
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium">
              중량
              <input
                className="mt-1 rounded border border-gray-300 p-2"
                name="weight"
                value={form.weight}
                onChange={onInputChange}
                required
              />
            </label>
            <label className="flex flex-col text-sm font-medium">
              카테고리
              <input
                className="mt-1 rounded border border-gray-300 p-2"
                name="category"
                value={form.category}
                onChange={onInputChange}
              />
            </label>
          </div>

          <label className="flex flex-col text-sm font-medium">
            태그 (콤마로 구분)
            <input
              className="mt-1 rounded border border-gray-300 p-2"
              name="tags"
              value={form.tags}
              onChange={onInputChange}
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            원재료명 (콤마로 구분)
            <textarea
              className="mt-1 rounded border border-gray-300 p-2"
              name="ingredients"
              rows={2}
              value={form.ingredients}
              onChange={onInputChange}
            />
          </label>

          <label className="flex flex-col text-sm font-medium">
            알레르기 유발 성분 (콤마로 구분)
            <textarea
              className="mt-1 rounded border border-gray-300 p-2"
              name="allergens"
              rows={2}
              value={form.allergens}
              onChange={onInputChange}
            />
          </label>

          <button
            type="submit"
            className="w-full rounded bg-green-600 py-2 font-semibold text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? '생성 중...' : '히스토리 항목 추가'}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-gray-200 p-4">
        <h2 className="text-lg font-semibold">저장된 히스토리 목록</h2>
        {foods.length === 0 ? (
          <p className="mt-4 text-sm text-gray-500">아직 저장된 히스토리가 없습니다.</p>
        ) : (
          <ul className="mt-4 divide-y divide-gray-200">
            {foods.map(item => (
              <li
                key={item.order}
                className="flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold">{item.productName}</p>
                  <p className="text-sm text-gray-600">바코드: {item.barcode}</p>
                  <p className="text-sm text-gray-600">order: {item.order}</p>
                </div>
                <div className="flex gap-2 text-sm">
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1"
                    onClick={() => navigator.clipboard.writeText(JSON.stringify(item, null, 2))}
                  >
                    JSON 복사
                  </button>
                  <button
                    type="button"
                    className="rounded border border-gray-300 px-3 py-1 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => handleSummarize(item)}
                    disabled={!item.description}
                  >
                    AI요약
                  </button>
                  <button
                    type="button"
                    className="rounded bg-red-600 px-3 py-1 text-white"
                    onClick={() => handleDelete(item.order)}
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
