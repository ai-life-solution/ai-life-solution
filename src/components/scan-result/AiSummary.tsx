import type { FoodItem } from '@/types/FoodItem'

import { AI_SUMMARY_CONTAINER_CLASS } from './_constants/style'

interface Props {
  data: FoodItem
}

export default function AiSummary({ data }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-xl">AI의 요약 정보</p>
      <div className={AI_SUMMARY_CONTAINER_CLASS}>{data.description}</div>
    </div>
  )
}
