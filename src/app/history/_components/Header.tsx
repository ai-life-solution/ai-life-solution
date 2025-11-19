import { COMPONENTS_HEADER } from '../_constants/style'

import HeaderButtonContainer from './HeaderButtonContainer'

export default function Header() {
  return (
    <header className={COMPONENTS_HEADER.HEADER}>
      <HeaderButtonContainer />
      <h1 className={COMPONENTS_HEADER.H1}>히스토리</h1>
    </header>
  )
}
