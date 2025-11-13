import Provider from '@/app/Provider'
import '@/styles/global.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko-KR">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
