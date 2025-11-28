import { Loader2 } from 'lucide-react'

interface SpinnerProps {
  message?: string
  size?: number
}

export default function Spinner({ message, size = 40 }: SpinnerProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* 원형 스피너 */}
      <Loader2
        className="text-(--color-etc-3) animate-spin"
        style={{ width: size, height: size }}
      />
      {message && <p className="text-sm text-gray-500">{message}</p>}
    </div>
  )
}
