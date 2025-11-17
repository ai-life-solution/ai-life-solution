import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header>
      <Link href="/">
        <Image src="/svg/logo.svg" width={200} height={31} alt="HearCode" />
      </Link>
    </header>
  )
}
