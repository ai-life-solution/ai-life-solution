import cn from '@/utils/cn'

export const MODAL_INNER_CLASS = cn(
  'p-6',
  'bg-white',
  'gap-3',
  'w-full',
  'h-2/3',
  'absolute',
  'flex',
  'flex-col',
  'bottom-0',
  'max-w-[600px]',
  'rounded-t-3xl'
)

export const DIALOG_CLASS = cn(
  'inset-0 z-50 w-full h-full p-4 bg-black/55 flex justify-center items-center'
)

export const SAVE_BUTTON_CLASS = cn(
  'flex',
  'justify-center',
  'items-center',
  'gap-6',
  'text-(--color-primary)',
  'font-bold',
  'bg-(--color-etc-1)',
  'py-4',
  'text-lg',
  'rounded-2xl',
  'w-full'
)
