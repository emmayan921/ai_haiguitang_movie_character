import { Link } from 'react-router-dom'
import { PageShell } from '../components/PageShell'

export default function DomesticComingSoonPage() {
  return (
    <PageShell title='国内经典影视' subtitle='题库建设中'>
      <section className='mx-auto flex min-h-[48vh] max-w-4xl items-center justify-center rounded-3xl border border-white/70 bg-white/75 p-8 text-center shadow-[0_16px_40px_rgba(15,23,42,0.08)] backdrop-blur-xl'>
        <div>
          <p className='text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl'>敬请期待</p>
          <p className='mt-4 text-sm text-slate-600'>国内题库后续上线，当前仅开放海外经典影视题库。</p>
          <Link
            to='/'
            className='mt-6 inline-flex min-h-11 items-center rounded-full bg-slate-900 px-5 py-2 text-sm font-medium text-white transition hover:bg-slate-700'
          >
            返回首页
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
