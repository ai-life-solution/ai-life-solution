'use client'

import Link from 'next/link'

import { MoreHorizontal } from 'lucide-react'

import Popover, { type PopoverAction } from '@/components/Popover'
import { useFoodStore } from '@/store/useFoodsHistoryStore'
import type { FoodHistoryEntry } from '@/types/FoodData'

import { STYLE } from '../_constants/style'

interface FoodHistoryItemProps {
  item: FoodHistoryEntry
}

export function FoodHistoryItem(props: FoodHistoryItemProps) {
  const removeFoodItem = useFoodStore(state => state.removeFoodItem)
  const { item } = props
  const actions: PopoverAction[] = [
    {
      id: 'delete',
      label: '삭제',
      onClick: () => {
        if (item.order) removeFoodItem(item.order)
      },
      isDanger: true,
    },
  ]

  return (
    <li className={STYLE.HISTORY_ITEM.ITEM}>
      <Link className={STYLE.HISTORY_ITEM.LINK} href={`/history/${props.item.order}`}>
        {item.productName}
      </Link>
      <Popover
        trigger={<MoreHorizontal />}
        actions={actions}
        ariaLabel="더보기"
        className={STYLE.HISTORY_ITEM.POPOVER}
      />
    </li>
  )
}
