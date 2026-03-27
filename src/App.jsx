import { useEffect, useState } from 'react'
import mentorImage from './assets/Ade (2).jpg'

const totalSteps = 6
const SUBMIT_URL = '/api/submit'
const DEV_APPS_SCRIPT_URL = String(import.meta.env.VITE_APPS_SCRIPT_URL || '').trim()

function App() {
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('remarkable-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeStep, setActiveStep] = useState(1)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [selectedScale1, setSelectedScale1] = useState(null)
  const [selectedScale2, setSelectedScale2] = useState(null)
  const [hearSource, setHearSource] = useState('')
  const [videoFileName, setVideoFileName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('remarkable-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 90)
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 },
    )
    reveals.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const scrollToApply = () => {
    const apply = document.getElementById('apply')
    if (apply) {
      window.scrollTo({ top: apply.offsetTop - 80, behavior: 'smooth' })
    }
  }

  const getFormData = () => {
    const form = document.getElementById('applicationForm')
    if (!form) return null
    return new FormData(form)
  }

  const clearFieldError = (field) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  const scrollToStepTop = (step) => {
    const stepEl = document.querySelector(`.form-section[data-step="${step}"]`)
    if (!stepEl) return
    const y = stepEl.getBoundingClientRect().top + window.scrollY - 120
    window.scrollTo({ top: y, behavior: 'smooth' })
  }

  const validateStep = (step) => {
    const formData = getFormData()
    if (!formData) return false
    const errors = {}

    if (step === 1) {
      const required = ['fullName', 'age', 'gender', 'state', 'email', 'whatsapp']
      required.forEach((field) => {
        if (!String(formData.get(field) || '').trim()) {
          errors[field] = 'This field is required.'
        }
      })
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please complete all required personal information fields before continuing.' })
        return false
      }
    }

    if (step === 2) {
      const required = ['track', 'jobOrBusiness', 'industry', 'years', 'currentWork']
      required.forEach((field) => {
        if (!String(formData.get(field) || '').trim()) {
          errors[field] = 'This field is required.'
        }
      })
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please complete all required career/business fields before continuing.' })
        return false
      }
    }

    if (step === 3) {
      const required = ['satisfactionWhy', 'gap', 'vision', 'ordinaryWhen']
      required.forEach((field) => {
        if (!String(formData.get(field) || '').trim()) {
          errors[field] = 'This field is required.'
        }
      })
      if (!selectedScale1) errors.satisfactionScore = 'Please choose a score.'
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please answer all growth questions and select your score before continuing.' })
        return false
      }
    }

    if (step === 4) {
      const videoLink = String(formData.get('videoLink') || '').trim()
      if (!videoFileName && !videoLink) {
        setFieldErrors((prev) => ({ ...prev, videoLink: 'Upload a file or provide a video link.' }))
        setFormMessage({ type: 'error', text: 'Please upload your video or provide a video link before continuing.' })
        return false
      }
    }

    if (step === 5) {
      const required = ['attend', 'commitmentWhy', 'hearAbout']
      required.forEach((field) => {
        if (!String(formData.get(field) || '').trim()) {
          errors[field] = 'This field is required.'
        }
      })
      const hearAbout = String(formData.get('hearAbout') || '').trim()
      const referrer = String(formData.get('referrer') || '').trim()
      if (!selectedScale2) errors.commitmentScore = 'Please choose a score.'
      if (hearAbout === 'referred' && !referrer) errors.referrer = 'Please tell us who referred you.'
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please complete all logistics and commitment fields before continuing.' })
        return false
      }
    }

    if (step === 6 && !agreed) {
      setFieldErrors((prev) => ({ ...prev, declarationAgreed: 'You must agree before submitting.' }))
      setFormMessage({ type: 'error', text: 'Please read and agree to the declaration before submitting.' })
      return false
    }

    setFieldErrors((prev) => {
      const next = { ...prev }
      const stepFields = {
        1: ['fullName', 'age', 'gender', 'state', 'email', 'whatsapp'],
        2: ['track', 'jobOrBusiness', 'industry', 'years', 'currentWork'],
        3: ['satisfactionScore', 'satisfactionWhy', 'gap', 'vision', 'ordinaryWhen'],
        4: ['videoLink'],
        5: ['attend', 'commitmentScore', 'commitmentWhy', 'hearAbout', 'referrer'],
        6: ['declarationAgreed'],
      }[step] || []
      stepFields.forEach((f) => delete next[f])
      return next
    })
    setFormMessage(null)
    return true
  }

  const nextSection = () => {
    if (activeStep < totalSteps) {
      if (!validateStep(activeStep)) return
      setFormMessage(null)
      const nextStep = activeStep + 1
      setActiveStep(nextStep)
      setTimeout(() => scrollToStepTop(nextStep), 30)
    }
  }

  const prevSection = () => {
    if (activeStep > 1) {
      setFormMessage(null)
      const prevStep = activeStep - 1
      setActiveStep(prevStep)
      setTimeout(() => scrollToStepTop(prevStep), 30)
    }
  }

  const submitForm = async () => {
    scrollToStepTop(6)
    if (!validateStep(6)) return

    const form = document.getElementById('applicationForm')
    if (!form) return
    const formData = new FormData(form)
    const payload = {
      fullName: formData.get('fullName') || '',
      age: formData.get('age') || '',
      gender: formData.get('gender') || '',
      state: formData.get('state') || '',
      email: formData.get('email') || '',
      whatsapp: formData.get('whatsapp') || '',
      linkedin: formData.get('linkedin') || '',
      track: formData.get('track') || '',
      jobOrBusiness: formData.get('jobOrBusiness') || '',
      industry: formData.get('industry') || '',
      years: formData.get('years') || '',
      currentWork: formData.get('currentWork') || '',
      satisfactionScore: selectedScale1 || '',
      satisfactionWhy: formData.get('satisfactionWhy') || '',
      gap: formData.get('gap') || '',
      vision: formData.get('vision') || '',
      ordinaryWhen: formData.get('ordinaryWhen') || '',
      videoFileName: videoFileName || '',
      videoLink: formData.get('videoLink') || '',
      canAttendLaunch: formData.get('attend') || '',
      commitmentScore: selectedScale2 || '',
      commitmentWhy: formData.get('commitmentWhy') || '',
      hearAbout: formData.get('hearAbout') || '',
      referrer: formData.get('referrer') || '',
      declarationAgreed: agreed,
    }

    try {
      setIsSubmitting(true)
      setFormMessage(null)

      if (import.meta.env.DEV && !DEV_APPS_SCRIPT_URL) {
        setFormMessage({
          type: 'error',
          text: 'Sorry, we could not submit your application right now. Please try again in a moment.',
        })
        return
      }

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)
      const response = await fetch(SUBMIT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        signal: controller.signal,
        body: JSON.stringify(payload),
      })
      clearTimeout(timeoutId)

      const raw = await response.text()
      let result = {}
      if (raw) {
        try {
          result = JSON.parse(raw)
        } catch {
          result = { ok: response.ok, raw }
        }
      }

      if (!response.ok || result?.ok === false) {
        throw new Error(result?.error || `Submission failed (${response.status})`)
      }

      form.reset()
      setSelectedScale1(null)
      setSelectedScale2(null)
      setHearSource('')
      setVideoFileName('')
      setAgreed(false)
      setFieldErrors({})
      setFormMessage({ type: 'success', text: 'Application submitted successfully.' })
      setIsSubmitted(true)
      setActiveStep(1)
      scrollToApply()
    } catch (error) {
      const message =
        error?.name === 'AbortError'
          ? 'The submission is taking longer than expected. Please check your connection and try again.'
          : 'We could not submit your application right now. Please try again.'
      setFormMessage({ type: 'error', text: message })
      scrollToStepTop(6)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <nav id="nav" className={isScrolled ? 'scrolled' : ''}>
        <div className="nav-brand">
          <div className="nav-logo">
            Re<span>mark</span>able
          </div>
          <div className="nav-sub">Mentorship Program</div>
        </div>
        <div className="nav-right">
          <div className="nav-links">
            <a href="#about">About</a>
            <a href="#program">Program</a>
            <a href="#event">Launch Event</a>
            <a href="#mentor">Mentor</a>
            <a href="#apply" className="nav-apply">
              Apply Now
            </a>
          </div>
          <button
            type="button"
            className="theme-toggle desktop-theme-toggle"
            onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
            aria-label="Toggle light and dark mode"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button
            type="button"
            className={`menu-toggle ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
        <a href="#program" onClick={() => setMenuOpen(false)}>Program</a>
        <a href="#event" onClick={() => setMenuOpen(false)}>Launch Event</a>
        <a href="#mentor" onClick={() => setMenuOpen(false)}>Mentor</a>
        <a href="#apply" className="mobile-apply" onClick={() => setMenuOpen(false)}>Apply Now</a>
        <button
          type="button"
          className="theme-toggle mobile-theme-toggle"
          onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          aria-label="Toggle light and dark mode"
        >
          {theme === 'light' ? '🌙 Dark mode' : '☀️ Light mode'}
        </button>
      </div>

      <section className="hero" id="home">
        <div className="hero-radial"></div>
        <div className="hero-grid-bg"></div>
        <div className="hero-content">
          <div className="hero-eyebrow">
            <div className="hero-eyebrow-dot"></div>
            <span className="hero-eyebrow-text">Remarkable '26 - Applications Now Open</span>
          </div>
          <h1 className="hero-title">
            For Those Who<em>Refused</em>to Be Ordinary.
          </h1>
          <p className="hero-sub">
            A <strong>12-month transformational mentorship program</strong> for 50 high-potential
            professionals and entrepreneurs in Nigeria. Structured. Inspiring.
            Transformational.
          </p>
          <div className="hero-actions">
            <a href="#apply" className="btn-primary">
              Apply for Remarkable '26 {'->'}
            </a>
            <a href="#about" className="btn-ghost">
              Learn More
            </a>
          </div>
          <div className="trust-badges">
            <div className="trust-badge"><span className="trust-badge-val">50</span><span className="trust-badge-label">Spots Only</span></div>
            <div className="trust-badge"><span className="trust-badge-val">12 Months</span><span className="trust-badge-label">Apr 2026 - Mar 2027</span></div>
            <div className="trust-badge"><span className="trust-badge-val">100% Free</span><span className="trust-badge-label">Fully Funded</span></div>
            <div className="trust-badge"><span className="trust-badge-val">Lagos</span><span className="trust-badge-label">Nigeria + Virtual</span></div>
          </div>
        </div>
      </section>

      <div className="stats-bar">
        <div className="stats-inner">
          <div className="stat-item"><div className="stat-val">50</div><div className="stat-label">Selected Mentees</div></div>
          <div className="stat-item"><div className="stat-val">12</div><div className="stat-label">Months Duration</div></div>
          <div className="stat-item"><div className="stat-val">3</div><div className="stat-label">Mentorship Tracks</div></div>
          <div className="stat-item"><div className="stat-val">100%</div><div className="stat-label">Free to Attend</div></div>
          <div className="stat-item"><div className="stat-val">12</div><div className="stat-label">Monthly Sessions</div></div>
          <div className="stat-item"><div className="stat-val">1</div><div className="stat-label">Cohort Per Year</div></div>
        </div>
      </div>

      <section className="about" id="about">
        <div className="inner">
          <div className="about-grid reveal">
            <div>
              <div className="eyebrow">What is Remarkable?</div>
              <h2 className="section-title">The Decision to Succeed Was Made the Day You <em>Refused to Settle.</em></h2>
              <div className="rule"></div>
              <p className="body-text">Remarkable is a highly rigorous, 12-month mentorship program designed for high-potential professionals and entrepreneurs in Nigeria who are 5 years or below into their careers or businesses.</p>
              <p className="body-text">It exists to close the gap between where you are and where you know you could be.</p>
              <p className="body-text">The world's best mentoring programs share three things: structure, consistency, and community. Remarkable was built with all three - drawing from the principles that make great mentoring work anywhere in the world, then shaped specifically for the realities, ambitions, and potential of the young upwardly mobile Nigerian who is too talented to stay stuck and too hungry to settle for where they are.</p>
              <ul className="about-checklist" style={{ marginTop: '24px' }}>
                <li>Free for all accepted participants</li>
                <li>Monthly live group sessions</li>
                <li>Small peer-learning circles</li>
                <li>Matching with accountability partner</li>
                <li>Structured 12-month curriculum across 4 quarters</li>
                <li>A community of 50 driven, like-minded peers</li>
                <li>Final project to be completed by all mentees</li>
              </ul>
            </div>
            <div className="about-image-box">
              <div className="about-cohort-label">Now Accepting Applications</div>
              <div className="about-cohort-title">Remarkable '26</div>
              <div className="about-cohort-dates">April 2026 - March 2027 · Lagos, Nigeria</div>
              <blockquote className="about-quote">
                "You did not come this far to live an ordinary life."
                <div className="about-quote-attribution">- Ade' Olowojoba</div>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      <section id="pillars">
        <div className="inner">
          <div className="eyebrow reveal">The Framework</div>
          <h2 className="section-title reveal">Five Pillars of <em>Transformation</em></h2>
          <p className="body-text reveal">Every session, assignment, and conversation in Remarkable is designed to develop you across these four interconnected dimensions.</p>
          <div className="pillars-grid reveal" style={{ gridTemplateColumns: 'repeat(5,1fr)' }}>
            {[
              {
                title: 'Mind',
                sub: 'Personal Growth & Leadership',
                desc: 'Build the mindset, habits, and leadership identity of someone who operates at the next level. Growth starts from within.',
              },
              {
                title: 'Money',
                sub: 'Finance & Wealth',
                desc: 'Develop real financial intelligence — how to earn more, manage better, invest wisely, and build lasting wealth on your terms.',
              },
              {
                title: 'Platform',
                sub: 'Business & Career',
                desc: "Build a career or business that creates impact. Sharpen your strategy, visibility, and execution to grow what you've started.",
              },
              {
                title: 'Environment',
                sub: 'Relationships',
                desc: 'Your environment shapes your outcomes. Cultivate intentional relationships that challenge, support, and open doors for you.',
              },
              {
                title: 'Spirit',
                sub: 'Faith',
                desc: 'Anchor your ambition in purpose. Develop the inner conviction and spiritual resilience that sustains you through the journey.',
              },
            ].map((pillar, i) => (
              <div key={pillar.title} className="pillar">
                <div className="pillar-num">{`0${i + 1}`}</div>
                <div className="pillar-title">{pillar.title}</div>
                <div className="pillar-sub">{pillar.sub}</div>
                <p className="pillar-desc">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="journey" id="program">
        <div className="inner">
          <div className="eyebrow reveal">The 12-Month Journey</div>
          <h2 className="section-title reveal">A Year Designed to Change <em>the Trajectory of Your Life.</em></h2>
          <div className="phases reveal">
            <div className="phase"><div className="phase-tag">Phase 01 · April – June 2026</div><div className="phase-name">Foundation</div><div className="phase-sub">Know Yourself</div><ul className="phase-list"><li>Honest self-assessment & personal audit</li><li>Goal architecture & success mapping</li><li>Mindset renewal & belief systems</li><li>In-person launch & cohort bonding</li></ul></div>
            <div className="phase"><div className="phase-tag">Phase 02 · July – September 2026</div><div className="phase-name">Growth</div><div className="phase-sub">Build Yourself</div><ul className="phase-list"><li>Building habits that compound</li><li>Strategic relationship development</li><li>Financial intelligence</li><li>Personal brand foundations</li></ul></div>
            <div className="phase"><div className="phase-tag">Phase 03 · October – December 2026</div><div className="phase-name">Momentum</div><div className="phase-sub">Stretch Yourself</div><ul className="phase-list"><li>Career & business acceleration</li><li>Visibility & thought leadership</li><li>Execution & professional discipline</li><li>Navigating setbacks & resilience</li></ul></div>
            <div className="phase"><div className="phase-tag">Phase 04 · January – April 2027</div><div className="phase-name">Legacy</div><div className="phase-sub">Establish Yourself</div><ul className="phase-list"><li>Consolidating your gains & wins</li><li>Learning to mentor and give back</li><li>Planning your next chapter</li><li>Graduation & alumni network</li></ul></div>
          </div>
          <div className="rhythm reveal">
            <div className="eyebrow">Monthly Operating Rhythm</div>
            <h3 className="section-title" style={{ fontSize: 'clamp(1.5rem,3vw,2.2rem)' }}>What Happens <em>Every Month</em></h3>
            <div className="rhythm-grid">
              <div className="rhythm-card"><div className="rhythm-num">01</div><div className="rhythm-title">Group Session</div><p className="rhythm-desc">90-minute live session with Ade' Olowojoba or a guest expert, covering the month's topic in depth.</p></div>
              <div className="rhythm-card"><div className="rhythm-num">02</div><div className="rhythm-title">Peer Circles</div><p className="rhythm-desc">Small groups of 5–6 mentees meet to discuss challenges, share progress, and hold each other accountable.</p></div>
              <div className="rhythm-card"><div className="rhythm-num">03</div><div className="rhythm-title">Personal Check-in</div><p className="rhythm-desc">A brief touchpoint with your track mentor to review your goals and receive personalized guidance.</p></div>
              <div className="rhythm-card"><div className="rhythm-num">04</div><div className="rhythm-title">Monthly Reflection</div><p className="rhythm-desc">A guided review of wins, lessons, and commitments for the next 30 days.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section id="event">
        <div className="inner">
          <div className="eyebrow reveal">The Launch Event</div>
          <h2 className="section-title reveal">Where It <em>All Begins.</em></h2>
          <p className="body-text reveal">The launch event is not just an orientation — it is the moment you step into a new version of yourself, surrounded by 49 other people who made the same decision you did.</p>
          <div className="event-wrap reveal">
            <div className="event-left">
              <div className="schedule-title">Event Details</div>
              <div className="event-detail">
                <div className="event-detail-icon">◈</div>
                <div><div className="event-detail-label">Date</div><div className="event-detail-val">Saturday, April 18, 2026</div></div>
              </div>
              <div className="event-detail">
                <div className="event-detail-icon">◈</div>
                <div><div className="event-detail-label">Time</div><div className="event-detail-val">9:30 AM – 2:00 PM</div></div>
              </div>
              <div className="event-detail">
                <div className="event-detail-icon">◈</div>
                <div><div className="event-detail-label">Location</div><div className="event-detail-val">Lagos, Nigeria (Venue TBA)</div></div>
              </div>
              <div className="event-detail">
                <div className="event-detail-icon">◈</div>
                <div><div className="event-detail-label">Attendance</div><div className="event-detail-val">50 Selected Mentees Only</div></div>
              </div>
            </div>
            <div className="event-right">
              <div className="schedule-title">What to Expect</div>
              <p className="body-text" style={{ maxWidth: 'none', marginBottom: '20px' }}>The launch event is where 50 strangers become a community — and where each mentee steps into the 12 months ahead with clarity, conviction, and commitment.</p>
              <div className="sched-item"><div className="sched-time">◈</div><div className="sched-name">Vision-setting keynote by Ade' Olowojoba</div></div>
              <div className="sched-item"><div className="sched-time">◈</div><div className="sched-name">Panel: "What I Wish I Knew Earlier"</div></div>
              <div className="sched-item"><div className="sched-time">◈</div><div className="sched-name">Program orientation and cohort bonding</div></div>
              <div className="sched-item"><div className="sched-time">◈</div><div className="sched-name">The Commitment Moment — signing of Remarkable Commitment Cards</div></div>
              <div className="sched-item"><div className="sched-time">◈</div><div className="sched-name">Networking lunch with your new cohort</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="mentor-section" id="mentor">
        <div className="inner">
          <div className="eyebrow reveal">Your Lead Mentor</div>
          <div className="mentor-grid reveal">
            <div className="mentor-photo">
              <img src={mentorImage} alt="Ade' Olowojoba" />
            </div>
            <div>
              <div className="mentor-name">Ade' Olowojoba</div>
              <div className="mentor-role">Serial Entrepreneur · Social Innovator · Mentor</div>
              <p className="mentor-bio">Ademulegun (Ade') Olowojoba is a Nigerian serial entrepreneur and social innovator. He founded NerdzFactory Company in 2017 from his room with a capital of NGN 25,000 and has grown it into a leading social innovation center in Nigeria — with a team of 20+ operating across 3 continents. Under his leadership, NerdzFactory has reached over 30,000 young people through digital skills, entrepreneurship, and workforce development programs in partnership with Meta, UNDP, Mastercard Foundation, British Council, GIZ, and others.</p>
              <p className="mentor-bio">Prior to his entrepreneurial journey, Ade' worked in corporate Nigeria — managing Community Affairs at Microsoft, serving as Pioneer Project Lead for CodeLagos, and briefly serving as a Director in the Ondo State Government. He is based in Canada with his family while actively leading businesses that are transforming the future of Nigeria and Africa.</p>
              <p className="mentor-bio">Through Remarkable, Ade' is making the kind of mentorship that shaped his own trajectory accessible to 50 carefully selected individuals who are ready to do the work. His approach is direct, practical, and deeply personal.</p>
              <blockquote className="mentor-pull">"The version of you that is possible is not a fantasy. It is a decision. Remarkable exists to help you make that decision — and then execute on it, every single month, for a year."</blockquote>
              <div className="mentor-attribution">— Ade' Olowojoba</div>
            </div>
          </div>
        </div>
      </section>

      <section id="eligibility">
        <div className="inner">
          <div className="eyebrow reveal">Who Is This For?</div>
          <h2 className="section-title reveal">Eligibility & <em>Fit</em></h2>
          <div className="elig-grid reveal">
            <div className="elig-card">
              <div className="elig-title">You Are a Perfect Fit If...</div>
              <ul className="elig-list">
                <li>You are between 25 and 35 years old</li>
                <li>You are based in Nigeria (Lagos preferred, open to all)</li>
                <li>You are 3–5 years into your career or business</li>
                <li>You are a professional, entrepreneur, or navigating both</li>
                <li>You are genuinely hungry for growth and willing to do the work</li>
                <li>You can commit to monthly sessions and assignments</li>
                <li>You are not looking for shortcuts — you want the real thing</li>
              </ul>
            </div>
            <div className="elig-card">
              <div className="elig-title">By April 2027 You Will Have...</div>
              <ul className="elig-list">
                <li>A renewed and sharpened mindset</li>
                <li>Practical wisdom from 12 months of deep mentoring</li>
                <li>A stronger, more intentional network</li>
                <li>Measurable career or business growth</li>
                <li>Clarity on your next chapter</li>
                <li>A lifelong community of remarkable peers</li>
                <li>The confidence that only consistent execution builds</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="inner">
          <div className="eyebrow reveal">Frequently Asked Questions</div>
          <h2 className="section-title reveal">Your Questions, <em>Answered.</em></h2>
          <div className="faq-grid reveal">
            <div className="faq-item"><div className="faq-q">Is the program really free?</div><div className="faq-a">Yes. Remarkable is completely free for all accepted participants. There are no hidden fees, no deposits, and no charges at any point during the 12 months. The program is Ade' Olowojoba's investment in the next generation.</div></div>
            <div className="faq-item"><div className="faq-q">How many people will be accepted?</div><div className="faq-a">Only 50 participants will be selected for Remarkable '26. The selection process is rigorous because the quality of the cohort is central to the program's value. Every person in the room will be someone you want to know.</div></div>
            <div className="faq-item"><div className="faq-q">How much time do I need to commit each month?</div><div className="faq-a">Expect to invest approximately 4–6 hours per month: a 90-minute group session, a 60-minute peer circle, a 15-minute personal check-in, and time for the monthly reflection and any recommended reading.</div></div>
            <div className="faq-item"><div className="faq-q">Is the program in-person or virtual?</div><div className="faq-a">The program is hybrid. The launch event (April 18, 2026) is in-person in Lagos. Monthly sessions will be a mix of virtual and in-person, depending on the session and logistics.</div></div>
            <div className="faq-item"><div className="faq-q">When does the application close?</div><div className="faq-a">Applications for Remarkable '26 close on March 31, 2026. Successful applicants will be notified by April 10, 2026. We strongly encourage early applications.</div></div>
            <div className="faq-item"><div className="faq-q">Can I apply outside Lagos?</div><div className="faq-a">Yes. While the program is anchored in Lagos, we welcome applications from high-potential individuals across Nigeria. Virtual participation is fully supported for monthly sessions.</div></div>
          </div>
        </div>
      </section>

      <section className="apply-section" id="apply">
        <div className="apply-bg"></div>
        <div className="inner">
          <div className="apply-header reveal">
            <div className="apply-deadline"><div className="apply-deadline-dot"></div>Applications Close — March 31, 2026</div>
            <h2 className="section-title" style={{ fontSize: 'clamp(2.5rem,6vw,5rem)', marginBottom: '16px' }}>50 Spots.<br /><em>One</em> Decision.</h2>
            <p className="body-text" style={{ margin: '0 auto', textAlign: 'center', maxWidth: '520px' }}>If you're ready to invest 12 months into the most important project of your life — yourself — this is your moment.</p>
          </div>
          <div className="form-wrap reveal">
            <div className="form-progress-bar"><div className="form-progress-fill" style={{ width: `${(activeStep / totalSteps) * 100}%` }}></div></div>
            {formMessage ? (
              <div className={`form-message form-message-${formMessage.type}`}>
                {formMessage.text}
              </div>
            ) : null}

            {!isSubmitted && (
              <form id="applicationForm" onSubmit={(e) => e.preventDefault()}>
                <div className={`form-section ${activeStep === 1 ? 'active' : ''}`} data-step="1">
                  <div className="form-section-header"><div className="form-section-num">Section A of 6 — Personal Information</div><div className="form-section-title">Let's start with you.</div><div className="form-section-sub">Basic details to get started.</div></div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Full Name <span>*</span></label><input className={`form-input ${fieldErrors.fullName ? 'has-error' : ''}`} name="fullName" type="text" placeholder="Your full name" onChange={() => clearFieldError('fullName')} />{fieldErrors.fullName ? <div className="field-error">{fieldErrors.fullName}</div> : null}</div>
                    <div className="form-field"><label className="form-label">Age <span>*</span></label><input className={`form-input ${fieldErrors.age ? 'has-error' : ''}`} name="age" type="number" placeholder="Your age" min="18" max="50" onChange={() => clearFieldError('age')} />{fieldErrors.age ? <div className="field-error">{fieldErrors.age}</div> : null}</div>
                  </div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Gender <span>*</span></label><select className={`form-select ${fieldErrors.gender ? 'has-error' : ''}`} name="gender" onChange={() => clearFieldError('gender')}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select>{fieldErrors.gender ? <div className="field-error">{fieldErrors.gender}</div> : null}</div>
                    <div className="form-field"><label className="form-label">State of Residence <span>*</span></label><input className={`form-input ${fieldErrors.state ? 'has-error' : ''}`} name="state" type="text" placeholder="e.g. Lagos, Abuja, Port Harcourt" onChange={() => clearFieldError('state')} />{fieldErrors.state ? <div className="field-error">{fieldErrors.state}</div> : null}</div>
                  </div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Email Address <span>*</span></label><input className={`form-input ${fieldErrors.email ? 'has-error' : ''}`} name="email" type="email" placeholder="your@email.com" onChange={() => clearFieldError('email')} />{fieldErrors.email ? <div className="field-error">{fieldErrors.email}</div> : null}</div>
                    <div className="form-field"><label className="form-label">WhatsApp Number <span>*</span></label><input className={`form-input ${fieldErrors.whatsapp ? 'has-error' : ''}`} name="whatsapp" type="tel" placeholder="+234 xxx xxx xxxx" onChange={() => clearFieldError('whatsapp')} />{fieldErrors.whatsapp ? <div className="field-error">{fieldErrors.whatsapp}</div> : null}</div>
                  </div>
                  <div className="form-field"><label className="form-label">LinkedIn Profile URL</label><input className="form-input" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" /><div className="form-hint">Optional but encouraged. Helps us understand your professional background.</div></div>
                </div>

                <div className={`form-section ${activeStep === 2 ? 'active' : ''}`} data-step="2">
                  <div className="form-section-header"><div className="form-section-num">Section B of 6 - Career & Business Profile</div><div className="form-section-title">Where are you right now?</div><div className="form-section-sub">Help us understand your professional context.</div></div>
                  <div className="form-field"><label className="form-label">You are primarily: <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="track" value="A working professional" id="t1" onChange={() => clearFieldError('track')} /> <label htmlFor="t1">A working professional</label></div><div className="form-radio"><input type="radio" name="track" value="A founder / entrepreneur" id="t2" onChange={() => clearFieldError('track')} /> <label htmlFor="t2">A founder / entrepreneur</label></div><div className="form-radio"><input type="radio" name="track" value="Both - professional with a business on the side" id="t3" onChange={() => clearFieldError('track')} /> <label htmlFor="t3">Both - professional with a business on the side</label></div></div>{fieldErrors.track ? <div className="field-error">{fieldErrors.track}</div> : null}</div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">Current Job Title or Business Name <span>*</span></label><input className={`form-input ${fieldErrors.jobOrBusiness ? 'has-error' : ''}`} name="jobOrBusiness" type="text" placeholder="e.g. Marketing Manager / Founder, XYZ Co." onChange={() => clearFieldError('jobOrBusiness')} />{fieldErrors.jobOrBusiness ? <div className="field-error">{fieldErrors.jobOrBusiness}</div> : null}</div>
                    <div className="form-field"><label className="form-label">Industry / Sector <span>*</span></label><input className={`form-input ${fieldErrors.industry ? 'has-error' : ''}`} name="industry" type="text" placeholder="e.g. Technology, Finance, Fashion" onChange={() => clearFieldError('industry')} />{fieldErrors.industry ? <div className="field-error">{fieldErrors.industry}</div> : null}</div>
                  </div>
                  <div className="form-field"><label className="form-label">Years into your career or business <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="years" value="1-2 years" id="y1" onChange={() => clearFieldError('years')} /> <label htmlFor="y1">1-2 years</label></div><div className="form-radio"><input type="radio" name="years" value="3-5 years" id="y2" onChange={() => clearFieldError('years')} /> <label htmlFor="y2">3-5 years</label></div><div className="form-radio"><input type="radio" name="years" value="5+ years" id="y3" onChange={() => clearFieldError('years')} /> <label htmlFor="y3">5+ years</label></div></div>{fieldErrors.years ? <div className="field-error">{fieldErrors.years}</div> : null}</div>
                  <div className="form-field"><label className="form-label">Describe what you currently do in 2-3 sentences <span>*</span></label><textarea className={`form-textarea ${fieldErrors.currentWork ? 'has-error' : ''}`} name="currentWork" placeholder="Tell us what your day-to-day looks like..." style={{ minHeight: '100px' }} onChange={() => clearFieldError('currentWork')}></textarea>{fieldErrors.currentWork ? <div className="field-error">{fieldErrors.currentWork}</div> : null}</div>
                </div>

                <div className={`form-section ${activeStep === 3 ? 'active' : ''}`} data-step="3">
                  <div className="form-section-header"><div className="form-section-num">Section C of 6 - The Growth Questions</div><div className="form-section-title">Honest answers only.</div><div className="form-section-sub">Short and sharp. 3-5 sentences per question is enough.</div></div>
                  <div className="form-field">
                    <label className="form-label">Where you are right now <span>*</span></label>
                    <p className="form-hint" style={{ marginBottom: '14px' }}>On a scale of 1-10, how satisfied are you with where you are right now? Select your score, then explain why that score and not higher.</p>
                    <div className="scale-group">{Array.from({ length: 10 }).map((_, i) => <button key={i + 1} type="button" className={`scale-btn ${selectedScale1 === i + 1 ? 'selected' : ''}`} onClick={() => { setSelectedScale1(i + 1); clearFieldError('satisfactionScore') }}>{i + 1}</button>)}</div>
                    {fieldErrors.satisfactionScore ? <div className="field-error">{fieldErrors.satisfactionScore}</div> : null}
                    <textarea className={`form-textarea ${fieldErrors.satisfactionWhy ? 'has-error' : ''}`} name="satisfactionWhy" placeholder="Why that score and not higher?..." style={{ minHeight: '110px' }} onChange={() => clearFieldError('satisfactionWhy')}></textarea>
                    {fieldErrors.satisfactionWhy ? <div className="field-error">{fieldErrors.satisfactionWhy}</div> : null}
                  </div>
                  <div className="form-field"><label className="form-label">The gap <span>*</span></label><textarea className={`form-textarea ${fieldErrors.gap ? 'has-error' : ''}`} name="gap" placeholder="What is the single biggest thing standing between you and the next level?..." onChange={() => clearFieldError('gap')}></textarea>{fieldErrors.gap ? <div className="field-error">{fieldErrors.gap}</div> : null}</div>
                  <div className="form-field"><label className="form-label">The vision <span>*</span></label><textarea className={`form-textarea ${fieldErrors.vision ? 'has-error' : ''}`} name="vision" placeholder="One year from now, after Remarkable - what has changed in your life? Be specific..." onChange={() => clearFieldError('vision')}></textarea>{fieldErrors.vision ? <div className="field-error">{fieldErrors.vision}</div> : null}</div>
                  <div className="form-field"><label className="form-label">Complete this sentence <span>*</span></label><div className="declaration-box" style={{ padding: '16px 20px', marginBottom: '12px' }}>"I refused to be ordinary when I..."</div><textarea className={`form-textarea ${fieldErrors.ordinaryWhen ? 'has-error' : ''}`} name="ordinaryWhen" placeholder="Complete in 2-3 sentences..." style={{ minHeight: '90px' }} onChange={() => clearFieldError('ordinaryWhen')}></textarea>{fieldErrors.ordinaryWhen ? <div className="field-error">{fieldErrors.ordinaryWhen}</div> : null}</div>
                </div>

                <div className={`form-section ${activeStep === 4 ? 'active' : ''}`} data-step="4">
                  <div className="form-section-header"><div className="form-section-num">Section D of 6 - The Video Pitch</div><div className="form-section-title">Show us who you are.</div><div className="form-section-sub">This is the most important part of your application. It tells us everything the form cannot.</div></div>
                  <div className="video-questions"><div className="video-questions-title">Your 60-90 second video must answer these three things</div><ol><li>Who are you and what do you do?</li><li>Why do you want to be in Remarkable '26?</li><li>What will this cohort lose if you are not in the room?</li></ol></div>
                  <div className="video-upload-box">
                    <div className="video-upload-title">Upload Your Video</div>
                    <div className="video-upload-sub">Click to select your video file<br />MP4, MOV, or AVI · Max 200MB · 60-90 seconds only</div>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFileName(e.target.files?.[0]?.name || '')} />
                    {videoFileName ? <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--ember-light)' }}>Selected: {videoFileName}</div> : null}
                  </div>
                  <div className="or-divider"><span>or share a link instead</span></div>
                  <div className="form-field"><label className="form-label">Video Link (Google Drive, YouTube Unlisted, or Dropbox)</label><input className={`form-input ${fieldErrors.videoLink ? 'has-error' : ''}`} name="videoLink" type="url" placeholder="https://drive.google.com/..." onChange={() => clearFieldError('videoLink')} /><div className="form-hint">Make sure the link is set to "Anyone with the link can view"</div>{fieldErrors.videoLink ? <div className="field-error">{fieldErrors.videoLink}</div> : null}</div>
                  <div className="video-guidelines"><div className="video-guidelines-title">Video Guidelines</div><ul><li>Exactly 60-90 seconds. No longer.</li><li>Face clearly visible. Speak directly to camera.</li><li>No scripts. No reading. Just you.</li><li>Any environment is fine - we are looking at you, not your background.</li><li>Confidence and authenticity matter more than production quality.</li></ul></div>
                </div>

                <div className={`form-section ${activeStep === 5 ? 'active' : ''}`} data-step="5">
                  <div className="form-section-header"><div className="form-section-num">Section E of 6 - Logistics & Commitment</div><div className="form-section-title">A few final questions.</div><div className="form-section-sub">Almost done. These help us plan.</div></div>
                  <div className="form-field"><label className="form-label">Can you attend the launch event in Lagos on Saturday, April 18, 2026? <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="attend" value="Yes - I will be there" id="a1" onChange={() => clearFieldError('attend')} /><label htmlFor="a1">Yes - I will be there</label></div><div className="form-radio"><input type="radio" name="attend" value="I am outside Lagos but will make arrangements to attend" id="a2" onChange={() => clearFieldError('attend')} /><label htmlFor="a2">I am outside Lagos but will make arrangements to attend</label></div><div className="form-radio"><input type="radio" name="attend" value="No - I cannot attend in person" id="a3" onChange={() => clearFieldError('attend')} /><label htmlFor="a3">No - I cannot attend in person</label></div></div>{fieldErrors.attend ? <div className="field-error">{fieldErrors.attend}</div> : null}</div>
                  <div className="form-field"><label className="form-label">Commitment Score <span>*</span></label><p className="form-hint" style={{ marginBottom: '14px' }}>On a scale of 1-10, how committed are you to 12 months of full participation? What makes you say that number and not a 10?</p><div className="scale-group">{Array.from({ length: 10 }).map((_, i) => <button key={i + 1} type="button" className={`scale-btn ${selectedScale2 === i + 1 ? 'selected' : ''}`} onClick={() => { setSelectedScale2(i + 1); clearFieldError('commitmentScore') }}>{i + 1}</button>)}</div>{fieldErrors.commitmentScore ? <div className="field-error">{fieldErrors.commitmentScore}</div> : null}<textarea className={`form-textarea ${fieldErrors.commitmentWhy ? 'has-error' : ''}`} name="commitmentWhy" placeholder="What makes you say that number and not a 10?..." style={{ minHeight: '100px' }} onChange={() => clearFieldError('commitmentWhy')}></textarea>{fieldErrors.commitmentWhy ? <div className="field-error">{fieldErrors.commitmentWhy}</div> : null}</div>
                  <div className="form-field"><label className="form-label">How did you hear about Remarkable? <span>*</span></label><select className={`form-select ${fieldErrors.hearAbout ? 'has-error' : ''}`} name="hearAbout" value={hearSource} onChange={(e) => { setHearSource(e.target.value); clearFieldError('hearAbout') }}><option value="">Select one</option><option>Instagram</option><option>LinkedIn</option><option>WhatsApp</option><option value="referred">Referred by someone</option><option>Twitter / X</option><option>Other</option></select>{fieldErrors.hearAbout ? <div className="field-error">{fieldErrors.hearAbout}</div> : null}</div>
                  {hearSource === 'referred' ? <div className="form-field"><label className="form-label">Who referred you?</label><input className={`form-input ${fieldErrors.referrer ? 'has-error' : ''}`} name="referrer" type="text" placeholder="Their full name" onChange={() => clearFieldError('referrer')} />{fieldErrors.referrer ? <div className="field-error">{fieldErrors.referrer}</div> : null}</div> : null}
                </div>

                <div className={`form-section ${activeStep === 6 ? 'active' : ''}`} data-step="6">
                  <div className="form-section-header"><div className="form-section-num">Section F of 6 - Declaration</div><div className="form-section-title">Make it official.</div><div className="form-section-sub">Read carefully and confirm your commitment.</div></div>
                  <div className="declaration-box"><p className="declaration-text">"I understand that Remarkable '26 is a 12-month commitment. I agree to show up consistently, engage with honesty and integrity, complete monthly assignments, support my peers, and give my absolute best to this journey. I understand that if I am selected, my spot represents an opportunity denied to someone else - and I will honour that."</p></div>
                  <label className="form-checkbox-wrap"><input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); clearFieldError('declarationAgreed') }} /><span className="form-checkbox-label">I have read, understood, and agree to the above declaration. I am ready to begin.</span></label>
                  {fieldErrors.declarationAgreed ? <div className="field-error" style={{ marginTop: '8px' }}>{fieldErrors.declarationAgreed}</div> : null}
                  <div className="declaration-box" style={{ marginTop: '24px' }}>
                    <div className="video-guidelines-title">Key Dates to Remember</div>
                    <div className="sched-item"><div className="sched-name">Application Deadline</div><div className="sched-name" style={{ marginLeft: 'auto' }}>March 31, 2026</div></div>
                    <div className="sched-item"><div className="sched-name">Notifications Sent</div><div className="sched-name" style={{ marginLeft: 'auto' }}>April 10, 2026</div></div>
                    <div className="sched-item"><div className="sched-name">Launch Event</div><div className="sched-name" style={{ marginLeft: 'auto', color: 'var(--ember-light)' }}>April 18, 2026 · Lagos</div></div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '40px' }}><button type="button" className="form-btn-submit" onClick={submitForm} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit My Application ->'}</button><p className="form-hint" style={{ marginTop: '16px' }}>Applications are reviewed individually. Only 50 spots available.</p></div>
                </div>

                <div className="form-nav">
                  <div className="form-nav-info">Step {activeStep} of {totalSteps}</div>
                  <div className="form-nav-btns">
                    <button className="form-btn-prev" onClick={prevSection} disabled={activeStep === 1} style={{ visibility: activeStep === 1 ? 'hidden' : 'visible' }}>{"← Back"}</button>
                    <button className="form-btn-next" onClick={nextSection} disabled={activeStep === totalSteps} style={{ visibility: activeStep === totalSteps ? 'hidden' : 'visible' }}>Continue {'→'}</button>
                  </div>
                </div>
              </form>
            )}

            {isSubmitted ? (
              <div className="form-success active">
                <div className="success-icon">✦</div>
                <div className="success-title">Application Received.</div>
                <p className="success-sub">Thank you for applying to Remarkable '26.</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <div className="dates-bar">
        <div className="dates-inner">
          <div className="date-item"><div className="date-milestone">Applications Open</div><div className="date-val">Now</div></div>
          <div className="date-item"><div className="date-milestone">Deadline</div><div className="date-val">March 31, 2026</div></div>
          <div className="date-item"><div className="date-milestone">Notifications</div><div className="date-val">April 10, 2026</div></div>
          <div className="date-item"><div className="date-milestone">Launch Event</div><div className="date-val">April 18, 2026</div></div>
          <div className="date-item"><div className="date-milestone">Program Ends</div><div className="date-val">April 2027</div></div>
        </div>
      </div>

      <footer>
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">Re<span>mark</span>able</div>
            <div className="footer-brand-sub">Mentorship Program</div>
            <p className="footer-brand-desc">For those who refused to be ordinary. A 12-month mentorship program for 50 high-potential professionals and entrepreneurs in Nigeria.</p>
          </div>
          <div>
            <div className="footer-col-title">Navigate</div>
            <ul className="footer-links">
              <li><a href="#about">About</a></li>
              <li><a href="#program">The Program</a></li>
              <li><a href="#event">Launch Event</a></li>
              <li><a href="#mentor">Your Mentor</a></li>
              <li><a href="#apply">Apply Now</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Key Dates</div>
            <ul className="footer-date-list">
              <li><span className="fdl-label">Applications Open</span><span className="fdl-val">Now</span></li>
              <li><span className="fdl-label">Deadline</span><span className="fdl-val">Mar 31, 2026</span></li>
              <li><span className="fdl-label">Notifications</span><span className="fdl-val">Apr 10, 2026</span></li>
              <li><span className="fdl-label">Launch Event</span><span className="fdl-val">Apr 18, 2026</span></li>
              <li><span className="fdl-label">Program Ends</span><span className="fdl-val">Apr 2027</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Remarkable Mentorship Program. All rights reserved.</div>
          <div className="footer-tagline">Designed with intention. Built for impact.</div>
        </div>
      </footer>
    </>
  )
}

export default App
