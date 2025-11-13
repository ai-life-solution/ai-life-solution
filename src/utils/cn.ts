import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * clsx와 tailwind-merge를 사용하여 Tailwind CSS 클래스를 결합하고 병합합니다
 * @param inputs - 결합하고 병합할 클래스 값들
 * @returns Tailwind CSS 충돌이 해결된 병합된 클래스 문자열
 */
const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export default cn
