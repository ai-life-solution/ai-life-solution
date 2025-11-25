import { Check, Ellipsis, X } from 'lucide-react'

import { ICON_WRAPPER_CLASS } from './_constants/style'

export type Status = 'loading' | 'success' | 'error'

interface LoadingStatusProps {
  status: Status
}

export default function LoadingStatus({ status }: LoadingStatusProps) {
  const renderStatus = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Ellipsis className="w-4 h-4 text-gray-500" />,
          bg: 'bg-(--color-gray-100)',
          text: '상품 정보를 로딩중입니다!',
          textColor: 'text-gray-500',
          outlineColor: 'outline-gray-500',
        }
      case 'success':
        return {
          icon: <Check className="w-4 h-4 text-(--color-primary)" />,
          bg: 'bg-(--color-etc-3)',
          text: '상품 스캔을 완료했습니다!',
          textColor: 'text-(--color-primary)',
          outlineColor: 'outline-gray-500',
        }
      case 'error':
        return {
          icon: <X className="w-4 h-4 text-(--color-accent-red)" />,
          bg: 'bg-red-100',
          text: '상품정보를 가져오는동안 오류가 발생했습니다!',
          textColor: 'text-(--color-accent-red)',
          outlineColor: 'outline-(--color-accent-red)',
        }
    }
  }

  const { icon, bg, text, textColor, outlineColor } = renderStatus()

  return (
    <div className="flex gap-2 items-center">
      <span className={`${bg} ${ICON_WRAPPER_CLASS} ${outlineColor}`}>{icon}</span>
      <p className={`${textColor} text-base font-medium`}>{text}</p>
    </div>
  )
}
