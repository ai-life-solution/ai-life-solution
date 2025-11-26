'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { Home, Scan, Bookmark } from 'lucide-react'

import { STYLE } from './_constants/style'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/scan', icon: Scan, label: '스캔' },
  { href: '/history', icon: Bookmark, label: '히스토리' },
]

export default function NavigationBar() {
  const rawPathname = usePathname()
  // 마지막이 숫자(\d)인 세그먼트(`/%d`)를 제거하는 로직
  const pathname = rawPathname?.replace(/\/\d+$/, '') ?? rawPathname
  return (
    <nav className={STYLE.NAVIGATION_BAR.CONTAINER}>
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={
            pathname === href ? STYLE.NAVIGATION_BAR.LINK_ACTIVE : STYLE.NAVIGATION_BAR.LINK
          }
          aria-label={label}
        >
          <Icon size={28} strokeWidth={2} />
        </Link>
      ))}
    </nav>
  )
}
