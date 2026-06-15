'use client'
import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ mx: -200, my: -200, rx: -200, ry: -200 })

  useEffect(() => {
    const INTERACTIVES = 'a,button,[role="button"],.group'

    const onMove = (e: MouseEvent) => {
      pos.current.mx = e.clientX
      pos.current.my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform =
          `translate(${e.clientX}px,${e.clientY}px) translate(-50%,-50%)`
      }
    }

    const onOver = (e: MouseEvent) => {
      const t = (e.target as Element).closest(INTERACTIVES)
      document.body.style.setProperty('--ring-scale', t ? '1.6' : '1')
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)

    let rid = 0
    const loop = () => {
      rid = requestAnimationFrame(loop)
      const { mx, my, rx, ry } = pos.current
      pos.current.rx = rx + (mx - rx) * 0.12
      pos.current.ry = ry + (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.transform =
          `translate(${pos.current.rx}px,${pos.current.ry}px) translate(-50%,-50%) scale(var(--ring-scale,1))`
      }
    }
    requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rid)
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" style={{ mixBlendMode: 'difference' }}>
      <div
        ref={dotRef}
        className="absolute w-[5px] h-[5px] bg-white rounded-full"
      />
      <div
        ref={ringRef}
        className="absolute w-9 h-9 border border-white/70 rounded-full transition-transform duration-100"
        style={{ transitionProperty: 'transform', transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)', transitionDuration: '0ms' }}
      />
    </div>
  )
}
