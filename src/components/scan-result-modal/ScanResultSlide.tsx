'use client'

import { useEffect, useState, type TouchEvent } from 'react'

import type { FoodItem } from '@/types/FoodItem'

import AiSummary from '../scan-result/AiSummary'
import AllergyInfo from '../scan-result/AllergyInfo'
import NutritionInfo from '../scan-result/NutritionInfo'
import OtherInfo from '../scan-result/OtherInfo'

import animations from './_constants/animation.module.css'
import { INDICATOR_CLASS, INDICATOR_WRAPPER_CLASS, SLIDE_INNER_CLASS } from './_constants/style'

interface Props {
  data: FoodItem
  currentSlide?: number,
  setCurrentSlide?: React.Dispatch<React.SetStateAction<number>>
}

const slides = [NutritionInfo, AiSummary, AllergyInfo, OtherInfo]

export default function ScanResultSlide({ data, currentSlide, setCurrentSlide }: Props) {
  
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  // 애니메이션 클래스를 제어할 state
  const [animationClass, setAnimationClass] = useState('')
  // 이동 방향을 기록 (null 상태를 유지하여 스냅샷 방지)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)

  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }
  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd || !setCurrentSlide) return

    const distance = touchStart - touchEnd
    const minSwipeDistance = 5

    // 왼쪽으로 스와이프 → 다음 슬라이드 등장(direction = 'right')
    if (distance > minSwipeDistance) {
      setDirection('right')
      setCurrentSlide((prev: number) => (prev === slides.length - 1 ? 0 : prev + 1))
    }

    // 오른쪽으로 스와이프 → 이전 슬라이드 등장(direction = 'left')
    if (distance < -minSwipeDistance) {
      setDirection('left')
      setCurrentSlide((prev: number) => (prev === 0 ? slides.length - 1 : prev - 1))
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  // 인디케이터 클릭 시도 동일하게 방향 설정
  const goToSlide = (index: number) => {
    if (index === currentSlide || !setCurrentSlide) return
    setDirection(index > (currentSlide || 0) ? 'left' : 'right')
    setCurrentSlide(index)
  }

  useEffect(() => {
    // direction이 설정되었을 때만 애니메이션 시작
    if (direction) {
      // 방향에 맞는 클래스 설정
      const newClass =
        direction === 'left'
          ? animations['animate-slide-in-left']
          : animations['animate-slide-in-right']

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimationClass(newClass)

      // 애니메이션 시간(300ms) 후 클래스를 제거하여 다음 상태 변화에 대비
      const timer = setTimeout(() => {
        setAnimationClass('')
        setDirection(null)
      }, 300) // CSS 애니메이션 지속 시간과 일치해야 함

      return () => clearTimeout(timer)
    }
  }, [currentSlide, direction]) // currentSlide 또는 direction이 바뀔 때마다 실행

  return (
    <div
      className="relative h-full overflow-y-auto overflow-x-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        key={currentSlide || 0}
        aria-live="polite"
        className={`${SLIDE_INNER_CLASS} ${animationClass}`}
      >
        {(currentSlide || 0) === 0 && <NutritionInfo data={data} />}
        {(currentSlide || 0) === 1 && <AiSummary data={data} />}
        {(currentSlide || 0) === 2 && <AllergyInfo data={data} />}
        {(currentSlide || 0) === 3 && <OtherInfo data={data} />}
      </div>

      <div className={INDICATOR_WRAPPER_CLASS}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={INDICATOR_CLASS(index, currentSlide || 0)}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
