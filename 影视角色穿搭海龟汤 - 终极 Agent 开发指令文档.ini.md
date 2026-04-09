影视角色穿搭海龟汤 - 终极 Agent 开发指令文档
（严格对齐训练营模板 | 强制语义匹配 | 强制生成完整后端）
项目概述
使用 React + TypeScript + Vite + Tailwind CSS 开发的影视角色穿搭主题海龟汤游戏网站。
核心规则：国内 / 国外影视分类 → 难度选择 → 游戏提问 → 汤底揭晓；纯 AI 语义理解判断回答（是 / 否 / 无关），废弃关键词匹配（qaPairs）；对接智谱 AI 原始 API，必须生成完整 Node.js+Express 后端做 API 代理防跨域；用户连续 6 次提问未猜对自动弹出穿搭关键提示。
开发规范（必须严格遵守）
技术栈固定：React 18 + TypeScript 5 + Vite 5 + Tailwind CSS + React Router 6
必须生成前后端分离项目：frontend（前端）+ backend（后端 Express）
全部使用函数式组件 + React Hooks，禁止类组件
TypeScript 必须定义完整类型接口，全项目类型安全
AI 核心：纯语义理解匹配，不使用任何关键词 /qaPairs 匹配
后端唯一功能：封装智谱 AI API，解决跨域，不暴露 API Key
组件可复用、代码带清晰注释、路由规范
禁止使用 Coze / 一键 AI 平台，仅允许对接智谱官方原始 API
代码风格（训练营强制标准）
组件名使用 PascalCase（HomePage、GameCard.tsx）
函数名使用 camelCase（handleSendMessage、getAISemanticAnswer）
常量使用 UPPER_SNAKE_CASE（MAX_QUESTION_COUNT = 6）
类型 / 接口以 T 开头（TStory、TMessage、TGameSession）
文件后缀：.tsx（页面 / 组件）、.ts（工具 / 类型 / 接口）
后端统一使用 TypeScript + Express
设计要求（固定 UI，不许修改）
全局背景：红色帷幕静态图片
装饰元素：静态汤婆婆 AI 二创图（固定定位，不遮挡交互）
主色调：红色系（bg-red-700 /text-red-800）
卡片：bg-white/90、rounded-lg、shadow-lg
聊天框：消息气泡左右区分、支持自动滚动
全端适配：移动端 + 桌面端自适应布局
核心功能硬性要求（必须全部实现）
页面流程：首页 (分类) → 难度页 → 游戏页 → 汤底揭晓页
游戏逻辑：用户提问 → AI语义判断返回 是 / 否 / 无关
规则：提问满 6 次未猜中 → 自动弹出关键提示
题库：存储在前端 src/data/stories.ts，无 qaPairs 关键词
后端接口：POST /api/ai/ask（接收问题 + 题目 ID，返回 AI 答案）
安全：AI API Key 仅存于后端环境变量，前端绝不暴露
注意事项
优先实现核心游戏功能，代码简洁不冗余
后端必须支持 Vercel Serverless 部署
静态装饰图设置 pointer-events-none，不影响按钮点击
AI 返回结果严格兜底，仅输出：是 / 否 / 无关
项目结构必须和标准前端工程化目录一致
测试要求
页面跳转流程完整无报错
AI 语义理解正常，不问关键词也能正确回答
6 次提问自动触发提示功能正常
移动端 / 桌面端显示正常
后端接口调用成功，无跨域、无密钥泄露