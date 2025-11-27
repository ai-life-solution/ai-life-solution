import Image from 'next/image'

import type { Certification } from '@/types/FoodItem'

import { STYLE } from '../_constants/style'

interface CertSectionProps {
  data: Certification[]
}

export default function CertSection({ data }: CertSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION_TOP}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>인증 현황</h3>

      <ul className={STYLE.HISTORY_INFO.PARAGRPAPH}>
        {data.map(cert => (
          <li key={cert.certNm} className="flex justify-between">
            <Image src={cert.certIng || ''} height={40} width={40} alt={cert.certNm} />
            <p className="flex self-center">{cert.certNm}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
