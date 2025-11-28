'use client'

import { usePathname, useRouter } from 'next/navigation'

import { Home, Scan, Bookmark } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

import { STYLE } from './_constants/style'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/scan', icon: Scan, label: '스캔' },
  { href: '/history', icon: Bookmark, label: '히스토리' },
]

export default function NavigationBar() {
  const rawPathname = usePathname()
  const router = useRouter()
  const { routerMoveWithTTSClose, warmup } = useTTSStore()

  // 마지막이 숫자(\d)인 세그먼트(`/%d`)를 제거하는 로직
  const pathname = rawPathname?.replace(/\/\d+$/, '') ?? rawPathname

  const handleNavigation = (href: string) => {
    if (href === '/scan') {
      warmup()
    }

    routerMoveWithTTSClose(() => {
      router.push(href)
    })
  }

  return (
    <nav className={STYLE.NAVIGATION_BAR.CONTAINER}>
      {navItems.map(({ href, icon: Icon, label }) => (
        <button
          key={href}
          onClick={() => handleNavigation(href)}
          className={
            pathname === href ? STYLE.NAVIGATION_BAR.LINK_ACTIVE : STYLE.NAVIGATION_BAR.LINK
          }
          aria-label={label}
          type="button"
        >
          <Icon size={28} strokeWidth={2} />
        </button>
      ))}
    </nav>
  )
}
