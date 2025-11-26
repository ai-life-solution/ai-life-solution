import cn from '@/utils/cn'

export const MODAL_INNER_CLASS = cn(
  'p-6',
  'bg-white',
  'gap-3',
  'w-full',
  'h-[80vh]',
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

// 슬라이드
export const SLIDE_INNER_CLASS = cn('flex w-full h-full transition-transform duration-300')

export const INDICATOR_CLASS = (index: number, currentSlide: number) =>
  cn(
    index === currentSlide ? 'bg-[var(--color-accent)]' : 'bg-gray-300',
    'h-5 flex justify-center items-center rounded-full aspect-square'
  )

export const INDICATOR_WRAPPER_CLASS = cn('absolute bottom-0 w-full flex justify-center gap-2')

//로딩 상태
export const ICON_WRAPPER_CLASS = cn('w-fit p-1 rounded-full aspect-square outline-1')

// 태그
export const TAG_ITEM_CLASS = cn('bg-gray-500 text-gray-200 text-sm px-3 py-0.5 rounded-lg')
