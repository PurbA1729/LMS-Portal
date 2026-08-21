import { ArrowRight, BarChart3, Bell, BookOpen, Check, Clock3, Code2, Globe2, LogOut, Menu, Sparkles, X } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import { type ReactNode, useEffect, useState } from 'react'
import talentYugLogo from './assets/talentYug-logo.png'
import './style.css'
import './responsive.css'

type Lecture = {
  title: string
  duration: string
}

type Course = {
  id: string
  icon: ReactNode
  tag: string
  title: string
  copy: string
  lessons: string
  color: 'mint' | 'yellow' | 'coral'
  level: string
  duration: string
  lectures: Lecture[]
}

const courses: Course[] = [
  {
    id: 'python-foundations',
    icon: <Code2 />,
    tag: 'Beginner',
    title: 'Python Foundations',
    copy: 'Build your Python fundamentals with practical coding exercises and beginner-friendly guidance.',
    lessons: '18 lessons',
    color: 'mint',
    level: 'Beginner',
    duration: '3 weeks',
    lectures: [
      { title: 'Python setup and syntax', duration: '12 min' },
      { title: 'Variables and data types', duration: '18 min' },
      { title: 'Loops and conditionals', duration: '16 min' },
      { title: 'Functions and modules', duration: '20 min' }
    ]
  },
  {
    id: 'web-development',
    icon: <Globe2 />,
    tag: 'Popular',
    title: 'Build for the Web',
    copy: 'Learn responsive design, HTML structure, and JavaScript interactivity to ship modern interfaces.',
    lessons: '24 lessons',
    color: 'yellow',
    level: 'Intermediate',
    duration: '5 weeks',
    lectures: [
      { title: 'HTML structure', duration: '14 min' },
      { title: 'CSS layout systems', duration: '18 min' },
      { title: 'JavaScript interactivity', duration: '22 min' },
      { title: 'Responsive design', duration: '24 min' }
    ]
  },
  {
    id: 'javascript-lab',
    icon: <BookOpen />,
    tag: 'Starter',
    title: 'JavaScript Lab',
    copy: 'Practice browser-based projects and strengthen your JavaScript skills through guided labs.',
    lessons: '16 lessons',
    color: 'coral',
    level: 'Intermediate',
    duration: '4 weeks',
    lectures: [
      { title: 'ES6 basics', duration: '13 min' },
      { title: 'DOM manipulation', duration: '20 min' },
      { title: 'Events and forms', duration: '17 min' },
      { title: 'API integration', duration: '25 min' }
    ]
  }
]

function AuthForm({ mode, onSubmit, onGoogle, onClose }:{ mode:'login'|'register', onSubmit:(payload:{name?:string,email:string,password:string})=>Promise<void> | void, onGoogle:()=>Promise<void> | void, onClose:()=>void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const validatePassword = (value: string) => /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(value)

  return <form className="auth-form" onSubmit={async (event) => {
    event.preventDefault()
    if (mode === 'register' && !validatePassword(password)) {
      setError('Password must have at least 8 characters, 1 uppercase letter, 1 number, and 1 special character.')
      return
    }
    setError('')
    await onSubmit(mode === 'register' ? { name, email, password } : { email, password })
  }}>
    {mode === 'register' && (
      <label>
        <span>Full name</span>
        <input value={name} onChange={e => setName(e.target.value)} required placeholder="Your full name" />
      </label>
    )}

    <label>
      <span>Email</span>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
    </label>

    <label>
      <span>Password</span>
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter password" />
    </label>

    {error && <div className="auth-error">{error}</div>}

    <div className="auth-actions">
      <button type="submit" className="primary-btn">{mode === 'login' ? 'Log in' : 'Create account'}</button>
      <button type="button" className="secondary-btn" onClick={onClose}>Cancel</button>
    </div>

    <button type="button" className="google-btn" onClick={() => onGoogle()}>
      Continue with Google
    </button>
  </form>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null)
  const [authStatus, setAuthStatus] = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(() => typeof window !== 'undefined' ? Boolean(localStorage.getItem('lms_token')) : false)
  const [userName, setUserName] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('lms_user') || 'Student' : 'Student')
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [completedLectures, setCompletedLectures] = useState<Record<string, boolean[]>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      return JSON.parse(localStorage.getItem('lms_completed') || '{}')
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lms_completed', JSON.stringify(completedLectures))
    }
  }, [completedLectures])

  const closeMenu = () => setMenuOpen(false)

  const openAuth = (mode: 'login' | 'register') => {
    setAuthStatus('')
    setAuthMode(mode)
    closeMenu()
  }

  const closeAuth = () => setAuthMode(null)

  const getCourseProgress = (course: Course) => {
    const done = completedLectures[course.id] || Array(course.lectures.length).fill(false)
    const count = done.filter(Boolean).length
    return Math.round((count / course.lectures.length) * 100)
  }

  const toggleLecture = (courseId: string, index: number) => {
    setCompletedLectures((current) => {
      const next = { ...current }
      const list = [...(next[courseId] || Array(courses.find(c => c.id === courseId)?.lectures.length || 0).fill(false))]
      list[index] = !list[index]
      next[courseId] = list
      return next
    })
  }

  async function handleLogin(payload: { email: string; password: string }) {
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Login failed')
      localStorage.setItem('lms_token', data.token)
      const name = payload.email.split('@')[0] || 'Student'
      localStorage.setItem('lms_user', name)
      setUserName(name)
      setIsLoggedIn(true)
      setAuthStatus('Logged in successfully.')
      setAuthMode(null)
      setProfileOpen(false)
    } catch (error: any) {
      setAuthStatus(error.message || 'Unable to log in. Please try again.')
    }
  }

  async function handleRegister(payload: { name?: string; email: string; password: string }) {
    try {
      const response = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: payload.name || 'Learner', email: payload.email, password: payload.password })
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Registration failed')
      setAuthStatus('Registration successful. You can now sign in.')
      setAuthMode('login')
    } catch (error: any) {
      setAuthStatus(error.message || 'Unable to register right now.')
    }
  }

  async function handleGoogleLogin() {
    try {
      const response = await fetch('http://localhost:4000/auth/google', { method: 'POST' })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Google login failed')
      localStorage.setItem('lms_token', data.token)
      const gName = 'Google Learner'
      localStorage.setItem('lms_user', gName)
      setUserName(gName)
      setIsLoggedIn(true)
      setAuthStatus('Google login successful')
      setAuthMode(null)
      setProfileOpen(false)
    } catch (error: any) {
      setAuthStatus(error.message || 'Unable to continue with Google.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('lms_token')
    localStorage.removeItem('lms_user')
    setIsLoggedIn(false)
    setProfileOpen(false)
    setSelectedCourse(null)
  }

  const openCourse = (course: Course) => {
    if (!isLoggedIn) {
      setAuthMode('login')
      setAuthStatus('Please log in to unlock course lessons.')
      return
    }
    setSelectedCourse(course)
  }

  const filteredCourses = courses.filter((course) => course.title.toLowerCase().includes(query.toLowerCase()) || !query)

  return <main className="lms-shell">
    <nav>
      <a className="brand" href="#top" aria-label="TalentYug home">
        <span className="brand-mark"><img src={talentYugLogo} alt="" /></span>
        <span className="brand-name">TalentYug</span>
      </a>

      <div className={menuOpen ? 'navlinks open' : 'navlinks'}>
        {!isLoggedIn ? (
          <>
            <a href="#top" onClick={closeMenu}>Home</a>
            <a href="#courses" onClick={closeMenu}>Courses</a>
            <a href="#support" onClick={closeMenu}>Support</a>
            <button className="nav-btn" onClick={() => openAuth('login')}>Login</button>
            <button className="primary-btn" onClick={() => openAuth('register')}>Register</button>
          </>
        ) : (
          <>
            <a href="#dashboard" onClick={closeMenu}>Dashboard</a>
            <a href="#courses" onClick={closeMenu}>Courses</a>
            <a href="#library" onClick={closeMenu}>Library</a>
            <a href="#support" onClick={closeMenu}>Support</a>
            <div className="profile-wrap mobile-profile-row">
              <span className="profile-label">Account</span>
              <button className="profile-btn" onClick={() => setProfileOpen((prev) => !prev)}>{userName.slice(0, 2).toUpperCase()}</button>
              {profileOpen && (
                <div className="profile-menu">
                  <div className="profile-user">{userName}</div>
                  <button onClick={() => { setProfileOpen(false); setSelectedCourse(null); closeMenu(); }}><Bell size={14} /> Notifications</button>
                  <button onClick={() => { handleLogout(); closeMenu(); }}><LogOut size={14} /> Logout</button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <button className="menu" aria-label="Menu" onClick={() => setMenuOpen((prev) => !prev)}>{menuOpen ? <X /> : <Menu />}</button>
    </nav>

    {!isLoggedIn ? (
      <>
        <section className="hero" id="top">
          <div className="hero-copy">
            <div className="eyebrow"><Sparkles size={15} /> Build your career with practical learning</div>
            <h1>Learn modern skills and grow with confidence.</h1>
            <p>Access guided courses, mentoring, and practical resources designed for learners who want to build real-world capability.</p>
            <div className="hero-actions">
              <button className="primary-btn" onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}>Explore courses <ArrowRight size={18} /></button>
              <button className="secondary-btn" onClick={() => openAuth('register')}>Join free</button>
            </div>

            <div className="student-line">
              <div className="avatars">
                <b>AM</b><b>RK</b><b>NS</b><b>+</b>
              </div>
              <span>12,000+ learners currently building their future.</span>
            </div>
          </div>

          <div className="hero-art" aria-label="Learning dashboard illustration">
            <div className="grid"></div>
            <div className="sun"></div>
            <div className="float-card progress">
              <span className="round-icon"><Check size={15} /></span>
              <div><b>Lesson complete!</b><small>Great work, Anaya.</small></div>
            </div>
            <div className="float-card badge"><span>✦</span><div><b>Creative thinker</b><small>New badge earned</small></div></div>
          </div>
        </section>

        <section className="stats">
          <div><strong>12K<span>+</span></strong><small>active learners</small></div>
          <div><strong>36</strong><small>hands-on courses</small></div>
          <div><strong>94<span>%</span></strong><small>feel more confident</small></div>
          <div><strong>4.9<span>/5</span></strong><small>learner rating</small></div>
        </section>
      </>
    ) : (
      <section className="dashboard-shell" id="dashboard">
        <div className="dashboard-grid">
          <div className="welcome-panel">
            <span className="eyebrow">Your learning dashboard</span>
            <h2>Welcome back, {userName}.</h2>
            <p>Continue where you left off and keep momentum on your learning goals.</p>
            <div className="dashboard-actions">
              <button className="primary-btn" onClick={() => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })}>Continue learning</button>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-header">
              <span className="eyebrow">Progress</span>
              <BarChart3 size={18} />
            </div>
            <div className="summary-stat">68%</div>
            <p>Average course completion</p>
          </div>
        </div>
      </section>
    )}

    <section className="courses" id="courses">
      <div className="section-head">
        <div>
          <div className="eyebrow">Explore your learning path</div>
          <h2>{isLoggedIn ? 'Continue your learning journey.' : 'Choose a course that matches your goals.'}</h2>
        </div>
      </div>

      <div className="search-wrap">
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses" aria-label="Search courses" />
      </div>

      <div className="course-grid">
        {filteredCourses.map((course) => {
          const progress = getCourseProgress(course)
          const current = completedLectures[course.id] || Array(course.lectures.length).fill(false)
          const completedCount = current.filter(Boolean).length

          return <article className="course-card" key={course.id}>
            <div className={'course-icon ' + course.color}>{course.icon}</div>
            <span className="course-tag">{course.tag}</span>
            <h3>{course.title}</h3>
            <p>{course.copy}</p>
            <div className="course-meta">
              <span>{course.level}</span>
              <span>{course.duration}</span>
            </div>
            <div className="mini-progress">
              <div className="mini-progress-bar"><span style={{ width: `${progress}%` }} /></div>
              <strong>{progress}%</strong>
            </div>
            <div className="course-footer">
              <span><Clock3 size={15} />{course.lessons}</span>
              <button onClick={() => openCourse(course)} aria-label={'Open ' + course.title}>{isLoggedIn ? 'Open' : 'Login'}</button>
            </div>
            <div className="course-progress-note">{completedCount}/{course.lectures.length} completed</div>
          </article>
        })}
      </div>

      {selectedCourse && (
        <div className="course-detail" id="library">
          <div className="course-detail-header">
            <div>
              <span className="eyebrow">Course module</span>
              <h3>{selectedCourse.title}</h3>
            </div>
            <button className="secondary-btn" onClick={() => setSelectedCourse(null)}>Close</button>
          </div>

          <div className="detail-layout">
            <div className="detail-card info-panel">
              <div className={'course-icon ' + selectedCourse.color}>{selectedCourse.icon}</div>
              <p>{selectedCourse.copy}</p>
              <div className="detail-meta-row">
                <span>{selectedCourse.level}</span>
                <span>{selectedCourse.duration}</span>
                <span>{selectedCourse.lessons}</span>
              </div>
              <div className="detail-progress">
                <div className="mini-progress-bar"><span style={{ width: `${getCourseProgress(selectedCourse)}%` }} /></div>
                <strong>{getCourseProgress(selectedCourse)}% complete</strong>
              </div>
            </div>

            <div className="detail-card list-panel">
              <div className="lecture-list">
                {selectedCourse.lectures.map((lecture, index) => {
                  const isComplete = completedLectures[selectedCourse.id]?.[index] || false
                  return <div className={`lecture-row ${isComplete ? 'done' : ''}`} key={lecture.title}>
                    <div className="lecture-index">0{index + 1}</div>
                    <div>
                      <strong>{lecture.title}</strong>
                      <small>{lecture.duration}</small>
                    </div>
                    <button className="lecture-toggle" onClick={() => toggleLecture(selectedCourse.id, index)}>
                      {isComplete ? 'Completed' : 'Mark done'}
                    </button>
                  </div>
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>

    <section className="feature-strip" id="support">
      <div className="feature-box">
        <h3>Mentor support</h3>
        <p>Get guidance from industry mentors and community discussions.</p>
      </div>
      <div className="feature-box">
        <h3>Certificates</h3>
        <p>Earn digital certificates and show your progress to employers.</p>
      </div>
      <div className="feature-box">
        <h3>Flexible learning</h3>
        <p>Study anytime, anywhere with self-paced online lessons.</p>
      </div>
    </section>

    <footer className="site-footer">
      <a className="brand" href="#top" aria-label="TalentYug home">
        <span className="brand-mark"><img src={talentYugLogo} alt="" /></span>
        <span className="brand-name">TalentYug</span>
      </a>
      <p>Made for curious learners and future builders.</p>
      <div>
        <a href="#courses">Courses</a>
        <a href="#library">Library</a>
        <a href="#support">Support</a>
      </div>
    </footer>

    {authMode && (
      <div className="modal-backdrop" onClick={closeAuth}>
        <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
          <div className="auth-header">
            <h3>{authMode === 'login' ? 'Welcome back' : 'Create your account'}</h3>
            <button className="close-btn" onClick={closeAuth} aria-label="Close auth modal">×</button>
          </div>

          <div className="tab-toggle">
            <button className={authMode === 'login' ? 'active' : ''} onClick={() => setAuthMode('login')}>Login</button>
            <button className={authMode === 'register' ? 'active' : ''} onClick={() => setAuthMode('register')}>Register</button>
          </div>

          {authStatus && <div className="auth-status">{authStatus}</div>}
          <AuthForm mode={authMode} onSubmit={authMode === 'login' ? handleLogin : handleRegister} onGoogle={handleGoogleLogin} onClose={closeAuth} />
        </div>
      </div>
    )}
  </main>
}

export default App

createRoot(document.getElementById('root')!).render(<App />)
