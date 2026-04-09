import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'

export default function HomePage() {
  return (
    <PageShell title='穿搭猜角色' subtitle='CYBER STYLE · 霓虹推理实验场'>
      <div className='mx-auto grid gap-4'>
        <article className='group relative overflow-hidden rounded-[30px] border border-fuchsia-300/25 bg-white/5 shadow-[0_0_0_1px_rgba(236,72,153,0.16),0_16px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.4),0_30px_70px_rgba(124,58,237,0.5)]'>
          <div className='h-60 bg-cover bg-center' style={{ backgroundImage: "linear-gradient(180deg,rgba(0,0,0,.15),rgba(0,0,0,.82)),url('/images/stills/us-easy-01.png')" }} />
          <div className='absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-fuchsia-300/20 bg-black/45 p-5 backdrop-blur-xl'>
            <div className='mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-fuchsia-500 to-violet-600 text-xl text-white shadow-[0_0_20px_rgba(192,38,211,0.75)]'>
              🌍
            </div>
            <h2 className='text-2xl font-semibold tracking-tight text-white'>海外经典影视</h2>
            <p className='mt-2 text-sm leading-relaxed text-fuchsia-100/75'>韩剧/美剧角色穿搭谜题，进入多轮提问并解锁汤底。</p>
            <div className='mt-4 h-px bg-gradient-to-r from-fuchsia-400/40 to-transparent' />
          <Link
            to='/difficulty/foreign'
            className='mt-5 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-600 px-6 py-2 text-base font-semibold text-white shadow-[0_0_24px_rgba(168,85,247,0.55)] transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(236,72,153,0.8)]'
          >
            开始挑战 →
          </Link>
          </div>
        </article>

        <article className='group relative overflow-hidden rounded-[30px] border border-fuchsia-300/20 bg-white/5 shadow-[0_0_0_1px_rgba(168,85,247,0.16),0_16px_50px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(236,72,153,0.35),0_30px_70px_rgba(124,58,237,0.5)]'>
          <div className='h-60 bg-cover bg-center' style={{ backgroundImage: "linear-gradient(180deg,rgba(0,0,0,.2),rgba(0,0,0,.84)),url('/images/stills/kr-easy-01.png')" }} />
          <div className='absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-fuchsia-300/20 bg-black/45 p-5 backdrop-blur-xl'>
            <div className='mb-3 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-700 to-slate-500 text-xl text-white shadow-[0_0_20px_rgba(71,85,105,0.65)]'>
            🏮
          </div>
            <h2 className='text-2xl font-semibold tracking-tight text-white'>国内经典影视</h2>
            <p className='mt-2 text-sm leading-relaxed text-fuchsia-100/75'>题库制作中，入口保留，后续将接入完整国剧角色体系。</p>
            <div className='mt-4 h-px bg-gradient-to-r from-fuchsia-400/40 to-transparent' />
          <Link
            to='/domestic-coming-soon'
            className='mt-5 inline-flex min-h-12 items-center rounded-full bg-gradient-to-r from-slate-600 to-slate-500 px-6 py-2 text-base font-semibold text-white shadow-[0_0_24px_rgba(71,85,105,0.55)] transition-all hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(148,163,184,0.7)]'
          >
            敬请期待
          </Link>
          </div>
        </article>
      </div>
    </PageShell>
  )
}