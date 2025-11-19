import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  reactCompiler: true,
  images: {
    domains: ['foodqr.kr'], // 외부 이미지 호스트 추가
  },
}

export default nextConfig
