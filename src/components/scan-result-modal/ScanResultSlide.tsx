'use client'

import { useState } from 'react'

import type { FoodItem } from '@/types/FoodItem'

import AllergyInfo from '../scan-result/AllergyInfo'
import NutritionInfo from '../scan-result/NutritionInfo'
import OtherInfo from '../scan-result/OtherInfo'

interface Props {
  data: FoodItem
}

const slides = [NutritionInfo, AllergyInfo, OtherInfo]

export default function ScanResultSlide({ data }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const translateClass = ['translate-x-0', '-translate-x-full', '-translate-x-[200%]']

  return (
    <div className="relative h-full">
      {/* 슬라이드 영역 */}
      <div className="overflow-hidden flex w-full h-full">
        <div
          className={`flex transition-transform duration-300 ${translateClass[currentSlide]} w-full h-full`}
        >
          {slides.map((Slide, index) => (
            <div key={index} className="w-full shrink-0 ">
              <Slide data={data} />
            </div>
          ))}
        </div>
      </div>
      {/* 인디케이터 영역 */}
      <div className=" absolute bottom-0 flex gap-2 w-full justify-center">
        {slides.map((_, index) => (
          <button
            className={`${index === currentSlide ? 'bg-(--color-accent)' : 'bg-gray-300'} h-5 flex justify-center items-center rounded-full aspect-square`}
            key={index}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
