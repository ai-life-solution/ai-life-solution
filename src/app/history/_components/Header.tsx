import { STYLE } from '../_constants/style'

import HeaderButtonContainer from './HeaderButtonContainer'

export default function Header() {
  return (
    <header className={STYLE.HEADER.HEADER}>
      <HeaderButtonContainer />
      <h1 className={STYLE.HEADER.H1}>히스토리</h1>
    </header>
  )
}
