'use server'

import { toast } from 'sonner'

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
