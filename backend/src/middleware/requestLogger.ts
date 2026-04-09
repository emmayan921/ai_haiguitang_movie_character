import type { NextFunction, Request, Response } from 'express'

/**
 * 记录每个请求的 method、路径、状态码与耗时（stdout）。
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    const ts = new Date().toISOString()
    console.log(`[${ts}] ${req.method} ${req.originalUrl} ${res.statusCode} ${ms}ms`)
  })
  next()
}
