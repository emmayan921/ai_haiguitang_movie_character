# 后端环境变量说明

配置方式：在 **`backend` 目录**下创建 `.env` 文件（可参考同目录的 `.env.example`）。

加载逻辑见 `src/loadEnv.ts`：依次尝试 `backend/.env`、`backend/backend/.env`（兼容误放路径），都不存在时再尝试进程环境变量与当前工作目录下的默认 dotenv 行为。

---

## 变量一览

| 变量 | 必填 | 默认值 | 说明 |
|------|------|--------|------|
| `PORT` | 否 | `8787` | HTTP 监听端口 |
| `NODE_ENV` | 否 | 未设置 | 设为 `production` 时，未捕获异常返回给客户端的错误信息更保守；开发时可不设 |
| `ZHIPU_API_KEY` | 否 | 无 | 智谱 API Key；**不配则不走大模型**，仅用本地规则 + 题库事实 |
| `ZHIPU_APIKEY` | 否 | 无 | 与 `ZHIPU_API_KEY` 二选一（别名） |
| `ZHIPU_KEY` | 否 | 无 | 与 `ZHIPU_API_KEY` 二选一（别名） |

代码中读取智谱 Key 的顺序：`ZHIPU_API_KEY` → `ZHIPU_APIKEY` → `ZHIPU_KEY`（见 `src/services/aiService.ts`）。

---

## 本地快速启动

```bash
cd backend
cp .env.example .env
# 按需编辑 .env（尤其是需要调用智谱时填写 ZHIPU_API_KEY）
npm install
npm run dev
```

生产可先构建再启动：

```bash
npm run build
npm start
```

健康检查：`GET http://localhost:<PORT>/api/health`

---

## 安全提示

- 勿将含真实密钥的 `.env` 提交到版本库。
- `.env.example` 中只保留空值或占位说明，不要写入真实 Key。
