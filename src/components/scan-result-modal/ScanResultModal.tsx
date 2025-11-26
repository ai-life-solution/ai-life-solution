'use client'

import { X } from 'lucide-react'
import { toast } from 'sonner'

import NavigationBar from '@/components/NavigationBar'
import { useScanResultStore } from '@/store/scanResultStore'
import { useFoodStore } from '@/store/useFoodsHistoryStore'

import { DIALOG_CLASS, MODAL_INNER_CLASS } from './_constants/style'
import LoadingStatus from './LoadingStatus'
import SaveButton from './SaveButton'
import ScanResultSlide from './ScanResultSlide'
import Tags from './Tags'

interface ScanResultModalProps {
  open: boolean
  onClose: () => void
}

export default function ScanResultModal({ open, onClose }: ScanResultModalProps) {
  const { data, status } = useScanResultStore()
  const { foods, addFoodsHistoryItem } = useFoodStore()
  if (!open) return null

  const handleSave = async () => {
    if (!data) return
    const lastOrder = foods[0]?.order ?? 0

    const newEntry = {
      ...data,
      order: lastOrder + 1,
      createAt: Date.now(),
    }

    try {
      await addFoodsHistoryItem(newEntry)
      toast.success('저장 완료!')
    } catch (e) {
      toast.error('fail')
      console.error(e)
    }
  }

  return (
    <dialog open className={DIALOG_CLASS}>
      <div className={MODAL_INNER_CLASS}>
        {/* 닫기버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-500"
          aria-label="닫기"
        >
          <X size={24} />
        </button>
        {/*상태 메시지 */}
        <LoadingStatus status={status} />

        {status === 'success' && data ? (
          <>
            {/* 테그 */}
            <Tags tags={data.tags} />
            {/* 제품이름 */}
            <div className="text-2xl font-bold">{data.productName}</div>
            {/* 슬라이드 */}
            <ScanResultSlide data={data} />
            {/* 저장 버튼 */}
            <SaveButton className="mb-20" onClick={handleSave} />
            {/* 네비게이션 바 */}
            <NavigationBar />
          </>
        ) : null}
      </div>
    </dialog>
  )
}
