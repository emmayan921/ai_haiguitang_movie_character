import { STORIES } from '../data/stories'
import type { TStory } from '../data/stories'
import { offlineSemanticAnswer } from './offlineSemanticAnswer'

interface TAskAIRequest {
  question: string
  storyId: string
}

export interface TAskAIResponse {
  answer: '是' | '否' | '无关'
  replyText?: string
}

export async function askAI(payload: TAskAIRequest): Promise<TAskAIResponse> {
  const story = STORIES.find((s) => s.id === payload.storyId)

  const fallback = (): TAskAIResponse =>
    story ? offlineSemanticAnswer(payload.question, story) : { answer: '无关' }

  try {
    const response = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (response.ok) {
      const data = (await response.json()) as TAskAIResponse
      if (data.answer === '是' || data.answer === '否' || data.answer === '无关') {
        return {
          answer: data.answer,
          ...(data.replyText ? { replyText: data.replyText } : {}),
        }
      }
    }
  } catch {
    /* 后端未启动或网络错误：使用本地回退 */
  }

  console.warn('[askAI] backend unavailable, using offline semantic fallback')
  return fallback()
}

export function getStoryById(storyId: string): TStory | undefined {
  return STORIES.find((story) => story.id === storyId)
}
