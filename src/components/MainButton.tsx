'use client'

import type { ButtonHTMLAttributes } from 'react'

import cn from '@/utils/cn'

export default function MainButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...rest } = props
  return (
    <button
      {...rest}
      className={cn(
        'text-xl',
        'font-bold',
        'text-center',
        'p-2',
        'rounded',
        'bg-blue-500',
        'hover:bg-blue-600',
        'text-white',
        'cursor-pointer',
        className
      )}
    >
      {props.children}
    </button>
  )
}
