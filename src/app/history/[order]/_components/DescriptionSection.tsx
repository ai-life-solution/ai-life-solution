'use client'

import { STYLE } from '../_constants/style'

interface DescriptionSectionProps {
  source: string
  title: string
}

/**
 * DescriptionSection 컴포넌트
 * 
 * 식품의 상세 설명 정보를 표시하는 컴포넌트입니다.
 * 제목과 설명 텍스트를 섹션 형태로 렌더링합니다.
 * 
 * @param props - DescriptionSectionProps 객체
 * @param props.source - 표시할 설명 텍스트
 * @param props.title - 섹션 제목
 * @returns 설명 정보를 나타내는 JSX 요소
 */
export default function DescriptionSection({ source, title }: DescriptionSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>{title}</h3>
      <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>{source}</p>
    </section>
  )
}
