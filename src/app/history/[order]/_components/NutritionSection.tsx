'use client'

import type { FoodNutrient } from '@/types/FoodItem'

import { STYLE } from '../_constants/style'

interface NutritionSectionProps {
  source: FoodNutrient[]
  title: string
}

export default function NutritionSection({ source, title }: NutritionSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>{title}</h3>
      <ul className={STYLE.HISTORY_INFO.PARAGRPAPH}>
        {source.map(data => (
          <li key={data.name} className="flex justify-between">
            <span>{data.name}</span>
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
