import NavigationBar from '@/components/NavigationBar'

import Header from './_components/Header'
import { STYLE } from './_constants/style'

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={STYLE.PAGE.CONTAINER}>
      <div className="max-w-[600px] mx-auto">
        <Header />
        <div className={STYLE.PAGE.CONTENTS}>
          <main className={STYLE.PAGE.MAIN}>{children}</main>
          <footer>
            <NavigationBar />
          </footer>
        </div>
      </div>
    </div>
  )
}
