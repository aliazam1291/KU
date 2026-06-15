'use client'
import { useRef } from 'react'
import { Play, ChevronLeft, ChevronRight, Headphones } from 'lucide-react'

const episodes = [
  { num: '141', title: 'When Algorithms Dream of Music', guest: 'James Okafor', dur: '58m', plays: '1.2M', isNew: false },
  { num: '140', title: 'Cities Without Centers', guest: 'Priya Rao', dur: '1h 08m', plays: '923K', isNew: false },
  { num: '139', title: 'The Language We Lose', guest: 'Sofia Laurent', dur: '45m', plays: '756K', isNew: false },
  { num: '138', title: 'What Silence Sounds Like', guest: 'Daniel Park', dur: '2h 02m', plays: '2.1M', isNew: false },
  { num: '137', title: 'The Last Analog Generation', guest: 'Mia Torres', dur: '1h 31m', plays: '1.4M', isNew: false },
  { num: '136', title: 'Nostalgia as a Political Tool', guest: 'Dr. Reza Karimi', dur: '1h 12m', plays: '634K', isNew: false },
]

export function RecentEpisodes({ onMoreMidnightClick }: { onMoreMidnightClick?: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const down = useRef(false), startX = useRef(0), scrollL = useRef(0)
  const velX = useRef(0), lastX = useRef(0), lastT = useRef(0)

  const onDown = (e: React.PointerEvent) => {
    down.current = true
    startX.current = e.pageX - (ref.current?.offsetLeft ?? 0)
    scrollL.current = ref.current?.scrollLeft ?? 0
    lastX.current = e.pageX; lastT.current = Date.now()
    ref.current?.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!down.current || !ref.current) return
    ref.current.scrollLeft = scrollL.current - (e.pageX - ref.current.offsetLeft - startX.current) * 1.2
    const now = Date.now()
    velX.current = (e.pageX - lastX.current) / (now - lastT.current + 1)
    lastX.current = e.pageX; lastT.current = now
  }
  const onUp = () => {
    down.current = false
    let v = -velX.current * 10
    const coast = () => {
      if (Math.abs(v) < 0.5 || !ref.current) return
      ref.current.scrollLeft += v; v *= 0.92
      requestAnimationFrame(coast)
    }
    requestAnimationFrame(coast)
  }

  const scroll = (d: number) => ref.current?.scrollBy({ left: d * 240, behavior: 'smooth' })

  return (
    <div className="border-t border-white/[0.05]">
      {/* Header */}
      <div className="flex items-center justify-between px-10 md:px-14 py-3">
        <button
          type="button"
          onClick={onMoreMidnightClick}
          className="text-left text-[8px] tracking-[0.32em] uppercase text-ku-cream/30 hover:text-ku-cream/55 transition-colors cursor-none"
        >
          More from Midnight Frequencies
        </button>
        <div className="flex items-center gap-4">
          <a href="#" className="text-[8px] tracking-[0.2em] uppercase text-ku-cream/25 hover:text-ku-cream/55 transition-colors cursor-none">
            All episodes →
          </a>
          <div className="flex gap-2">
            {[-1, 1].map(d => (
              <button key={d} onClick={() => scroll(d)}
                className="w-6 h-6 border border-white/[0.08] rounded-full flex items-center justify-center hover:border-white/25 transition-colors cursor-none text-ku-cream/35 hover:text-ku-cream/70">
                {d < 0 ? <ChevronLeft size={9} /> : <ChevronRight size={9} />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Episode cards */}
      <div ref={ref}
        className="overflow-x-hidden cursor-grab select-none"
        onPointerDown={onDown} onPointerMove={onMove}
        onPointerUp={onUp} onPointerCancel={onUp}
      >
        <div className="flex gap-px pb-5 px-10 md:px-14">
          {episodes.map(ep => (
            <div key={ep.num}
              className="flex-shrink-0 w-[220px] border border-white/[0.05] bg-white/[0.02] p-4 group hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-none"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="font-mono text-[9px] text-ku-gold/50 group-hover:text-ku-gold/80 transition-colors">
                  #{ep.num}
                </span>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 border border-white/15 rounded-full flex items-center justify-center hover:border-ku-gold/50 cursor-none">
                  <Play size={9} className="fill-ku-cream/60 ml-px" />
                </button>
              </div>

              <p className="text-[12px] font-display font-light text-ku-cream/70 leading-snug mb-2 group-hover:text-ku-cream/90 transition-colors line-clamp-2">
                {ep.title}
              </p>

              <p className="text-[9px] text-ku-cream/28 mb-3 truncate">
                with {ep.guest}
              </p>

              <div className="flex items-center justify-between text-[8px] tracking-[0.12em] uppercase text-ku-cream/22">
                <span className="flex items-center gap-1">
                  <Headphones size={9} /> {ep.plays}
                </span>
                <span>{ep.dur}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
