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

/**
 * FoodHistoryItem 컴포넌트
 *
 * 식품 히스토리 목록에서 개별 항목을 렌더링하는 컴포넌트입니다.
 * 제품명을 표시하고, 더보기 메뉴를 통해 삭제 기능을 제공합니다.
 *
 * @param props - FoodHistoryItemProps 객체
 * @param props.item - 표시할 식품 히스토리 항목
 * @returns 식품 히스토리 항목을 나타내는 JSX 요소
 */
export function FoodHistoryItem(props: FoodHistoryItemProps) {
  const removeFoodItem = useFoodStore(state => state.removeFoodItem)
  const { item } = props

  /**
   * 더보기 메뉴에 표시될 액션 목록
   * 삭제 액션만 포함되며, 확인 다이얼로그를 통해 사용자 의도를 재확인합니다.
   */
  const actions: PopoverAction[] = [
    {
      id: 'delete',
      label: '삭제',
      onClick: () => {
        if (item.order) removeFoodItem(item.order)
      },
      isDanger: true,
      dangerLabel: '삭제하시겠습니까?',
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
