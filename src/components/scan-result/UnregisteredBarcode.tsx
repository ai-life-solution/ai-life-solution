'use client'

import { toast } from 'sonner'

import { RetryButton } from '../scan-result-modal/Buttons'

import { UNREGISTERED_ERROR_BOX_CLASS, UNREGISTERED_ERROR_BUTTON_CLASS } from './_constants/style'

interface Props {
  barcode: string
  onRetry: () => void
}

export default function UnregisteredBarcode({ barcode, onRetry }: Props) {
  const copyCode = () => {
    navigator.clipboard.writeText(barcode ?? '')
    toast.success('클립보드에 복사되었습니다!')
  }

  return (
    <div className="flex flex-col h-full w-full mt-10">
      <div className={UNREGISTERED_ERROR_BOX_CLASS}>
        <div className="flex items-center gap-2">
          <span className="text-red-600 font-bold">등록되지 않은 바코드</span>
        </div>

        <p className="text-gray-700">
          바코드: <span>{barcode}</span>
        </p>

        <button className={UNREGISTERED_ERROR_BUTTON_CLASS} onClick={() => copyCode()}>
          바코드 복사
        </button>

        <p className="text-sm text-gray-500">이 바코드는 food-qr DB에 등록되어 있지 않습니다.</p>
      </div>

      <RetryButton className="mt-auto mb-15" onClick={onRetry} />
    </div>
  )
}
