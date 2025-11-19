import NavigationBar from '@/components/NavigationBar'

import Header from './_components/Header'
import { PAGE } from './_constants/style'

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={PAGE.CONTAINER}>
      <div className="max-w-[600px] mx-auto">
        <Header />
        <div className={PAGE.CONTENTS}>
          <main className={PAGE.MAIN}>{children}</main>
          <footer>
            <NavigationBar />
          </footer>
        </div>
      </div>
    </div>
  )
}
