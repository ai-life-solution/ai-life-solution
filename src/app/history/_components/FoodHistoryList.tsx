'use client'

import { FoodHistoryItem } from './FoodHistoryItem'
import { MOCK_DATA } from '../_constants/mockData'

export default function FoodHistoryList() {
  return (
    <ul className="flex flex-col w-full gap-4">
      {MOCK_DATA.map(item => (
        <FoodHistoryItem key={item.order} item={item} />
      ))}
    </ul>
  )
}
