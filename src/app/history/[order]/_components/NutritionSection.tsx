'use client'

import type { FoodNutrient } from '@/types/FoodItem'

import { STYLE } from '../_constants/style'

interface NutritionSectionProps {
  source: FoodNutrient[]
  title: string
}

/**
 * NutritionSection 컴포넌트
 * 
 * 식품의 영양 정보를 표시하는 컴포넌트입니다.
 * 영양소명, 함량, 일일 섭취량 기준치를 리스트 형태로 렌더링합니다.
 * 
 * @param props - NutritionSectionProps 객체
 * @param props.source - 표시할 영양소 정보 배열
 * @param props.title - 섹션 제목
 * @returns 영양 정보를 나타내는 JSX 요소
 */
export default function NutritionSection({ source, title }: NutritionSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>{title}</h3>
      <ul className={STYLE.HISTORY_INFO.PARAGRPAPH}>
        {source.map(data => (
          <li key={data.name} className="flex justify-between">
            <span>
              {data.name}
              {data.dailyRatio && data.dailyRatio > 0 && `(${data.dailyRatio}%)`}
            </span>
            <span>
              {data.amount}
              {data.unit}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
