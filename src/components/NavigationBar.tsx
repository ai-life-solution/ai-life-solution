import Link from 'next/link'

import { Home, Scan, Bookmark } from 'lucide-react'

import { STYLE } from './_constants/style'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/scan', icon: Scan, label: '스캔' },
  { href: '/history', icon: Bookmark, label: '히스토리' },
]

export default function NavigationBar() {
  return (
    <nav className={STYLE.NAVIGATION_BAR.CONTAINER}>
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link key={href} href={href} className={STYLE.NAVIGATION_BAR.LINK} aria-label={label}>
          <Icon size={28} strokeWidth={2} />
        </Link>
      ))}
    </nav>
  )
}
