import { NextResponse } from 'next/server'

import { requestFoodQrApi } from '@/libs/api/food-qr'

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
