'use client'

import { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import { Play, Pause, SkipBack, SkipForward, Headphones, Share2, MessageCircle } from 'lucide-react'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { HeroShader } from './HeroShader'
import { RecentEpisodes } from '@/components/RecentEpisodes'
import { Button } from './ui/button'

// 1. Convert the static episode into a database array
const EPISODE_DATABASE = [
  {
    id: 'ep-142',
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
  },
  {
    id: 'ep-141',
    number: '141',
    season: '3',
    show: 'Midnight Frequencies',
    date: 'Jun 05, 2026',
    title: 'The Silence of Quantum Space',
    guest: 'Dr. Elias Vance',
    guestTitle: 'Astrophysicist, CERN',
    desc: "Beyond the edge of the observable universe lies a void so quiet it borders on the impossible. Dr. Vance explains what this silence means for the origin of time itself.",
    elapsed: '0:00:00',
    duration: '2:11:04',
    plays: '1.2M',
    comments: '4.8K',
    genres: ['Science', 'Space', 'Philosophy'],
    hostName: 'Alex Mercer',
    hostRole: 'Lead Host',
    hostImg: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80',
    guestImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80',
    bgImg: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1920&h=1080&q=80',
  }
]

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
  // 2. Track active episode state
  const [activeEpIndex, setActiveEpIndex] = useState(0)
  const activeEp = EPISODE_DATABASE[activeEpIndex]

  const [isPlaying, setIsPlaying] = useState(false)
  const [speedIdx, setSpeedIdx] = useState(1)
  const [progress, setProgress] = useState(INITIAL_PROGRESS)
  const [hoveredChapter, setHoveredChapter] = useState<{ title: string; pct: number } | null>(null)

  const sectionRef = useRef<HTMLElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 60, damping: 25, mass: 0.6 })
  const springY = useSpring(rawY, { stiffness: 60, damping: 25, mass: 0.6 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      if (e.clientY > rect.bottom) return
      
      const nx = (e.clientX / window.innerWidth - 0.5)
      const ny = (e.clientY / window.innerHeight - 0.5)
      rawX.set(nx * -25)
      rawY.set(ny * -15)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [rawX, rawY])

  function cycleSpeed() {
    setSpeedIdx(i => (i + 1) % SPEEDS.length)
  }

  function handleProgressClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100)
    setProgress(Math.max(0, Math.min(100, pct)))
  }

  // 3. Smooth transition handler for episode changes
  function handleSelectEpisode(index: number) {
    if (index === activeEpIndex) return
    setIsPlaying(false)
    setProgress(0) // Reset player progress
    setActiveEpIndex(index)
  }

  function handleMoreMidnightClick() {
    const nextIndex = (activeEpIndex + 1) % EPISODE_DATABASE.length
    setIsPlaying(false)
    setProgress(0)
    setActiveEpIndex(nextIndex)
  }

  return (
    <section id="hero" ref={sectionRef} className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#050508] text-white">
      
      {/* Background Media Crossfade */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeEp.bgImg}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease }}
            className="absolute inset-0"
          >
            <Image
              src={activeEp.bgImg}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-[0.12] scale-105 pointer-events-none filter blur-[2px]"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-gradient-to-r from-[#050508] via-[#050508]/95 to-transparent lg:to-[#050508]/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-[#050508]/30 z-[1]" />
      </div>

      <HeroShader 
        className="absolute inset-0 w-full h-full z-[1] pointer-events-none"
        style={{ mixBlendMode: 'screen', opacity: 0.35 }} 
      />

      <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 xl:px-12 flex-1 flex flex-col justify-center pt-20 pb-10 sm:pt-24 sm:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center h-full">
          
          {/* ── LEFT COLUMN: Text Content & Player ── */}
          <motion.div
            style={{ x: springX, y: springY }}
            className="col-span-1 lg:col-span-7 min-w-0 flex flex-col justify-center order-2 lg:order-1"
          >
            {/* 4. Wrap text content in AnimatePresence for smooth data swaps */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease }}
              >
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span className="inline-block border border-amber-500/40 bg-amber-500/5 px-2.5 py-1 text-[9px] font-semibold tracking-[0.25em] uppercase text-amber-400 rounded-sm">
                    EP. {activeEp.number}
                  </span>
                  <span className="text-[10px] font-medium tracking-[0.18em] uppercase text-zinc-400">
                    {activeEp.show} &middot; Season {activeEp.season}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] text-zinc-500 font-mono">{activeEp.date}</span>
                </div>

                <h1 className="font-sans font-light text-3xl sm:text-4xl md:text-5xl lg:text-[48px] xl:text-[54px] leading-[1.1] tracking-tight mb-5 bg-gradient-to-b from-white to-zinc-300 bg-clip-text text-transparent">
                  {activeEp.title}
                </h1>

                <p className="text-xs sm:text-sm tracking-[0.12em] uppercase text-zinc-400 mb-4">
                  with <strong className="text-amber-400 font-semibold">{activeEp.guest}</strong>
                  <span className="text-zinc-600 mx-2">|</span>
                  <span className="font-light text-zinc-400 normal-case italic">{activeEp.guestTitle}</span>
                </p>

                <p className="text-sm sm:text-base leading-relaxed text-zinc-400 mb-8 max-w-xl">
                  {activeEp.desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Audio Player Box (Static container, dynamic data) */}
            <div className="mb-6 p-5 rounded-xl border border-white/[0.06] bg-zinc-950/40 backdrop-blur-md relative">
              <div className="mb-4 relative">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <span className="font-mono text-xs text-zinc-500 w-10">
                    {progress === 0 ? '0:00:00' : activeEp.elapsed}
                  </span>

                  <div className="flex-1 h-4 group/bar cursor-pointer relative flex items-center" onClick={handleProgressClick}>
                    <div className="absolute inset-y-[6px] left-0 right-0 bg-white/10 rounded-full w-full" />
                    <div className="absolute left-0 top-[6px] bottom-[6px] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }} />
                    <div className="absolute w-3 h-3 bg-white rounded-full -ml-1.5 shadow-xl transition-all duration-300 ease-out group-hover/bar:scale-150" style={{ left: `${progress}%` }} />

                    {chapters.map((c) => (
                      <div key={c.pct} className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 -ml-0.75 flex items-center justify-center group/ch" style={{ left: `${c.pct}%` }} onMouseEnter={() => setHoveredChapter({ title: c.title, pct: c.pct })} onMouseLeave={() => setHoveredChapter(null)}>
                        <div className={`w-[2px] h-2 rounded-full transition-all group-hover/ch:h-3 ${c.pct <= progress ? 'bg-amber-400' : 'bg-white/30'}`} />
                      </div>
                    ))}
                  </div>

                  <span className="font-mono text-xs text-zinc-500 w-10 text-right">{activeEp.duration}</span>
                </div>

                <div className="h-4 relative flex items-center">
                  <AnimatePresence mode="wait">
                    {hoveredChapter ? (
                      <motion.span key="hovered" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-medium tracking-[0.1em] uppercase text-amber-400 flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-400 animate-ping" /> Jump to: {hoveredChapter.title} ({hoveredChapter.pct}%)
                      </motion.span>
                    ) : (
                      <motion.span key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] tracking-[0.12em] uppercase text-zinc-500 truncate">
                        Playing: Chapter 3 &middot; Deep Work vs. Listening
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <button className="text-zinc-500 hover:text-white transition-colors p-1 active:scale-95"><SkipBack size={16} /></button>
                <button onClick={() => setIsPlaying(!isPlaying)} className="w-11 h-11 border border-white/10 rounded-full flex items-center justify-center bg-white/5 hover:border-amber-400/40 hover:bg-amber-400/10 transition-all group active:scale-90">
                  {isPlaying ? <Pause size={15} className="fill-amber-400 text-amber-400" /> : <Play size={15} className="fill-white text-white ml-0.5 group-hover:fill-amber-400 group-hover:text-amber-400 transition-colors" />}
                </button>
                <button className="text-zinc-500 hover:text-white transition-colors p-1 active:scale-95"><SkipForward size={16} /></button>

                <div className="hidden sm:flex items-end gap-[3px] h-4 px-2">
                  {waveH.map((h, i) => (
                    <div key={i} className={`w-[2px] rounded-full origin-bottom transition-colors duration-300 ${isPlaying ? 'bg-amber-400/75' : 'bg-zinc-700'}`} style={{ height: `${h}px`, animation: isPlaying ? `waveform ${0.5 + (i % 4) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` : 'none' }} />
                  ))}
                </div>

                <button onClick={cycleSpeed} className="ml-auto font-mono text-[10px] text-zinc-400 border border-white/10 rounded px-2.5 py-1 hover:border-amber-400/40 hover:text-amber-400 transition-all tracking-wider min-w-[48px] text-center bg-white/[0.02]">{SPEEDS[speedIdx]}</button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Button variant="default" className="bg-white text-black hover:bg-zinc-200 transition-colors px-6 font-medium text-sm flex items-center justify-center gap-2 h-11 rounded-md" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <><Pause className="w-4 h-4 fill-current" /> Pause Episode</> : <><Play className="w-4 h-4 fill-current" /> Listen Now</>}
              </Button>
            </div>
          </motion.div>

          {/* ── RIGHT COLUMN: Portraits Stack (Animated Crossfade) ── */}
          <div className="col-span-1 lg:col-span-5 min-w-0 flex flex-row lg:flex-col items-center justify-center gap-8 lg:gap-0 order-1 lg:order-2 bg-gradient-to-b from-white/[0.02] to-transparent lg:bg-none p-4 sm:p-6 lg:p-0 rounded-2xl border border-white/[0.02] lg:border-none">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeEp.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease }}
                className="flex flex-row lg:flex-col items-center gap-8 lg:gap-0 w-full"
              >
                {/* Host */}
                <div className="flex flex-col items-center gap-3 group/host flex-1 lg:flex-none">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-[132px] lg:h-[132px] rounded-full overflow-hidden ring-2 ring-white/10 group-hover/host:ring-amber-500/40 transition-all duration-500 shadow-2xl">
                    <Image src={activeEp.hostImg} alt={activeEp.hostName} fill sizes="132px" className="object-cover transition-transform duration-700 group-hover/host:scale-105" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-zinc-300">{activeEp.hostName}</p>
                    <p className="text-[9px] tracking-widest uppercase text-zinc-500 mt-0.5">{activeEp.hostRole}</p>
                  </div>
                </div>

                {/* Connector */}
                <div className="hidden lg:flex flex-col items-center py-4 w-full">
                  <div className="w-px h-6 bg-gradient-to-b from-zinc-800 to-zinc-700" />
                  <span className="text-[8px] font-semibold tracking-[0.4em] uppercase text-zinc-600 my-1">VS</span>
                  <div className="w-px h-6 bg-gradient-to-b from-zinc-700 to-zinc-800" />
                </div>

                {/* Guest */}
                <div className="flex flex-col items-center gap-3 group/guest flex-1 lg:flex-none">
                  <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-[132px] lg:h-[132px] rounded-full overflow-hidden ring-2 ring-amber-500/20 group-hover/guest:ring-amber-400/50 transition-all duration-500 shadow-2xl">
                    <Image src={activeEp.guestImg} alt={activeEp.guest} fill sizes="132px" className="object-cover transition-transform duration-700 group-hover/guest:scale-105" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs sm:text-sm font-medium text-zinc-300">{activeEp.guest}</p>
                    <p className="text-[9px] tracking-wider uppercase text-amber-400/80 mt-0.5 max-w-[160px] truncate">{activeEp.guestTitle.split(',')[0]}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={activeEp.number}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="hidden xl:block mt-8 font-sans text-7xl font-extralight text-white/[0.02] tracking-tighter pointer-events-none select-none"
              >
                NO. {activeEp.number}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* 5. Pass the state modifier down to your child component */}
        {/* Make sure RecentEpisodes accepts an onSelectEpisode prop like this in its definition: */}
        {/* export function RecentEpisodes({ onSelectEpisode }: { onSelectEpisode: (index: number) => void }) */}
        <RecentEpisodes onMoreMidnightClick={handleMoreMidnightClick} />
      </div>

      <style jsx global>{`
        @keyframes waveform {
          0% { transform: scaleY(0.3); }
          100% { transform: scaleY(1.1); }
        }
      `}</style>
    </section>
  )
}