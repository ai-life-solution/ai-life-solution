import Provider from '@/app/Provider'
import '@/styles/global.css'
import fonts from '@/fonts'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <body className={fonts.pretendard.className}>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
