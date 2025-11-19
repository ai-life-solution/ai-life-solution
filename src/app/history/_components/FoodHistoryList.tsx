'use client'

import { MOCK_DATA } from '../_constants/mockData'
import { STYLE } from '../_constants/style'

import { FoodHistoryItem } from './FoodHistoryItem'

export default function FoodHistoryList() {
  return (
    <ul className={STYLE.HISTORY_LIST.LIST}>
      {MOCK_DATA.toReversed().map(item => (
        <FoodHistoryItem key={item.order} item={item} />
      ))}
    </ul>
  )
}
