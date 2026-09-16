'use client'

import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/utils'

import { STYLE } from './_constants/style'

/**
 * 팝오버 메뉴 액션 아이템 타입
 */
export interface PopoverAction {
  /**
   * 액션 고유 식별자
   */
  id: string
  /**
   * 액션 레이블
   */
  label: string
  /**
   * 액션 실행 핸들러
   */
  onClick: () => void
  /**
   * 위험한 액션인지 여부 (빨간색으로 표시)
   */
  isDanger?: boolean
  /**
   * 비활성화 여부
   */
  disabled?: boolean

  dangerLabel?: string
}

/**
 * Popover 컴포넌트 props
 */
interface PopoverProps {
  /**
   * 팝오버 트리거 버튼 (커스텀 가능)
   */
  trigger: ReactNode
  /**
   * 팝오버 메뉴 액션 목록
   */
  actions: PopoverAction[]
  /**
   * 추가 CSS 클래스
   */
  className?: string
  /**
   * 팝오버 메뉴 정렬 (기본값: right)
   */
  align?: 'left' | 'right'

  ariaLabel?: string
}

/**
 * 범용 팝오버 컴포넌트
 *
 * 클릭 시 액션 메뉴를 표시하는 범용 팝오버 UI 컴포넌트입니다.
 * 외부 클릭 시 자동으로 닫히며, 다양한 액션을 지원합니다.
 *
 * @param props - PopoverProps
 *
 * @example
 * ```tsx
 * <Popover
 *   trigger={<MoreVertical />}
 *   actions={[
 *     { id: 'edit', label: '수정', onClick: handleEdit },
 *     { id: 'delete', label: '삭제', onClick: handleDelete, isDanger: true }
 *   ]}
 * />
 * ```
 */
export default function Popover({
  trigger,
  actions,
  className,
  align = 'right',
  ariaLabel,
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuItemsRef = useRef<(HTMLButtonElement | null)[]>([])

  const getFirstFocusableIndex = () => actions.findIndex(action => !action.disabled)

  const getLastFocusableIndex = () => {
    for (let i = actions.length - 1; i >= 0; i--) {
      if (!actions[i]?.disabled) return i
    }
    return -1
  }

  const getNextFocusableIndex = (currentIndex: number, direction: 1 | -1) => {
    const total = actions.length
    if (total === 0) return -1
    let nextIndex = (currentIndex + direction + total) % total
    while (actions[nextIndex]?.disabled && nextIndex !== currentIndex) {
      nextIndex = (nextIndex + direction + total) % total
    }
    return actions[nextIndex]?.disabled ? -1 : nextIndex
  }

  /**
   * 외부 클릭/탭 시 팝오버 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('pointerdown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * ESC 키로 팝오버 닫기 및 트리거 포커스 복원
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  /**
   * 액션 실행 핸들러
   */
  const handleActionClick = (action: PopoverAction) => {
    if (action.disabled) return
    if (action.isDanger) {
      const message = action.dangerLabel ?? '진행하시겠습니까?'
      if (!confirm(message)) return
    }
    action.onClick()
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  /**
   * 트리거 클릭 핸들러
   */
  const handleTriggerClick = () => {
    setIsOpen(prev => !prev)
  }

  const focusItem = (index: number) => {
    if (index !== -1) menuItemsRef.current[index]?.focus()
  }

  const openAndFocus = (getTargetIndex: () => number) => {
    setIsOpen(true)
    requestAnimationFrame(() => focusItem(getTargetIndex()))
  }

  const TRIGGER_NAV_TARGETS: Record<string, () => number> = {
    ArrowDown: getFirstFocusableIndex,
    ArrowUp: getLastFocusableIndex,
    Enter: getFirstFocusableIndex,
    ' ': getFirstFocusableIndex,
  }

  /**
   * 트리거 키보드 핸들러
   */
  const handleTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Tab') {
      if (isOpen) setIsOpen(false)
      return
    }

    const getTarget = TRIGGER_NAV_TARGETS[event.key]
    if (!getTarget) return

    event.preventDefault()
    if (!isOpen) {
      openAndFocus(getTarget)
    } else if (event.key === 'Enter' || event.key === ' ') {
      setIsOpen(false)
    } else {
      focusItem(getTarget())
    }
  }

  const ITEM_NAV_RESOLVERS: Record<string, (curr: number) => number> = {
    ArrowDown: curr => getNextFocusableIndex(curr, 1),
    ArrowUp: curr => getNextFocusableIndex(curr, -1),
    Home: () => getFirstFocusableIndex(),
    End: () => getLastFocusableIndex(),
  }

  /**
   * 메뉴 아이템 키보드 탐색 핸들러
   */
  const handleItemKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    const resolveTarget = ITEM_NAV_RESOLVERS[event.key]
    if (resolveTarget) {
      event.preventDefault()
      focusItem(resolveTarget(index))
      return
    }
  }

  /**
   * 포커스 외부 이탈 시 팝오버 닫기
   */
  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsOpen(false)
    }
  }

  return (
    <div className={cn(STYLE.POPOVER.CONTAINER, className)} ref={popoverRef} onBlur={handleBlur}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleTriggerClick}
        className={STYLE.POPOVER.TRIGGER_BUTTON}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
      >
        {trigger}
      </button>

      {isOpen && (
        <ul
          className={cn(STYLE.POPOVER.MENU, align === 'right' ? 'right-0' : 'left-0')}
          role="menu"
        >
          {actions.map((action, index) => (
            <li key={action.id}>
              <button
                ref={element => {
                  menuItemsRef.current[index] = element
                }}
                type="button"
                className={cn(
                  STYLE.POPOVER.ACTION_BUTTON,
                  !action.disabled && STYLE.POPOVER.ACTION_BUTTON_HOVER,
                  action.isDanger && STYLE.POPOVER.ACTION_BUTTON_DANGER,
                  action.disabled && STYLE.POPOVER.ACTION_BUTTON_DISABLED
                )}
                onClick={() => handleActionClick(action)}
                onKeyDown={event => handleItemKeyDown(event, index)}
                disabled={action.disabled}
                role="menuitem"
                tabIndex={-1}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
