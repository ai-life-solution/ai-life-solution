import { cn } from '@/utils'

export const STYLE = {
  PAGE: {
    CONTAINER: cn('bg-(--color-etc-2)', 'w-full', 'min-h-screen'),
    CONTENTS: cn(
      'flex',
      'flex-col',
      'p-8',
      'bg-gray-100',
      'rounded-t-3xl',
      'max-h-[calc(100vh_-_120px)]',
      'max-w-[600px] w-full'
    ),
    MAIN: cn('flex', 'flex-col', 'items-center', 'w-full', 'h-full', 'min-h-[calc(100vh_-_168px)]'),
  },
  HEADER: {
    HEADER: cn('grid', 'grid-cols-3', 'w-full', 'px-8', 'py-4'),
    H1: cn(
      'flex',
      'self-center',
      'justify-self-center',
      'font-bold',
      'text-2xl',
      'text-(--color-primary)'
    ),
  },
  HEADER_BUTTON_CONTAINER: {
    CONTAINER: cn('flex', 'items-center'),
    BUTTON: cn('w-fit', 'p-2', 'cursor-pointer'),
  },
  HISTORY_LIST: {
    LIST: cn(
      'flex',
      'flex-col',
      'w-full',
      'gap-4',
      'overflow-y-scroll',
      'scrollbar-hide',
      'min-h-[calc(100vh_-_168px)]'
    ),
  },
  HISTORY_ITEM: {
    ITEM: cn('flex', 'bg-white', 'rounded-lg'),
    LINK: cn('p-4', 'truncate', 'w-full'),
    POPOVER: cn('p-2'),
  },
  STATUS_MESSAGE: {
    INFO: cn('text-center', 'text-sm', 'text-gray-500'),
    ERROR: cn('text-center', 'text-sm', 'text-red-500'),
  },
} as const
