'use client'
import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Headphones, Share2, MessageCircle } from 'lucide-react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { HeroShader } from './HeroShader'
import { RecentEpisodes } from '@/components/RecentEpisodes'
import { Button } from './ui/button'

const ep = {
  number: '142',
  season: '3',
  show: 'Midnight Frequencies',
  date: 'Jun 12, 2026',
  title: 'The Art of Listening in a Loud World',
  guest: 'Dr. Maya Chen',
  guestTitle: 'Cognitive Scientist, MIT',
  desc: "In a world engineered to shatter focus, cognitive scientist Dr. Maya Chen asks whether we've lost the ability to truly listen — and what happens to society if we don't get it back.",
  elapsed: '0:26:45',
  duration: '1:24:18',
  plays: '847K',
  comments: '2.3K',
  genres: ['Talk Show', 'Culture', 'Society'],
  hostName: 'Alex Mercer',
  hostRole: 'Lead Host',
  hostImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
  guestImg: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300&q=80',
  bgImg: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1920&h=1080&q=80',
}

const chapters = [
  { title: 'Introduction', pct: 0 },
  { title: 'The Attention Economy', pct: 11 },
  { title: 'Deep Work vs. Listening', pct: 27 },
  { title: 'The Cognitive Cost', pct: 46 },
  { title: 'A Way Forward', pct: 67 },
  { title: 'Takeaways', pct: 86 },
]

const INITIAL_PROGRESS = 32
const SPEEDS = ['0.75×', '1.0×', '1.25×', '1.5×', '2.0×']

const waveH = [3, 7, 12, 5, 16, 9, 18, 5, 11, 17, 7, 14, 3, 10, 16, 6, 13, 4, 9, 17]
const ease = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const [isPlaying, setIsPlaying]       = useState(false)
  const [speedIdx, setSpeedIdx]         = useState(1)
  const [progress, setProgress]         = useState(INITIAL_PROGRESS)
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  const [chapterX, setChapterX]         = useState(0)

  const leftRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Smooth parallax via spring
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 50, damping: 20, mass: 0.8 })
  const springY = useSpring(rawY, { stiffness: 50, damping: 20, mass: 0.8 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      // Only parallax while cursor is over the hero
      if (e.clientY > rect.bottom) return
      const nx = (e.clientX / window.innerWidth  - 0.5)
      const ny = (e.clientY / window.innerHeight - 0.5)
      rawX.set(nx * -18)
      rawY.set(ny * -11)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  function cycleSpeed() {
    setSpeedIdx(i => (i + 1) % SPEEDS.length)
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    setProgress(Math.max(0, Math.min(100, pct)))
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen flex flex-col overflow-hidden bg-[#050508]">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image src={ep.bgImg} alt="" fill priority sizes="100vw"
          className="object-cover opacity-[0.14]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/92 to-[#050508]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508]/90 via-transparent to-[#050508]/40" />
      </div>

      {/* Three.js ambient shader */}
      <HeroShader className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0.45 }} />

      {/* ── Content ── */}
      <div className="relative z-[2] flex-1 flex flex-col">

        {/* Nav spacer */}
        <div className="h-[96px] flex-shrink-0" />

        {/* Two-column body */}
        <div className="flex-1 flex items-center gap-10 xl:gap-16 px-10 md:px-14 py-8">

          {/* ── LEFT: Episode info + player (parallax layer) ── */}
          <motion.div
            ref={leftRef}
            style={{ x: springX, y: springY }}
            className="flex-1 min-w-0 max-w-[580px]"
          >
            {/* Ep badge + meta */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.08 }}
              className="flex items-center gap-3 flex-wrap mb-4"
            >
              <span className="inline-block border border-ku-gold/35 px-2.5 py-[5px] text-[8px] tracking-[0.28em] uppercase text-ku-gold">
                EP. {ep.number}
              </span>
              <span className="text-[8px] tracking-[0.2em] uppercase text-ku-cream/28">
                {ep.show} · Season {ep.season}
              </span>
              <span className="text-[8px] text-ku-cream/18">{ep.date}</span>
            </motion.div>

            {/* Genre tags */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.16 }}
              className="flex items-center gap-2 mb-5"
            >
              {ep.genres.map((g, i) => (
                <span key={g} className="flex items-center gap-2">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-ku-cream/38">{g}</span>
                  {i < ep.genres.length - 1 && <span className="text-ku-cream/15">·</span>}
                </span>
              ))}
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.24 }}
              className="font-display font-light text-[clamp(30px,3.8vw,56px)] leading-[1.05] tracking-tight mb-4 max-w-[500px]"
            >
              {ep.title}
            </motion.h1>

            {/* Guest credit */}
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.32 }}
              className="text-[11px] tracking-[0.18em] uppercase text-ku-cream/38 mb-4"
            >
              with&nbsp;
              <strong className="text-ku-gold/75 font-medium not-italic">{ep.guest}</strong>
              <span className="text-ku-cream/18 mx-2">—</span>
              <span className="font-light">{ep.guestTitle}</span>
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.40 }}
              className="text-[13px] leading-[1.82] text-ku-cream/38 mb-6 max-w-[460px]"
            >
              {ep.desc}
            </motion.p>

            {/* ── Audio player ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.5 }}
              className="mb-6 p-4 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm"
            >
              {/* Progress bar + chapter markers */}
              <div className="mb-3 relative">
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="font-mono text-[9px] text-ku-cream/28 w-[42px]">{ep.elapsed}</span>

                  {/* Clickable scrubber */}
                  <div
                    className="flex-1 h-[6px] group/bar cursor-none relative flex items-center"
                    onClick={handleProgressClick}
                  >
                    {/* Track */}
                    <div className="absolute inset-y-[2px] left-0 right-0 bg-white/10 rounded-full" />
                    {/* Played portion */}
                    <div
                      className="absolute left-0 top-[2px] bottom-[2px] bg-ku-gold/60 rounded-full transition-none"
                      style={{ width: `${progress}%` }}
                    />
                    {/* Playhead */}
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-ku-cream rounded-full -ml-1.5 shadow-md transition-transform group-hover/bar:scale-125 cursor-none"
                      style={{ left: `${progress}%` }}
                    />
                    {/* Chapter markers */}
                    {chapters.map(c => (
                      <div
                        key={c.pct}
                        title={c.title}
                        className="absolute top-1/2 -translate-y-1/2 w-[2px] h-3 -ml-px cursor-none group/ch"
                        style={{ left: `${c.pct}%` }}
                        onMouseEnter={e => {
                          setHoveredChapter(c.title)
                          const rect = (e.currentTarget.closest('[data-scrubber]') as HTMLElement | null)
                          if (!rect) setChapterX(c.pct)
                        }}
                        onMouseLeave={() => setHoveredChapter(null)}
                        data-chapter-pct={c.pct}
                      >
                        <div className={`w-full h-full rounded-full ${c.pct <= progress ? 'bg-ku-gold/40' : 'bg-white/25'}`} />
                      </div>
                    ))}
                  </div>

                  <span className="font-mono text-[9px] text-ku-cream/28 w-[42px] text-right">{ep.duration}</span>
                </div>

                {/* Chapter label */}
                <div className="flex pl-[54px] pr-[54px] relative">
                  <span className="text-[8px] tracking-[0.15em] uppercase text-ku-cream/22 truncate transition-all duration-200">
                    {hoveredChapter
                      ? `▸ ${hoveredChapter}`
                      : `Chapter 3 · Deep Work vs. Listening`
                    }
                  </span>
                </div>
              </div>

              {/* Controls row */}
              <div className="flex items-center gap-4">
                <button className="text-ku-cream/28 hover:text-ku-cream/70 transition-colors cursor-none">
                  <SkipBack size={14} />
                </button>

                <button
                  onClick={() => setIsPlaying(p => !p)}
                  className="w-9 h-9 border border-white/15 rounded-full flex items-center justify-center hover:border-ku-gold/60 hover:bg-ku-gold/5 transition-all cursor-none group"
                >
                  {isPlaying
                    ? <Pause size={13} className="fill-ku-gold/80 group-hover:fill-ku-gold transition-colors" />
                    : <Play  size={13} className="fill-ku-cream/80 ml-0.5 group-hover:fill-ku-gold transition-colors" />
                  }
                </button>

                <button className="text-ku-cream/28 hover:text-ku-cream/70 transition-colors cursor-none">
                  <SkipForward size={14} />
                </button>

                {/* Live waveform — only animates when playing */}
                <div className="flex items-end gap-[2px] h-[14px] ml-1">
                  {waveH.map((h, i) => (
                    <div key={i}
                      className={`w-[2px] rounded-full origin-bottom transition-colors duration-300 ${isPlaying ? 'bg-ku-gold/45' : 'bg-white/15'}`}
                      style={{
                        height: `${h}px`,
                        animation: isPlaying
                          ? `waveform ${0.6 + (i % 5) * 0.18}s ease-in-out ${i * 0.06}s infinite alternate`
                          : 'none',
                      }}
                    />
                  ))}
                </div>

                {/* Speed cycle button */}
                <button
                  onClick={cycleSpeed}
                  className="ml-auto font-mono text-[9px] text-ku-cream/28 border border-white/[0.08] px-2 py-1 hover:border-ku-gold/30 hover:text-ku-gold/70 transition-all cursor-none tracking-widest min-w-[42px] text-center"
                >
                  {SPEEDS[speedIdx]}
                </button>
              </div>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-5 mb-5 text-[9px] tracking-[0.15em] uppercase text-ku-cream/28"
            >
              <span className="flex items-center gap-1.5">
                <Headphones size={11} /> {ep.plays} plays
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={11} /> {ep.comments} comments
              </span>
              <button className="ml-auto flex items-center gap-1.5 hover:text-ku-cream/55 transition-colors cursor-none">
                <Share2 size={11} /> Share
              </button>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.68 }}
              className="flex gap-3 items-center"
            >
              <Button variant="default" className="cursor-none" onClick={() => setIsPlaying(p => !p)}>
                {isPlaying
                  ? <><Pause className="w-3 h-3 fill-current" /> Pause</>
                  : <><Play  className="w-3 h-3 fill-current" /> Listen Now</>
                }
              </Button>
              <Button variant="outline" className="cursor-none">
                <Headphones className="w-3.5 h-3.5" /> Subscribe Free
              </Button>
            </motion.div>
          </motion.div>

          {/* ── RIGHT: Host + Guest portraits ── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease, delay: 0.4 }}
            className="hidden lg:flex flex-col items-center gap-0 flex-shrink-0 select-none"
          >
            {/* Host */}
            <div className="flex flex-col items-center gap-3 group/host">
              <div className="relative w-[132px] h-[132px] rounded-full overflow-hidden ring-1 ring-white/10 transition-all duration-500 group-hover/host:ring-ku-gold/25 group-hover/host:scale-[1.03]">
                <Image src={ep.hostImg} alt={ep.hostName} fill sizes="132px" className="object-cover grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-ku-cream/75">{ep.hostName}</p>
                <p className="text-[8px] tracking-[0.22em] uppercase text-ku-cream/30">{ep.hostRole}</p>
              </div>
            </div>

            {/* Connector */}
            <div className="flex flex-col items-center py-4 gap-2">
              <div className="w-px h-8 bg-white/[0.07]" />
              <span className="text-[7px] tracking-[0.3em] uppercase text-ku-cream/20 whitespace-nowrap">
                in conversation with
              </span>
              <div className="w-px h-8 bg-white/[0.07]" />
            </div>

            {/* Guest */}
            <div className="flex flex-col items-center gap-3 group/guest">
              <div className="relative w-[132px] h-[132px] rounded-full overflow-hidden ring-1 ring-ku-gold/20 transition-all duration-500 group-hover/guest:ring-ku-gold/45 group-hover/guest:scale-[1.03]">
                <Image src={ep.guestImg} alt={ep.guest} fill sizes="132px" className="object-cover grayscale-[20%]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="text-center">
                <p className="text-[12px] font-medium text-ku-cream/75">{ep.guest}</p>
                <p className="text-[8px] tracking-[0.15em] uppercase text-ku-cream/28 max-w-[160px] leading-loose">
                  {ep.guestTitle}
                </p>
              </div>
            </div>

            {/* Episode number watermark */}
            <p className="mt-6 font-display text-[72px] font-light leading-none text-white/[0.04] tracking-tight">
              #{ep.number}
            </p>
          </motion.div>

        </div>
      </div>

      {/* Recent episodes strip */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease, delay: 0.9 }}
        className="relative z-[2]"
      >
        <RecentEpisodes />
      </motion.div>
    </section>
  )
}
