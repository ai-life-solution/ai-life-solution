'use client'

import { STYLE } from '../_constants/style'

interface AllergenSectionProps {
  allergens: string[]
}

export default function AllergenSection({ allergens }: AllergenSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={STYLE.HISTORY_INFO.SECTION_H3}>알레르기 유발 성분</h3>
      {allergens.length > 0 ? (
        <ul className="list-disc list-inside text-sm">
          {allergens.map(allergen => (
            <li key={allergen}>{allergen}</li>
          ))}
        </ul>
      ) : (
        <p className={STYLE.HISTORY_INFO.PARAGRPAPH}>알레르기 유발 성분이 없습니다.</p>
      )}
    </section>
  )
}
