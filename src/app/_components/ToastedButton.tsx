'use client'

import MainButton from '@/components/MainButton'
import type { PropsWithChildren } from 'react'
import { toast } from 'sonner'

export default function ToastedButton({ children }: PropsWithChildren) {
  return (
    <MainButton
      onClick={() => {
        const toastId = toast(children)
        setTimeout(() => {
          toast.dismiss(toastId)
        }, 2000)
      }}
    >
      {children}
    </MainButton>
  )
}
