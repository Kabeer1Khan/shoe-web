import { useEffect, useRef, useState } from 'react'
import img1 from '../assets/fifth_sec/img_1.webp'
import img2 from '../assets/fifth_sec/img_2.webp'
import img3 from '../assets/fifth_sec/img_3.webp'
import img4 from '../assets/fifth_sec/img_4.webp'

/* ------------------------------------------------------------------ */
/*  EDIT THE CONTENT HERE                                              */
/* ------------------------------------------------------------------ */
const STATS = [
  { to: 10, suffix: '+', dec: 0, label: 'YEARS OF INNOVATION' },
  { to: 50, suffix: 'M+', dec: 0, label: 'GLOBAL ATHLETES' },
  { to: 100, suffix: '%', dec: 0, label: 'PREMIUM QUALITY' },
  { to: 4.9, suffix: '/5', dec: 1, label: 'CUSTOMER RATING' },
]

const BTS = {
  label: 'BEHIND THE SCENES',
  titleTop: 'THE MAKING OF',
  titleBottom: 'A LEGEND',
  text: 'From concept to court, see how the Jordan Jumpman 2021 PF comes to life \u2014 a perfect blend of design, technology and athlete feedback.',
  button: 'WATCH FULL STORY',
}

const CARDS = [
  { img: img1, play: true, cap: 'THE FEEL' },
  { img: img2, play: false, cap: 'THE CRAFT' },
  { img: img3, play: true, cap: 'THE SKETCH' },
  { img: img4, play: false, cap: 'THE DETAIL' },
]

const NEWS = {
  label: 'STAY IN THE LOOP',
  title: 'GET EXCLUSIVE UPDATES',
  placeholder: 'Enter your email address',
  text: 'Be the first to know about new drops, special offers and more.',
}

const NAV = ['Home', 'Man', 'Woman', 'Kids', 'Sale']
const LEGAL = ['Privacy Policy', 'Terms', 'Contact']

/* ---------- helpers ---------- */
const EASE = 'ease-[cubic-bezier(.22,1,.36,1)]'

/* true while the element is on screen -> entry animation replays every time */
function useSeen(margin = '0px 0px -15% 0px') {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0, rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [margin])
  return [ref, seen]
}

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

/* counts from 0 up to the number whenever `run` becomes true */
function Count({ to, suffix, dec, run, delay = 0 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) {
      setV(0)
      return
    }
    let raf = 0
    const t0 = performance.now()
    const D = 1800
    const tick = (now) => {
      const t = Math.max(0, Math.min(1, (now - t0 - delay) / D))
      setV(to * (1 - Math.pow(1 - t, 4)))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to, delay])
  return (
    <>
      {v.toFixed(dec)}
      {suffix}
    </>
  )
}

const Arrow = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 12h16" />
    <path d="m14 6 6 6-6 6" />
  </svg>
)

const Social = ({ label, children }) => (
  <a
    href="#"
    aria-label={label}
    className="text-white/80 transition-all duration-300 hover:-translate-y-1 hover:scale-125 hover:text-[#ffc58a]"
  >
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  </a>
)

/* ================================================================== */
export default function Finale() {
  const rootRef = useRef(null)
  const [statsRef, statsSeen] = useSeen('0px 0px -10% 0px')
  const [btsRef, btsSeen] = useSeen('0px 0px -15% 0px')
  const [newsRef, newsSeen] = useSeen('0px 0px -12% 0px')
  const [footRef, footSeen] = useSeen('0px 0px 0px 0px')

  const [lb, setLb] = useState({ open: false, i: 0 })
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  /* scroll-linked parallax value (-1..1) shared with the CSS */
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const el = rootRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const t = (window.innerHeight / 2 - (r.top + r.height / 2)) / (r.height / 2 + window.innerHeight / 2)
      el.style.setProperty('--p', String(Math.max(-1, Math.min(1, t))))
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

  /* close lightbox with Esc */
  useEffect(() => {
    if (!lb.open) return
    const onKey = (e) => e.key === 'Escape' && setLb((p) => ({ ...p, open: false }))
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lb.open])

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
    setEmail('')
    setTimeout(() => setDone(false), 3500)
  }

  return (
    <div ref={rootRef} className="fin">
      {/* ====================== STATS ====================== */}
      <div className="fin-wrap">
        <div ref={statsRef} className="fin-stats" data-seen={statsSeen}>
          {STATS.map((s, i) => (
            <div key={s.label} className="fin-stat">
              <R show={statsSeen} delay={i * 150}>
                <div className="group cursor-default transition-transform duration-500 hover:-translate-y-1.5">
                  <p className="font-wide text-[clamp(1.5rem,2.4vw,2.2rem)] font-bold leading-none transition-colors duration-300 group-hover:text-[#ffc58a]">
                    <Count to={s.to} suffix={s.suffix} dec={s.dec} run={statsSeen} delay={i * 150} />
                  </p>
                  <p className="mt-3 font-wide text-[8px] font-bold tracking-[0.2em] text-white/70 transition-colors duration-300 group-hover:text-white sm:text-[9px]">
                    {s.label}
                  </p>
                </div>
              </R>
            </div>
          ))}
        </div>
      </div>

      {/* ====================== BEHIND THE SCENES ====================== */}
      <div className="fin-bts">
        <div ref={btsRef} className="fin-wrap">
          <div className="fin-head">
            <div>
              <R show={btsSeen} delay={100} from="x">
                <p className="mb-4 font-wide text-[10px] font-bold tracking-[0.35em] text-[#d9a06a]">{BTS.label}</p>
              </R>
              <h2 className="font-wide text-[clamp(1.5rem,2.7vw,2.5rem)] font-bold leading-[1.15] tracking-wide">
                <Line show={btsSeen} delay={200}>{BTS.titleTop}</Line>
                <Line show={btsSeen} delay={330}>{BTS.titleBottom}</Line>
              </h2>
            </div>

            <R show={btsSeen} delay={500}>
              <p className="fin-head-text text-[13px] leading-relaxed text-white/75">{BTS.text}</p>
            </R>

            <R show={btsSeen} delay={650} from="r">
              <button className="group relative inline-flex items-center gap-4 overflow-hidden border border-white/70 px-7 py-4 font-wide text-[10px] font-bold tracking-[0.2em] transition-transform duration-300 hover:-translate-y-0.5 active:scale-95">
                <span className="absolute inset-0 origin-left scale-x-0 bg-white transition-transform duration-500 ease-out group-hover:scale-x-100" />
                <span className="relative whitespace-nowrap transition-colors duration-300 group-hover:text-black">{BTS.button}</span>
                <Arrow className="relative h-4 w-4 transition-all duration-300 group-hover:translate-x-1.5 group-hover:text-black" />
              </button>
            </R>
          </div>

          <div className="fin-cards">
            {CARDS.map((c, i) => (
              <div
                key={i}
                className={`transition-all duration-[1100ms] ${EASE}`}
                style={{
                  opacity: btsSeen ? 1 : 0,
                  transform: btsSeen ? 'none' : 'translateY(60px) scale(0.92)',
                  filter: btsSeen ? 'blur(0px)' : 'blur(10px)',
                  transitionDelay: btsSeen ? `${500 + i * 140}ms` : '0ms',
                }}
              >
                <button
                  className="fin-card"
                  aria-label={c.play ? `Play video: ${c.cap}` : `View image: ${c.cap}`}
                  onClick={() => setLb({ open: true, i })}
                >
                  <div className="fin-par">
                    <img src={c.img} alt="" draggable={false} />
                  </div>
                  <div className="fin-shade" />
                  {c.play && (
                    <span className="fin-play">
                      <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                  )}
                  <span className="fin-cap">{c.cap}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ====================== NEWSLETTER ====================== */}
      <div className="fin-wrap" style={{ paddingTop: '2.5rem' }}>
        <div
          ref={newsRef}
          className={`fin-news transition-all duration-[1200ms] ${EASE}`}
          style={{
            opacity: newsSeen ? 1 : 0,
            transform: newsSeen ? 'none' : 'translateY(60px) scale(0.97)',
          }}
        >
          <img className="fin-newsbg" src={img4} alt="" draggable={false} />

          <div>
            <R show={newsSeen} delay={300} from="x">
              <p className="mb-2 font-wide text-[9px] font-bold tracking-[0.3em] text-[#d9a06a]">{NEWS.label}</p>
            </R>
            <h3 className="font-wide text-[clamp(1.1rem,2vw,1.7rem)] font-bold leading-tight tracking-wide">
              <Line show={newsSeen} delay={400}>{NEWS.title}</Line>
            </h3>
          </div>

          <R show={newsSeen} delay={600}>
            <form onSubmit={submit} className="fin-form">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={done ? 'Thanks! You are subscribed.' : NEWS.placeholder}
                aria-label="Email address"
              />
              <button type="submit" aria-label="Subscribe" className="group">
                {done ? (
                  <svg viewBox="0 0 24 24" className="pop h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                ) : (
                  <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                )}
              </button>
            </form>
          </R>

          <R show={newsSeen} delay={800} from="r">
            <p className="max-w-[220px] text-[11px] leading-relaxed text-white/70">{NEWS.text}</p>
          </R>
        </div>
      </div>

      {/* ====================== FOOTER ====================== */}
      <footer ref={footRef} className="fin-wrap">
        <div className="fin-foot">
          {/* Replace these text wordmarks with your own logo images */}
          <R show={footSeen} delay={100} from="x">
            <div className="group flex cursor-pointer items-center gap-4">
              <span className="font-wide text-sm font-bold tracking-[0.15em] transition-colors duration-300 group-hover:text-[#ffc58a]">JORDAN</span>
              <span className="h-8 w-px bg-white/30" />
              <span className="font-wide text-sm font-bold tracking-[0.15em] transition-colors duration-300 group-hover:text-[#ffc58a]">NIKE</span>
            </div>
          </R>

          <nav className="fin-nav">
            {NAV.map((n, i) => (
              <R key={n} show={footSeen} delay={200 + i * 90}>
                <a
                  href="#"
                  className="relative font-wide text-[10px] font-bold tracking-[0.12em] transition-colors duration-300 hover:text-[#ffc58a] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[#ffc58a] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {n}
                </a>
              </R>
            ))}
          </nav>

          <R show={footSeen} delay={450} from="r">
            <div className="fin-social">
              <Social label="Instagram">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" />
              </Social>
              <Social label="Facebook">
                <path d="M14 8h2.5V4.5H14A3.5 3.5 0 0 0 10.5 8v2H8v3.5h2.5V21H14v-7.5h2.5L17 10h-3V8.5c0-.3.2-.5.5-.5z" />
              </Social>
              <Social label="X">
                <path d="M4 4l16 16" />
                <path d="M20 4 4 20" />
              </Social>
              <Social label="YouTube">
                <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                <path d="m10 9.5 5 2.5-5 2.5z" fill="currentColor" />
              </Social>
            </div>
          </R>
        </div>

        <div className="fin-bottom">
          <R show={footSeen} delay={600}>
            <p className="text-[9px] text-white/60">&copy; {new Date().getFullYear()} Jordan Brand. All rights reserved.</p>
          </R>
          <R show={footSeen} delay={700}>
            <div className="fin-legal">
              {LEGAL.map((l) => (
                <a key={l} href="#" className="text-[9px] text-white/70 transition-colors duration-300 hover:text-[#ffc58a]">
                  {l}
                </a>
              ))}
            </div>
          </R>
        </div>
      </footer>

      {/* ====================== LIGHTBOX ====================== */}
      <div
        className="fin-lb"
        data-open={lb.open}
        onClick={() => setLb((p) => ({ ...p, open: false }))}
        role="dialog"
        aria-hidden={!lb.open}
      >
        <button
          aria-label="Close"
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/40 transition-all duration-300 hover:rotate-90 hover:bg-white hover:text-black"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6 6 18" />
          </svg>
        </button>
        <img src={CARDS[lb.i].img} alt="" draggable={false} onClick={(e) => e.stopPropagation()} />
      </div>
    </div>
  )
}