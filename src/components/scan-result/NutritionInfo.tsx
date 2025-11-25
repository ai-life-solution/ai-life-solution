import type { FoodItem } from '@/types/FoodItem'

interface Props {
  data: FoodItem
}

export default function NutritionInfo({ data }: Props) {
  return (
    <>
      {/* 영양성분 부분 API연결 필요 */}
      <div>{data.ingredients.join(',')}</div>
      <hr className="my-5 text-gray-300" />
    </>
  )
}
