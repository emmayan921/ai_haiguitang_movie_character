import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { MessageList } from '../components/MessageList'
import { PageShell } from '../components/PageShell'
import { getStoryById } from '../services/api'
import { useGameSession } from '../hooks/useGameSession'
import { STORY_REVEAL_KEYWORDS, STORY_STILLS } from '../config/storyMedia'
import { allStories } from '../data/stories'

export function GamePage() {
  const { region = '', difficulty = '', storyId = '' } = useParams()
  const [question, setQuestion] = useState('')
  const [showRevealCard, setShowRevealCard] = useState(false)
  const story = getStoryById(storyId)

  if (!story || story.region !== region || story.difficulty !== difficulty) {
    return <Navigate to='/' replace />
  }

  const game = useGameSession(story)
  const stills = STORY_STILLS[story.id] ?? []
  const revealKeywords = STORY_REVEAL_KEYWORDS[story.id] ?? []
  const nextStoryPath = useMemo(() => {
    const sameBucketStories = allStories.filter(
      (item) => item.region === story.region && item.difficulty === story.difficulty,
    )
    if (sameBucketStories.length <= 1) {
      return `/game/${story.region}/${story.difficulty}/${story.id}`
    }
    const currentIndex = sameBucketStories.findIndex((item) => item.id === story.id)
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % sameBucketStories.length : 0
    const nextStory = sameBucketStories[nextIndex]
    return `/game/${nextStory.region}/${nextStory.difficulty}/${nextStory.id}`
  }, [story])

  const isCorrectGuess = useMemo(() => {
    if (game.messages.length < 2) return false
    const lastAssistant = game.messages[game.messages.length - 1]
    const lastUser = game.messages[game.messages.length - 2]
    if (!lastAssistant || !lastUser) return false
    if (lastAssistant.role !== 'assistant' || lastUser.role !== 'user') return false
    const canon =
      lastAssistant.canonicalAnswer ??
      (lastAssistant.content === '是' || lastAssistant.content === '否' || lastAssistant.content === '无关'
        ? lastAssistant.content
        : undefined)
    if (canon !== '是') return false
    const content = lastUser.content.toLowerCase()
    if (story.id === 'kr-hard-01') {
      return content.includes('成德善')
    }
    return revealKeywords.some((keyword) => content.includes(keyword.toLowerCase()))
  }, [game.messages, revealKeywords, story.id])

  useEffect(() => {
    if (isCorrectGuess) {
      setShowRevealCard(true)
    }
  }, [isCorrectGuess])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await game.sendQuestion(question)
    setQuestion('')
  }

  return (
    <PageShell
      title={`${region === 'domestic' ? '国内影视' : '国外影视'} · ${difficulty.toUpperCase()}`}
      subtitle='穿搭谜题推理终端'
    >
      <div className='space-y-4 rounded-3xl border border-fuchsia-300/25 bg-white/6 p-4 text-slate-100 shadow-[0_0_0_1px_rgba(236,72,153,0.15),0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl md:p-5'>
        <div className='rounded-2xl border border-white/10 bg-black/35 p-3 text-xs uppercase tracking-[0.22em] text-fuchsia-100/70'>
          Cyber Styling Guessing Terminal
        </div>
        <div className='rounded-2xl border border-violet-300/30 bg-violet-500/10 p-3'>
          <div className='mb-2 flex items-center justify-between text-xs text-fuchsia-100/70'>
            <span>QUESTION PROGRESS</span>
            <span>{game.questionCount}/{game.maxQuestionCount}</span>
          </div>
          <div className='h-2 rounded-full bg-black/40'>
            <div
              className='h-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 shadow-[0_0_14px_rgba(192,38,211,0.75)]'
              style={{ width: `${Math.min(100, (game.questionCount / game.maxQuestionCount) * 100)}%` }}
            />
          </div>
        </div>

        <p className='rounded-2xl border border-fuchsia-300/25 bg-black/35 p-4 text-sm leading-relaxed text-fuchsia-50'>
          <span className='mr-2 inline-flex rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-2 py-1 text-[11px] font-semibold text-white'>汤面</span>
          {story.surface}
        </p>

        <MessageList messages={game.messages} />

        <form onSubmit={handleSubmit} className='flex flex-col gap-2 md:flex-row'>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className='min-h-12 flex-1 rounded-2xl border border-fuchsia-300/25 bg-black/45 px-4 text-white outline-none ring-fuchsia-400/40 transition placeholder:text-fuchsia-100/45 focus:ring'
            placeholder='请输入 Yes/No 问题'
          />
          <button
            type='submit'
            disabled={game.isLoading}
            className='min-h-12 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-2 text-base font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.55)] transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)] disabled:cursor-not-allowed disabled:opacity-60'
          >
            {game.isLoading ? '思考中...' : '发送问题'}
          </button>
        </form>

        {game.error ? <p className='text-sm text-rose-300'>{game.error}</p> : null}
        {game.hintUnlocked ? (
          <div className='rounded-2xl border border-amber-300/35 bg-amber-500/10 p-4 text-sm text-amber-200'>
            <p className='font-medium text-amber-100'>关键提示</p>
            <p className='mt-2 leading-relaxed'>{story.keyHintSpoilerFree}</p>
            <p className='mt-3 text-amber-100/90'>
              再试一次猜一猜，还没想起来的话，我来告诉你答案哈！
            </p>
          </div>
        ) : null}

        <div className='flex flex-wrap gap-3'>
          <button
            type='button'
            onClick={() => setShowRevealCard(true)}
            className='inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_18px_rgba(168,85,247,0.45)] transition hover:scale-[1.03]'
          >
            查看汤底
          </button>
          <Link to={`/difficulty/${region}`} className='inline-flex min-h-12 items-center rounded-full border border-fuchsia-300/25 bg-white/8 px-5 py-2 text-sm text-fuchsia-50 transition hover:scale-[1.02] hover:bg-white/14'>
            返回难度页
          </Link>
          <Link to='/' className='inline-flex min-h-12 items-center rounded-full border border-fuchsia-300/25 bg-white/8 px-5 py-2 text-sm text-fuchsia-50 transition hover:scale-[1.02] hover:bg-white/14'>
            结束游戏
          </Link>
        </div>
      </div>
      {showRevealCard ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm'>
          <article className='w-full max-w-md space-y-4 rounded-3xl border border-fuchsia-300/25 bg-[#0b0a18]/95 p-5 shadow-[0_0_0_1px_rgba(236,72,153,0.2),0_20px_60px_rgba(0,0,0,0.75)]'>
            <h3 className='text-xl font-semibold text-white'>汤底揭晓</h3>
            {stills[0] ? (
              <img
                src={stills[0].src}
                alt={stills[0].alt}
                className='h-64 w-full rounded-2xl border border-fuchsia-300/25 object-cover'
              />
            ) : null}
            <p className='rounded-2xl border border-fuchsia-300/25 bg-white/8 p-4 text-sm text-fuchsia-50'>{story.bottom}</p>
            <div className='flex flex-wrap gap-3'>
              <Link
                to={`/reveal/${story.id}`}
                className='inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(168,85,247,0.55)] transition hover:scale-[1.03]'
              >
                进入汤底详情
              </Link>
              <Link
                to={nextStoryPath}
                className='inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] transition hover:scale-[1.03]'
              >
                下一题
              </Link>
              <button
                type='button'
                onClick={() => setShowRevealCard(false)}
                className='inline-flex min-h-12 items-center rounded-full border border-fuchsia-300/25 bg-white/8 px-5 py-2 text-sm text-fuchsia-50 transition hover:bg-white/14'
              >
                继续提问
              </button>
            </div>
          </article>
        </div>
      ) : null}
    </PageShell>
  )
}

/** 换题时强制 remount，避免揭晓弹层、对话状态残留在上一题 */
export function GamePageRoute() {
  const { storyId = '' } = useParams()
  return <GamePage key={storyId} />
}
