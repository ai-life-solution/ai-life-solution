'use client'

import { cn } from '@/utils'

import { STYLE } from '../_constants/style'

interface AllergenSectionProps {
  allergens: string[]
}

/**
 * AllergenSection 컴포넌트
 * 
 * 식품의 알레르기 유발 성분 정보를 표시하는 컴포넌트입니다.
 * 알레르기 성분 목록을 리스트 형태로 렌더링하거나, 
 * 알레르기 성분이 없는 경우 해당 메시지를 표시합니다.
 * 
 * @param props - AllergenSectionProps 객체
 * @param props.allergens - 표시할 알레르기 유발 성분 배열
 * @returns 알레르기 정보를 나타내는 JSX 요소
 */
export default function AllergenSection({ allergens }: AllergenSectionProps) {
  return (
    <section className={STYLE.HISTORY_INFO.SECTION}>
      <h3 className={cn(STYLE.HISTORY_INFO.SECTION_H3, 'text-red-600')}>알레르기 유발 성분</h3>
      {allergens.length > 0 ? (
        <ul className="list-disc list-inside text-sm text-red-600">
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
