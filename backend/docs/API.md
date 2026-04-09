# 海龟汤游戏 · 后端 HTTP 接口说明

Base URL（本地默认）：`http://localhost:8787`

所有 JSON 接口的 `Content-Type` 均为 `application/json`。

---

## GET `/api/health`

健康检查。

### 响应 `200`

```json
{ "ok": true }
```

---

## POST `/api/ai/ask`

根据用户提问与题目 ID，返回语义裁判结果（是 / 否 / 无关），可选展示文案。

### 请求体

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `question` | string | 是 | 用户输入的问题或猜测，首尾空格会被忽略 |
| `storyId` | string | 是 | 题库中的题目 ID（须为后端已存在的 ID） |

示例：

```json
{
  "question": "是韩剧吗",
  "storyId": "kr-hard-01"
}
```

### 响应 `200`（成功）

| 字段 | 类型 | 说明 |
|------|------|------|
| `answer` | `"是"` \| `"否"` \| `"无关"` | 三元裁判结果 |
| `replyText` | string（可选） | 展示给用户的完整句子；无则前端可用 `answer` 作为气泡文案 |

示例：

```json
{
  "answer": "无关",
  "replyText": "你已经猜对了一半，再想想名字？"
}
```

### 错误响应

| HTTP | `error.code` | 说明 |
|------|----------------|------|
| `400` | `INVALID_BODY` | 缺少字段、类型错误、或 trim 后为空 |
| `404` | `UNKNOWN_STORY` | `storyId` 不在题库中 |
| `404` | `NOT_FOUND` | 路径不存在（见下方「其它路径」） |
| `500` | `INTERNAL_ERROR` | 未捕获异常；响应体中可能仍含 `answer: "无关"` 以兼容旧客户端 |

`400` / `404`（业务）示例：

```json
{
  "error": {
    "code": "UNKNOWN_STORY",
    "message": "未知的 storyId：xxx"
  }
}
```

`500` 示例：

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "服务器内部错误"
  },
  "answer": "无关"
}
```

生产环境下 `INTERNAL_ERROR` 的 `message` 可能为固定文案；开发环境（`NODE_ENV` 非 `production`）可能返回更具体的错误信息。

---

## 其它路径

未匹配任何已注册路由时返回 `404` 与 `error.code: NOT_FOUND`。

---

## 请求日志

服务会在标准输出打印一行请求日志，格式为：

```text
[ISO时间] METHOD 路径 HTTP状态码 耗时ms
```

例如：`[2026-04-09T12:00:00.000Z] POST /api/ai/ask 200 120ms`

---

## 环境变量

完整说明（加载顺序、别名、本地启动）见同目录 **[ENV.md](./ENV.md)**。

摘要：`PORT`（默认 `8787`）、`NODE_ENV`、`ZHIPU_API_KEY`（或 `ZHIPU_APIKEY` / `ZHIPU_KEY`，可选；不配则仅用本地规则）。
