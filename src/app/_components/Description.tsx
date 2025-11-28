import Image from 'next/image'

/**
 * Description 컴포넌트
 * 
 * 앱의 주요 기능을 설명하는 컴포넌트입니다.
 * 바코드 스캔 기능과 식품 정보 조회 기능을 소개하며,
 * 음성 가이드 제공 여부를 표시합니다.
 * 
 * @returns 설명 텍스트와 이미지를 포함한 JSX 요소
 */
export default function Description() {
  return (
    <>
      <Image src="/svg/avocado.svg" alt="아보카도 일러스트" width={233} height={185} />
      <div className="flex flex-col text-center gap-2 font-bold text-xl">
        <p>
          바코드를 <span className="text-(--color-primary)">스캔</span>해서
        </p>
        <p>
          <span className="text-(--color-primary)">식품정보</span>를 알아보세요!
        </p>
        <p className="text-gray-400 text-sm mt-2">음성가이드 제공</p>
      </div>
    </>
  )
}
