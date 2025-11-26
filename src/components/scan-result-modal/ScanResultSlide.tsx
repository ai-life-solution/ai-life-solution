'use client'

import { useState } from 'react'

import type { FoodItem } from '@/types/FoodItem'

import AiSummary from '../scan-result/AiSummary'
import AllergyInfo from '../scan-result/AllergyInfo'
import NutritionInfo from '../scan-result/NutritionInfo'
import OtherInfo from '../scan-result/OtherInfo'

import { INDICATOR_CLASS, INDICATOR_WRAPPER_CLASS, SLIDE_INNER_CLASS } from './_constants/style'

interface Props {
  data: FoodItem
}

const slides = [NutritionInfo, AiSummary, AllergyInfo, OtherInfo]

export default function ScanResultSlide({ data }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const translateClass = [
    'translate-x-0',
    '-translate-x-full',
    '-translate-x-[200%]',
    '-translate-x-[300%]',
  ]

  return (
    <div className="relative h-full overflow-auto">
      {/* 슬라이드 영역 */}
      <div className="overflow-hidden flex w-full h-full">
        <div className={`${SLIDE_INNER_CLASS} ${translateClass[currentSlide]}`}>
          {slides.map((Slide, index) => (
            <div key={index} className="w-full shrink-0 ">
              <Slide data={data} />
            </div>
          ))}
        </div>
      </div>
      {/* 인디케이터 영역 */}
      <div className={INDICATOR_WRAPPER_CLASS}>
        {slides.map((_, index) => (
          <button
            className={INDICATOR_CLASS(index, currentSlide)}
            key={index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
