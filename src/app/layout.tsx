import '@/styles/global.css'
import { Toaster } from 'sonner'

import fonts from '@/fonts'
import { cn } from '@/utils'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <body className={cn(fonts.pretendard.className)}>
        <div className="mx-auto flex flex-col items-center">
          <Toaster />
          {children}
        </div>
      </body>
    </html>
  )
}
