import express from 'express';
import cors from 'cors';
import aiRouter from './routes/ai';

const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 健康检查接口（测试用）
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// AI 路由
app.use('/api/ai', aiRouter);

// ⚠️ 重点：删除所有 app.listen！！！
// ⚠️ 重点：必须导出 app 给 Vercel！！！
export default app;