import type { ErrorRequestHandler } from 'express'

const isDev = process.env.NODE_ENV !== 'production'

/**
 * 统一错误响应；对外仍附带 answer 以便旧客户端不因结构变化崩溃。
 */
export const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (res.headersSent) {
    next(err)
    return
  }

  const message = err instanceof Error ? err.message : '服务器内部错误'
  console.error('[error]', isDev && err instanceof Error ? err.stack ?? message : message)

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: isDev ? message : '服务器内部错误',
    },
    answer: '无关' as const,
  })
}
