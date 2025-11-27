'use client'

import { useRef, useState } from 'react'

export function useTTS() {
  const isTTSEnabledRef = useRef(true)
  const [isTTSEnabled, setIsTTSEnabled] = useState(true)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (text: string) => {
    if (!isTTSEnabledRef.current) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0

    utterance.onstart = () => {
      setIsSpeaking(true)
    }

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    utterance.onerror = () => {
      setIsSpeaking(false)
    }

    window.speechSynthesis.speak(utterance)
  }

  const stopSpeak = () => {
    window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  const toggleTTS = () => {
    isTTSEnabledRef.current = !isTTSEnabledRef.current
    setIsTTSEnabled(isTTSEnabledRef.current)
    if (!isTTSEnabledRef.current) {
      stopSpeak()
    }
  }

  return {
    speak,
    stopSpeak,
    toggleTTS,
    isTTSEnabled,
    isSpeaking,
  }
}
