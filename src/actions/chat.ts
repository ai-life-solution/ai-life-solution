'use server'

import { toast } from 'sonner'

import type { FoodItem } from '@/types/FoodItem'

/**
 * 채팅 메시지의 구조를 정의합니다.
 *
 * @property role - 메시지의 발신자 역할 (예: 'user', 'assistant', 'system').
 * @property content - 메시지의 텍스트 내용.
 * @property [reasoning_details] - 추론 과정에 대한 선택적 세부 정보.
 */
interface Message {
  role: string
  content: string
  reasoning_details?: unknown
}

/**
 * 채팅 완료 요청을 위한 페이로드 구조를 정의합니다.
 *
 * @property messages - 대화 기록을 포함하는 메시지 배열.
 * @property [reasoning] - 추론 기능에 대한 선택적 설정.
 * @property [reasoning.enabled] - 추론 기능 활성화 여부.
 */
interface ChatCompletionPayload {
  messages: Message[]
  reasoning?: { enabled: boolean }
}

/**
 * OpenRouter API에 채팅 완료 요청을 수행합니다.
 *
 * 이 서버 액션은 채팅 메시지와 선택적 추론 매개변수가 포함된 페이로드를
 * 지정된 AI 모델로 전송합니다. `OPENROUTER_API_KEY` 환경 변수를 사용하여
 * API 인증을 처리합니다.
 *
 * @param payload - 채팅 완료에 필요한 데이터입니다.
 * @param payload.messages - 대화 기록을 나타내는 메시지 객체의 배열입니다.
 * @param [payload.reasoning] - 추론 기능을 위한 선택적 구성입니다.
 * @param [payload.reasoning.enabled] - 이 요청에 대해 추론이 활성화되었는지 여부입니다.
 * @returns OpenRouter API의 JSON 응답으로 해결되는 Promise를 반환합니다.
 * @throws API 키가 누락되었거나 API 요청이 실패한 경우 오류를 발생시킵니다.
 *
 * @example
 * ```typescript
 * const response = await chatCompletion({
 *   messages: [
 *     { role: 'user', content: '안녕하세요!' }
 *   ],
 *   reasoning: { enabled: true } // 없으면 추론모델 사용안해서 빨라짐
 * });
 * console.log(response);
 * ```
 */
export async function chatCompletion(payload: ChatCompletionPayload) {
  const apiKey = process.env.OPENROUTER_API_KEY

  if (!apiKey) {
    throw new Error(
      'API 키가 누락되었습니다. payload에 제공하거나 OPENROUTER_API_KEY 환경 변수를 설정하십시오.'
    )
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'x-ai/grok-4.1-fast',
        messages: payload.messages,
        reasoning: payload.reasoning,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        `API 호출이 실패했습니다: ${response.status} ${response.statusText} - ${JSON.stringify(errorData)}`
      )
    }

    const result = await response.json()
    return result
  } catch (error) {
    toast.error(`서버 액션 오류:, ${error}`)
    throw error
  }
}

/**
 * FoodItem 데이터를 AI를 통해 200자 이내로 요약합니다.
 *
 * @param foodItem - 요약할 식품 정보 객체
 * @returns 200자 이내의 요약 문자열
 *
 * @example
 * ```typescript
 * const summary = await summarizeFoodItem(foodItem);
 * console.log(summary); // "새우깡은 150g의 과자로, 밀가루와 새우를 주원료로..."
 * ```
 */
export async function summarizeFoodItem(foodItem: FoodItem): Promise<string> {
  const foodJson = JSON.stringify(foodItem, null, 2)

  const result = await chatCompletion({
    messages: [
      {
        role: 'system',
        content: `당신은 식품 정보 요약 전문가입니다.
          주어진 식품 데이터를 일반 소비자가 이해하기 쉽게 200자 이내로 요약해주세요.
          제품명, 주요 영양정보, 알레르기 정보를 포함해주세요.
          사람들이 이해하기 쉽게 뭐가 어떻게 왜 좋고 안좋은지 문어체로 설명해주세요`,
      },
      {
        role: 'user',
        content: `다음 식품 정보를 200자 이내로 요약해주세요:\n\n${foodJson}`,
      },
    ],
  })

  const content = result?.choices?.[0]?.message?.content
  if (!content) {
    throw new Error('AI 응답에서 요약 내용을 찾을 수 없습니다.')
  }

  return content
}
