import axios from 'axios'
import { STORIES } from '../data/stories'
import type { TStory } from '../data/stories'

const ZHIPU_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions'

const ALLOWED = new Set(['是', '否', '无关'])

export type AskAIResult = { answer: '是' | '否' | '无关'; replyText?: string }

function ar(answer: '是' | '否' | '无关', replyText?: string): AskAIResult {
  return replyText ? { answer, replyText } : { answer }
}

function extractModelText(content: unknown): string {
  if (typeof content === 'string') return content
  if (Array.isArray(content)) {
    return content
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object' && 'text' in item) {
          const text = (item as { text?: string }).text
          return typeof text === 'string' ? text : ''
        }
        return ''
      })
      .join('')
      .trim()
  }
  if (content && typeof content === 'object' && 'text' in content) {
    const text = (content as { text?: string }).text
    return typeof text === 'string' ? text : ''
  }
  return ''
}

function sanitizeAnswer(text: string): '是' | '否' | '无关' {
  const value = text.trim()
  if (ALLOWED.has(value)) return value as '是' | '否' | '无关'
  if (/(^|[^否])是($|[^否])/u.test(value)) return '是'
  if (/否/u.test(value)) return '否'
  if (/无关|不确定|无法判断/u.test(value)) return '无关'
  return '无关'
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[《》【】（）()，。！？、:：；;“”"'`\s]/g, '')
}

function extractCandidateEntity(question: string): string | null {
  const normalized = question.replace(/[？?！!。]/g, '').trim()
  const hit = normalized.match(/(?:是|是不是|是否)(.+?)(?:吗|么|呢)?$/)
  if (!hit) return null
  const candidate = hit[1]
    .replace(/的$/g, '')
    .replace(/这个|那个|角色|女主|男主/g, '')
    .trim()
  if (candidate.length < 2) return null
  return candidate
}

function canonicalizeEntity(entity: string): string {
  return entity
    .replace(/饰演|扮演|演的|演得|演/g, '')
    .replace(/演员|角色|本人/g, '')
    .trim()
}

/** 汤面+事实里是否写明「有姐姐」；用于规则与 LLM 结果校正 */
function blobSaysHasOlderSister(blob: string): boolean {
  return /上面有姐姐|有一位亲姐姐|有亲姐姐|姐姐为长女|家中有一位亲姐姐/.test(blob)
}

function blobSaysNoOlderSister(blob: string): boolean {
  return /没有姐姐|没姐姐|没有亲姐姐|独女|只有哥哥没有姐姐/.test(blob)
}

/** 是否在问「有没有姐姐」类事实（须含「有/有没有/是不是」等，避免「姐姐漂亮吗」误命中） */
function asksHavingOlderSister(q: string): boolean {
  if (!/(姐姐|姊姊)/.test(q)) return false
  if (!/(有|有没有|有没|是不是|是否)/.test(q)) return false
  return true
}

function sisterFactAnswer(question: string, blob: string): AskAIResult | null {
  if (!asksHavingOlderSister(question)) return null
  if (blobSaysNoOlderSister(blob)) return ar('否')
  if (blobSaysHasOlderSister(blob)) return ar('是')
  return null
}

function keywordRuleAnswer(question: string, story: TStory): AskAIResult {
  const q = question.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
  if (!q) return ar('无关')

  const blob = [story.title, story.surface, story.bottom, ...story.semanticFacts].join('\n')
  const normalizedQ = normalizeText(q)
  const normalizedBlob = normalizeText(blob)
  const negatives = story.semanticFacts.filter((f) => /不是|并非|没有/.test(f))

  // 美剧/韩剧等地域类问题须先于「是 XXX 吗」实体抽取：否则「是美剧里的吗」会抽成「美剧里」，与事实「出自美剧《…》」无法子串匹配而误判无关
  const asksUsTv =
    /美剧|美国电视剧|美剧的|来自美剧|是不是美剧|是否美剧|^是美剧|美剧里/.test(q)
  const asksKrTv =
    /韩剧|韩国电视剧|韩剧的|来自韩剧|是不是韩剧|是否韩剧|^是韩剧|韩剧里/.test(q)
  if (asksUsTv || asksKrTv) {
    const hasUs = /美剧/.test(blob)
    const hasKr = /韩剧/.test(blob)
    if (asksUsTv) {
      if (hasUs) return ar('是')
      if (hasKr && !hasUs) return ar('否')
    }
    if (asksKrTv) {
      if (hasKr) return ar('是')
      if (hasUs && !hasKr) return ar('否')
    }
  }

  // 是否有姐姐 / 亲姐姐等（须在「德善」半对提示与通用实体匹配前）
  const sisterHit = sisterFactAnswer(q, blob)
  if (sisterHit) return sisterHit

  // 《请回答1988》成德善：只提到「德善」未带姓氏「成」时，引导补全姓名
  if (story.id === 'kr-hard-01') {
    const stripped = q
      .replace(/[\s\u3000]/g, '')
      .replace(/[？?！!。,.，。]/g, '')
      .trim()
    const rawNameGuess = /^\p{Script=Han}{0,2}德善$/u.test(stripped) && stripped !== '成德善'
    const questionLike = /是|是不是|是否|对吧|对不对|就叫/.test(q) || /吗|么|呢|吧/.test(q)
    if (/德善/.test(q) && !/成德善/.test(q) && (questionLike || rawNameGuess)) {
      return ar('无关', '你已经猜对了一半，再想想名字？')
    }
  }

  const asksFemale =
    /是女的|女的吗|女性|女生|女人|是不是女|是否女|性别.*女/.test(q) ||
    (/女/.test(q) && /吗|么|是不是|是否/.test(q))
  const asksMale =
    /是男的|男的吗|男性|男人|是不是男|是否男|性别.*男/.test(q) ||
    (/男/.test(q) && /吗|么|是不是|是否/.test(q))

  if (asksFemale) {
    if (/性别为女|角色性别为女/.test(blob)) return ar('是')
    if (/性别为男|角色性别为男/.test(blob)) return ar('否')
  }
  if (asksMale) {
    if (/性别为男|角色性别为男/.test(blob)) return ar('是')
    if (/性别为女|角色性别为女/.test(blob)) return ar('否')
  }

  // 是不是某个角色/演员/关系实体
  const candidate = extractCandidateEntity(q)
  if (candidate) {
    const normalizedCandidate = normalizeText(canonicalizeEntity(candidate))
    if (negatives.some((f) => normalizeText(f).includes(normalizedCandidate))) {
      return ar('否')
    }
    if (normalizedBlob.includes(normalizedCandidate)) {
      return ar('是')
    }
    return ar('无关')
  }

  // 穿搭/服饰细节判断：命中已知负事实 => 否，命中正事实/汤面关键词 => 是
  if (/穿搭|衣服|造型|发型|双马尾|休闲|可爱|亮色/.test(q)) {
    if (negatives.some((f) => normalizeText(f).includes(normalizedQ))) return ar('否')
    if (normalizedBlob.includes(normalizedQ)) return ar('是')
    const commonOutfitHints = ['休闲可爱', '双马尾', '亮色']
    if (commonOutfitHints.some((k) => normalizedBlob.includes(normalizeText(k)) && normalizedQ.includes(normalizeText(k)))) {
      return ar('是')
    }
  }

  // 人物关系判断
  if (/在一起|恋人|结婚|契约结婚|男主|李英宰|守护者|丈夫/.test(q)) {
    if (negatives.some((f) => normalizeText(f).includes(normalizedQ))) return ar('否')
    if (normalizedBlob.includes(normalizedQ)) return ar('是')
    if (/李英宰/.test(q) && /李英宰/.test(blob)) return ar('是')
  }

  // 演员相关问法
  if (/演员|饰演|扮演|演的|演得/.test(q)) {
    const actorFacts = story.semanticFacts.filter((f) => /饰演|扮演|演员/.test(f))
    if (actorFacts.some((f) => normalizeText(f).includes(normalizedQ))) return ar('是')
    const actorNameMatch = q.match(/(宋慧乔|宋慧喬|Jennifer\s*Aniston|安妮斯顿|全智贤|千颂伊|Kat\s*Dennings|麦克斯|惠利|Alicia)/i)
    if (actorNameMatch) {
      const actorName = normalizeText(actorNameMatch[1])
      if (actorFacts.some((f) => normalizeText(f).includes(actorName))) return ar('是')
      if (actorFacts.length > 0) return ar('否')
    }
  }

  return ar('无关')
}

/** 模型偶发与汤面矛盾（如「有姐姐」问成否）时，按题库强制纠正 */
function correctSisterAgainstModel(question: string, story: TStory, modelAnswer: AskAIResult): AskAIResult {
  const blob = [story.title, story.surface, story.bottom, ...story.semanticFacts].join('\n')
  const canon = sisterFactAnswer(question.trim().replace(/[\u200B-\u200D\uFEFF]/g, ''), blob)
  if (!canon || modelAnswer.replyText) return modelAnswer
  if (canon.answer === '是' && modelAnswer.answer === '否') return canon
  if (canon.answer === '否' && modelAnswer.answer === '是') return canon
  return modelAnswer
}

async function requestSemanticAnswer(params: {
  apiKey: string
  systemPrompt: string
  userPrompt: string
}): Promise<'是' | '否' | '无关'> {
  const response = await axios.post(
    ZHIPU_URL,
    {
      model: 'glm-4-flash',
      messages: [
        { role: 'system', content: params.systemPrompt },
        { role: 'user', content: params.userPrompt },
      ],
      temperature: 0,
      top_p: 0.05,
    },
    {
      headers: {
        Authorization: `Bearer ${params.apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 15000,
    },
  )
  const content = response.data?.choices?.[0]?.message?.content
  return sanitizeAnswer(extractModelText(content))
}

export async function getAISemanticAnswer(
  question: string,
  storyId: string,
): Promise<AskAIResult> {
  const story = STORIES.find((item) => item.id === storyId)
  if (!story) return ar('无关')

  const apiKey = (
    process.env.ZHIPU_API_KEY ||
    process.env.ZHIPU_APIKEY ||
    process.env.ZHIPU_KEY ||
    ''
  ).trim()

  const semanticFacts = (story.semanticFacts ?? []).join('；')
  const userPromptBase = [
    `题目汤面：${story.surface}`,
    `汤底（正确角色信息）：${story.bottom}`,
    `补充语义事实：${semanticFacts || '无'}`,
    `用户问题：${question}`,
    '请仅输出：是 / 否 / 无关（三选一）。',
  ].join('\n')

  if (!apiKey) {
    return keywordRuleAnswer(question, story)
  }

  const systemPrompt = [
    '你是影视角色穿搭海龟汤的语义裁判。',
    '你只能输出一个词：是 或 否 或 无关。',
    '判定规则：',
    '1) 问题语义与目标角色事实一致 => 是。',
    '2) 问题语义与目标角色事实矛盾 => 否。',
    '3) 只有在无法根据题目与事实判断时才返回无关。',
    '4) 若问题是“是不是某个具体角色”，仅当该角色与正确角色是同一人时返回是，否则返回否。',
  ].join('\n')

  try {
    const pre = keywordRuleAnswer(question, story)
    if (pre.replyText || pre.answer !== '无关') return pre

    const first = await requestSemanticAnswer({
      apiKey,
      systemPrompt,
      userPrompt: userPromptBase,
    })
    if (first !== '无关') {
      return correctSisterAgainstModel(question, story, ar(first))
    }

    const secondSystem = [
      '你是严格二分类裁判。',
      '对该题尽量只返回“是”或“否”，只有绝对无法判断才返回“无关”。',
      '你只能输出一个词：是 或 否 或 无关。',
    ].join('\n')
    const secondUser = [
      `正确角色与汤底：${story.bottom}`,
      `补充语义事实：${semanticFacts || '无'}`,
      `用户问题：${question}`,
      '请只输出一个词。',
    ].join('\n')
    const second = await requestSemanticAnswer({
      apiKey,
      systemPrompt: secondSystem,
      userPrompt: secondUser,
    })
    return correctSisterAgainstModel(question, story, ar(second))
  } catch {
    return keywordRuleAnswer(question, story)
  }
}
