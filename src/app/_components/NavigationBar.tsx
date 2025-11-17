'use client'

import Link from 'next/link'
import { Home, Scan, Bookmark } from 'lucide-react'

const navItems = [
  { href: '/', icon: Home, label: '홈' },
  { href: '/scan', icon: Scan, label: '스캔' },
  { href: '/bookmark', icon: Bookmark, label: '북마크' },
]

export default function NavigationBar() {
  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] bg-[#31694E] text-white z-50 rounded-t-3xl"
      role="navigation"
      aria-label="네비게이션바"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center justify-center w-full h-full hover:text-[#F0E491] transition-colors"
            aria-label={label}
          >
            <Icon size={28} strokeWidth={2} />
          </Link>
        ))}
      </div>
    </nav>
  )
}
