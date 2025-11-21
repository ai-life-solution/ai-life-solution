'use client'

import { STYLE } from '../_constants/style'

interface WeightSectionProps {
  data: string
}

export default function WeightSection({ data }: WeightSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION_TOP}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>총 내용량</h3>
      <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>
        {data}
      </p>
    </section>
  )
}
