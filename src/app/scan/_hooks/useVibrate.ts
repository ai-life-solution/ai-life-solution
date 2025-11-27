import { useCallback } from 'react'

export function useVibrate() {
  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])

  return { vibrate }
}
