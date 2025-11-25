'use client'

import { useRef, useState, useEffect } from 'react'

import {
  Brain,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Loader2,
  Send,
  User,
  Bot,
  Trash2,
} from 'lucide-react'

import { chatCompletion } from '@/actions/chat'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  reasoning_details?: unknown
}

function ReasoningToggle({ details }: { details: unknown }) {
  const [showReasoning, setShowReasoning] = useState(false)

  const renderReasoning = (data: unknown): string => {
    if (typeof data === 'string') return data
    return JSON.stringify(data, null, 2)
  }

  return (
    <div className="mt-2">
      <button
        onClick={() => setShowReasoning(!showReasoning)}
        className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
      >
        <Brain className="size-3 text-purple-500" />
        <span>Reasoning</span>
        {showReasoning ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
      </button>

      {showReasoning && (
        <div className="mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-300">
            <pre className="whitespace-pre-wrap font-mono leading-relaxed">
              {renderReasoning(details)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex size-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        {isUser ? (
          <User className="size-4 text-white" />
        ) : (
          <Bot className="size-4 text-gray-600 dark:text-gray-300" />
        )}
      </div>
      <div className={`max-w-[80%] ${isUser ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-2xl px-4 py-2.5 ${
            isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
          }`}
        >
          <p className="whitespace-pre-wrap text-sm">{message.content}</p>
        </div>
        {!isUser && message.reasoning_details !== undefined && (
          <ReasoningToggle details={message.reasoning_details as unknown} />
        )}
      </div>
    </div>
  )
}

export default function Container() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: ChatMessage = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const result = await chatCompletion({
        messages: newMessages.map(m => ({
          role: m.role,
          content: m.content,
          reasoning_details: m.reasoning_details,
        })),
        reasoning: { enabled: true },
      })

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: result.choices[0].message.content,
        reasoning_details: result.choices[0].message.reasoning_details,
      }
      setMessages([...newMessages, assistantMessage])
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.'
      setError(errorMessage)
      console.error('API call error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setMessages([])
    setError(null)
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-2rem)] max-w-3xl flex-col p-4 font-sans">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Chat</h1>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-gray-500 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          >
            <Trash2 className="size-4" />
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
        {messages.length === 0 && !loading && (
          <div className="flex h-full items-center justify-center text-gray-400">
            <p>메시지를 입력해서 대화를 시작하세요</p>
          </div>
        )}

        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatBubble key={index} message={message} />
          ))}

          {loading && (
            <div className="flex gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <Bot className="size-4 text-gray-600 dark:text-gray-300" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-2.5 dark:bg-gray-800">
                <Loader2 className="size-4 animate-spin text-gray-500" />
                <span className="text-sm text-gray-500">생각 중...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="메시지를 입력하세요..."
            disabled={loading}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors placeholder:text-gray-400 focus:border-blue-500 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
          </button>
        </div>
      </form>
    </div>
  )
}
