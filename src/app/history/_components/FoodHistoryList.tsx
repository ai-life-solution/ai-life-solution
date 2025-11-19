'use client'

import { MOCK_DATA } from '../_constants/mockData'

import { FoodHistoryItem } from './FoodHistoryItem'

export default function FoodHistoryList() {
  return (
    <ul className="flex flex-col w-full gap-4 overflow-y-auto">
      {MOCK_DATA.toReversed().map(item => (
        <FoodHistoryItem key={item.order} item={item} />
      ))}
    </ul>
  )
}
