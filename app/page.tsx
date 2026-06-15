import dynamic from 'next/dynamic'
import { Nav }           from '@/components/Nav'
import { Hero }          from '@/components/Hero'
import { HostsCarousel } from '@/components/HostsCarousel'
import { FeaturedShows } from '@/components/FeaturedShows'
import { Community }     from '@/components/Community'
import { Episodes }      from '@/components/Episodes'
import { Footer }        from '@/components/Footer'

const Cursor = dynamic(
  () => import('@/components/Cursor').then(m => m.Cursor),
  { ssr: false }
)

const marqueeItems = [
  'Midnight Frequencies', 'Signal & Noise', 'The Human Side', 'Echo Chamber',
  'Green Room', 'The Signal', 'Null Space', 'Ember Sessions',
]

export default function Page() {
  return (
    <>
      {/* Film grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Custom cursor */}
      <Cursor />

      {/* Navigation */}
      <Nav />

      <main>
        {/* 1 — Cinematic hero */}
        <Hero />

        {/* 2 — Hosts carousel */}
        <HostsCarousel />

        {/* 3 — Marquee separator */}
        <div className="bg-ku-bg border-y border-white/[0.05] py-4 overflow-hidden">
          <div className="flex whitespace-nowrap animate-marquee">
            {[...marqueeItems, ...marqueeItems].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-10 pr-10">
                <span className="font-display text-[clamp(16px,1.8vw,24px)] font-light text-ku-cream/30 hover:text-ku-cream transition-colors cursor-none">
                  {t}
                </span>
                <span className="w-1 h-1 rounded-full bg-ku-gold/40 flex-shrink-0" />
              </span>
            ))}
          </div>
        </div>

        {/* 4 — Featured shows grid */}
        <FeaturedShows />

        {/* 5 — Community / live discussion */}
        <Community />

        {/* 6 — Episodes list */}
        <Episodes />
      </main>

      <Footer />
    </>
  )
}
