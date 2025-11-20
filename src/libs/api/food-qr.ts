const BASE_URL = process.env.NEXT_PUBLIC_FOOD_QR_URL
const API_KEY = process.env.NEXT_PUBLIC_FOOD_QR_API_KEY as string

interface RequestParams {
  servicePath: string
  barcode: string
  numOfRows?: number
  pageNo?: number
}

export async function requestFoodQrApi({
  servicePath,
  barcode,
  numOfRows = 10,
  pageNo = 1,
}: RequestParams) {
  const encodedKey = encodeURIComponent(API_KEY)
  const url = `${BASE_URL}${servicePath}?accessKey=${encodedKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json&brcdNo=${barcode}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('food qr api error occured')
  const data = await res.json()
  return data
}

// [클라이언트용] 내 Next.js 서버(/api/food-qr)로 요청을 보내는 헬퍼 함수
async function requestProxy(path: string, barcode: string) {
  // app/api/food-qr/route.ts 로 요청
  const res = await fetch(`/api/foodQr?barcode=${barcode}&path=${path}`)

  if (!res.ok) throw new Error(`Proxy request failed: ${res.statusText}`)
  return res.json()
}

// 기본 정보(푸드QR기본정보)
export const fetchProduct = (barcode: string) => requestProxy('/qr1003/F003', barcode)

// 원재료 정보(푸드QR원재료정보)
export const fetchIngredientInfo = (barcode: string) => requestProxy('/qr1007/F007', barcode)

// 영양표시 정보 (푸드QR 영양표시성분 정보)
export const fetchNutritionInfo = (barcode: string) => requestProxy('/qr1008/F008', barcode)

// 알러지 정보(푸드QR알레르기정보)
export const fetchAllergyInfo = (barcode: string) => requestProxy('/qr1009/F009', barcode)

// 인증 정보 (푸드QR인증정보)
export const fetchCertificationInfo = (barcode: string) => requestProxy('/qr1016/F016', barcode)
