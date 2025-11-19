'use client'

import { MOCK_DATA } from "../../_constants/mockData"

interface HistoryInfoContainerProps {
  order: string
}

export default function HistoryInfoContainer({ order }: HistoryInfoContainerProps) {
  const data = MOCK_DATA.find((item) => item.order === Number(order))
  return (
    <article className="w-full h-full p-4 bg-(--color-secondary) rounded-lg overflow-y-auto min-h-[calc(100vh_-_168px)]">
      {data ? (
        <>
          <section className="mb-6">
            <h2 className="text-2xl font-bold text-(--color-primary)">{data.productName}</h2>
            <p className="text-sm text-gray-600 mt-1">상품 코드: {data.productCode}</p>
            <p className="text-sm text-gray-600">주문 번호: {data.order}</p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">총 내용량</h3>
            <p className="text-sm">
              {data.weight.amount}
              {data.weight.unit}
            </p>
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">알레르기 유발 성분</h3>
            {data.allergens.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {data.allergens.map(allergen => (
                  <li key={allergen}>{allergen}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-600">알레르기 유발 성분이 없습니다.</p>
            )}
          </section>

          <section className="mb-6">
            <h3 className="text-lg font-semibold mb-2">영양 성분</h3>
            <ul className="text-sm space-y-1">
              {data.nutrients.map(nutrient => (
                <li key={nutrient.name} className="flex justify-between">
                  <span>{nutrient.name}</span>
                  <span>
                    {nutrient.amount}
                    {nutrient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">원재료명 및 함량</h3>
            <ul className="text-sm space-y-1">
              {data.ingredients.map(ingredient => (
                <li key={ingredient.name} className="flex justify-between">
                  <span>{ingredient.name}</span>
                  <span>
                    {ingredient.amount}
                    {ingredient.unit}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p>데이터가 없습니다.</p>
      )}
    </article>
  )
}
