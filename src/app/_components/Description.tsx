import Image from 'next/image'

export default function Description() {
  return (
    <>
      <Image src="/svg/avocado.svg" alt="" width={233} height={185} />
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
