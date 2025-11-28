'use client'

import { STYLE } from '../_constants/style'

interface IngridientSectionProps {
  source: string[]
  title: string
}

/**
 * IngridientSection 컴포넌트
 *
 * 식품의 재료 정보를 표시하는 컴포넌트입니다.
 * 재료 목록을 리스트 형태로 렌더링합니다.
 *
 * @param props - IngridientSectionProps 객체
 * @param props.source - 표시할 재료 배열
 * @param props.title - 섹션 제목
 * @returns 재료 정보를 나타내는 JSX 요소
 */
export default function IngridientSection({ source, title }: IngridientSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>{title}</h3>
      <ul className={STYLE.HISTORY_INFO.PARAGRPAPH}>
        {source.map(data => (
          <li key={data} className="flex justify-between">
            <span>{data}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
