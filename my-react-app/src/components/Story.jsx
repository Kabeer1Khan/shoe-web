import { useEffect, useRef, useState } from 'react'
import storyImg from '../assets/fourth_sec/shoe_img.webp'

/* ------------------------------------------------------------------ */
/*  EDIT THE CONTENT HERE                                              */
/* ------------------------------------------------------------------ */
const CONTENT = {
  label: 'OUR STORY',
  titleTop: 'BUILT FOR',
  titleBottom: 'THE NEXT',
  text: "The Jordan Jumpman 2021 PF is more than a shoe \u2014 it's a mindset. Designed for dreamers, built for athletes, and made for the next generation of greatness.",
  button: 'LEARN MORE',
}

/* ---------- reveal helpers ---------- */
const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]'

function R({ show, delay = 0, from = 'y', className = '', children }) {
  const hidden = { y: 'translate-y-10', x: '-translate-x-10', r: 'translate-x-10' }[from]
  return (
    <div
      className={`transition-all duration-[900ms] ${EASE} ${
        show ? 'translate-x-0 translate-y-0 opacity-100' : `${hidden} opacity-0`
      } ${className}`}
      style={{ transitionDelay: show ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

function Line({ show, delay = 0, children }) {
  return (
    <span className="block overflow-hidden pb-1">
      <span
        className={`block transition-transform duration-[1100ms] ${EASE}`}
        style={{
          transform: show ? 'translateY(0)' : 'translateY(110%)',
          transitionDelay: show ? `${delay}ms` : '0ms',
        }}
      >
        {children}
      </span>
    </span>
  )
}

/* ================================================================== */
export default function Story() {
  const sectionRef = useRef(null)
  const scrollRef = useRef(null)
  const moveRef = useRef(null)
  const [seen, setSeen] = useState(false)

  /* play the entry animation every time the section comes into view */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -18% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* scroll-linked parallax on the photo */
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      const p = scrollRef.current
      if (!el || !p) return
      const t = Math.max(-1, Math.min(1, el.getBoundingClientRect().top / window.innerHeight))
      p.style.transform = `translate3d(0, ${t * -26}px, 0) scale(1.12)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  /* mouse parallax on the photo */
  const onMove = (e) => {
    if (!moveRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    moveRef.current.style.transform = `translate3d(${x * -26}px, ${y * -16}px, 0)`
  }
  const onLeave = () => {
    if (moveRef.current) moveRef.current.style.transform = 'translate3d(0,0,0)'
  }

  return (
    <section ref={sectionRef} className="story-sec">
      {/* glow orbs */}
      <div className="orb pointer-events-none absolute right-1/4 top-0 h-72 w-72 rounded-full bg-[#ff8a1f]/10 blur-3xl" />
      <div className="orb pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#c4621a]/10 blur-3xl" style={{ animationDelay: '-5s' }} />

      <div className="story-grid relative">
        {/* ---------------- left: photo ---------------- */}
        <div className="story-media" onMouseMove={onMove} onMouseLeave={onLeave}>
          {/* entry layer */}
          <div
            className="absolute inset-0 transition-all duration-[1600ms] ease-[cubic-bezier(.22,1,.36,1)]"
            style={{
              opacity: seen ? 1 : 0,
              clipPath: seen ? 'inset(0 0 0 0)' : 'inset(0 100% 0 0)',
              transform: seen ? 'scale(1)' : 'scale(1.25)',
              transitionDelay: seen ? '100ms' : '0ms',
            }}
          >
            {/* scroll parallax layer */}
            <div ref={scrollRef} className="absolute inset-0 will-change-transform">
              {/* mouse parallax layer */}
              <div
                ref={moveRef}
                className="absolute inset-0"
                style={{ transition: 'transform 0.7s cubic-bezier(.22,1,.36,1)' }}
              >
                <img src={storyImg} alt="Jordan Jumpman 2021 PF" draggable={false} className="story-img" />
              </div>
            </div>
            <div className="story-sheen" />
          </div>
        </div>

        {/* ---------------- middle: text ---------------- */}
        <div className="story-body">
          <R show={seen} delay={500} from="x">
            <p className="mb-4 font-wide text-[10px] font-bold tracking-[0.35em] text-[#d9a06a]">{CONTENT.label}</p>
          </R>

          <h2 className="font-wide text-[clamp(1.5rem,2.7vw,2.5rem)] font-bold leading-[1.15] tracking-wide">
            <Line show={seen} delay={600}>{CONTENT.titleTop}</Line>
            <Line show={seen} delay={730}>{CONTENT.titleBottom}</Line>
          </h2>

          <R show={seen} delay={950} className="mt-6">
            <p className="story-text text-[13px] leading-relaxed text-white/75">{CONTENT.text}</p>
          </R>

          <R show={seen} delay={1150} className="mt-8">
            <button className="group relative inline-flex items-center gap-4 overflow-hidden border border-white/70 px-7 py-4 font-wide text-[10px] font-bold tracking-[0.2em] transition-transform duration-300 hover:-translate-y-0.5 active:scale-95">
              <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
              <span className="relative transition-colors duration-300 group-hover:text-black">{CONTENT.button}</span>
              <svg
                viewBox="0 0 24 24"
                className="relative h-4 w-4 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 12h16" />
                <path d="m14 6 6 6-6 6" />
              </svg>
            </button>
          </R>
        </div>

        {/* ---------------- right: brand logos ---------------- */}
        <div className="story-logos">
          {/* vertical divider (grows down) */}
          <span className="story-rule" style={{ transform: seen ? 'scaleY(1)' : 'scaleY(0)', transitionDelay: seen ? '900ms' : '0ms' }} />

          {/* Replace these text wordmarks with your own logo images: <img src={...} className="h-14 ..." /> */}
          <R show={seen} delay={1100} from="r">
            <div className="cursor-pointer text-center transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_14px_rgba(255,197,138,0.55)]">
              <p className="font-wide text-lg font-bold tracking-[0.18em]">JORDAN</p>
            </div>
          </R>
          <R show={seen} delay={1300} from="r">
            <div className="cursor-pointer text-center transition-all duration-500 hover:scale-110 hover:drop-shadow-[0_0_14px_rgba(255,197,138,0.55)]">
              <p className="font-wide text-lg font-bold tracking-[0.18em]">NIKE</p>
            </div>
          </R>
        </div>
      </div>
    </section>
  )
}