import { useParams, Link, Navigate } from 'react-router-dom'
import { DIFFICULTIES, allStories } from '../data/stories'
import { PageShell } from '../components/PageShell'

export default function DifficultyPage() {
  const { region } = useParams()

  if (region === 'domestic') {
    return <Navigate to='/domestic-coming-soon' replace />
  }

  const regionLabel = region === 'domestic' ? '国内影视' : '国外影视'
  const difficultyCover: Record<string, string> = {
    easy: '/images/stills/us-easy-01.png',
    medium: '/images/stills/kr-medium-01.png',
    hard: '/images/stills/us-hard-01.png',
  }

  return (
    <PageShell title='难度选择' subtitle={`${regionLabel} · 赛博机能难度面板`}>
      <div className='mx-auto grid gap-4'>
        {DIFFICULTIES.map((diff) => {
          const story =
            allStories.find(
              (s) => s.region === region && s.difficulty === diff.key,
            ) ?? allStories.find((s) => s.difficulty === diff.key);
          // 必须用 story.region 拼路径：GamePage 会校验 story 与 URL 中的 region 一致。
          // 国内分区若暂无 domestic 题目，回退到同难度的 foreign 题，避免 to="#" 无法跳转。
          const gamePath = story
            ? `/game/${story.region}/${diff.key}/${story.id}`
            : '#';
          return (
          <article
            key={diff.key}
            className="group overflow-hidden rounded-3xl border border-fuchsia-300/25 bg-white/5 shadow-[0_0_0_1px_rgba(236,72,153,0.12),0_14px_40px_rgba(0,0,0,0.55)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_24px_60px_rgba(124,58,237,0.45)]"
          >
            <div className='h-44 bg-cover bg-center' style={{ backgroundImage: `linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.82)),url('${difficultyCover[diff.key]}')` }} />
            <div className='p-5 text-left'>
              <div className={`mb-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold tracking-[0.15em] ${
                diff.key === 'easy'
                  ? 'bg-emerald-400/20 text-emerald-300'
                  : diff.key === 'medium'
                    ? 'bg-amber-400/20 text-amber-300'
                    : 'bg-rose-400/20 text-rose-300'
              }`}>
                LEVEL · {diff.key.toUpperCase()}
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">{diff.label}</h2>
              <p className="mt-2 text-sm text-fuchsia-100/75">赛博推理模式已加载，点击进入该等级剧情挑战。</p>
              <div className='mt-4 flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_12px_rgba(217,70,239,0.9)]' />
                <span className='text-xs text-fuchsia-100/65'>MOBILE FIRST · TOUCH OPTIMIZED</span>
              </div>
            <Link
              to={gamePath}
              className="mt-5 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-2 text-base font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.55)] transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)]"
            >
              进入难度 →
            </Link>
            </div>
          </article>
          );
        })}
      </div>
      <Link to="/" className="mt-7 inline-block text-sm font-medium text-fuchsia-100/70 transition-colors hover:text-fuchsia-200">
        ← 返回首页
      </Link>
    </PageShell>
  )
}