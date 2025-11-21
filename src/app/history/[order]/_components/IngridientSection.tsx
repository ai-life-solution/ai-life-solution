'use client'

import { STYLE } from '../_constants/style'

interface IngridientSectionProps {
  source: string[]
  title: string
}

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
