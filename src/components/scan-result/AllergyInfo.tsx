import { TriangleAlert } from 'lucide-react'

import type { FoodItem } from '@/types/FoodItem'

import { ALLERGEN_CONTAINER_CLASS } from './_constants/style'

interface Props {
  data: FoodItem
}

export default function AllergyInfo({ data }: Props) {
  return (
    <div className="flex flex-col h-full justify-center items-center gap-4">
      {/* 알러지유발 물질 갯수 표시 */}
      <p className="font-bold text-(--color-accent-red) text-xl">
        알러지 유발물질 {data.allergens.length}개
      </p>
      {/* 알러지유말 물질 이름 표시 */}
      {data.allergens.map(a => (
        <div key={a} className={ALLERGEN_CONTAINER_CLASS}>
          <TriangleAlert />
          알러지 유발 : {a}
        </div>
      ))}
    </div>
  )
}
