'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { MessageCircle, Radio, TrendingUp } from 'lucide-react'
import { useEffect } from 'react'

const threads = [
  {
    user: 'Nadia K.',
    avatar: 'NK',
    time: '12m ago',
    comment: 'The Maya Chen episode completely changed how I think about active listening. That bit about "performative attention" hit different.',
    replies: 34,
    likes: 127,
  },
  {
    user: 'Theo M.',
    avatar: 'TM',
    time: '38m ago',
    comment: "Alex finally asked the question I've been waiting three seasons for. No spoilers but ep 142 ending = instant classic.",
    replies: 18,
    likes: 89,
  },
  {
    user: 'Reva S.',
    avatar: 'RS',
    time: '1h ago',
    comment: "The silence experiment they did mid-episode was genuinely unsettling. Couldn't look away from my headphones.",
    replies: 12,
    likes: 64,
  },
]

const stats = [
  { label: 'Active listeners', value: 48291,  display: '48,291', icon: Radio },
  { label: 'Episodes released', value: 214,    display: '214',    icon: TrendingUp },
  { label: 'Community members', value: 183000, display: '183K',   icon: MessageCircle },
]

function AnimatedStat({ value, display, inView }: { value: number; display: string; inView: boolean }) {
  const [shown, setShown] = useState('0')

  useEffect(() => {
    if (!inView) return
    const duration = 1400
    const start = Date.now()
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      const current = Math.round(eased * value)
      // Format like the display string
      if (display.endsWith('K')) {
        setShown(current >= 1000 ? `${Math.round(current / 1000)}K` : String(current))
      } else {
        setShown(current.toLocaleString())
      }
      if (p < 1) requestAnimationFrame(tick)
      else setShown(display)
    }
    requestAnimationFrame(tick)
  }, [inView, value, display])

  return <>{shown}</>
}

const ease = [0.16, 1, 0.3, 1] as const

export function Community() {
  const [liked, setLiked] = useState<Record<string, boolean>>({})
  const statsRef = useRef<HTMLDivElement>(null)
  const statsInView = useInView(statsRef, { once: true, margin: '-60px' })

  function toggleLike(user: string) {
    setLiked(prev => ({ ...prev, [user]: !prev[user] }))
  }

  return (
    <section className="py-20 md:py-28 bg-ku-bg px-10 md:px-14 border-t border-white/[0.04]">

      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
        <div>
          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="live-dot w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span className="text-[9px] tracking-[0.35em] uppercase text-red-400/80">Live now</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease }}
            className="font-display text-[clamp(36px,5vw,68px)] font-light leading-[0.93] tracking-tight"
          >
            Join the
            <br />
            <em className="text-ku-gold not-italic">Conversation</em>
          </motion.h2>
        </div>

        {/* Stats — count up on entry */}
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex gap-8 md:gap-12"
        >
          {stats.map((s, i) => (
            <div key={s.label} className="flex flex-col gap-1">
              <s.icon className="w-3.5 h-3.5 text-ku-gold/50 mb-1" />
              <span className="font-display text-[clamp(22px,2.5vw,36px)] font-light leading-none text-ku-cream tabular-nums">
                <AnimatedStat value={s.value} display={s.display} inView={statsInView} />
              </span>
              <span className="text-[9px] tracking-[0.18em] uppercase text-ku-cream/30">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Discussion threads */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-white/[0.04]">
        {threads.map((t, i) => (
          <motion.div
            key={t.user}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="bg-ku-bg p-7 group cursor-none hover:bg-[#111] transition-colors duration-300"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 rounded-full bg-ku-gold/12 flex items-center justify-center border border-ku-gold/15 group-hover:border-ku-gold/30 transition-colors duration-300">
                <span className="font-display text-[10px] text-ku-gold/70">{t.avatar}</span>
              </div>
              <div>
                <p className="text-[11px] font-medium text-ku-cream/70">{t.user}</p>
                <p className="text-[9px] text-ku-cream/25">{t.time}</p>
              </div>
            </div>

            <p className="text-[13px] leading-[1.7] text-ku-cream/50 group-hover:text-ku-cream/65 transition-colors duration-300 mb-6">
              &ldquo;{t.comment}&rdquo;
            </p>

            <div className="flex items-center gap-5 text-[9px] tracking-[0.15em] uppercase text-ku-cream/25">
              <span className="flex items-center gap-1.5 hover:text-ku-cream/50 transition-colors cursor-none">
                <MessageCircle className="w-3 h-3" />
                {t.replies}
              </span>

              {/* Like button with toggle */}
              <button
                onClick={() => toggleLike(t.user)}
                className={`flex items-center gap-1.5 transition-all duration-200 cursor-none select-none
                  ${liked[t.user]
                    ? 'text-red-400 scale-110'
                    : 'hover:text-ku-cream/50'
                  }`}
              >
                <span className="transition-transform duration-200" style={{ display: 'inline-block', transform: liked[t.user] ? 'scale(1.3)' : 'scale(1)' }}>
                  {liked[t.user] ? '♥' : '♡'}
                </span>
                {liked[t.user] ? t.likes + 1 : t.likes}
              </button>

              <span className="ml-auto hover:text-ku-cream/50 transition-colors cursor-none">
                Reply →
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-8 border-t border-white/[0.05]"
      >
        <p className="text-[13px] text-ku-cream/35 leading-relaxed max-w-[440px]">
          Every episode has its own thread. Listeners, guests, and hosts all talk in the same room.
          No algorithm. No moderation theater.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-3 text-[9px] tracking-[0.22em] uppercase text-ku-cream/50 hover:text-ku-gold transition-colors cursor-none border border-white/10 hover:border-ku-gold/30 px-5 py-3"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Join the community
        </a>
      </motion.div>
    </section>
  )
}
