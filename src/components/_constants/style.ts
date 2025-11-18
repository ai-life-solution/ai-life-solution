import { cn } from '@/utils'

export const STYLE = {
  NAVIGATION_BAR: {
    CONTAINER: cn(
      'flex',
      'justify-around',
      'items-center',
      'h-16',
      'fixed',
      'bottom-0',
      'left-1/2',
      '-translate-x-1/2',
      'w-full',
      'max-w-[600px]',
      'bg-(--color-primary)',
      'text-white',
      'z-50',
      'rounded-t-3xl'
    ),
    LINK: cn(
      'flex',
      'items-center',
      'justify-center',
      'w-full',
      'h-full',
      'hover:text-[#F0E491]',
      'transition-colors'
    ),
  },
}
