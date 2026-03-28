import { useEffect, useRef, useState } from 'react'
import mentorImage from './assets/Ade (2).webp'
import testimonialImgEmmanuel from './assets/Img/Emmanuel Okpiaifo.webp'
import testimonialImgRaymond from './assets/Img/Raymond Nwachukwu.webp'
import testimonialImgGoodnews from './assets/Img/Goodnews Stephen.webp'
import testimonialImgJoel from './assets/Img/Joel Opara.webp'
import testimonialImgRachael from './assets/Img/Rachael Aimola.webp'

/** All WebP images in `src/assets/Img/Ade's work/`, sorted by filename. */
const adeWorkModules = import.meta.glob("./assets/Img/Ade's work/*.webp", {
  eager: true,
  query: '?url',
  import: 'default',
})
const mentorMomentTiles = Object.keys(adeWorkModules)
  .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
  .map((path) => adeWorkModules[path])

const MOMENTS_INITIAL_COUNT = 3

const MENTOR_BIO_SPLIT_PHRASE =
  'an organization committed to creating access to skills and opportunities for marginalized African youth and women.'

const MENTOR_BIO_FULL = `Ademulegun (Ade') Olowojoba is a serial entrepreneur, human capital development expert and social innovator with over a decade of experience building people and organisations, designing programmes, and advising governments and institutions on youth employment, entrepreneurship development, digital skills, and workforce development across Nigeria and Africa.

He is the Founding Partner and CEO of NerdzFactory Company, a leading Social Innovation and Human Capital Development Company that he started from his room in Lagos in 2017 with less than USD 100 in capital. What began as a lean startup has grown into a pan-African organisation that has reached over 100,000 young people with digital skills, workforce development, and entrepreneurship programmes, working with leading institutions including The World Bank Group, The United Nations, The United States Africa Development Foundation, UK Government, German Development Corporation, The Nigerian Presidency, Meta, Google, Mastercard Foundation, British Council, King's Trust International, Raspberry Pi Foundation and a host of others. He is also the founder of NerdzFactory Foundation, an organization committed to creating access to skills and opportunities for marginalized African youth and women.

Before founding NerdzFactory, Ade' built his expertise at the intersection of technology, human capital, and public policy. He managed Community Affairs and Youth Employment initiatives for Microsoft Nigeria, where he managed the Lagos-Andela Open Skilling Programme, one of Nigeria's earliest technology upskilling programs. He subsequently served as the pioneer Project Lead for CodeLagos, a first-of-its-kind government initiative in Africa which aimed to train one million Lagosians to code, overseeing the establishment of over 300 coding centres across schools, universities, and public spaces in Lagos State.

He also worked with the Ondo State and Edo State Governments on human capital and innovation initiatives, serving as the pioneer Director for Human Capital Development under Ondo State's Office of Innovation and Partnerships. He has also collaborated with The Federal Government of Nigeria, Lagos State, Bayelsa State, Oyo State, Ekiti State, Kwara State, Ogun State, Asia State, Anambra State, Kano State to mention a few on teacher development, skills development and digital economy programmes - bringing private sector rigour to public sector challenges.

At the international level, Ade' has represented Nigeria and Africa in some of the world's most significant forums. In 2019, he spoke at the Paris Peace Forum in France, sharing the stage with African Billionaire and Philanthropist, Mo Ibrahim, the President of the United Nations General Assembly Tijani Mohammed Bande, the Executive Director of the International Trade Centre Arancha Gonzalez, and the Former President of Burundi, Late Pierre Buoyaya. In 2020, he moderated a high-level session on education systems and COVID-19, hosting former Italian Prime Minister Enrico Letta and Former Malian President Sheikh Modibo Diarra.

Between 2018 and 2021, he served as a Youth and Education Expert at the African Union-European Union Youth Cooperation Hub, providing advisory and monitoring support for a EUR 10 million initiative implemented concurrently in Mali and Spain.

Beyond NerdzFactory, Ade' is a builder of people, platforms and communities. He founded BizGrowthAfrica, a platform for African entrepreneurs and SMEs, and GrowthPath, a personal development brand through which he creates frameworks, accelerator programmes, newsletters, and content for ambitious individuals committed to intentional growth. He also founded Faith & Business, a community for Christian entrepreneurs who believe that purpose and commerce are partners, not opposites.

He is currently based in Winnipeg, Canada, where he lives with his wife, Oluwadamilola and his two kids, Oluwatomike and Oluwatimisire while continuing to lead organisations and build initiatives that are actively shaping the future of Nigeria and Africa.

Through Remarkable, Ade' is making the kind of learnings that shaped his own trajectory directly accessible to fifty carefully selected professionals and entrepreneurs who are ready to do the work. His approach is direct, practical, and deeply personal.`

const mentorBioSplitIndex = MENTOR_BIO_FULL.indexOf(MENTOR_BIO_SPLIT_PHRASE)
const MENTOR_BIO_LEAD =
  mentorBioSplitIndex >= 0 ? MENTOR_BIO_FULL.slice(0, mentorBioSplitIndex) : MENTOR_BIO_FULL
const MENTOR_BIO_REST =
  mentorBioSplitIndex >= 0 ? MENTOR_BIO_FULL.slice(mentorBioSplitIndex) : ''
const mentorBioRestParagraphs = MENTOR_BIO_REST.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)

/** { quote, name, image } — `image` optional (initials fallback). Headshots: `src/assets/Img/`. */
const testimonials = [
  {
    quote:
      "Meeting Mr. Ade Olowojoba was a turning point in my career. His mentorship reshaped how I think about growth, discipline, and positioning, helping me approach my work with clarity, intention, and long-term vision.",
    name: 'Emmanuel Okpaifo',
    image: testimonialImgEmmanuel,
  },
  {
    quote:
      "Meeting Mr. Ade in 2020 was a turning point in my professional journey. More than an employer, he is a big brother and a visionary mentor who has taught me the mechanics of growth and strategic thinking. I'm incredibly lucky to be learning under his guidance.",
    name: 'Raymond Nwachukwu',
    image: testimonialImgRaymond,
  },
  {
    quote:
      'Working with Ade Olowojoba was a defining season of growth for me. His mentorship sharpened my skills in grant writing and program management, built my confidence, and opened real opportunities. He leads with clarity and genuinely creates room for others to grow and excel.',
    name: 'Goodnews Stephen',
    image: testimonialImgGoodnews,
  },
  {
    quote:
      "I used the Growth Blueprint & Planner by Mr Ade to plan my 2026, and it was deeply self-reflective. The questions challenged me, uncovered hidden blocks, and gave me clarity across my career, business, finances, relationships, and personal growth. Even in a short time of knowing him, I've gained valuable insight and direction.",
    name: 'Joel Opara',
    image: testimonialImgJoel,
  },
  {
    quote:
      "A leader who doesn't just manage, but mentors. I'm grateful to have a boss like Ade who is also a mentor. His support, honesty, and guidance have helped me grow professionally, think more strategically, and believe more in my abilities.",
    name: 'Rachael Aimola',
    image: testimonialImgRachael,
  },
]

function testimonialInitials(name) {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return (parts[0]?.[0] || '?').toUpperCase()
}

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
  const [hearOtherSpecify, setHearOtherSpecify] = useState('')
  const [videoFileName, setVideoFileName] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formMessage, setFormMessage] = useState(null)
  const [fieldErrors, setFieldErrors] = useState({})
  const [momentsExpanded, setMomentsExpanded] = useState(false)
  const [lightboxSrc, setLightboxSrc] = useState(null)
  const [mentorBioExpanded, setMentorBioExpanded] = useState(false)
  const momentsGridRef = useRef(null)
  const wasMomentsExpandedRef = useRef(momentsExpanded)

  const visibleMoments = momentsExpanded
    ? mentorMomentTiles
    : mentorMomentTiles.slice(0, MOMENTS_INITIAL_COUNT)
  const hasMoreMoments = mentorMomentTiles.length > MOMENTS_INITIAL_COUNT

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    window.localStorage.setItem('remarkable-theme', theme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen || lightboxSrc ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen, lightboxSrc])

  useEffect(() => {
    if (!lightboxSrc) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setLightboxSrc(null)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxSrc])

  useEffect(() => {
    const was = wasMomentsExpandedRef.current
    wasMomentsExpandedRef.current = momentsExpanded
    if (was === momentsExpanded) return
    const grid = momentsGridRef.current
    if (!grid) return
    const t = window.setTimeout(() => {
      if (!was && momentsExpanded) {
        grid.querySelector('.moment-card:nth-child(4)')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      } else if (was && !momentsExpanded) {
        grid.querySelector('.moment-card:nth-child(1)')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 120)
    return () => window.clearTimeout(t)
  }, [momentsExpanded])

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
      const required = ['firstName', 'lastName', 'age', 'gender', 'state', 'email', 'whatsapp']
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
      const required = ['satisfactionWhy', 'gap', 'burningQuestion', 'vision', 'ordinaryWhen']
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
      const otherSpec = String(formData.get('hearOtherSpecify') || '').trim()
      if (!selectedScale2) errors.commitmentScore = 'Please choose a score.'
      if (hearAbout === 'Referred by someone' && !referrer) errors.referrer = 'Please tell us who referred you.'
      if (hearAbout === 'Other' && !otherSpec) errors.hearOtherSpecify = 'Please specify how you heard about us.'
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please complete all logistics and commitment fields before continuing.' })
        return false
      }
    }

    if (step === 6) {
      if (!agreed) {
        setFieldErrors((prev) => ({ ...prev, declarationAgreed: 'Please confirm to continue.' }))
        setFormMessage({ type: 'error', text: 'Please read and agree to the declaration before submitting.' })
        return false
      }
      const signName = String(formData.get('signFullName') || '').trim()
      const signDate = String(formData.get('signDate') || '').trim()
      if (!signName) errors.signFullName = 'Please enter your full name.'
      if (!signDate) errors.signDate = 'Please enter today’s date.'
      if (Object.keys(errors).length) {
        setFieldErrors((prev) => ({ ...prev, ...errors }))
        setFormMessage({ type: 'error', text: 'Please complete your name and date to finish your application.' })
        return false
      }
    }

    setFieldErrors((prev) => {
      const next = { ...prev }
      const stepFields = {
        1: ['firstName', 'lastName', 'age', 'gender', 'state', 'email', 'whatsapp'],
        2: ['track', 'jobOrBusiness', 'industry', 'years', 'currentWork'],
        3: ['satisfactionScore', 'satisfactionWhy', 'gap', 'burningQuestion', 'vision', 'ordinaryWhen'],
        4: ['videoLink'],
        5: ['attend', 'commitmentScore', 'commitmentWhy', 'hearAbout', 'referrer', 'hearOtherSpecify'],
        6: ['declarationAgreed', 'signFullName', 'signDate'],
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
    const firstName = String(formData.get('firstName') || '').trim()
    const lastName = String(formData.get('lastName') || '').trim()
    const payload = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
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
      burningQuestion: formData.get('burningQuestion') || '',
      vision: formData.get('vision') || '',
      ordinaryWhen: formData.get('ordinaryWhen') || '',
      videoFileName: videoFileName || '',
      videoLink: formData.get('videoLink') || '',
      canAttendLaunch: formData.get('attend') || '',
      commitmentScore: selectedScale2 || '',
      commitmentWhy: formData.get('commitmentWhy') || '',
      hearAbout: formData.get('hearAbout') || '',
      referrer: formData.get('referrer') || '',
      hearOtherSpecify: formData.get('hearOtherSpecify') || '',
      declarationAgreed: agreed,
      signFullName: formData.get('signFullName') || '',
      signDate: formData.get('signDate') || '',
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
      setHearOtherSpecify('')
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
            <a href="#stories">Stories</a>
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
        <a href="#stories" onClick={() => setMenuOpen(false)}>Stories</a>
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
          <div className="eyebrow reveal">Profile</div>
          <div className="mentor-grid reveal">
            <div className="mentor-photo">
              <img src={mentorImage} alt="Ade' Olowojoba" />
            </div>
            <div>
              <div className="mentor-name">Lead Mentor — Ade&apos; Olowojoba</div>
              <div className="mentor-role">Serial Entrepreneur · Social Innovator</div>
              <div className="mentor-bio-block">
                <p className="mentor-bio">{MENTOR_BIO_LEAD}</p>
                {mentorBioExpanded ? (
                  <div className="mentor-bio-expanded">
                    {mentorBioRestParagraphs.map((para, i) => (
                      <p key={i} className="mentor-bio">
                        {para}
                      </p>
                    ))}
                  </div>
                ) : null}
                {MENTOR_BIO_REST ? (
                  <div className="mentor-bio-actions">
                    <button
                      type="button"
                      className={`btn-ghost moments-toggle mentor-bio-toggle ${mentorBioExpanded ? 'moments-toggle--less' : 'moments-toggle--more'}`}
                      onClick={() => setMentorBioExpanded((v) => !v)}
                      aria-expanded={mentorBioExpanded}
                    >
                      {mentorBioExpanded ? 'Read less' : 'Read more'}
                    </button>
                  </div>
                ) : null}
              </div>
              <blockquote className="mentor-pull">"The version of you that is possible is not a fantasy. It is a decision. Remarkable exists to help you make that decision — and then execute on it, every single month, for a year."</blockquote>
              <div className="mentor-attribution">— Ade' Olowojoba</div>
            </div>
          </div>

          <div className="mentor-track reveal">
            <div className="mentor-track-heading">
              <span className="mentor-track-icon" aria-hidden="true" />
              Mentorship you can verify
            </div>
            <p className="mentor-track-lead body-text">
              Before Remarkable, Ade&apos; spent years building programs and teams that meet young people where they are — in classrooms, communities, and partner ecosystems across Nigeria and beyond.
            </p>
            <div className="mentor-stats">
              <div className="mentor-stat mentor-stat--a">
                <span className="mentor-stat-val">100k+</span>
                <span className="mentor-stat-label">Young people reached via NerdzFactory programmes</span>
              </div>
              <div className="mentor-stat mentor-stat--b">
                <span className="mentor-stat-val">CodeLagos</span>
                <span className="mentor-stat-label">Pioneer project lead — state-wide digital skills</span>
              </div>
              <div className="mentor-stat mentor-stat--c">
                <span className="mentor-stat-val">20+</span>
                <span className="mentor-stat-label">Team members across three continents</span>
              </div>
              <div className="mentor-stat mentor-stat--d">
                <span className="mentor-stat-val">Meta · UNDP</span>
                <span className="mentor-stat-label">Plus Mastercard Foundation, British Council, GIZ &amp; more</span>
              </div>
            </div>
            <ul className="mentor-track-list">
              <li>
                Scaled NerdzFactory from a room with under USD 100 into a pan-African organisation — over 100,000 young people reached with digital skills, workforce development, and entrepreneurship programmes.
              </li>
              <li>
                Corporate chapter: Community Affairs at Microsoft Nigeria; later a director in Ondo State Government — bridging public purpose and private-sector execution.
              </li>
              <li>
                Today: based in Canada with his family while actively building ventures that invest in Nigeria and Africa&apos;s next generation — Remarkable is that same through-line, condensed for 50 people.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="moments-section moments-section-scroll" id="stories" aria-labelledby="moments-heading">
        <div className="moments-section-glow" aria-hidden="true" />
        <div className="inner moments-inner">
          <div className="eyebrow reveal">In the room</div>
          <h2 className="section-title reveal" id="moments-heading">
            Moments from <em>the work</em>
          </h2>
          <p className="body-text reveal" style={{ maxWidth: '560px' }}>
            Mentoring shows up in rooms — stages, cohorts, and partner programs. A few moments from the field.
          </p>
          <div
            ref={momentsGridRef}
            className="moments-grid reveal"
            aria-label="Photos from programs and events"
          >
            {visibleMoments.map((src, i) => (
              <button
                type="button"
                className={`moment-card${i === 0 ? ' moment-card--first-photo' : ''}`}
                key={src}
                onClick={() => setLightboxSrc(src)}
                aria-label="Open image fullscreen"
              >
                <div className="moment-card-shine" aria-hidden="true" />
                <img src={src} alt="" loading="lazy" decoding="async" />
              </button>
            ))}
          </div>
          {hasMoreMoments && !momentsExpanded ? (
            <div className="moments-preload" aria-hidden="true">
              {mentorMomentTiles.slice(MOMENTS_INITIAL_COUNT).map((src) => (
                <img
                  key={`preload-${src}`}
                  src={src}
                  alt=""
                  width={1}
                  height={1}
                  loading="eager"
                  decoding="async"
                  fetchPriority="low"
                />
              ))}
            </div>
          ) : null}
          {hasMoreMoments ? (
            <div className="moments-actions reveal">
              <button
                type="button"
                className={`btn-ghost moments-toggle ${momentsExpanded ? 'moments-toggle--less' : 'moments-toggle--more'}`}
                onClick={() => setMomentsExpanded((v) => !v)}
                aria-expanded={momentsExpanded}
              >
                {momentsExpanded ? 'View less' : 'View more'}
              </button>
            </div>
          ) : null}
        </div>
      </section>

      {lightboxSrc ? (
        <div
          className="moment-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Fullscreen photo"
          onClick={() => setLightboxSrc(null)}
        >
          <button
            type="button"
            className="moment-lightbox-close"
            onClick={(e) => {
              e.stopPropagation()
              setLightboxSrc(null)
            }}
            aria-label="Close fullscreen image"
          >
            ×
          </button>
          <img
            className={`moment-lightbox-img${lightboxSrc === mentorMomentTiles[0] ? ' moment-lightbox-img--rotated' : ''}`}
            src={lightboxSrc}
            alt=""
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      ) : null}

      <section className="testimonials-section" id="voices" aria-labelledby="voices-heading">
        <div className="testimonials-section-glow" aria-hidden="true" />
        <div className="inner testimonials-inner">
          <div className="eyebrow reveal">Voices</div>
          <h2 className="section-title reveal" id="voices-heading">
            What people <em>say</em>
          </h2>
          <p className="body-text reveal" style={{ maxWidth: '560px' }}>
            Reflections from professionals who have worked with Ade&apos; through programs and mentoring contexts.
          </p>
          <div className="testimonials-grid reveal">
            {testimonials.map((t, i) => (
              <div className="testimonial-shell" key={`${t.name}-${i}`}>
                <blockquote className="testimonial-card">
                  <div className="testimonial-avatar-ring" aria-hidden="true">
                    {t.image ? (
                      <img src={t.image} alt="" />
                    ) : (
                      <span className="testimonial-avatar-initials">{testimonialInitials(t.name)}</span>
                    )}
                  </div>
                  <div className="testimonial-card-inner">
                    <p className="testimonial-quote">{t.quote}</p>
                    <cite className="testimonial-name">{t.name}</cite>
                  </div>
                </blockquote>
              </div>
            ))}
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
            <div className="faq-item"><div className="faq-q">When does the application close?</div><div className="faq-a">Applications for Remarkable '26 close on April 8, 2026. Successful applicants will be notified by April 10, 2026. We strongly encourage early applications.</div></div>
            <div className="faq-item"><div className="faq-q">Can I apply outside Lagos?</div><div className="faq-a">Yes. While the program is anchored in Lagos, we welcome applications from high-potential individuals across Nigeria. Virtual participation is fully supported for monthly sessions.</div></div>
          </div>
        </div>
      </section>

      <section className="apply-section" id="apply">
        <div className="apply-bg"></div>
        <div className="inner">
          <div className="apply-header reveal">
            <div className="apply-key-dates-strip">
              Applications close: <strong>April 8, 2026</strong>
              <span className="apply-key-sep">|</span>
              Notifications: <strong>April 10, 2026</strong>
              <span className="apply-key-sep">|</span>
              Launch: <strong>April 18, 2026</strong>
            </div>
            <div className="apply-deadline"><div className="apply-deadline-dot"></div>Applications Close — April 8, 2026</div>
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
                <div className="form-doc-header">
                  <div className="form-doc-brand">REMARKABLE</div>
                  <div className="form-doc-program">Mentorship Program &apos;26</div>
                  <div className="form-doc-title">APPLICATION FORM</div>
                  <div className="form-doc-dates">
                    Applications close: April 8, 2026 <span className="form-doc-sep">|</span> Notifications: April 10, 2026 <span className="form-doc-sep">|</span> Launch: April 18, 2026
                  </div>
                  <p className="form-how-to">
                    <strong>How to use this form:</strong> Complete every section honestly and thoroughly. Your answers — and your video pitch — are how we determine if Remarkable &apos;26 is the right fit for you. We are looking for clarity, self-awareness, and genuine hunger for growth.
                  </p>
                </div>

                <div className={`form-section ${activeStep === 1 ? 'active' : ''}`} data-step="1">
                  <div className="form-section-header"><div className="form-section-num">SECTION A — Personal Information</div><div className="form-section-title">Your details</div></div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">1. First Name <span>*</span></label><input className={`form-input ${fieldErrors.firstName ? 'has-error' : ''}`} name="firstName" type="text" autoComplete="given-name" onChange={() => clearFieldError('firstName')} />{fieldErrors.firstName ? <div className="field-error">{fieldErrors.firstName}</div> : null}</div>
                    <div className="form-field"><label className="form-label">2. Last Name <span>*</span></label><input className={`form-input ${fieldErrors.lastName ? 'has-error' : ''}`} name="lastName" type="text" autoComplete="family-name" onChange={() => clearFieldError('lastName')} />{fieldErrors.lastName ? <div className="field-error">{fieldErrors.lastName}</div> : null}</div>
                  </div>
                  <div className="form-field"><label className="form-label">3. Age <span>*</span></label><input className={`form-input ${fieldErrors.age ? 'has-error' : ''}`} name="age" type="number" min="18" max="50" onChange={() => clearFieldError('age')} />{fieldErrors.age ? <div className="field-error">{fieldErrors.age}</div> : null}</div>
                  <div className="form-field"><label className="form-label">4. Gender <span>*</span></label><select className={`form-select ${fieldErrors.gender ? 'has-error' : ''}`} name="gender" onChange={() => clearFieldError('gender')}><option value="">Select gender</option><option>Male</option><option>Female</option><option>Prefer not to say</option></select>{fieldErrors.gender ? <div className="field-error">{fieldErrors.gender}</div> : null}</div>
                  <div className="form-field"><label className="form-label">5. State of Residence in Nigeria <span>*</span></label><input className={`form-input ${fieldErrors.state ? 'has-error' : ''}`} name="state" type="text" placeholder="e.g. Lagos" onChange={() => clearFieldError('state')} />{fieldErrors.state ? <div className="field-error">{fieldErrors.state}</div> : null}</div>
                  <div className="form-row">
                    <div className="form-field"><label className="form-label">6. Email Address <span>*</span></label><input className={`form-input ${fieldErrors.email ? 'has-error' : ''}`} name="email" type="email" autoComplete="email" onChange={() => clearFieldError('email')} />{fieldErrors.email ? <div className="field-error">{fieldErrors.email}</div> : null}</div>
                    <div className="form-field"><label className="form-label">7. WhatsApp Number <span>*</span></label><input className={`form-input ${fieldErrors.whatsapp ? 'has-error' : ''}`} name="whatsapp" type="tel" autoComplete="tel" onChange={() => clearFieldError('whatsapp')} />{fieldErrors.whatsapp ? <div className="field-error">{fieldErrors.whatsapp}</div> : null}</div>
                  </div>
                  <div className="form-field"><label className="form-label">8. LinkedIn Profile URL <span className="form-label-opt">(optional but encouraged)</span></label><input className="form-input" name="linkedin" type="url" placeholder="https://linkedin.com/in/yourprofile" /></div>
                </div>

                <div className={`form-section ${activeStep === 2 ? 'active' : ''}`} data-step="2">
                  <div className="form-section-header"><div className="form-section-num">SECTION B — Career &amp; Business Profile</div><div className="form-section-title">Where you are professionally</div></div>
                  <div className="form-field"><label className="form-label">9. You are primarily: <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="track" value="A working professional" id="t1" onChange={() => clearFieldError('track')} /><label htmlFor="t1">A working professional</label></div><div className="form-radio"><input type="radio" name="track" value="A founder / entrepreneur" id="t2" onChange={() => clearFieldError('track')} /><label htmlFor="t2">A founder / entrepreneur</label></div><div className="form-radio"><input type="radio" name="track" value="Both — professional with a business on the side" id="t3" onChange={() => clearFieldError('track')} /><label htmlFor="t3">Both — professional with a business on the side</label></div></div>{fieldErrors.track ? <div className="field-error">{fieldErrors.track}</div> : null}</div>
                  <div className="form-field"><label className="form-label">10. Current Job Title or Business Name <span>*</span></label><input className={`form-input ${fieldErrors.jobOrBusiness ? 'has-error' : ''}`} name="jobOrBusiness" type="text" onChange={() => clearFieldError('jobOrBusiness')} />{fieldErrors.jobOrBusiness ? <div className="field-error">{fieldErrors.jobOrBusiness}</div> : null}</div>
                  <div className="form-field"><label className="form-label">11. Industry / Sector <span>*</span></label><input className={`form-input ${fieldErrors.industry ? 'has-error' : ''}`} name="industry" type="text" onChange={() => clearFieldError('industry')} />{fieldErrors.industry ? <div className="field-error">{fieldErrors.industry}</div> : null}</div>
                  <div className="form-field"><label className="form-label">12. Years into your career or business <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="years" value="1 – 2 years" id="y1" onChange={() => clearFieldError('years')} /><label htmlFor="y1">1 – 2 years</label></div><div className="form-radio"><input type="radio" name="years" value="3 – 5 years" id="y2" onChange={() => clearFieldError('years')} /><label htmlFor="y2">3 – 5 years</label></div><div className="form-radio"><input type="radio" name="years" value="5+ years" id="y3" onChange={() => clearFieldError('years')} /><label htmlFor="y3">5+ years</label></div></div>{fieldErrors.years ? <div className="field-error">{fieldErrors.years}</div> : null}</div>
                  <div className="form-field"><label className="form-label">13. In 2–3 sentences, describe what you currently do. Keep it clear and specific. <span>*</span></label><textarea className={`form-textarea ${fieldErrors.currentWork ? 'has-error' : ''}`} name="currentWork" style={{ minHeight: '120px' }} onChange={() => clearFieldError('currentWork')}></textarea>{fieldErrors.currentWork ? <div className="field-error">{fieldErrors.currentWork}</div> : null}</div>
                </div>

                <div className={`form-section ${activeStep === 3 ? 'active' : ''}`} data-step="3">
                  <div className="form-section-header"><div className="form-section-num">SECTION C — The Growth Questions</div><div className="form-section-title">Honest answers only</div></div>
                  <div className="form-section-note">
                    <strong>A note on this section:</strong> Short, sharp, honest answers only. 3–5 sentences per question. We are not looking for polished language. We are looking for someone who knows themselves well enough to be real.
                  </div>
                  <div className="form-field">
                    <label className="form-label">14. Where you are right now <span>*</span></label>
                    <p className="form-hint" style={{ marginBottom: '14px' }}>On a scale of 1–10, how satisfied are you with where you are — and why that score, not higher?</p>
                    <p className="form-hint form-hint-strong">Score (select one):</p>
                    <div className="scale-group">{Array.from({ length: 10 }).map((_, i) => <button key={i + 1} type="button" className={`scale-btn ${selectedScale1 === i + 1 ? 'selected' : ''}`} onClick={() => { setSelectedScale1(i + 1); clearFieldError('satisfactionScore') }}>{i + 1}</button>)}</div>
                    {fieldErrors.satisfactionScore ? <div className="field-error">{fieldErrors.satisfactionScore}</div> : null}
                    <textarea className={`form-textarea ${fieldErrors.satisfactionWhy ? 'has-error' : ''}`} name="satisfactionWhy" style={{ minHeight: '110px' }} onChange={() => clearFieldError('satisfactionWhy')}></textarea>
                    {fieldErrors.satisfactionWhy ? <div className="field-error">{fieldErrors.satisfactionWhy}</div> : null}
                  </div>
                  <div className="form-field"><label className="form-label">15. The gap <span>*</span></label><p className="form-hint">What is the single biggest thing standing between you and the next level?</p><textarea className={`form-textarea ${fieldErrors.gap ? 'has-error' : ''}`} name="gap" onChange={() => clearFieldError('gap')}></textarea>{fieldErrors.gap ? <div className="field-error">{fieldErrors.gap}</div> : null}</div>
                  <div className="form-field"><label className="form-label">16. The burning question <span>*</span></label><p className="form-hint">What is the one question you cannot stop asking yourself — about your career, your business, your finances, your purpose, or your life? And what frustration keeps showing up, no matter how hard you work?</p><textarea className={`form-textarea ${fieldErrors.burningQuestion ? 'has-error' : ''}`} name="burningQuestion" onChange={() => clearFieldError('burningQuestion')}></textarea>{fieldErrors.burningQuestion ? <div className="field-error">{fieldErrors.burningQuestion}</div> : null}</div>
                  <div className="form-field"><label className="form-label">17. The vision <span>*</span></label><p className="form-hint">One year from now, after Remarkable — what has changed in your life? Be specific.</p><textarea className={`form-textarea ${fieldErrors.vision ? 'has-error' : ''}`} name="vision" onChange={() => clearFieldError('vision')}></textarea>{fieldErrors.vision ? <div className="field-error">{fieldErrors.vision}</div> : null}</div>
                  <div className="form-field"><label className="form-label">18. Complete this sentence in 2–3 sentences <span>*</span></label><div className="declaration-box" style={{ padding: '16px 20px', marginBottom: '12px' }}>&quot;I refused to be ordinary when I...&quot;</div><textarea className={`form-textarea ${fieldErrors.ordinaryWhen ? 'has-error' : ''}`} name="ordinaryWhen" style={{ minHeight: '100px' }} onChange={() => clearFieldError('ordinaryWhen')}></textarea>{fieldErrors.ordinaryWhen ? <div className="field-error">{fieldErrors.ordinaryWhen}</div> : null}</div>
                </div>

                <div className={`form-section ${activeStep === 4 ? 'active' : ''}`} data-step="4">
                  <div className="form-section-header"><div className="form-section-num">SECTION D — The Video Pitch</div><div className="form-section-title form-section-title-urgent">This is the most important part of your application</div></div>
                  <p className="form-block-lead">Record a 60–90 second video and upload the file or share a link (Google Drive, Dropbox, or YouTube unlisted). <strong>A video link or file is required.</strong></p>
                  <p className="form-hint" style={{ marginBottom: '16px' }}>Your video must answer these three things — in any order, in your own words:</p>
                  <ol className="form-numbered-list"><li>Who are you and what do you do?</li><li>Why do you want to be in Remarkable &apos;26?</li><li>What will the cohort lose if you are not in the room?</li></ol>
                  <div className="video-upload-box">
                    <div className="video-upload-title">Upload your video file</div>
                    <div className="video-upload-sub">MP4, MOV, or AVI · aim for 60–90 seconds</div>
                    <input type="file" accept="video/*" onChange={(e) => setVideoFileName(e.target.files?.[0]?.name || '')} />
                    {videoFileName ? <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--ember-light)' }}>Selected: {videoFileName}</div> : null}
                  </div>
                  <div className="or-divider"><span>or paste a link</span></div>
                  <div className="form-field"><label className="form-label">19. Video link or file upload <span>*</span></label><p className="form-hint">Paste your Google Drive / YouTube / Dropbox link here:</p><input className={`form-input ${fieldErrors.videoLink ? 'has-error' : ''}`} name="videoLink" type="url" placeholder="https://..." onChange={() => clearFieldError('videoLink')} />{fieldErrors.videoLink ? <div className="field-error">{fieldErrors.videoLink}</div> : null}</div>
                  <div className="video-guidelines"><div className="video-guidelines-title">Guidelines</div><ul><li>Exactly 60–90 seconds. No longer.</li><li>Face clearly visible. Speak directly to camera.</li><li>No scripts. No reading. Just you.</li><li>Any environment is fine — we are looking at you, not your background.</li></ul></div>
                </div>

                <div className={`form-section ${activeStep === 5 ? 'active' : ''}`} data-step="5">
                  <div className="form-section-header"><div className="form-section-num">SECTION E — Logistics &amp; Commitment</div><div className="form-section-title">Final details</div></div>
                  <div className="form-field"><label className="form-label">20. Can you attend the in-person launch event in Lagos on Saturday, April 18, 2026? <span>*</span></label><div className="form-radio-group"><div className="form-radio"><input type="radio" name="attend" value="Yes — I will be there" id="a1" onChange={() => clearFieldError('attend')} /><label htmlFor="a1">Yes — I will be there</label></div><div className="form-radio"><input type="radio" name="attend" value="I am outside Lagos but will make travel arrangements" id="a2" onChange={() => clearFieldError('attend')} /><label htmlFor="a2">I am outside Lagos but will make travel arrangements</label></div><div className="form-radio"><input type="radio" name="attend" value="No — I cannot attend in person" id="a3" onChange={() => clearFieldError('attend')} /><label htmlFor="a3">No — I cannot attend in person</label></div></div>{fieldErrors.attend ? <div className="field-error">{fieldErrors.attend}</div> : null}</div>
                  <div className="form-field"><label className="form-label">21. How did you hear about Remarkable? <span>*</span></label><select className={`form-select ${fieldErrors.hearAbout ? 'has-error' : ''}`} name="hearAbout" value={hearSource} onChange={(e) => {
                      const v = e.target.value
                      setHearSource(v)
                      if (v !== 'Other') setHearOtherSpecify('')
                      clearFieldError('hearAbout')
                    }}><option value="">Select one</option><option>Instagram</option><option>LinkedIn</option><option>WhatsApp</option><option>MSME Africa</option><option>BizGrowth Africa</option><option>NerdzFactory Company Newsletter</option><option>Referred by someone</option><option>Other</option></select>{fieldErrors.hearAbout ? <div className="field-error">{fieldErrors.hearAbout}</div> : null}</div>
                  {hearSource === 'Referred by someone' ? <div className="form-field"><label className="form-label">Name of person who referred you <span>*</span></label><input className={`form-input ${fieldErrors.referrer ? 'has-error' : ''}`} name="referrer" type="text" onChange={() => clearFieldError('referrer')} />{fieldErrors.referrer ? <div className="field-error">{fieldErrors.referrer}</div> : null}</div> : null}
                  {hearSource === 'Other' ? <div className="form-field"><label className="form-label">Please specify <span>*</span></label><input className={`form-input ${fieldErrors.hearOtherSpecify ? 'has-error' : ''}`} name="hearOtherSpecify" type="text" value={hearOtherSpecify} onChange={(e) => { setHearOtherSpecify(e.target.value); clearFieldError('hearOtherSpecify') }} />{fieldErrors.hearOtherSpecify ? <div className="field-error">{fieldErrors.hearOtherSpecify}</div> : null}</div> : null}
                  <div className="form-field">
                    <label className="form-label">22. Commitment check <span>*</span></label>
                    <p className="form-hint" style={{ marginBottom: '14px' }}>On a scale of 1–10, how committed are you to 12 months of full participation — and what makes you say that number and not a 10? (2–3 sentences)</p>
                    <p className="form-hint form-hint-strong">Score (select one):</p>
                    <div className="scale-group">{Array.from({ length: 10 }).map((_, i) => <button key={i + 1} type="button" className={`scale-btn ${selectedScale2 === i + 1 ? 'selected' : ''}`} onClick={() => { setSelectedScale2(i + 1); clearFieldError('commitmentScore') }}>{i + 1}</button>)}</div>
                    {fieldErrors.commitmentScore ? <div className="field-error">{fieldErrors.commitmentScore}</div> : null}
                    <textarea className={`form-textarea ${fieldErrors.commitmentWhy ? 'has-error' : ''}`} name="commitmentWhy" style={{ minHeight: '100px' }} onChange={() => clearFieldError('commitmentWhy')}></textarea>
                    {fieldErrors.commitmentWhy ? <div className="field-error">{fieldErrors.commitmentWhy}</div> : null}
                  </div>
                </div>

                <div className={`form-section ${activeStep === 6 ? 'active' : ''}`} data-step="6">
                  <div className="form-section-header"><div className="form-section-num">SECTION F — Declaration</div><div className="form-section-title">Read carefully before signing</div></div>
                  <div className="declaration-box"><p className="declaration-text">I understand that Remarkable &apos;26 is a 12-month commitment. I agree to show up consistently, engage with honesty and integrity, complete monthly assignments, support my peers, and give my absolute best to this journey. I understand that if I am selected, my spot represents an opportunity denied to someone else — and I will honour that.</p></div>
                  <label className="form-checkbox-wrap"><input type="checkbox" checked={agreed} onChange={(e) => { setAgreed(e.target.checked); clearFieldError('declarationAgreed') }} /><span className="form-checkbox-label">I agree and I am ready.</span></label>
                  {fieldErrors.declarationAgreed ? <div className="field-error" style={{ marginTop: '8px' }}>{fieldErrors.declarationAgreed}</div> : null}
                  <div className="form-row form-sign-row" style={{ marginTop: '24px' }}>
                    <div className="form-field"><label className="form-label">Full Name <span>*</span></label><input className={`form-input ${fieldErrors.signFullName ? 'has-error' : ''}`} name="signFullName" type="text" autoComplete="name" onChange={() => clearFieldError('signFullName')} />{fieldErrors.signFullName ? <div className="field-error">{fieldErrors.signFullName}</div> : null}</div>
                    <div className="form-field"><label className="form-label">Date <span>*</span></label><input className={`form-input ${fieldErrors.signDate ? 'has-error' : ''}`} name="signDate" type="date" onChange={() => clearFieldError('signDate')} />{fieldErrors.signDate ? <div className="field-error">{fieldErrors.signDate}</div> : null}</div>
                  </div>
                  <div className="form-footer-tag">REMARKABLE &apos;26 — For those who refused to be ordinary.</div>
                  <div className="declaration-box" style={{ marginTop: '24px' }}>
                    <div className="video-guidelines-title">Key dates</div>
                    <div className="sched-item"><div className="sched-name">Applications close</div><div className="sched-name" style={{ marginLeft: 'auto' }}>April 8, 2026</div></div>
                    <div className="sched-item"><div className="sched-name">Notifications</div><div className="sched-name" style={{ marginLeft: 'auto' }}>April 10, 2026</div></div>
                    <div className="sched-item"><div className="sched-name">Launch</div><div className="sched-name" style={{ marginLeft: 'auto', color: 'var(--ember-light)' }}>April 18, 2026 · Lagos</div></div>
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '40px' }}><button type="button" className="form-btn-submit" onClick={submitForm} disabled={isSubmitting}>{isSubmitting ? 'Submitting...' : 'Submit application'}</button><p className="form-hint" style={{ marginTop: '16px' }}>Applications are reviewed individually. Only 50 spots available.</p></div>
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
          <div className="date-item"><div className="date-milestone">Deadline</div><div className="date-val">April 8, 2026</div></div>
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
              <li><a href="#stories">Stories</a></li>
              <li><a href="#apply">Apply Now</a></li>
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Key Dates</div>
            <ul className="footer-date-list">
              <li><span className="fdl-label">Applications Open</span><span className="fdl-val">Now</span></li>
              <li><span className="fdl-label">Deadline</span><span className="fdl-val">Apr 8, 2026</span></li>
              <li><span className="fdl-label">Notifications</span><span className="fdl-val">Apr 10, 2026</span></li>
              <li><span className="fdl-label">Launch Event</span><span className="fdl-val">Apr 18, 2026</span></li>
              <li><span className="fdl-label">Program Ends</span><span className="fdl-val">Apr 2027</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© 2026 Remarkable Mentorship Program. All rights reserved.</div>
          <div className="footer-tagline">REMARKABLE &apos;26 — For those who refused to be ordinary. Applications close April 8, 2026.</div>
        </div>
      </footer>
    </>
  )
}

export default App
