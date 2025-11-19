import { cn } from '@/utils'

export const PAGE = {
  CONTAINER: cn('bg-(--color-etc-2)', 'w-full', 'min-h-screen'),
  CONTENTS: cn('flex', 'flex-col', 'p-8', 'bg-gray-100', 'rounded-t-3xl', 'max-h-[calc(100vh_-_120px)]', 'max-w-[600px] w-full'),
  MAIN: cn('flex', 'flex-col', 'items-center', 'w-full', 'h-full', 'min-h-[calc(100vh_-_168px)]'),
} as const

export const COMPONENTS_HEADER = {
  HEADER: cn('grid', 'grid-cols-3', 'w-full', 'px-8', 'py-4'),
  H1: cn(
    'flex',
    'self-center',
    'justify-self-center',
    'font-bold',
    'text-2xl',
    'text-(--color-primary)'
  ),
} as const

export const COMPONENTS_HEADER_BUTTON_CONTAINER = {
  CONTAINER: cn('flex', 'items-center'),
  LINK: cn('w-fit', 'p-2', 'cursor-pointer'),
}
