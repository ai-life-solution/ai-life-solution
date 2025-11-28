import { STYLE } from '../_constants/style'

import HeaderButtonContainer from './HeaderButtonContainer'

/**
 * Header 컴포넌트
 * 
 * 히스토리 페이지의 헤더를 렌더링하는 컴포넌트입니다.
 * 뒤로가기, 홈 버튼과 "히스토리" 제목을 포함합니다.
 * 
 * @returns 네비게이션 버튼과 제목을 포함한 헤더 JSX 요소
 */
export default function Header() {
  return (
    <header className={STYLE.HEADER.HEADER}>
      <HeaderButtonContainer />
      <h1 className={STYLE.HEADER.H1}>히스토리</h1>
    </header>
  )
}
