'use client'

import Link from 'next/link'

import { MoreHorizontal } from 'lucide-react'

import Popover, { type PopoverAction } from '@/components/Popover'
import type { FoodHistoryEntry } from '@/types/FoodData'

interface FoodHistoryItemProps {
  item: FoodHistoryEntry
}

export function FoodHistoryItem(props: FoodHistoryItemProps) {
  const { item } = props
  const actions: PopoverAction[] = [{ id: 'delete', label: '삭제', onClick: () => { return }, isDanger: true }]

  return (
    <li className="flex bg-white rounded-md">
      <Link className="p-4 truncate w-full" href={`/history/${props.item.order}`}>
        {item.productName}
      </Link>
      <Popover
        trigger={<MoreHorizontal />}
        actions={actions}
        ariaLabel='더보기'
        className='p-2'
      />
    </li>
  )
}
