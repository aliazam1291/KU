'use client'
import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Play } from 'lucide-react'

const shows = [
  {
    num: '01',
    title: 'Midnight Frequencies',
    tag: 'Talk Show · Culture',
    genre: 'talk-show',
    desc: 'The flagship late-night conversation. Deep dives into culture, identity, and what it means to be human in a fractured world.',
    episodes: 142,
    listeners: '2.8M',
    img: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    num: '02',
    title: 'Signal & Noise',
    tag: 'Tech · Society',
    genre: 'tech',
    desc: 'Where technology meets humanity. Conversations with engineers, ethicists, and artists on how code is reshaping the world.',
    episodes: 48,
    listeners: '890K',
    img: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&h=800&q=80',
  },
  {
    num: '03',
    title: 'The Human Side',
    tag: 'Storytelling · Society',
    genre: 'storytelling',
    desc: 'Intimate interviews with ordinary people living extraordinary lives. Stories that remind us what connects us all.',
    episodes: 24,
    listeners: '540K',
    img: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&h=800&q=80',
  },
]

const filters = [
  { id: 'all',          label: 'All' },
  { id: 'talk-show',   label: 'Talk Show' },
  { id: 'tech',        label: 'Tech' },
  { id: 'storytelling',label: 'Storytelling' },
]

export function FeaturedShows() {
  const [active, setActive] = useState('all')

  return (
    <section id="shows" style={{ scrollMarginTop: '96px' }} className="py-20 md:py-28 bg-ku-bg px-10 md:px-14">

      {/* Header */}
      <div className="flex items-end justify-between mb-10 pb-6 border-b border-white/[0.06]">
        <div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-[9px] tracking-[0.35em] uppercase text-ku-gold mb-3"
          >
            Our shows
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-display text-[clamp(36px,5vw,68px)] font-light leading-[0.93] tracking-tight"
          >
            On the Air
          </motion.h2>
        </div>
        <a
          href="#"
          className="hidden md:block text-[9px] tracking-[0.2em] uppercase text-ku-cream/40 hover:text-ku-gold transition-colors cursor-none pb-1 border-b border-transparent hover:border-ku-gold"
        >
          All shows →
        </a>
      </div>

      {/* Genre filter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex gap-2 flex-wrap mb-12"
      >
        {filters.map(f => (
          <button
            key={f.id}
            onClick={() => setActive(f.id)}
            className={`
              text-[9px] tracking-[0.22em] uppercase px-5 py-2.5 border transition-all duration-300 cursor-none
              ${active === f.id
                ? 'border-ku-gold text-ku-gold bg-ku-gold/10'
                : 'border-white/[0.08] text-ku-cream/35 hover:border-ku-gold/30 hover:text-ku-cream/70 hover:-translate-y-px'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-[2px]">
        {shows.map((show, i) => {
          const hidden = active !== 'all' && active !== show.genre
          return (
            <motion.div
              key={show.title}
              initial={{ clipPath: 'inset(100% 0 0 0)' }}
              whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.77, 0, 0.18, 1], delay: i * 0.1 }}
              animate={{
                opacity: hidden ? 0.12 : 1,
                scale:   hidden ? 0.97 : 1,
              }}
              style={{ pointerEvents: hidden ? 'none' : 'auto' }}
              className="relative aspect-[3/4] overflow-hidden group cursor-none"
            >
              <Image
                src={show.img}
                alt={show.title}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent transition-all duration-500 group-hover:from-black/98 group-hover:via-black/55" />

              {/* Gold border glow on hover */}
              <div className="absolute inset-0 border border-transparent group-hover:border-ku-gold/18 transition-all duration-500 z-10 pointer-events-none" />

              {/* Ghost number */}
              <span className="absolute top-5 right-5 font-display text-[52px] font-light text-white/[0.06] leading-none transition-all duration-500 group-hover:text-ku-gold/10 group-hover:scale-110 group-hover:-translate-x-1 origin-top-right">
                {show.num}
              </span>

              {/* Tag chip */}
              <div className="absolute top-5 left-5 z-[2]">
                <span className="text-[8px] tracking-[0.2em] uppercase text-ku-cream/50 border border-white/10 px-2 py-1">
                  {show.tag}
                </span>
              </div>

              {/* Play button overlay — fades in on hover */}
              <div className="absolute inset-0 flex items-center justify-center z-[3] pointer-events-none">
                <div className="w-16 h-16 rounded-full border border-white/25 flex items-center justify-center opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:border-ku-gold/70 bg-black/20 backdrop-blur-sm">
                  <Play className="w-5 h-5 fill-white ml-0.5 group-hover:fill-ku-gold transition-colors duration-300" />
                </div>
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-[2]">
                <h3 className="font-display text-[clamp(20px,2.2vw,32px)] font-light leading-tight mb-2 group-hover:text-ku-gold transition-colors duration-300">
                  {show.title}
                </h3>

                {/* Description — slides up on hover */}
                <div className="max-h-0 overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-[80px]">
                  <p className="text-[12px] leading-relaxed text-ku-cream/45 mb-3">
                    {show.desc}
                  </p>
                </div>

                <div className="flex items-center gap-4 text-[9px] tracking-[0.15em] uppercase text-ku-cream/35">
                  <span>{show.episodes} eps</span>
                  <span className="w-1 h-1 rounded-full bg-ku-cream/20" />
                  <span>{show.listeners} listeners</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
