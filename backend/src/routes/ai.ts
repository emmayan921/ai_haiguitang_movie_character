import { Router } from 'express'
import { STORIES } from '../data/stories'
import { getAISemanticAnswer } from '../services/aiService'

interface TAskBody {
  question?: unknown
  storyId?: unknown
}

export const aiRouter = Router()

const storyIds = new Set(STORIES.map((s) => s.id))

aiRouter.post('/ask', async (req, res, next) => {
  const { question, storyId } = req.body as TAskBody

  if (typeof question !== 'string' || typeof storyId !== 'string') {
    res.status(400).json({
      error: {
        code: 'INVALID_BODY',
        message: 'question 与 storyId 须为字符串',
      },
    })
    return
  }

  const q = question.trim()
  const sid = storyId.trim()

  if (!q || !sid) {
    res.status(400).json({
      error: {
        code: 'INVALID_BODY',
        message: 'question 与 storyId 均为必填项且不能为空',
      },
    })
    return
  }

  if (!storyIds.has(sid)) {
    res.status(404).json({
      error: {
        code: 'UNKNOWN_STORY',
        message: `未知的 storyId：${sid}`,
      },
    })
    return
  }

  try {
    const result = await getAISemanticAnswer(q, sid)
    res.json(result)
  } catch (err) {
    next(err)
  }
})
