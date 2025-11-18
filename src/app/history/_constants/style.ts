import { cn } from '@/utils'

export const PAGE = {
  CONTAINER: cn('bg-(--color-etc-2)', 'w-full', 'min-h-screen'),
  CONTENTS: cn('p-8', 'bg-gray-100', 'rounded-t-3xl', 'min-h-[calc(100vh_-_120px)]'),
  MAIN: cn(
    'flex',
    'flex-col',
    'items-center',
    'w-full',
    'h-full',
    'min-h-[calc(100vh_-_136px)]'
  ),
} as const

export const COMPONENTS_HEADER = {
  HEADER: cn('grid', 'grid-cols-3', 'w-full', 'px-8', 'py-4'),
  LINK: cn('w-fit', 'p-2'),
  H1: cn(
    'flex',
    'self-center',
    'justify-self-center',
    'font-bold',
    'text-2xl',
    'text-(--color-primary)'
  ),
} as const
