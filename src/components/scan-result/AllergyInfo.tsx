import { TriangleAlert } from 'lucide-react'

import type { ScanResultData } from '@/types/scanData'

interface Props {
  data: ScanResultData
}

export default function AllergyInfo({ data }: Props) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* 알러지유발 물질 갯수 표시 */}
      <p className="font-bold text-(--color-accent-red) text-xl">
        알러지 유발물질 {data.allergens.length}개
      </p>
      {/* 알러지유말 물질 이름 표시 */}
      {data.allergens.map(a => (
        <div
          key={a}
          className="flex gap-2 p-4 rounded-2xl justify-center min-w-md bg-(--color-accent-red) text-xl font-bold text-(--color-secondary) "
        >
          <TriangleAlert />
          알러지 유발 : {a}
        </div>
      ))}
    </div>
  )
}
