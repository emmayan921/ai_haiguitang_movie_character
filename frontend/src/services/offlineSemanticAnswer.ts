import type { TStory } from '../data/stories'

export type TYesNoIrrelevant = '是' | '否' | '无关'

export type OfflineAskResult = { answer: TYesNoIrrelevant; replyText?: string }

function ok(answer: TYesNoIrrelevant, replyText?: string): OfflineAskResult {
  return replyText ? { answer, replyText } : { answer }
}

function blobSaysHasOlderSister(blob: string): boolean {
  return /上面有姐姐|有一位亲姐姐|有亲姐姐|姐姐为长女|家中有一位亲姐姐/.test(blob)
}

function blobSaysNoOlderSister(blob: string): boolean {
  return /没有姐姐|没姐姐|没有亲姐姐|独女|只有哥哥没有姐姐/.test(blob)
}

function asksHavingOlderSister(q: string): boolean {
  if (!/(姐姐|姊姊)/.test(q)) return false
  if (!/(有|有没有|有没|是不是|是否)/.test(q)) return false
  return true
}

function sisterFactAnswer(question: string, blob: string): OfflineAskResult | null {
  if (!asksHavingOlderSister(question)) return null
  if (blobSaysNoOlderSister(blob)) return ok('否')
  if (blobSaysHasOlderSister(blob)) return ok('是')
  return null
}

/**
 * 无大模型时的语义回退：覆盖性别、常见「是 XXX 吗」等，保证本地可玩。
 */
export function offlineSemanticAnswer(question: string, story: TStory): OfflineAskResult {
  const q = question.trim().replace(/[\u200B-\u200D\uFEFF]/g, '')
  if (!q) return ok('无关')

  const blob = [story.title, story.surface, story.bottom, ...story.semanticFacts].join('\n')
  const negatives = story.semanticFacts.filter((f) => /不是|并非|没有/.test(f))
  const actorFacts = story.semanticFacts.filter((f) => /饰演|扮演|演员/.test(f))

  const asksUsTv =
    /美剧|美国电视剧|美剧的|来自美剧|是不是美剧|是否美剧|^是美剧|美剧里/.test(q)
  const asksKrTv =
    /韩剧|韩国电视剧|韩剧的|来自韩剧|是不是韩剧|是否韩剧|^是韩剧|韩剧里/.test(q)
  if (asksUsTv || asksKrTv) {
    const hasUs = /美剧/.test(blob)
    const hasKr = /韩剧/.test(blob)
    if (asksUsTv) {
      if (hasUs) return ok('是')
      if (hasKr && !hasUs) return ok('否')
    }
    if (asksKrTv) {
      if (hasKr) return ok('是')
      if (hasUs && !hasKr) return ok('否')
    }
  }

  const sisterHit = sisterFactAnswer(q, blob)
  if (sisterHit) return sisterHit

  if (story.id === 'kr-hard-01') {
    const stripped = q
      .replace(/[\s\u3000]/g, '')
      .replace(/[？?！!。,.，。]/g, '')
      .trim()
    const rawNameGuess = /^\p{Script=Han}{0,2}德善$/u.test(stripped) && stripped !== '成德善'
    const questionLike = /是|是不是|是否|对吧|对不对|就叫/.test(q) || /吗|么|呢|吧/.test(q)
    if (/德善/.test(q) && !/成德善/.test(q) && (questionLike || rawNameGuess)) {
      return ok('无关', '你已经猜对了一半，再想想名字？')
    }
  }

  const asksFemale =
    /是女的|女的吗|女性|女生|女人|是不是女|是否女|性别.*女/.test(q) ||
    (/女/.test(q) && /吗|么|是不是|是否/.test(q))
  const asksMale =
    /是男的|男的吗|男性|男人|是不是男|是否男|性别.*男/.test(q) ||
    (/男/.test(q) && /吗|么|是不是|是否/.test(q))

  if (asksFemale) {
    if (/性别为女|角色性别为女/.test(blob)) return ok('是')
    if (/性别为男|角色性别为男/.test(blob)) return ok('否')
  }
  if (asksMale) {
    if (/性别为男|角色性别为男/.test(blob)) return ok('是')
    if (/性别为女|角色性别为女/.test(blob)) return ok('否')
  }

  const charMatch = q.match(/(?:是|是不是|是否)\s*([^吗？?…]{2,24})\s*(吗|么|呢)?[？?]?$/)
  if (charMatch) {
    const name = charMatch[1]
      .replace(/的$/, '')
      .replace(/这个|那个|角色|女主|男主/g, '')
      .trim()
    if (name.length >= 2) {
      const negated = negatives.some((f) => f.includes(name))
      if (negated) return ok('否')
      if (blob.includes(name)) return ok('是')
      return ok('无关')
    }
  }

  if (/在一起|恋人|结婚|契约结婚|李英宰/.test(q)) {
    if (negatives.some((f) => f.includes('李英宰') || f.includes('结婚'))) return ok('否')
    if (blob.includes('李英宰') || blob.includes('契约结婚') || blob.includes('在一起')) return ok('是')
  }

  if (/穿搭|衣服|造型|发型|双马尾|休闲|可爱|亮色/.test(q)) {
    if (negatives.some((f) => f.includes('穿搭') || f.includes('造型'))) return ok('否')
    if (
      blob.includes('穿搭') ||
      blob.includes('休闲可爱') ||
      blob.includes('双马尾') ||
      blob.includes('亮色')
    ) {
      return ok('是')
    }
  }

  if (/演员|饰演|扮演|演的|演得/.test(q)) {
    if (actorFacts.some((f) => f.includes('宋慧乔')) && /宋慧乔/.test(q)) return ok('是')
    if (actorFacts.length > 0 && /宋慧乔|全智贤|安妮斯顿|惠利|Alicia|麦克斯/.test(q)) {
      return actorFacts.some((f) => /宋慧乔|全智贤|安妮斯顿|惠利|Alicia|麦克斯/.test(f)) ? ok('是') : ok('否')
    }
  }

  return ok('无关')
}
