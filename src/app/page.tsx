import ToastedButton from './_components/ToastedButton'
import { PAGE_H1_CLASS, PAGE_MAIN_CLASS } from './_constants/style'

export default function Home() {
  return (
    <main className={PAGE_MAIN_CLASS}>
      <h1 className={PAGE_H1_CLASS}>Home</h1>
      <ToastedButton>안녕</ToastedButton>
    </main>
  )
}
