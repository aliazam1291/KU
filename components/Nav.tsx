'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const links = [
  { label: 'Info', href: '#hero' },
  { label: 'Shows', href: '#shows' },
  { label: 'Hosts', href: '#hosts' },
  { label: 'Podcasts', href: '#episodes' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Lock scroll + allow Esc to close while the overlay is open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] grid grid-cols-[1fr_auto_1fr] items-center px-4 sm:px-8 md:px-12 lg:px-14 transition-all duration-500 ${
          scrolled
            ? 'py-3 sm:py-4 bg-ku-bg/80 backdrop-blur-xl border-b border-white/[0.06]'
            : 'py-5 sm:py-6 md:py-7'
        }`}
      >
        {/* Left — Burger (toggles the overlay menu) */}
        <div className="flex justify-start">
          <button
            onClick={() => setOpen(v => !v)}
            className="group relative z-[110] flex flex-col gap-[5px] w-6 sm:w-7 cursor-none"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span
              className={`block h-px bg-ku-cream/90 transition-all duration-300 group-hover:bg-ku-cream ${
                open ? 'w-full translate-y-[6px] rotate-45' : 'w-full'
              }`}
            />
            <span
              className={`block h-px bg-ku-cream/90 transition-all duration-300 group-hover:bg-ku-cream ${
                open ? 'w-full opacity-0' : 'w-[72%] group-hover:w-full'
              }`}
            />
            <span
              className={`block h-px bg-ku-cream/90 transition-all duration-300 group-hover:bg-ku-cream ${
                open ? 'w-full -translate-y-[6px] -rotate-45' : 'w-[48%] group-hover:w-full'
              }`}
            />
          </button>
        </div>

        {/* Center — Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="justify-self-center font-display text-[20px] sm:text-[24px] md:text-[26px] font-light leading-none tracking-[0.35em] sm:tracking-[0.5em] pl-[0.35em] sm:pl-[0.5em] text-ku-cream hover:text-ku-gold transition-colors duration-300 cursor-none"
        >
          KU
        </Link>

        {/* Right — Register CTA */}
        <div className="flex items-center justify-end">
          <button className="bg-ku-accent text-white text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.22em] uppercase px-3.5 py-2 sm:px-5 sm:py-2.5 rounded-sm hover:opacity-90 transition-opacity cursor-none whitespace-nowrap">
            Register
          </button>
        </div>
      </nav>

      {/* Full-screen overlay menu */}
      <div
        className={`fixed inset-0 z-[90] bg-ku-bg/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-5 sm:gap-6 md:gap-8 px-6">
          {links.map((link, i) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : '0ms' }}
              className={`font-display text-3xl sm:text-5xl md:text-6xl font-light tracking-[0.15em] text-ku-cream/80 hover:text-ku-gold transition-all duration-500 cursor-none ${
                open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
