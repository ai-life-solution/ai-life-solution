import Link from 'next/link'

import { Camera } from 'lucide-react'

import { SCAN_LINK_CLASS } from '../_constants/style'

export default function ScanLink() {
  return (
    <Link href="/" className={SCAN_LINK_CLASS}>
      스캔시작
      <Camera size={24} />
    </Link>
  )
}
