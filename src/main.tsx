import { ArrowRight, BookOpen, Braces, Check, ChevronRight, Clock3, Code2, Globe2, Layers3, Menu, Play, Search, Sparkles, Star, X } from 'lucide-react'
import { createRoot } from 'react-dom/client'
import { useState } from 'react'
import './style.css'

const courses = [
  { icon: <Code2 />, tag: 'Beginner', title: 'Python Foundations', copy: 'Write your first programs and learn to think like a developer.', lessons: '18 lessons', color: 'mint' },
  { icon: <Globe2 />, tag: 'Popular', title: 'Build for the Web', copy: 'Create beautiful, responsive websites with HTML, CSS and JS.', lessons: '24 lessons', color: 'yellow' },
  { icon: <Braces />, tag: 'Starter', title: 'JavaScript Lab', copy: 'Turn ideas into interactive projects that live in the browser.', lessons: '16 lessons', color: 'coral' },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [query, setQuery] = useState('')
  const scrollToCourses = () => document.querySelector('#courses')?.scrollIntoView({ behavior: 'smooth' })

  return <main>
    <nav>
      <a className="brand" href="#top"><span>&lt;/&gt;</span>Talent<span>Yug</span></a>
      <div className={menuOpen ? 'navlinks open' : 'navlinks'}>
        <a href="#courses">Courses</a><a href="#journey">How it works</a><a href="#community">Community</a>
        <button className="login">Log in</button><button className="nav-cta" onClick={scrollToCourses}>Start learning <ArrowRight size={15}/></button>
      </div>
      <button className="menu" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X/> : <Menu/>}</button>
    </nav>

    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><Sparkles size={15}/> YOUR FUTURE IN TECH STARTS HERE</div>
        <h1>Discover the <em>builder</em> in you.</h1>
        <p>Practical, confidence-building tech courses for intermediate students. Explore your curiosity. Create things that matter.</p>
        <div className="hero-actions"><button className="primary" onClick={scrollToCourses}>Explore courses <ArrowRight size={18}/></button><button className="watch"><span><Play size={15} fill="currentColor"/></span> How TalentYug works</button></div>
        <div className="student-line"><div className="avatars"><b>AM</b><b>RK</b><b>NS</b><b>+</b></div><span>Join <strong>12,000+ learners</strong><br/>building their futures.</span></div>
      </div>
      <div className="hero-art" aria-label="Illustration of a student learning to code">
        <div className="grid"></div><div className="sun"></div><div className="squiggle">⌁</div>
        <div className="code-window"><div className="window-top"><i></i><i></i><i></i><span>portfolio.js</span></div><div className="code-lines"><b>const</b> myFuture = <strong>'limitless'</strong>;<br/><b>while</b> (learning) &#123;<br/><span>  buildSomethingCool();</span><br/>&#125;</div></div>
        <div className="student"><div className="hair"></div><div className="face"></div><div className="neck"></div><div className="shirt"></div><div className="arm"></div><div className="laptop"><span>&lt;/&gt;</span></div></div>
        <div className="float-card progress"><span className="round-icon"><Check size={15}/></span><div><b>Lesson complete!</b><small>Great work, Anaya.</small></div></div>
        <div className="float-card badge"><span>✦</span><div><b>Creative thinker</b><small>New badge earned</small></div></div>
      </div>
    </section>

    <section className="stats"><div><strong>12K<span>+</span></strong><small>active learners</small></div><div><strong>36</strong><small>hands-on courses</small></div><div><strong>94<span>%</span></strong><small>feel more confident</small></div><div><strong>4.9<span>/5</span></strong><small>learner rating</small></div></section>

    <section className="courses" id="courses"><div className="section-head"><div><div className="eyebrow">FIND YOUR STARTING POINT</div><h2>Learn it. <em>Make it.</em> Share it.</h2></div><button className="text-btn">See all courses <ArrowRight size={17}/></button></div><div className="course-grid">{courses.filter(c => c.title.toLowerCase().includes(query.toLowerCase()) || !query).map(c => <article className="course-card" key={c.title}><div className={'course-icon ' + c.color}>{c.icon}</div><span className="course-tag">{c.tag}</span><h3>{c.title}</h3><p>{c.copy}</p><div className="course-footer"><span><Clock3 size={15}/>{c.lessons}</span><button onClick={() => alert(`Added ${c.title} to your learning plan!`)}><ArrowRight size={18}/></button></div></article>)}</div></section>

    <section className="journey" id="journey"><div className="journey-art"><div className="orbit one"></div><div className="orbit two"></div><div className="orbit-dot"></div><div className="planet">✦</div><div className="mini-card c1"><BookOpen size={19}/><span>Start a course</span></div><div className="mini-card c2"><Layers3 size={19}/><span>Build a project</span></div><div className="mini-card c3"><Star size={19}/><span>Share your work</span></div></div><div className="journey-copy"><div className="eyebrow">YOUR PATH, YOUR PACE</div><h2>Big dreams need a <em>first step.</em></h2><p>We break down the world of technology into bite-sized, exciting missions. No prior coding experience required.</p><ul><li><span><Check size={16}/></span>Learn through projects, not just lessons</li><li><span><Check size={16}/></span>Get feedback from mentors and peers</li><li><span><Check size={16}/></span>Earn a portfolio you’ll be proud to share</li></ul><button className="primary" onClick={scrollToCourses}>Choose your path <ArrowRight size={18}/></button></div></section>

    <section className="cta" id="community"><div><span className="eyebrow dark">A WHOLE COMMUNITY CHEERING YOU ON</span><h2>Your next chapter<br/>starts <em>today.</em></h2><p>There’s a place for your ideas in tech. Let’s find it together.</p></div><div className="search-box"><Search size={20}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="What do you want to learn?"/><button onClick={scrollToCourses}>Find courses <ChevronRight size={18}/></button></div></section>
    <footer><a className="brand" href="#top"><span>&lt;/&gt;</span>Talent<span>Yug</span></a><p>Made for the curious generation.</p><div><a href="#courses">Courses</a><a href="#journey">Our approach</a><a href="#community">Contact</a></div></footer>
  </main>
}
export default App

createRoot(document.getElementById('root')!).render(<App />)
