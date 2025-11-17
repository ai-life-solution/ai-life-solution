import Provider from '@/app/Provider'
import '@/styles/global.css'
import fonts from '@/fonts'
import { cn } from '@/utils'
import { Metadata } from 'next'

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
          <Provider>{children}</Provider>
        </div>
      </body>
    </html>
  )
}
