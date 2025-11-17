import cn from '@/utils/cn'

export const PAGE_H1_CLASS = cn('text-3xl', 'font-bold', 'text-center')
export const PAGE_MAIN_CLASS = cn(
  'flex',
  'flex-col',
  'items-center',
  'p-8',
  'gap-16',
  'max-w-[600px]'
)

export const SCAN_LINK_CLASS = cn(
  'flex',
  'gap-4',
  'items-center',
  'text-(--color-secondary)',
  'font-bold',
  'bg-(--color-primary)',
  'py-4',
  'px-8',
  'rounded-3xl',
  'text-2xl'
)
