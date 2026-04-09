import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

/**
 * 必须在其它业务模块之前 import。
 *
 * 环境变量说明见 `docs/ENV.md`。常用：`PORT`、`NODE_ENV`、
 * `ZHIPU_API_KEY`（或 `ZHIPU_APIKEY` / `ZHIPU_KEY`）。
 *
 * 优先加载 backend/.env；若没有则加载误放在 backend/backend/.env 的配置。
 */
const backendRoot = path.resolve(__dirname, '..')

const candidates = [
  path.join(backendRoot, '.env'),
  path.join(backendRoot, 'backend', '.env'),
]

let loaded = false
for (const filePath of candidates) {
  if (fs.existsSync(filePath)) {
    dotenv.config({ path: filePath })
    loaded = true
    break
  }
}

if (!loaded) {
  dotenv.config()
}
