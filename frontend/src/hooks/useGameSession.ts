import { useMemo, useState } from 'react'
import { askAI } from '../services/api'
import type { TMessage, TStory } from '../types/game'

const MAX_QUESTION_COUNT = 6

export function useGameSession(story: TStory) {
  const [messages, setMessages] = useState<TMessage[]>([])
  const [questionCount, setQuestionCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const hintUnlocked = questionCount >= MAX_QUESTION_COUNT

  const sendQuestion = async (question: string) => {
    if (!question.trim() || isLoading) return

    const userMessage: TMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: question.trim(),
      createdAt: Date.now(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError('')

    try {
      const response = await askAI({ question: question.trim(), storyId: story.id })
      const assistantMessage: TMessage = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: response.replyText ?? response.answer,
        canonicalAnswer: response.answer,
        createdAt: Date.now(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setQuestionCount((count) => count + 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : '未知错误')
    } finally {
      setIsLoading(false)
    }
  }

  return useMemo(
    () => ({
      messages,
      questionCount,
      hintUnlocked,
      isLoading,
      error,
      sendQuestion,
      maxQuestionCount: MAX_QUESTION_COUNT,
    }),
    [messages, questionCount, hintUnlocked, isLoading, error],
  )
}
