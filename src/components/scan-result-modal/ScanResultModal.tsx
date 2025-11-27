'use client'

import { useState } from 'react'

import { Volume1, X } from 'lucide-react'
import { toast } from 'sonner'

import NavigationBar from '@/components/NavigationBar'
import { useScanResultStore } from '@/store/scanResultStore'
import { useTTSStore } from '@/store/ttsStore'
import { useFoodStore } from '@/store/useFoodsHistoryStore'
import type { FoodItem } from '@/types/FoodItem'

import UnregisteredBarcode from '../scan-result/UnregisteredBarcode'

import { DIALOG_CLASS, MODAL_INNER_CLASS } from './_constants/style'
import { parsePartial } from './_lib/parsePartial'
import { SaveButton } from './Buttons'
import LoadingStatus from './LoadingStatus'
import ScanResultSlide from './ScanResultSlide'
import Tags from './Tags'

interface ScanResultModalProps {
  open: boolean
  onClose: () => void
}

export default function ScanResultModal({ open, onClose }: ScanResultModalProps) {
  const { data, status } = useScanResultStore()
  const { foods, addFoodsHistoryItem } = useFoodStore()
  const { speak, isSpeaking, stopSpeak } = useTTSStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  if (!open) return null

  // 타입 가드: 등록되지 않은 바코드인지 확인
  const isUnregistered = data && !('productName' in data)

  // FoodItem 타입 가드 함수
  const isFoodItem = (item: unknown): item is FoodItem => {
    return typeof item === 'object' && item !== null && 'productName' in item && 'barcode' in item
  }

  const handleSave = async () => {
    if (!data || isUnregistered) return
    const lastOrder = foods[0]?.order ?? 0

    const newEntry = {
      ...data,
      order: lastOrder + 1,
      createAt: Date.now(),
    }

    try {
      await addFoodsHistoryItem(newEntry)
      toast.success('저장 완료!')
    } catch (e) {
      toast.error('fail')
      console.error(e)
    }
  }

  const speakFoodItem = (data: unknown) => {
    if (!isFoodItem(data)) {
      speak('데이터가 없습니다.')
      return
    }

    try {
      if (!isSpeaking) {
        const textToSpeak = parsePartial(data, currentSlide)
        if (textToSpeak) {
          speak(textToSpeak)
        }
      } else {
        stopSpeak()
      }
    } catch (error) {
      toast.error(`음성 출력에 실패했습니다.: ${error}`)
    }
  }

  return (
    <dialog open className={DIALOG_CLASS}>
      <div className={MODAL_INNER_CLASS}>
        {/* 닫기버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500"
          aria-label="닫기"
        >
          <X size={24} />
        </button>
        {/*상태 메시지 */}
        <LoadingStatus status={status} />

        {/* 등록되지 않은 바코드 스캔 안내 */}
        {isUnregistered && <UnregisteredBarcode barcode={data.barcode} onRetry={onClose} />}

        {status === 'success' && !isUnregistered && data ? (
          <>
            {/* 태그 */}
            <Tags tags={data.tags} />
            {/* 제품이름 */}
            <div className="flex text-2xl font-bold gap-4">
              {data.productName}
              <button
                type="button"
                aria-label="음성듣기"
                onClick={() => speakFoodItem(data)}
                className={`transition-all ${isSpeaking ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}`}
              >
                <Volume1 />
              </button>
            </div>
            {/* 슬라이드 */}
            <ScanResultSlide
              data={data}
              currentSlide={currentSlide}
              setCurrentSlide={setCurrentSlide}
            />
            {/* 저장 버튼 */}
            <SaveButton className="mb-15" onClick={handleSave} />
          </>
        ) : null}
      </div>
      {/* 네비게이션 바 */}
      <NavigationBar />
    </dialog>
  )
}
