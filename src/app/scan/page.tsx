import BarcodeScanner from './_components/BarcodeScanner'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'HearCode',
  description: '제품 바코드를 스캔하여 영양 정보를 확인하세요',
}

export default function ScanPage() {
  return <BarcodeScanner />
}
