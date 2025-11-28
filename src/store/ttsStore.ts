'use client'

import { create } from 'zustand'

interface TTSState {
  isTTSEnabled: boolean
  isSpeaking: boolean
  speak: (text: string) => void
  stopSpeak: () => void
  toggleTTS: () => void
  routerMoveWithTTSClose: (navigationCallback?: () => void) => void
}

export const useTTSStore = create<TTSState>((set, get) => ({
  isTTSEnabled: true,
  isSpeaking: false,

  speak: (text: string) => {
    const { isTTSEnabled } = get()
    if (!isTTSEnabled) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0

    utterance.onstart = () => {
      set({ isSpeaking: true })
    }

    utterance.onend = () => {
      set({ isSpeaking: false })
    }

    utterance.onerror = () => {
      set({ isSpeaking: false })
    }

    window.speechSynthesis.speak(utterance)
  },

  stopSpeak: () => {
    window.speechSynthesis.cancel()
    set({ isSpeaking: false })
  },

  toggleTTS: () => {
    const { isTTSEnabled, stopSpeak } = get()
    const newEnabled = !isTTSEnabled
    set({ isTTSEnabled: newEnabled })
    if (!newEnabled) {
      stopSpeak()
    }
  },

  routerMoveWithTTSClose: (navigationCallback?: () => void) => {
    const { stopSpeak } = get()
    stopSpeak()
    if (navigationCallback) {
      navigationCallback()
    } else {
      window.history.back()
    }
  },
}))
