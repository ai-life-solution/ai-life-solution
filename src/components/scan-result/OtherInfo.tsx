import Image from 'next/image'

import type { ScanResultData } from '@/types/scanData'

interface Props {
  data: ScanResultData
}

export default function OtherInfo({ data }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <p className="font-bold text-xl">인증 정보</p>
      {data.certifications.map((cert, i) => (
        <div key={i} className="flex gap-3 items-center text-xl">
          <Image src={cert.certIng ?? ''} width={50} height={50} alt={cert.certNm} />
          <span>{cert.certNm}</span>
        </div>
      ))}
    </div>
  )
}
