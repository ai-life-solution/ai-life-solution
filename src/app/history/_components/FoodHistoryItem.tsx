'use client'

import Link from 'next/link'

import type { FoodHistoryEntry } from '@/types/FoodData'

interface FoodHistoryItemProps {
  item: FoodHistoryEntry
}

export function FoodHistoryItem(props: FoodHistoryItemProps) {
  const { item } = props
  return (
    <li className="flex bg-white rounded-md">
      <Link className="p-4 truncate w-full" href={`/history/${props.item.order}`}>
        {item.productName}
      </Link>
    </li>
  )
}
