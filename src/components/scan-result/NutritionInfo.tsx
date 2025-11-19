import type { ScanResultData } from '@/types/scanData'

interface Props {
  data: ScanResultData
}

export default function NutritionInfo({ data }: Props) {
  return (
    <>
      {/* 영양성분 부분 API연결 필요 */}
      <div>{data.ingredients.join(',')}</div>
      <hr className="my-5 text-gray-300" />
      {/* 영양성분 분석 한눈에보기 부분 AI연결 후 컴포넌트화 필요 */}
      <div className="flex justify-center items-center">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-(--color-grade-danger)">
            <span className="w-8 aspect-square rounded-full bg-(--color-grade-danger)" />
            <p>지방 함량 높음 (28%)</p>
          </div>
          <div className="flex items-center gap-2 text-(--color-grade-standard)">
            <span className="w-8 aspect-square rounded-full bg-(--color-grade-standard)" />
            <p>포화지방 함량 보통 (3.1%)</p>
          </div>
          <div className="flex items-center gap-2 text-(--color-grade-good)">
            <span className="w-8 aspect-square rounded-full bg-(--color-grade-good)" />
            <p>당류 함량 낮음 (2.8%)</p>
          </div>
          <div className="flex items-center gap-2 text-(--color-grade-standard)">
            <span className="w-8 aspect-square rounded-full bg-(--color-grade-standard)" />
            <p>나트륨 함량 낮음 (2.8%)</p>
          </div>
        </div>
      </div>
    </>
  )
}
