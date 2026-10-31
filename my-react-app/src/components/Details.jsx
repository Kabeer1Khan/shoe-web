import { useEffect, useRef, useState } from 'react'
import shoeImg from '../assets/second_sec/second_sec_shoe.png'

/* ------------------------------------------------------------------ */
/*  EDIT THE CONTENT HERE                                              */
/* ------------------------------------------------------------------ */
const CONTENT = {
  label: 'THE NEW SERIES',
  titleTop: 'JORDAN',
  titleBottom: 'JUMPMAN 2021 PF',
  text: 'A new chapter in performance. The Jordan Jumpman 2021 PF combines cutting-edge technology with iconic style, designed for players who never stop.',
  button: 'EXPLORE THE SERIES',
  script: 'Jumpman',
}

const Icon = ({ children }) => (
  <svg viewBox="0 0 24 24" className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const FEATURES = [
  {
    lines: ['LIGHTWEIGHT', 'COMFORT'],
    icon: (
      <Icon>
        <path d="M5 19C5 10 10 5 20 5c0 10-5 15-14 15" />
        <path d="M5 19 14 10" />
      </Icon>
    ),
  },
  {
    lines: ['RESPONSIVE', 'CUSHIONING'],
    icon: (
      <Icon>
        <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
        <path d="m3 12 9 4.5 9-4.5" />
        <path d="m3 16.5 9 4.5 9-4.5" />
      </Icon>
    ),
  },
  {
    lines: ['BREATHABLE', 'MATERIAL'],
    icon: (
      <Icon>
        <path d="M3 8h11a3 3 0 1 0-3-3" />
        <path d="M3 12h15a3 3 0 1 1-3 3" />
        <path d="M3 16h7" />
      </Icon>
    ),
  },
  {
    lines: ['DURABLE', 'OUTSOLE'],
    icon: (
      <Icon>
        <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" />
        <path d="m9 12 2 2 4-4" />
      </Icon>
    ),
  },
]

/* ---------- reveal helpers ---------- */
const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]'

function R({ show, delay = 0, from = 'y', className = '', children }) {
  const hidden = { y: 'translate-y-10', x: '-translate-x-10', r: 'translate-x-16' }[from]
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
export default function Details() {
  const sectionRef = useRef(null)
  const parRef = useRef(null)
  const tiltRef = useRef(null)
  const [seen, setSeen] = useState(false)

  /* play the entry animation when the section starts sliding in (works on any screen height) */
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -22% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  /* scroll-linked parallax on the shoe */
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = sectionRef.current
      const p = parRef.current
      if (!el || !p) return
      const t = Math.max(-1, Math.min(1, el.getBoundingClientRect().top / window.innerHeight))
      const k = window.innerWidth < 1024 ? 0.35 : 1 // gentler on small screens
      p.style.transform = `translate3d(${t * 90 * k}px, ${t * -30 * k}px, 0) rotate(${t * -5 * k}deg)`
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

  /* mouse tilt on the shoe */
  const onMove = (e) => {
    if (!tiltRef.current) return
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    tiltRef.current.style.transform = `perspective(1200px) rotateY(${x * 14}deg) rotateX(${-y * 10}deg) scale(1.04)`
  }
  const onLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0) scale(1)'
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100svh] overflow-hidden bg-[radial-gradient(circle_at_72%_50%,#4a2410_0%,#2a1208_45%,#150803_100%)] text-white"
    >
      {/* glowing background orbs */}
      <div className="orb pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#ff8a1f]/10 blur-3xl" />
      <div className="orb pointer-events-none absolute bottom-0 right-1/3 h-80 w-80 rounded-full bg-[#c4621a]/10 blur-3xl" style={{ animationDelay: '-4s' }} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.5)_100%)]" />

      <div className="relative mx-auto grid min-h-[100svh] max-w-[1500px] items-center gap-8 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4 lg:px-[6%] lg:py-10">
        {/* ---------------- left: text ---------------- */}
        <div className="relative z-20">
          <R show={seen} delay={100} from="x">
            <p className="mb-4 font-wide text-[10px] font-bold tracking-[0.35em] text-[#d9a06a] sm:mb-5">{CONTENT.label}</p>
          </R>

          <h2 className="whitespace-nowrap font-wide text-[clamp(1.15rem,2.4vw,2.2rem)] font-bold leading-[1.15] tracking-wide">
            <Line show={seen} delay={200}>{CONTENT.titleTop}</Line>
            <Line show={seen} delay={330}>{CONTENT.titleBottom}</Line>
          </h2>

          <span
            className="mt-5 block h-px bg-[#d9a06a] transition-all duration-[1200ms] ease-out"
            style={{ width: seen ? 56 : 0, transitionDelay: seen ? '600ms' : '0ms' }}
          />

          <R show={seen} delay={650} className="mt-6 sm:mt-7">
            <p className="max-w-[430px] text-[13px] leading-relaxed text-white/75">{CONTENT.text}</p>
          </R>

          {/* features */}
          <div className="mt-8 grid max-w-[440px] grid-cols-2 gap-x-8 gap-y-7 sm:mt-10 sm:gap-y-8">
            {FEATURES.map((f, i) => (
              <div key={f.lines[0]} className="contents">
                {i === 2 && (
                  <span
                    className="col-span-2 block h-px bg-white/20 transition-all duration-[1200ms] ease-out"
                    style={{ width: seen ? 56 : 0, transitionDelay: seen ? '1000ms' : '0ms' }}
                  />
                )}
                <R show={seen} delay={800 + i * 120}>
                  <div className="group cursor-pointer transition-transform duration-500 hover:-translate-y-1.5">
                    <div className="mb-3 h-7 w-7 text-[#e2b98f] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-125 group-hover:text-[#ffb15e] sm:mb-4 sm:h-8 sm:w-8">
                      {f.icon}
                    </div>
                    <p className="font-wide text-[10px] font-bold leading-relaxed tracking-[0.2em] text-white/90 transition-colors duration-300 group-hover:text-[#ffc58a]">
                      {f.lines[0]}
                      <br />
                      {f.lines[1]}
                    </p>
                  </div>
                </R>
              </div>
            ))}
          </div>

          <R show={seen} delay={1350} className="mt-9 sm:mt-10">
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

        {/* ---------------- right: shoe ---------------- */}
        <div
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="relative h-[300px] sm:h-[420px] lg:h-[72vh] lg:max-h-[700px]"
        >
          {/* dark circle behind the shoe */}
          <div className="absolute left-1/2 top-1/2 aspect-square h-[92%] -translate-x-1/2 -translate-y-1/2">
            <div
              className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.28)_65%,rgba(0,0,0,0.05)_100%)] ring-1 ring-white/5 transition-all duration-[1500ms] ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                transform: seen ? 'scale(1)' : 'scale(0.4)',
                opacity: seen ? 1 : 0,
                transitionDelay: seen ? '200ms' : '0ms',
              }}
            />
          </div>

          {/* scroll parallax layer */}
          <div ref={parRef} className="absolute inset-0 will-change-transform">
            {/* entry layer */}
            <div
              className="absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(.22,1,.36,1)]"
              style={{
                opacity: seen ? 1 : 0,
                filter: seen ? 'blur(0px)' : 'blur(12px)',
                transform: seen ? 'none' : 'translateX(30%) scale(0.7) rotate(12deg)',
                transitionDelay: seen ? '300ms' : '0ms',
              }}
            >
              {/* mouse tilt layer */}
              <div ref={tiltRef} className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out">
                <div className="float flex h-full w-full items-center justify-center">
                  {/* shoe size: change h-[80%] w-[88%] to make it bigger / smaller */}
                  <img
                    src={shoeImg}
                    alt={CONTENT.titleBottom}
                    draggable={false}
                    className="h-[80%] w-[88%] object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* script signature (top-right, away from the shoe) */}
          <div className="absolute right-1 top-1 z-20 sm:right-4 lg:right-0 lg:top-[4%]">
            <R show={seen} delay={1200} from="r">
              <div className="cursor-default transition-transform duration-500 hover:scale-110">
                <p className="-rotate-6 font-script text-3xl text-[#e2b98f] sm:text-4xl lg:text-5xl">{CONTENT.script}</p>
              </div>
            </R>
          </div>
        </div>
      </div>
    </section>
  )
}