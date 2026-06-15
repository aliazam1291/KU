'use client'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const VERT = `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
`

const FRAG = `
  precision highp float;
  uniform float uTime;
  uniform vec2  uMouse;
  varying vec2  vUv;

  float hash(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
  }
  float vnoise(vec2 p) {
    vec2 i=floor(p), f=fract(p);
    f=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),
               mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
  }
  mat2 rot2(float a){ float s=sin(a),c=cos(a); return mat2(c,s,-s,c); }
  float fbm(vec2 p){
    float v=0.0,a=0.5; mat2 r=rot2(0.45);
    for(int i=0;i<5;i++){ v+=a*vnoise(p); p=r*p*2.1+vec2(100.0); a*=0.5; }
    return v;
  }

  void main(){
    vec2 uv = vUv;
    vec2 m  = (uMouse - 0.5) * 0.14;

    vec2 q = vec2(fbm(uv*2.6+uTime*0.032+m), fbm(uv*2.6+vec2(5.2,1.3)-m+uTime*0.026));
    vec2 r = vec2(fbm(uv*2.0+1.7*q+vec2(1.7,9.2)+0.13*uTime),
                  fbm(uv*2.0+1.7*q+vec2(8.3,2.8)-0.11*uTime));
    float f = fbm(uv*1.8+1.8*r+uTime*0.014);

    vec3 col = mix(vec3(0.0), vec3(0.20,0.11,0.03), clamp(f*f*4.5,0.0,1.0));
    col = mix(col, vec3(0.10,0.06,0.24), clamp(length(q)*0.5,0.0,1.0));
    col += vec3(0.09,0.05,0.01) * clamp(f*3.0,0.0,1.0);

    vec2 vig = uv*(1.0-uv);
    col *= pow(vig.x*vig.y*16.0, 0.32);

    gl_FragColor = vec4(col, 1.0);
  }
`

interface Props {
  className?: string
  style?: React.CSSProperties
}

export function HeroShader({ className = '', style }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    // setSize with updateStyle=true so Three.js writes pixel dimensions as inline styles,
    // overriding any attribute-based collapse. setTimeout ensures parent is fully painted.
    const setSize = () => {
      const w = canvas.parentElement?.offsetWidth || document.documentElement.clientWidth
      const h = canvas.parentElement?.offsetHeight || document.documentElement.clientHeight
      if (w && h) renderer.setSize(w, h)
    }
    const initRaf = requestAnimationFrame(() => setTimeout(setSize, 0))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const uniforms = {
      uTime:  { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }
    scene.add(new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ uniforms, vertexShader: VERT, fragmentShader: FRAG })
    ))

    let tMx = 0.5, tMy = 0.5, cMx = 0.5, cMy = 0.5
    const onMouse = (e: MouseEvent) => {
      tMx = e.clientX / window.innerWidth
      tMy = 1 - e.clientY / window.innerHeight
    }
    window.addEventListener('mousemove', onMouse)
    window.addEventListener('resize', setSize)

    let prev = 0, rid = 0
    const tick = (now: number) => {
      rid = requestAnimationFrame(tick)
      uniforms.uTime.value += Math.min((now - prev) / 1000, 0.05)
      prev = now
      cMx += (tMx - cMx) * 0.04; cMy += (tMy - cMy) * 0.04
      uniforms.uMouse.value.set(cMx, cMy)
      renderer.render(scene, camera)
    }
    requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(initRaf)
      cancelAnimationFrame(rid)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('resize', setSize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} className={className} style={style} />
}
