import Link from 'next/link'

const nav   = ['Shows', 'Community', 'Watchlist', 'Episodes', 'About', 'Careers']
const social = ['Instagram', 'X', 'YouTube', 'Spotify']

export function Footer() {
  return (
    <footer className="bg-ku-bg border-t border-white/[0.05] px-4 sm:px-6 md:px-10 lg:px-14 pt-16 pb-10">

      {/* Top */}
      <div className="flex flex-col gap-6 md:flex-row md:items-end justify-between pb-12 border-b border-white/[0.05] mb-10">
        <span className="font-display text-[clamp(80px,14vw,180px)] font-light leading-none tracking-tight text-ku-cream opacity-[0.06] hover:opacity-[0.12] transition-opacity duration-500 select-none">
          KU
        </span>
        <p className="text-[13px] leading-relaxed text-ku-cream/38 max-w-[240px] text-right hidden md:block">
          A curated space for conversations worth having twice.
          Talk shows. Podcasts. Community.
        </p>
      </div>

      {/* Nav links */}
      <div className="flex flex-wrap gap-x-6 gap-y-3 mb-10">
        {nav.map(l => (
          <Link
            key={l}
            href="#"
            className="text-[9px] tracking-[0.22em] uppercase text-ku-cream/38 hover:text-ku-gold transition-colors cursor-none"
          >
            {l}
          </Link>
        ))}
      </div>

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <span className="text-[10px] tracking-[0.12em] text-ku-cream/20">
          © 2024 KU — All rights reserved
        </span>
        <div className="flex gap-6">
          {social.map(s => (
            <Link
              key={s}
              href="#"
              className="text-[9px] tracking-[0.22em] uppercase text-ku-cream/35 hover:text-ku-cream transition-colors cursor-none"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
