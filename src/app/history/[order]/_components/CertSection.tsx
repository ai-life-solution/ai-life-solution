import Image from 'next/image'

import type { Certification } from '@/types/FoodItem'

import { STYLE } from '../_constants/style'

interface CertSectionProps {
  data: Certification[]
}

/**
 * CertSection 컴포넌트
 *
 * 식품의 인증 현황 정보를 표시하는 컴포넌트입니다.
 * 인증 이미지와 인증명을 리스트 형태로 렌더링합니다.
 *
 * @param props - CertSectionProps 객체
 * @param props.data - 표시할 인증 정보 배열
 * @returns 인증 현황 정보를 나타내는 JSX 요소
 */
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
