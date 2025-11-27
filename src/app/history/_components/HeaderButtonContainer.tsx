import Link from 'next/link'

import { HomeIcon } from 'lucide-react'

import { STYLE } from '../_constants/style'

import GoBackButton from './GoBackButton'

export default function HeaderButtonContainer() {
  return (
    <div className={STYLE.HEADER_BUTTON_CONTAINER.CONTAINER}>
      <GoBackButton />
      <Link className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON} href="/">
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </Link>
    </div>
  )
}
