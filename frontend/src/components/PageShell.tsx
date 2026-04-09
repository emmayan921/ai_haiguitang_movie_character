import type { PropsWithChildren } from 'react'

interface TPageShellProps extends PropsWithChildren {
  title: string
  subtitle?: string
}

export function PageShell({ title, subtitle, children }: TPageShellProps) {
  return (
    <main className='mx-auto flex min-h-screen w-full max-w-md flex-col px-3 py-4 md:py-8'>
      <div className='rounded-[34px] border border-fuchsia-400/20 bg-[#080710]/72 p-3 shadow-[0_0_0_1px_rgba(168,85,247,0.14),0_34px_100px_rgba(0,0,0,0.75)] backdrop-blur-2xl'>
        <header className='mb-3 rounded-3xl border border-fuchsia-300/20 bg-white/7 p-4 md:p-5'>
          <h1 className='text-2xl font-semibold tracking-tight text-white md:text-3xl'>{title}</h1>
          {subtitle ? <p className='mt-2 text-sm text-fuchsia-100/70'>{subtitle}</p> : null}
        </header>
        <section className='flex-1'>{children}</section>
      </div>
    </main>
  )
}
