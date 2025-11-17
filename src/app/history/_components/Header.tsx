import Link from 'next/link'

import { HomeIcon } from 'lucide-react'

import { COMPONENTS_HEADER } from '../_constants/style'

export default function Header() {
  return (
    <header className={COMPONENTS_HEADER.HEADER}>
      <Link className={COMPONENTS_HEADER.LINK} href="/">
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </Link>
      <h1 className={COMPONENTS_HEADER.H1}>히스토리</h1>
    </header>
  )
}
