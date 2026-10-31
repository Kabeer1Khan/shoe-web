import { useEffect, useRef, useState } from 'react'
import shoe1 from '../assets/hero_imgs/shoe1.png'
import shoe2 from '../assets/hero_imgs/shoe2.png'
import shoe3 from '../assets/hero_imgs/shoe3.png'
import shoe4 from '../assets/hero_imgs/shoe4.webp'

/* ------------------------------------------------------------------ */
/*  EDIT THE CONTENT HERE                                              */
/* ------------------------------------------------------------------ */
const CONTENT = {
  label: 'THE COLLECTION',
  titleTop: 'MORE COLORS',
  titleBottom: 'MORE VIBES',
  text: 'Same performance. Different expressions. Explore the full collection and find your perfect pair.',
  button: 'VIEW ALL COLORS',
}

const COLORS = [
  { img: shoe1, name: 'ORIGINAL', sub: 'Cream / Brown', accent: '#f3e3cb', glow: 'rgba(243,227,203,0.28)' },
  { img: shoe2, name: 'PURPLE', sub: 'Violet / White', accent: '#b84cf5', glow: 'rgba(184,76,245,0.30)' },
  { img: shoe3, name: 'GREEN', sub: 'Emerald / White', accent: '#35d884', glow: 'rgba(53,216,132,0.28)' },
  { img: shoe4, name: 'RED', sub: 'Crimson / White', accent: '#ff6a55', glow: 'rgba(255,106,85,0.30)' },
]

/* ---------- reveal helpers ---------- */
const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]'

function R({ show, delay = 0, from = 'y', className = '', children }) {
  const hidden = { y: 'translate-y-10', x: '-translate-x-10' }[from]
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

/* ---------- one colour card ---------- */
function Card({ c, i, show, active, onSelect }) {
  const ref = useRef(null)

  const onMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--mx', `${x * 100}%`)
    el.style.setProperty('--my', `${y * 100}%`)
    el.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${-(y - 0.5) * 14}deg) translateY(-10px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    /* entry layer */
    <div
      className={`col-card transition-all duration-[1100ms] ${EASE}`}
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'none' : 'translateY(70px) scale(0.9)',
        filter: show ? 'blur(0px)' : 'blur(10px)',
        transitionDelay: show ? `${350 + i * 150}ms` : '0ms',
      }}
    >
      {/* hover / tilt layer */}
      <button
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        onClick={onSelect}
        aria-label={`${c.name} - ${c.sub}`}
        className={`col-btn group relative flex h-full w-full flex-col items-center rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] px-2 pb-4 pt-3 outline-none backdrop-blur-sm transition-transform duration-300 ease-out will-change-transform sm:pb-5 ${
          active ? 'is-active -translate-y-2' : ''
        }`}
      >
        {/* mouse spotlight */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `radial-gradient(circle at var(--mx,50%) var(--my,40%), ${c.glow}, transparent 62%)` }}
          />
        </div>

        {/* glowing border + outer glow (hover / selected) */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-2xl border transition-opacity duration-500 ${
            active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
          style={{ borderColor: c.accent, boxShadow: `0 20px 50px -12px ${c.glow}, inset 0 0 22px ${c.glow}` }}
        />

        {/* shoe */}
        <div className="relative flex w-full flex-1 items-center justify-center">
          <div className="absolute bottom-[14%] left-1/2 h-4 w-[70%] -translate-x-1/2 rounded-full bg-black/60 blur-lg transition-all duration-500 group-hover:w-[55%] group-hover:opacity-60" />
          <div className="float flex w-full items-center justify-center" style={{ animationDelay: `${-i * 1.2}s` }}>
            <img
              src={c.img}
              alt=""
              draggable={false}
              className="col-shoe drop-shadow-[0_18px_18px_rgba(0,0,0,0.5)]"
            />
          </div>
        </div>

        {/* colour dot */}
        <span className="relative mb-3 mt-1 flex h-2 w-2 sm:mb-4">
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:animate-ping group-hover:opacity-70"
            style={{ background: c.accent }}
          />
          <span
            className="relative h-2 w-2 rounded-full transition-transform duration-300 group-hover:scale-150"
            style={{ background: c.accent, boxShadow: `0 0 10px ${c.accent}` }}
          />
        </span>

        {/* text */}
        <p
          className="font-wide text-[10px] font-bold tracking-[0.2em] transition-colors duration-300 sm:text-xs"
          style={{ color: active ? c.accent : undefined }}
        >
          {c.name}
        </p>
        <p className="mt-1.5 text-[10px] text-white/70 transition-all duration-500 group-hover:tracking-wider group-hover:text-white sm:text-[11px]">
          {c.sub}
        </p>
      </button>
    </div>
  )
}

/* ================================================================== */
export default function Collection() {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  const [active, setActive] = useState(0)

  /* play the entry animation every time the section comes into view */
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), {
      threshold: 0,
      rootMargin: '0px 0px -18% 0px',
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className="relative flex min-h-[80svh] items-center overflow-hidden bg-[linear-gradient(180deg,#150803_0%,#2b1409_50%,#1a0b04_100%)] text-white"
    >
      {/* soft vertical stripes + glow orbs */}
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.018)_0px,rgba(255,255,255,0.018)_1px,transparent_1px,transparent_7px)]" />
      <div className="orb pointer-events-none absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-[#ff8a1f]/10 blur-3xl" />
      <div className="orb pointer-events-none absolute right-10 top-0 h-80 w-80 rounded-full bg-[#c4621a]/10 blur-3xl" style={{ animationDelay: '-5s' }} />

      <div className="col-wrap relative">
        {/* ---------------- left: text ---------------- */}
        <div>
          <R show={seen} delay={100} from="x">
            <p className="mb-4 font-wide text-[10px] font-bold tracking-[0.35em] text-[#d9a06a]">{CONTENT.label}</p>
          </R>

          <h2 className="font-wide text-[clamp(1.4rem,2.6vw,2.4rem)] font-bold leading-[1.15] tracking-wide">
            <Line show={seen} delay={200}>{CONTENT.titleTop}</Line>
            <Line show={seen} delay={330}>{CONTENT.titleBottom}</Line>
          </h2>

          <span
            className="mt-5 block h-px bg-[#d9a06a] transition-all duration-[1200ms] ease-out"
            style={{ width: seen ? 56 : 0, transitionDelay: seen ? '600ms' : '0ms' }}
          />

          <R show={seen} delay={600} className="mt-6">
            <p className="col-desc text-[13px] leading-relaxed text-white/75">{CONTENT.text}</p>
          </R>

          <R show={seen} delay={800} className="mt-8">
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

        {/* ---------------- right: cards ---------------- */}
        <div className="col-cards">
          {COLORS.map((c, i) => (
            <Card key={c.name} c={c} i={i} show={seen} active={active === i} onSelect={() => setActive(i)} />
          ))}
        </div>
      </div>
    </section>
  )
}