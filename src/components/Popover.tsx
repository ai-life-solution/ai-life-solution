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
  align?: 'left' | 'right',

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
export default function Popover({ trigger, actions, className, align = 'right', ariaLabel }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  /**
   * 외부 클릭 시 팝오버 닫기
   */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  /**
   * ESC 키로 팝오버 닫기
   */
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
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
    action.onClick()
    setIsOpen(false)
  }

  /**
   * 트리거 클릭 핸들러
   */
  const handleTriggerClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={cn(STYLE.POPOVER.CONTAINER, className)} ref={popoverRef}>
      <button
        type="button"
        onClick={handleTriggerClick}
        className={STYLE.POPOVER.TRIGGER_BUTTON}
        onKeyDown={(e: React.KeyboardEvent<HTMLButtonElement>) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleTriggerClick()
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={ariaLabel}
      >
        {trigger}
      </button>

      {isOpen && (
        <>
          <div className={STYLE.POPOVER.BACKDROP} onClick={() => setIsOpen(false)} />
          <ul
            className={cn(STYLE.POPOVER.MENU, align === 'right' ? 'right-0' : 'left-0')}
            role="menu"
          >
            {actions.map(action => (
              <li key={action.id}>
                <button
                  type="button"
                  className={cn(
                    STYLE.POPOVER.ACTION_BUTTON,
                    !action.disabled && STYLE.POPOVER.ACTION_BUTTON_HOVER,
                    action.isDanger && STYLE.POPOVER.ACTION_BUTTON_DANGER,
                    action.disabled && STYLE.POPOVER.ACTION_BUTTON_DISABLED
                  )}
                  onClick={() => handleActionClick(action)}
                  disabled={action.disabled}
                  role="menuitem"
                >
                  {action.label}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}
