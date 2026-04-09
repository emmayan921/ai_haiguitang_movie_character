export type { TStory } from '../data/stories'

export interface TMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: number
  /** 裁判三元结果；与 content（可展示长文案）分离 */
  canonicalAnswer?: '是' | '否' | '无关'
}
