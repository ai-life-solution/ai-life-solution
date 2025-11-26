const BASE_URL = process.env.FOOD_QR_URL
const API_KEY = process.env.FOOD_QR_API_KEY as string

interface RequestParams {
  servicePath: string
  barcode: string
  numOfRows?: number
  pageNo?: number
}

export async function requestFoodQrApi({
  servicePath,
  barcode,
  numOfRows = 20,
  pageNo = 1,
}: RequestParams) {
  const encodedKey = encodeURIComponent(API_KEY)
  const url = `${BASE_URL}${servicePath}?accessKey=${encodedKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&_type=json&brcdNo=${barcode}`

  const res = await fetch(url)
  if (!res.ok) throw new Error('food qr api error occured')
  const data = await res.json()
  return data
}
