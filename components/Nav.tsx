'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, Grid2x2 } from 'lucide-react'

const links = ['Info', 'Shows', 'Hosts', 'Podcasts']

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-10 md:px-14 transition-all duration-500 ${
        scrolled
          ? 'py-4 bg-[#0a0a0a]/85 backdrop-blur-xl border-b border-white/[0.05]'
          : 'py-7'
      }`}
    >
      {/* Burger */}
      <button className="group flex flex-col gap-[5px] w-7 cursor-none" aria-label="Menu">
        <span className="block h-px bg-ku-cream transition-all duration-400 group-hover:w-full" style={{ width: '100%' }} />
        <span className="block h-px bg-ku-cream transition-all duration-400 group-hover:w-full" style={{ width: '72%' }} />
        <span className="block h-px bg-ku-cream transition-all duration-400 group-hover:w-full" style={{ width: '48%' }} />
      </button>

      {/* Logo */}
      <Link
        href="/"
        className="font-display text-[26px] font-light tracking-[0.5em] text-ku-cream hover:text-ku-gold transition-colors duration-300 cursor-none"
      >
        KU
      </Link>

      {/* Nav links — hidden on mobile */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <Link
            key={l}
            href="#"
            className="text-[9px] tracking-[0.2em] uppercase text-ku-cream/50 hover:text-ku-cream transition-colors duration-300 cursor-none"
          >
            {l}
          </Link>
        ))}
        <button className="ml-4 bg-ku-accent text-white text-[9px] tracking-[0.2em] uppercase px-5 py-2 hover:opacity-90 transition-opacity cursor-none">
          Register
        </button>
      </div>

      {/* Grid icon — visible on mobile instead */}
      <div className="md:hidden cursor-none text-ku-cream/60 hover:text-ku-cream transition-colors">
        <Grid2x2 size={18} strokeWidth={1.2} />
      </div>
    </nav>
  )
}
