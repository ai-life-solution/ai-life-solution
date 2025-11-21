'use client'

import { X } from 'lucide-react'

import NavigationBar from '@/components/NavigationBar'
import { useScanResultStore } from '@/store/scanResultStore'

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

  if (!open) return null
  if (!data) return <div>there is no data</div>

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
        {/* 테그 */}
        <Tags tags={data.tags} />
        {/* 제품이름 */}
        <div className="text-2xl font-bold">{data.productName}</div>
        {/* 슬라이드 */}
        <ScanResultSlide data={data} />
        {/* 저장 버튼 */}
        <SaveButton className="mb-20" />
        {/* 네비게이션 바 */}
        <NavigationBar />
      </div>
    </dialog>
  )
}
