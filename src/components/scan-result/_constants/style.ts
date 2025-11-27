import cn from '@/utils/cn'

export const ALLERGEN_CONTAINER_CLASS = cn(
  'flex gap-2 p-4 rounded-2xl min-w-2xs justify-center bg-(--color-accent-red) text-xl font-bold text-(--color-secondary)'
)

export const AI_SUMMARY_CONTAINER_CLASS = cn('h-full flex justify-center items-center')

export const UNREGISTERED_ERROR_BOX_CLASS = cn(
  'p-5 border border-red-400 bg-red-50 rounded-lg flex flex-col gap-2'
)

export const UNREGISTERED_ERROR_BUTTON_CLASS = cn(
  'self-start px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700'
)
