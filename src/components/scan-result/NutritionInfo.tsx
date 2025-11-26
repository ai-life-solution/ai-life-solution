import type { FoodItem } from '@/types/FoodItem'

interface Props {
  data: FoodItem
}

export default function NutritionInfo({ data }: Props) {
  return (
    <div className="h-full overflow-y-scroll pr-2">
      {/* 원재료*/}
      <div>{data.ingredients.join(',')}</div>
      <hr className="my-5 text-gray-300" />
      {/* 영양성분표 */}
      <table className="w-full text-left mb-10 border-collapse">
        <caption className="sr-only">제품 영양정보</caption>
        <thead>
          <tr>
            <th className="border-b px-2 py-1">영양소</th>
            <th className="border-b px-2 py-1">함량</th>
            <th className="border-b px-2 py-1">단위</th>
            <th className="border-b px-2 py-1">일일 기준%</th>
          </tr>
        </thead>
        <tbody>
          {data.nutritions.map(n => (
            <tr key={n.name}>
              <td className="px-2 py-1">{n.name}</td>
              <td className="px-2 py-1">{n.amount}</td>
              <td className="px-2 py-1">{n.unit}</td>
              <td className="px-2 py-1">{n.dailyRatio ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
