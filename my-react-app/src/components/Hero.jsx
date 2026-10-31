import { useCallback, useEffect, useRef, useState } from 'react'
import shoe1 from '../assets/hero_imgs/shoe1.png'
import shoe2 from '../assets/hero_imgs/shoe2.png'
import shoe3 from '../assets/hero_imgs/shoe3.png'
import shoe4 from '../assets/hero_imgs/shoe4.webp'

/* ------------------------------------------------------------------ */
/*  EDIT YOUR SHOE CONTENT + BACKGROUND COLOURS HERE                   */
/* ------------------------------------------------------------------ */
const SHOES = [
  {
    img: shoe1,
    word: 'SNEAKER',
    price: '134$',
    brand: 'JORDAN',
    model: 'JUMPMAN 2021 PF',
    title: 'INSPIRATION',
    text: 'Inspired by the design of the latest Air Jordan game shoe, the Jordan Jumpman 2021 helps up-and-coming players level up their game.',
    bg: 'radial-gradient(circle at 50% 42%, #6b3516 0%, #3d1c0b 50%, #1f0d05 100%)',
  },
  {
    img: shoe2,
    word: 'JUMPMAN',
    price: '149$',
    brand: 'JORDAN',
    model: 'AIR ZENITH 2022',
    title: 'PERFORMANCE',
    text: 'Built for explosive first steps and fast cuts, the Air Zenith pairs a responsive cushioned sole with a lockdown fit for every court.',
    bg: 'radial-gradient(circle at 50% 42%, #24407a 0%, #14254a 50%, #070e22 100%)',
  },
  {
    img: shoe3,
    word: 'STREET',
    price: '159$',
    brand: 'JORDAN',
    model: 'RETRO FLIGHT 2023',
    title: 'HERITAGE',
    text: 'A modern take on a classic silhouette. Premium materials and a bold sculpted midsole make it equally at home on the court or the street.',
    bg: 'radial-gradient(circle at 50% 42%, #1f6a45 0%, #123d29 50%, #06160f 100%)',
  },
  {
    img: shoe4,
    word: 'LEGEND',
    price: '119$',
    brand: 'JORDAN',
    model: 'NEO STRIDE 2024',
    title: 'EVERYDAY WEAR',
    text: 'Lightweight, breathable and all-day comfortable. The Neo Stride brings athletic energy to your daily rotation without compromising style.',
    bg: 'radial-gradient(circle at 50% 42%, #7a2336 0%, #471322 50%, #1c050c 100%)',
  },
]

const NAV = ['HOME', 'MAN', 'WOMAN', 'KIDS', 'SALE']
const N = SHOES.length
const SCROLL_MS = 1200 // speed of the section-to-section scroll (higher = slower)

/* ---------- positions: active / exited-left / waiting-right ---------- */
const SHOE_POS = {
  active: { transform: 'translate(-50%,-50%) translateX(0vw) scale(1) rotate(0deg)', opacity: 1 },
  left:   { transform: 'translate(-50%,-50%) translateX(-65vw) scale(0.5) rotate(-14deg)', opacity: 0 },
  right:  { transform: 'translate(-50%,-50%) translateX(65vw) scale(0.5) rotate(14deg)', opacity: 0 },
}
const WORD_POS = {
  active: { transform: 'translate(-50%,-50%) translateX(0vw)', opacity: 1 },
  left:   { transform: 'translate(-50%,-50%) translateX(-35vw)', opacity: 0 },
  right:  { transform: 'translate(-50%,-50%) translateX(35vw)', opacity: 0 },
}

/* ---------- helpers ---------- */
const metrics = (el) => ({
  unit: el.offsetHeight / N, // height of one step
  top: el.getBoundingClientRect().top + window.scrollY,
})
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function Reveal({ state, delay = 0, className = '', children }) {
  const hidden = state !== 'active'
  const x = state === 'left' ? -40 : state === 'right' ? 40 : 0
  const d = hidden ? 0 : delay
  return (
    <div
      className={className}
      style={{
        opacity: hidden ? 0 : 1,
        transform: `translateX(${x}px)`,
        transition: `transform .8s cubic-bezier(.22,1,.36,1) ${d}ms, opacity .6s ease ${d}ms`,
      }}
    >
      {children}
    </div>
  )
}

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </svg>
)
const CartIcon = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 4h2l2.4 11.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 8H6.2" />
    <circle cx="9.5" cy="20" r="1.2" />
    <circle cx="17" cy="20" r="1.2" />
  </svg>
)
const UserIcon = () => (
  <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4.2a3.3 3.3 0 1 1 0 6.6 3.3 3.3 0 0 1 0-6.6Zm0 13.1a8 8 0 0 1-6-2.7c.1-2 4-3.1 6-3.1s5.9 1.1 6 3.1a8 8 0 0 1-6 2.7Z" />
  </svg>
)

/* ================================================================== */
export default function Hero() {
  const [s, setS] = useState({ cur: 0, prev: null, dir: 1 })
  const [cart, setCart] = useState(0)
  const [menu, setMenu] = useState(false)

  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const tiltRef = useRef(null)
  const busy = useRef(false)
  const jumpUntil = useRef(0)
  const lastWheel = useRef(0)
  const rafRef = useRef(0)

  const showShoe = useCallback((i) => {
    setS((p) => (p.cur === i ? p : { cur: i, prev: p.cur, dir: i > p.cur ? 1 : -1 }))
  }, [])

  /* smooth eased scroll to step k (0..N-1 = shoes, N = next section) */
  const animateTo = useCallback(
    (k) => {
      const el = wrapRef.current
      if (!el) return
      const { unit, top } = metrics(el)
      const to = top + k * unit
      const from = window.scrollY
      if (Math.abs(to - from) < 2) return

      showShoe(Math.min(k, N - 1)) // shoe starts changing immediately
      busy.current = true
      jumpUntil.current = Date.now() + SCROLL_MS + 80

      const t0 = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - t0) / SCROLL_MS)
        window.scrollTo(0, from + (to - from) * ease(t))
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
        else busy.current = false
      }
      cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(tick)
    },
    [showShoe]
  )

  /* ---------- wheel / touch / keyboard -> one step per gesture ---------- */
  useEffect(() => {
    const el = () => wrapRef.current

    // do we take over scrolling for this direction?
    const takesOver = (dir) => {
      if (!el()) return false
      const { unit, top } = metrics(el())
      const y = window.scrollY
      const detailsTop = top + N * unit
      if (y < detailsTop - 2) return true // inside the hero
      return dir < 0 && y <= detailsTop + 2 // at top of section 2, going back up
    }

    const stepBy = (dir) => {
      const { unit, top } = metrics(el())
      const k = Math.round((window.scrollY - top) / unit)
      animateTo(Math.max(0, Math.min(N, k + dir)))
    }

    const onWheel = (e) => {
      if (e.ctrlKey) return
      const now = performance.now()
      const gap = now - lastWheel.current
      lastWheel.current = now
      const d = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      const dir = d > 0 ? 1 : -1
      if (!takesOver(dir)) return
      e.preventDefault()
      // ignore trackpad inertia + tiny movements
      if (busy.current || gap < 80 || Math.abs(d) < 4) return
      stepBy(dir)
    }

    let sx = 0
    let sy = 0
    let intercepted = false
    const delta = (t) => {
      const dy = sy - t.clientY
      const dx = sx - t.clientX
      return Math.abs(dy) >= Math.abs(dx) ? dy : dx
    }
    const onTouchStart = (e) => {
      sx = e.touches[0].clientX
      sy = e.touches[0].clientY
      intercepted = false
    }
    const onTouchMove = (e) => {
      const d = delta(e.touches[0])
      if (Math.abs(d) < 4) return
      if (takesOver(d > 0 ? 1 : -1)) {
        intercepted = true
        if (e.cancelable) e.preventDefault()
      }
    }
    const onTouchEnd = (e) => {
      if (!intercepted || busy.current) return
      const d = delta(e.changedTouches[0])
      if (Math.abs(d) < 45) return
      stepBy(d > 0 ? 1 : -1)
    }

    const onKey = (e) => {
      const down = ['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key) || (e.key === ' ' && !e.shiftKey)
      const up = ['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key) || (e.key === ' ' && e.shiftKey)
      if (!down && !up) return
      const dir = down ? 1 : -1
      if (!takesOver(dir)) return
      e.preventDefault()
      if (!busy.current && !e.repeat) stepBy(dir)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      cancelAnimationFrame(rafRef.current)
    }
  }, [animateTo])

  /* ---------- scroll position -> active shoe + hero exit effect ---------- */
  useEffect(() => {
    let raf = 0

    const sync = () => {
      raf = 0
      const el = wrapRef.current
      if (!el) return
      const { unit, top } = metrics(el)
      const y = window.scrollY - top

      // hero shrinks + fades while section 2 slides in
      const p = Math.min(1, Math.max(0, (y - (N - 1) * unit) / unit))
      if (innerRef.current) {
        innerRef.current.style.transform = `scale(${1 - p * 0.08})`
        innerRef.current.style.opacity = String(1 - p * 0.65)
      }

      if (Date.now() < jumpUntil.current) return
      const i = Math.min(N - 1, Math.max(0, Math.round(y / unit)))
      showShoe(i)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(sync)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    sync()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [showShoe])

  /* dots / thumbnails */
  const goTo = (i) => {
    if (!busy.current) animateTo(i)
  }

  const stateOf = (i) => {
    if (i === s.cur) return 'active'
    if (i === s.prev) return s.dir > 0 ? 'left' : 'right'
    return s.dir > 0 ? 'right' : 'left'
  }

  /* ---------- mouse parallax tilt ---------- */
  const onMouseMove = (e) => {
    if (!tiltRef.current) return
    const x = e.clientX / window.innerWidth - 0.5
    const y = e.clientY / window.innerHeight - 0.5
    tiltRef.current.style.transform = `perspective(1200px) rotateY(${x * 12}deg) rotateX(${-y * 9}deg) translate3d(${x * 18}px, ${y * 12}px, 0)`
  }
  const onMouseLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = 'perspective(1200px) rotateY(0) rotateX(0)'
  }

  return (
    <div ref={wrapRef} className="relative" style={{ height: `${N * 100}svh` }}>
      <section
        ref={innerRef}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="sticky top-0 h-[100svh] w-full select-none overflow-hidden text-white will-change-transform"
      >
        {/* ---------- background colour layers (cross-fade) ---------- */}
        {SHOES.map((sh, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[1200ms] ease-in-out"
            style={{ background: sh.bg, opacity: i === s.cur ? 1 : 0 }}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />

        {/* ---------- giant background word ---------- */}
        <div className="enter-fade pointer-events-none absolute inset-0" style={{ '--d': '0.4s' }}>
          {SHOES.map((sh, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-[40%] whitespace-nowrap font-display text-[27vw] leading-none tracking-wide text-white/[0.09] lg:top-[44%]"
              style={{
                ...WORD_POS[stateOf(i)],
                transition: 'transform 1.4s cubic-bezier(.22,1,.36,1), opacity 1s ease',
              }}
            >
              {sh.word}
            </span>
          ))}
        </div>

        {/* ---------- header ---------- */}
        <header className="enter-down absolute inset-x-0 top-0 z-40 flex items-center justify-between px-6 pt-6 lg:px-[6%] lg:pt-8">
          {/* Replace these text wordmarks with your own logo images */}
          <div className="flex items-center gap-4">
            <span className="font-wide text-sm font-bold tracking-[0.15em]">JORDAN</span>
            <span className="h-8 w-px bg-white/40" />
            <span className="font-wide text-sm font-bold tracking-[0.15em]">NIKE</span>
          </div>

          <nav className="hidden gap-10 lg:absolute lg:left-1/2 lg:flex lg:-translate-x-1/2">
            {NAV.map((n) => (
              <a
                key={n}
                href="#"
                className="relative font-wide text-[11px] font-bold tracking-[0.22em] transition-colors hover:text-[#ffc58a] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-[#ffc58a] after:transition-all after:duration-300 hover:after:w-full"
              >
                {n}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button aria-label="Search" className="transition duration-300 hover:scale-125 hover:text-[#ffc58a]">
              <SearchIcon />
            </button>
            <button aria-label="Cart" className="relative transition duration-300 hover:scale-125 hover:text-[#ffc58a]">
              <CartIcon />
              {cart > 0 && (
                <span
                  key={cart}
                  className="pop absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#ff8a1f] text-[9px] font-bold text-black"
                >
                  {cart}
                </span>
              )}
            </button>
            <button aria-label="Account" className="transition duration-300 hover:scale-125 hover:rotate-6">
              <UserIcon />
            </button>
            <button
              aria-label="Menu"
              onClick={() => setMenu((m) => !m)}
              className="flex h-5 w-6 flex-col justify-between lg:hidden"
            >
              <span className={`h-0.5 w-full bg-white transition ${menu ? 'translate-y-[9px] rotate-45' : ''}`} />
              <span className={`h-0.5 w-full bg-white transition ${menu ? 'opacity-0' : ''}`} />
              <span className={`h-0.5 w-full bg-white transition ${menu ? '-translate-y-[9px] -rotate-45' : ''}`} />
            </button>
          </div>

          {/* mobile menu */}
          <div
            className={`absolute inset-x-0 top-full flex flex-col gap-5 bg-black/70 px-6 backdrop-blur-md transition-all duration-500 lg:hidden ${
              menu ? 'max-h-80 py-6 opacity-100' : 'pointer-events-none max-h-0 overflow-hidden py-0 opacity-0'
            }`}
          >
            {NAV.map((n) => (
              <a key={n} href="#" onClick={() => setMenu(false)} className="font-wide text-xs font-bold tracking-[0.22em]">
                {n}
              </a>
            ))}
          </div>
        </header>

        {/* ---------- shoe stage ---------- */}
        <div className="enter-shoe pointer-events-none absolute inset-x-0 top-[17%] z-10 h-[34%] sm:h-[40%] lg:top-[17%] lg:h-[52%]">
          <div
            ref={tiltRef}
            className="pointer-events-auto relative h-full w-full transition-transform duration-300 ease-out hover:scale-[1.04]"
          >
            {/* ground shadow */}
            <div className="shadow-pulse absolute bottom-[2%] left-1/2 h-8 w-[34vw] max-w-[520px] rounded-full bg-black/70 blur-2xl" />

            {SHOES.map((sh, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-[92vw] max-w-[820px] will-change-transform sm:w-[70vw] lg:w-[46vw]"
                style={{
                  ...SHOE_POS[stateOf(i)],
                  transition: 'transform 1.1s cubic-bezier(.22,1,.36,1), opacity .9s ease',
                }}
              >
                <div className="float">
                  <img
                    src={sh.img}
                    alt={`${sh.brand} ${sh.model}`}
                    draggable={false}
                    className="w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- vertical dots ---------- */}
        <div className="enter-fade absolute right-3 top-1/2 z-30 flex -translate-y-1/2 flex-col gap-3 lg:right-[2.5%]" style={{ '--d': '1.4s' }}>
          {SHOES.map((_, i) => (
            <button
              key={i}
              aria-label={`Show shoe ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition-all duration-500 hover:scale-150 hover:bg-white ${
                i === s.cur ? 'scale-125 bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>

        {/* ---------- bottom row ---------- */}
        <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col gap-5 px-6 pb-6 lg:flex-row lg:items-end lg:justify-between lg:px-[6%] lg:pb-12">
          {/* colour / shoe switcher */}
          <div className="enter-up order-3 lg:order-1" style={{ '--d': '1.1s' }}>
            <p className="mb-3 font-wide text-[10px] font-bold tracking-[0.2em]">CHOOSE COLOR :</p>
            <div className="flex items-center gap-4">
              {SHOES.map((sh, i) => (
                <button
                  key={i}
                  aria-label={`Choose ${sh.model}`}
                  onClick={() => goTo(i)}
                  className={`w-12 -rotate-12 transition-all duration-300 hover:-translate-y-1.5 hover:rotate-0 hover:scale-125 lg:w-14 ${
                    i === s.cur ? 'scale-125 opacity-100 drop-shadow-[0_8px_10px_rgba(255,255,255,0.25)]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={sh.img} alt="" draggable={false} className="w-full" />
                </button>
              ))}
            </div>
          </div>

          {/* buttons */}
          <div className="enter-up order-2 flex gap-4 lg:mb-1" style={{ '--d': '1.25s' }}>
            <button
              onClick={() => setCart((c) => c + 1)}
              className="group relative overflow-hidden bg-white px-7 py-3 font-wide text-[10px] font-bold tracking-[0.2em] text-black transition-transform duration-300 hover:-translate-y-0.5 active:scale-95"
            >
              <span className="absolute inset-0 -translate-x-full bg-[#ff8a1f] transition-transform duration-500 ease-out group-hover:translate-x-0" />
              <span className="relative transition-colors duration-300 group-hover:text-white">ADD TO CART</span>
            </button>
            <button className="group relative overflow-hidden border border-white/70 px-7 py-3 font-wide text-[10px] font-bold tracking-[0.2em] transition-transform duration-300 hover:-translate-y-0.5 active:scale-95">
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-white transition-transform duration-500 ease-out group-hover:scale-y-100" />
              <span className="relative transition-colors duration-300 group-hover:text-black">BUY NOW</span>
            </button>
          </div>

          {/* details (changes per shoe) */}
          <div className="enter-up order-1 grid lg:order-3 lg:w-[340px]" style={{ '--d': '1s' }}>
            {SHOES.map((sh, i) => {
              const st = stateOf(i)
              return (
                <div
                  key={i}
                  aria-hidden={st !== 'active'}
                  className={`col-start-1 row-start-1 ${st === 'active' ? '' : 'pointer-events-none'}`}
                >
                  <Reveal state={st} delay={150} className="flex items-center gap-4">
                    <span className="font-wide text-3xl font-bold lg:text-4xl">{sh.price}</span>
                    <span className="h-10 w-px bg-white/70" />
                    <div>
                      <p className="font-wide text-base font-bold tracking-[0.15em]">{sh.brand}</p>
                      <p className="font-wide text-[11px] tracking-[0.15em]">{sh.model}</p>
                    </div>
                  </Reveal>

                  <Reveal state={st} delay={260} className="mt-4">
                    <h4 className="mb-2 font-wide text-[11px] font-bold tracking-[0.25em]">{sh.title}</h4>
                    <p className="max-w-[340px] text-xs leading-relaxed text-white/80">{sh.text}</p>
                  </Reveal>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}