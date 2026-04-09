import { Link, Navigate, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { PageShell } from '../components/PageShell'
import { getStoryById } from '../services/api'
import { STORY_STILLS } from '../config/storyMedia'

export function RevealPage() {
  const { storyId = '' } = useParams()
  const story = getStoryById(storyId)
  const [failedSrcSet, setFailedSrcSet] = useState<Record<string, boolean>>({})

  if (!story) {
    return <Navigate to='/' replace />
  }

  const stills = useMemo(() => STORY_STILLS[story.id] ?? [], [story.id])
  const visibleStills = stills.filter((item) => !failedSrcSet[item.src])

  return (
    <PageShell title='汤底揭晓' subtitle='角色穿搭解析'>
      <article className='space-y-4 rounded-3xl border border-white/70 bg-white/80 p-5 text-slate-900 shadow-[0_16px_50px_rgba(15,23,42,0.1)] backdrop-blur-xl md:p-6'>
        <h2 className='text-2xl font-semibold tracking-tight'>{story.title}</h2>
        <p className='text-sm font-medium text-slate-700'>{story.bottom}</p>
        <section className='space-y-3'>
          <h3 className='text-sm font-semibold text-slate-800'>角色剧照</h3>
          <div className='grid gap-3 md:grid-cols-2'>
            {visibleStills.map((item) => (
              <img
                key={item.src}
                src={item.src}
                alt={item.alt}
                className='h-48 w-full rounded-2xl border border-slate-200 object-cover shadow-[0_10px_30px_rgba(15,23,42,0.12)]'
                loading='lazy'
                referrerPolicy='no-referrer'
                onError={() => {
                  setFailedSrcSet((prev) => ({ ...prev, [item.src]: true }))
                }}
              />
            ))}
          </div>
          {stills.length > 0 && visibleStills.length === 0 ? (
            <p className='rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
              当前剧照加载失败，请检查 `frontend/public/images/stills` 下对应图片是否存在。
            </p>
          ) : null}
        </section>
        <p className='rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-600'>{story.semanticFacts.join('；')}</p>
        <p className='text-sm text-slate-500'>想拆解更多影视角色穿搭，欢迎继续挑战更高难度。</p>

        <div className='flex flex-wrap gap-3'>
          <Link
            to={`/game/${story.region}/${story.difficulty}/${story.id}`}
            className='inline-flex min-h-11 items-center rounded-full bg-blue-600 px-5 py-2 text-sm font-medium text-white shadow-[0_8px_24px_rgba(37,99,235,0.35)] transition hover:bg-blue-500'
          >
            再来一局
          </Link>
          <Link to={`/difficulty/${story.region}`} className='inline-flex min-h-11 items-center rounded-full bg-slate-100 px-5 py-2 text-sm text-slate-700 transition hover:bg-slate-200'>
            返回难度页
          </Link>
          <Link to='/' className='inline-flex min-h-11 items-center rounded-full bg-slate-100 px-5 py-2 text-sm text-slate-700 transition hover:bg-slate-200'>
            返回首页
          </Link>
        </div>
      </article>
    </PageShell>
  )
}
