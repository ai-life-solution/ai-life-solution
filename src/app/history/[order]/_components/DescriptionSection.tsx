'use client'

import { STYLE } from '../_constants/style'

interface DescriptionSectionProps {
  source: string
  title: string
}

export default function DescriptionSection({ source, title }: DescriptionSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>{title}</h3>
      <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>{source}</p>
    </section>
  )
}
