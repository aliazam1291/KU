'use client'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Users } from 'lucide-react'

const hosts = [
  {
    name: 'Alex Mercer',
    role: 'Lead Host',
    show: 'Midnight Frequencies',
    bio: 'Former BBC journalist turned podcast pioneer. Known for conversations that go places other hosts won\'t.',
    episodes: 142,
    listeners: '2.8M',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&h=900&q=80',
  },
  {
    name: 'Priya Rao',
    role: 'Cultural Analyst',
    show: 'Echo Chamber',
    bio: 'Anthropologist and author of three books on urban identity. Brings academic rigor to street-level stories.',
    episodes: 48,
    listeners: '1.2M',
    img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&h=900&q=80',
  },
  {
    name: 'James Okafor',
    role: 'Correspondent',
    show: 'The Signal',
    bio: 'Music critic and culture writer. Has interviewed everyone from Nobel laureates to unsigned artists in forgotten cities.',
    episodes: 31,
    listeners: '890K',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&h=900&q=80',
  },
  {
    name: 'Mia Torres',
    role: 'Executive Producer',
    show: 'Green Room',
    bio: 'The voice behind the scenes. Mia shapes every episode arc and has a talent for getting guests to say the unsayable.',
    episodes: 24,
    listeners: '670K',
    img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=600&h=900&q=80',
  },
  {
    name: 'Daniel Park',
    role: 'Tech Host',
    show: 'Signal & Noise',
    bio: 'Engineer-turned-broadcaster. Translates the language of machines into conversations anyone can join.',
    episodes: 48,
    listeners: '560K',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&h=900&q=80',
  },
  {
    name: 'Sofia Laurent',
    role: 'Creative Director',
    show: 'The Human Side',
    bio: 'Documentary filmmaker and storyteller. Finds the extraordinary in the ordinary — one conversation at a time.',
    episodes: 24,
    listeners: '540K',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=900&q=80',
  },
]

const roles = ['Lead Host', 'Cultural Analyst', 'Correspondent', 'Executive Producer', 'Tech Host', 'Creative Director']

export function HostsCarousel() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-20 md:py-28 bg-ku-cream">
      <div className="px-10 md:px-14">

        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-[9px] tracking-[0.35em] uppercase text-ku-gold mb-3"
            >
              Behind the Mic
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(36px,5vw,68px)] font-light leading-[0.93] tracking-tight text-ku-bg"
            >
              The Voices of KU
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-[13px] text-ku-bg/50 max-w-[380px] leading-relaxed"
            >
              Journalists, storytellers, and cultural critics. Every voice on KU was chosen
              because they ask better questions — not louder ones.
            </motion.p>
          </div>

          {/* Roles list */}
          <div className="hidden lg:block text-right">
            <p className="text-[8px] tracking-[0.3em] uppercase text-ku-bg/25 mb-3">
              {roles.length} voices on air
            </p>
            {roles.map(r => (
              <p key={r} className="text-[10px] tracking-[0.18em] uppercase text-ku-bg/35 leading-loose hover:text-ku-bg/70 transition-colors cursor-none">
                {r}
              </p>
            ))}
          </div>
        </div>

        {/* Expanding carousel */}
        <div className="flex gap-[3px] h-[520px] md:h-[580px] overflow-hidden">
          {hosts.map((host, i) => (
            <div
              key={host.name}
              onClick={() => setActive(i)}
              className="relative overflow-hidden cursor-none flex-shrink-0 transition-flex"
              style={{ flex: active === i ? 4 : 0.55 }}
            >
              {/* Photo */}
              <Image
                src={host.img}
                alt={host.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className={`object-cover transition-all duration-700 ${
                  active === i ? 'grayscale-0 scale-100' : 'grayscale brightness-50 scale-105'
                }`}
              />

              {/* Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent transition-opacity duration-700 ${
                  active === i ? 'opacity-100' : 'opacity-50'
                }`}
              />

              {/* Index */}
              <span className="absolute top-4 left-4 text-white/20 text-[9px] font-mono z-10">
                {String(i + 1).padStart(2, '0')}
              </span>

              {/* Mic icon on inactive */}
              {active !== i && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <Mic className="w-3.5 h-3.5 text-white/20" />
                </div>
              )}

              {/* Info overlay on active */}
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    key={host.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="absolute inset-0 z-10 flex flex-col justify-end p-7"
                  >
                    <motion.div
                      initial={{ y: 18, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.45, delay: 0.2 }}
                    >
                      <p className="text-[8px] tracking-[0.28em] uppercase text-ku-gold mb-1.5">
                        {host.role}
                      </p>
                      <h3 className="font-display text-[clamp(22px,3vw,40px)] font-light text-white leading-tight mb-1">
                        {host.name}
                      </h3>
                      <p className="text-[11px] text-white/40 mb-3">
                        {host.show}
                      </p>
                      <p className="text-[11.5px] text-white/50 leading-relaxed mb-4 max-w-[260px]">
                        {host.bio}
                      </p>
                      <div className="flex items-center gap-4 text-[9px] tracking-[0.15em] uppercase text-white/35">
                        <span className="flex items-center gap-1.5">
                          <Mic className="w-3 h-3" />
                          {host.episodes} eps
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3" />
                          {host.listeners}
                        </span>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Dots nav */}
        <div className="flex items-center gap-2 mt-6">
          {hosts.map((h, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              title={h.name}
              className={`rounded-full transition-all duration-500 cursor-none ${
                active === i
                  ? 'w-8 h-[3px] bg-ku-bg'
                  : 'w-[3px] h-[3px] bg-ku-bg/25 hover:bg-ku-bg/50'
              }`}
            />
          ))}
          <span className="ml-auto text-[9px] tracking-[0.2em] uppercase text-ku-bg/35">
            {String(active + 1).padStart(2, '0')} / {String(hosts.length).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  )
}
