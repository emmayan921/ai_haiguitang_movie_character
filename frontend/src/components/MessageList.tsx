import { useEffect, useRef } from 'react'
import type { TMessage } from '../types/game'

interface TMessageListProps {
  messages: TMessage[]
}

export function MessageList({ messages }: TMessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div
      className='h-72 overflow-y-auto rounded-2xl border border-fuchsia-300/25 p-4 text-slate-100 shadow-[inset_0_0_24px_rgba(192,38,211,0.2)]'
      style={{
        backgroundImage:
          "linear-gradient(rgba(9,8,20,0.78), rgba(9,8,20,0.78)), url('/reveal-character.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {messages.length === 0 ? <p className='text-sm text-fuchsia-100/65'>开始提问吧，AI 只会回答：是 / 否 / 无关。</p> : null}
      {messages.map((message) => (
        <div key={message.id} className={`mb-2 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div
            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white shadow-[0_0_18px_rgba(192,38,211,0.45)]'
                : 'border border-fuchsia-300/20 bg-white/10 text-fuchsia-50'
            }`}
          >
            {message.content}
          </div>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  )
}
