export type Position = 'left' | 'right' | 'up' | 'down' | 'center'

export interface Dimension {
  width: number
  height: number
}

export interface GuideTimingConfig {
  moveHint: number
  distanceHint: number
  timeout: number
}

export interface AnnounceDecisionParams {
  nextPosition: Position
  lastPosition: Position | null
  now: number
  lastVoiceTime: number
  cooldownMs: number
}
