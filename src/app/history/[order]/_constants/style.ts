import { cn } from '@/utils'

export const STYLE = {
  HISTORY_INFO: {
    CONTAINER: cn(
      'w-full',
      'h-full',
      'p-4',
      'bg-(--color-secondary)',
      'rounded-lg',
      'overflow-y-auto',
      'min-h-[calc(100vh_-_168px)]',
      'scrollbar-hide'
    ),
    H2: cn('text-2xl', 'font-bold', 'text-(--color-primary)'),
    PARAGRPAPH: cn('text-sm text-gray-600'),
    SECTION_TOP: cn('mb-6', 'mt-6'),
    SECTION: cn('mb-6'),
    SECTION_H3: cn('text-lg', 'font-semibold', 'mb-2'),
    STATUS_MESSAGE: {
      BASE: cn('text-center', 'text-sm'),
      INFO: cn('text-center', 'text-sm', 'text-gray-500'),
      ERROR: cn('text-center', 'text-sm', 'text-red-500'),
    },
  },
} as const
