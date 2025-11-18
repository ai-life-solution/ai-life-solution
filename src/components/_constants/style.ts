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
  POPOVER: {
    CONTAINER: cn('relative flex items-center'),
    TRIGGER_BUTTON: cn(
      'inline-flex',
      'h-fit',
      'w-fit',
      'items-center',
      'justify-center',
      'rounded',
      'bg-transparent',
      'p-0',
      'text-inherit',
      'border-0',
      'outline-none',
      'transition',
      'focus-visible:outline',
      'focus-visible:outline-2',
      'focus-visible:outline-offset-2',
      'focus-visible:outline-[var(--color-primary)]',
      'cursor-pointer'
    ),
    BACKDROP: cn('fixed inset-0 z-10'),
    MENU: cn(
      'absolute',
      'top-full',
      'mt-1',
      'z-[100]',
      'm-0',
      'list-none',
      'min-w-[120px]',
      'rounded-lg',
      'border',
      'border-gray-100',
      'bg-[var(--color-secondary)]',
      'p-2',
      'shadow-[0_4px_16px_var(--color-shadow)]'
    ),
    ACTION_BUTTON: cn(
      'block',
      'w-full',
      'rounded-lg',
      'border-0',
      'bg-transparent',
      'px-4 py-2 text-left',
      'text-base text-[var(--secondary-color)]',
      'transition-colors'
    ),
    ACTION_BUTTON_HOVER: cn('hover:bg-gray-100', 'cursor-pointer'),
    ACTION_BUTTON_DANGER: cn('text-red-500'),
    ACTION_BUTTON_DISABLED: cn('opacity-50', 'cursor-not-allowed'),
  },
}
