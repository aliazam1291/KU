'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const cards = [
  { title: 'Shadow Protocol',   year: 2024, img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Ocean Frequencies', year: 2023, img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Crimson Hours',     year: 2024, img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Null Space',        year: 2023, img: 'https://images.unsplash.com/photo-1564732005956-20420ebdab60?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Green Room',        year: 2024, img: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Ember Sessions',    year: 2024, img: 'https://images.unsplash.com/photo-1468971050039-be99497410af?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'The Quiet Hours',   year: 2023, img: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=200&h=300&q=80' },
  { title: 'Neon Requiem',      year: 2024, img: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=200&h=300&q=80' },
]

export function AlsoLiked() {
  const vpRef    = useRef<HTMLDivElement>(null)
  const down     = useRef(false)
  const startX   = useRef(0)
  const scrollL  = useRef(0)
  const velX     = useRef(0)
  const lastX    = useRef(0)
  const lastT    = useRef(0)

  const onDown = (e: React.PointerEvent) => {
    down.current   = true
    startX.current = e.pageX - (vpRef.current?.offsetLeft ?? 0)
    scrollL.current = vpRef.current?.scrollLeft ?? 0
    lastX.current  = e.pageX
    lastT.current  = Date.now()
    vpRef.current?.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent) => {
    if (!down.current || !vpRef.current) return
    const x    = e.pageX - (vpRef.current.offsetLeft)
    vpRef.current.scrollLeft = scrollL.current - (x - startX.current) * 1.2
    const now = Date.now()
    velX.current  = (e.pageX - lastX.current) / (now - lastT.current + 1)
    lastX.current = e.pageX; lastT.current = now
  }
  const onUp = () => {
    down.current = false
    let v = -velX.current * 10
    const coast = () => {
      if (Math.abs(v) < 0.5 || !vpRef.current) return
      vpRef.current.scrollLeft += v; v *= 0.92
      requestAnimationFrame(coast)
    }
    requestAnimationFrame(coast)
  }

  const scroll = (dir: number) =>
    vpRef.current?.scrollBy({ left: dir * 156, behavior: 'smooth' })

  return (
    <div className="relative z-[2] border-t border-white/[0.06]">
      <div className="flex items-center justify-between px-10 md:px-14 py-4">
        <span className="text-[9px] tracking-[0.3em] uppercase text-ku-cream/35">
          People Also Liked
        </span>
        <div className="flex gap-3">
          {[-1, 1].map(d => (
            <button
              key={d}
              onClick={() => scroll(d)}
              className="w-[26px] h-[26px] border border-white/10 rounded-full flex items-center justify-center hover:border-ku-gold/60 transition-colors cursor-none text-ku-cream/50 hover:text-ku-cream"
            >
              {d < 0
                ? <ChevronLeft size={10} />
                : <ChevronRight size={10} />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={vpRef}
        className="overflow-x-hidden cursor-grab select-none"
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <div className="flex gap-3 pb-6 px-10 md:px-14">
          {cards.map(c => (
            <div
              key={c.title}
              className="flex-shrink-0 w-[120px] aspect-[2/3] relative overflow-hidden rounded-sm group"
            >
              <Image
                src={c.img}
                alt={c.title}
                fill
                sizes="120px"
                className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2.5">
                <p className="font-display text-[11px] font-light text-ku-cream leading-tight">{c.title}</p>
                <p className="text-[8px] text-ku-cream/40 mt-0.5">{c.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
