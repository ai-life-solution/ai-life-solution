import Image from 'next/image'
import Link from 'next/link'

/**
 * Header 컴포넌트
 * 
 * 앱의 헤더를 렌더링하는 컴포넌트입니다.
 * 로고를 포함하며, 클릭 시 홈페이지로 이동합니다.
 * 
 * @returns 로고 이미지를 포함한 헤더 JSX 요소
 */
export default function Header() {
  return (
    <header>
      <Link href="/">
        <Image src="/svg/logo.svg" width={200} height={31} alt="HearCode" />
      </Link>
    </header>
  )
}
