import { NextResponse } from 'next/server'

import { requestFoodQrApi } from '@/libs/api/food-qr'

/**
 * GET /api/foodQr
 * - 푸드 QR 외부 API(공공데이터 등)로 요청을 중계(Proxy)하는 API입니다.
 * - 클라이언트에서 직접 호출 시 발생할 수 있는 CORS 문제나 키 노출을 방지하기 위해 사용됩니다.
 *
 * - 쿼리 파라미터 (Query Params)
 * - barcode: string (필수) 조회할 상품의 바코드 번호
 * - path: string (필수) 외부 API의 서비스 경로 (예: '/qr1003/F003')
 *
 * - 사용 예시
 * - GET /api/foodQr?barcode=8801043014854&path=/qr1003/F003
 *
 * - 응답 (Response)
 * - 200: { ...ExternalApiResponse } (외부 API가 반환하는 JSON 데이터 그대로 반환)
 * - 500: { error: string } (프록시 요청 실패 시)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const barcode = searchParams.get('barcode')

  const servicePath = searchParams.get('path')

  if (!barcode || !servicePath) {
    return NextResponse.json({ error: 'barcode required' }, { status: 400 })
  }

  try {
    const data = await requestFoodQrApi({ servicePath, barcode })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
