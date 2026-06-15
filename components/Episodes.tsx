'use client'
import { useState, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Play, Pause, Headphones } from 'lucide-react'

const episodes = [
  {
    num: '142',
    show: 'Midnight Frequencies',
    title: 'The Art of Listening in a Loud World',
    guest: 'Dr. Maya Chen',
    guestTitle: 'Cognitive Scientist',
    dur: '1h 24m',
    plays: '847K',
    date: 'Jun 12',
    progress: 72,
    desc: 'Alex Mercer sits down with cognitive scientist Dr. Maya Chen to ask a simple question: in a world designed to capture attention, have we forgotten how to truly listen?',
  },
  {
    num: '141',
    show: 'Midnight Frequencies',
    title: 'When Algorithms Dream of Music',
    guest: 'James Okafor',
    guestTitle: 'Music Critic',
    dur: '58m',
    plays: '1.2M',
    date: 'Jun 5',
    progress: 28,
    desc: 'As AI-generated music floods streaming charts, James Okafor asks what we lose when we let machines compose the soundtrack of our lives.',
  },
  {
    num: '140',
    show: 'Echo Chamber',
    title: 'Cities Without Centers',
    guest: 'Priya Rao',
    guestTitle: 'Urban Anthropologist',
    dur: '1h 08m',
    plays: '923K',
    date: 'May 29',
    progress: 100,
    desc: "Why do the world's fastest-growing cities feel like they have no soul? Priya Rao traces the disappearance of the public square.",
  },
  {
    num: '139',
    show: 'The Signal',
    title: 'The Language We Lose',
    guest: 'Sofia Laurent',
    guestTitle: 'Linguist & Author',
    dur: '45m',
    plays: '756K',
    date: 'May 22',
    progress: 0,
    desc: 'Every two weeks, a language dies. Sofia Laurent has spent her career recording the final speakers — and asking what we lose when a tongue goes silent.',
  },
  {
    num: '138',
    show: 'Green Room',
    title: 'What Silence Sounds Like',
    guest: 'Daniel Park',
    guestTitle: 'Sound Designer',
    dur: '2h 02m',
    plays: '2.1M',
    date: 'May 15',
    progress: 0,
    desc: 'Sound designer Daniel Park on why silence is the most powerful tool in audio — and how modern media weaponizes noise to keep us from thinking.',
  },
]

function ProgressBar({ value, inView }: { value: number; inView: boolean }) {
  return (
    <div className="w-full max-w-[320px] h-[2px] bg-ku-bg/10 rounded-full mb-5 overflow-hidden">
      <motion.div
        className="h-full bg-gradient-to-r from-ku-gold/70 to-ku-gold/30 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: inView ? `${value}%` : 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </div>
  )
}

export function Episodes() {
  const [playingNum, setPlayingNum] = useState<string | null>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const inView = useInView(listRef, { once: true, margin: '-80px' })

  function togglePlay(num: string) {
    setPlayingNum(prev => (prev === num ? null : num))
  }

  return (
    <section id="episodes" style={{ scrollMarginTop: '96px' }} className="py-20 md:py-28 bg-ku-cream px-4 sm:px-6 md:px-10 lg:px-14">

      {/* Header */}
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-ku-bg/10">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] tracking-[0.35em] uppercase text-ku-gold mb-3"
          >
            Fresh from the studio
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(36px,5vw,68px)] font-light leading-[0.93] tracking-tight text-ku-bg"
          >
            Latest Episodes
          </motion.h2>
        </div>
        <a
          href="#"
          className="hidden md:block text-[9px] tracking-[0.2em] uppercase text-ku-bg/35 hover:text-ku-bg transition-colors cursor-none pb-1 border-b border-transparent hover:border-ku-bg"
        >
          Full archive →
        </a>
      </div>

      {/* Column labels */}
      <div className="hidden md:grid grid-cols-[64px_1fr_auto] gap-6 mb-4 px-0">
        <span className="text-[8px] tracking-[0.25em] uppercase text-ku-bg/25">Ep.</span>
        <span className="text-[8px] tracking-[0.25em] uppercase text-ku-bg/25">Title &amp; Guest</span>
        <span className="text-[8px] tracking-[0.25em] uppercase text-ku-bg/25 text-right">Plays · Duration</span>
      </div>

      {/* List */}
      <ul ref={listRef}>
        {episodes.map((ep, i) => {
          const isPlaying = playingNum === ep.num
          return (
            <motion.li
              key={ep.num}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.07 }}
              className="group border-b border-ku-bg/[0.08] cursor-none overflow-hidden"
            >
              <div className="flex items-center gap-6 py-5 transition-all duration-400 group-hover:py-6">

                {/* Episode number / play toggle */}
                <div className="relative min-w-[64px] flex items-center justify-start">
                  <span className={`font-display text-[clamp(28px,3.5vw,46px)] font-light leading-none transition-all duration-400
                    ${isPlaying ? 'text-ku-gold/60 opacity-0' : 'text-ku-bg/18 group-hover:text-ku-gold/60 group-hover:opacity-0'}`}>
                    #{ep.num}
                  </span>
                  <button
                    onClick={() => togglePlay(ep.num)}
                    className={`absolute inset-0 flex items-center transition-opacity duration-300 cursor-none
                      ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  >
                    <span className={`w-9 h-9 border rounded-full flex items-center justify-center transition-all duration-300
                      ${isPlaying
                        ? 'border-ku-gold bg-ku-gold text-white'
                        : 'border-ku-bg/20 hover:border-ku-bg/60 hover:bg-ku-bg hover:text-ku-cream'
                      }`}>
                      {isPlaying
                        ? <Pause className="w-3.5 h-3.5 fill-current text-ku-bg" />
                        : <Play  className="w-3.5 h-3.5 fill-current ml-0.5 text-ku-bg" />
                      }
                    </span>
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[8px] tracking-[0.2em] uppercase text-ku-gold/70">{ep.show}</span>
                    <span className="text-ku-bg/20 text-[8px]">·</span>
                    <span className="text-[8px] tracking-[0.15em] uppercase text-ku-bg/35">{ep.date}</span>
                    {isPlaying && (
                      <span className="ml-1 flex items-end gap-[2px] h-[10px]">
                        {[3,6,4,8,5,7,3,6].map((h, j) => (
                          <span key={j} className="w-[2px] bg-ku-gold/60 rounded-full origin-bottom inline-block"
                            style={{ height: `${h}px`,
                              animation: `waveform ${0.5 + (j % 4) * 0.15}s ease-in-out ${j * 0.07}s infinite alternate` }} />
                        ))}
                      </span>
                    )}
                  </div>
                  <h3 className={`font-display text-[clamp(16px,1.8vw,24px)] font-light leading-snug truncate transition-colors duration-300
                    ${isPlaying ? 'text-ku-gold' : 'text-ku-bg'}`}>
                    {ep.title}
                  </h3>
                  <p className="text-[11px] text-ku-bg/45 mt-0.5 hidden md:block">
                    with {ep.guest} <span className="text-ku-bg/25">— {ep.guestTitle}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-1 shrink-0">
                  <div className="flex items-center gap-1.5 text-[9px] tracking-[0.1em] text-ku-bg/35">
                    <Headphones className="w-3 h-3" />
                    <span>{ep.plays}</span>
                  </div>
                  <span className="text-[9px] tracking-[0.15em] uppercase text-ku-bg/30">{ep.dur}</span>
                </div>
              </div>

              {/* Hover-expanded description + progress bar */}
              <div className="max-h-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-[140px] pl-0 md:pl-[88px]">
                <p className="text-[13px] leading-relaxed text-ku-bg/48 pb-3 pr-4">
                  {ep.desc}
                </p>
                {ep.progress > 0 && (
                  <div className="flex items-center gap-3 mb-5">
                    <ProgressBar value={ep.progress} inView={inView} />
                    <span className="text-[8px] tracking-[0.15em] uppercase text-ku-bg/30 whitespace-nowrap -mt-3">
                      {ep.progress === 100 ? 'Completed' : `${ep.progress}% in`}
                    </span>
                  </div>
                )}
              </div>
            </motion.li>
          )
        })}
      </ul>

      {/* Subscribe CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-10 flex flex-col gap-4 md:flex-row items-start md:items-center justify-between"
      >
        <p className="text-[12px] text-ku-bg/40 leading-relaxed max-w-[360px]">
          New episodes every Thursday. Subscribe so you never miss a conversation.
        </p>
        <a
          href="#"
          className="text-[9px] tracking-[0.22em] uppercase text-ku-bg/50 hover:text-ku-bg transition-colors cursor-none border-b border-ku-bg/20 hover:border-ku-bg pb-1"
        >
          Subscribe for free →
        </a>
      </motion.div>
    </section>
  )
}
