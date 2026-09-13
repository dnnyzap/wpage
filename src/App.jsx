import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import defaultHeroImg from './assets/icon.jpg'
import drawingImg from './assets/drawingms.png'
import faceImg from './assets/IMG_2948.png'
import curriculoPdf from './assets/curriculo_damiao_nunes_21_07.pdf'
import { FaCalendarAlt, FaClock, FaDownload, FaEnvelope, FaGithub, FaLinkedin } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { ArrowDown, ArrowUpRight, GripHorizontal, RotateCcw } from 'lucide-react'

const DISCORD_USER_ID = '330702585352683520'
const MANAUS_TIME_ZONE = 'America/Manaus'

const statusLabels = {
  online: 'online',
  idle: 'away',
  dnd: 'busy',
  offline: 'offline',
}

const skills = ['Java', 'Spring Boot', 'JavaScript', 'React', 'CSS', 'Git']

const socials = [
  { href: 'https://github.com/dnnyzap', label: 'GitHub', icon: <FaGithub /> },
  { href: 'https://www.linkedin.com/in/damiaonunes', label: 'LinkedIn', icon: <FaLinkedin /> },
  { href: 'mailto:damiao.barbosa.02@gmail.com', label: 'Email', icon: <FaEnvelope /> },
  { href: 'https://x.com/dnnyzap', label: 'X', icon: <FaXTwitter /> },
]

const Window = ({ title, children, className = '', draggable = false, id }) => {
  const dragStartRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  const handlePointerDown = (event) => {
    if (!draggable || event.button !== 0 || window.innerWidth <= 760 || event.target.closest('button')) return

    event.currentTarget.setPointerCapture(event.pointerId)
    dragStartRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: offset.x,
      originY: offset.y,
    }
  }

  const handlePointerMove = (event) => {
    const dragStart = dragStartRef.current
    if (!dragStart || dragStart.pointerId !== event.pointerId) return

    setOffset({
      x: dragStart.originX + event.clientX - dragStart.startX,
      y: dragStart.originY + event.clientY - dragStart.startY,
    })
  }

  const handlePointerUp = (event) => {
    if (dragStartRef.current?.pointerId === event.pointerId) {
      dragStartRef.current = null
    }
  }

  return (
    <section
      className={`retro-window ${draggable ? 'is-draggable' : ''} ${className}`}
      id={id}
      style={draggable ? { '--drag-x': `${offset.x}px`, '--drag-y': `${offset.y}px` } : undefined}
    >
      <div
        className="window-titlebar"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <span>{title}</span>
        {draggable && <div className="window-tools"><GripHorizontal size={16} aria-hidden="true" /><button type="button" onClick={() => setOffset({ x: 0, y: 0 })} title="Reset position" aria-label={`Reset ${title} position`}><RotateCcw size={14} /></button></div>}
      </div>
      <div className="window-body">
        {children}
      </div>
    </section>
  )
}

const ElapsedTime = ({ start }) => {
  const [time, setTime] = useState('00:00')

  useEffect(() => {
    const updateTime = () => {
      const elapsedSeconds = Math.max(0, Math.floor((Date.now() - start) / 1000))
      const hours = Math.floor(elapsedSeconds / 3600)
      const minutes = Math.floor((elapsedSeconds % 3600) / 60)
      const seconds = elapsedSeconds % 60

      setTime(
        hours > 0
          ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
          : `${minutes}:${String(seconds).padStart(2, '0')}`,
      )
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [start])

  return <span>{time}</span>
}

const LocalTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateStr = new Intl.DateTimeFormat('pt-BR', {
    timeZone: MANAUS_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(time)

  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: MANAUS_TIME_ZONE,
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(time)

  return (
    <div className="taskbar-clock" aria-label="Local time in Manaus">
      <span><FaCalendarAlt /> {dateStr}</span>
      <span><FaClock /> {timeStr}</span>
    </div>
  )
}

const getDiscordAssetUrl = (activity, assetId) => {
  if (!assetId) return null
  if (assetId.startsWith('mp:')) return `https://media.discordapp.net/${assetId.replace('mp:', '')}`
  return `https://cdn.discordapp.com/app-assets/${activity.application_id}/${assetId}.png`
}

const DiscordActivity = ({ data, unavailable }) => {
  if (unavailable) return <p className="presence-empty">Discord is temporarily unavailable.</p>
  if (!data) {
    return <p className="presence-empty">Connecting to Discord...</p>
  }

  const currentGame = data.activities?.find(activity => activity.type === 0)

  if (currentGame) {
    const largeUrl = getDiscordAssetUrl(currentGame, currentGame.assets?.large_image)
    const smallUrl = getDiscordAssetUrl(currentGame, currentGame.assets?.small_image)

    return (
      <div className="discord-activity-card">
        <div className="activity-images">
          {largeUrl && <img src={largeUrl} className="large-image" alt="" />}
          {smallUrl && <img src={smallUrl} className="small-image" alt="" />}
        </div>
        <div className="activity-info">
          <span className="activity-kicker">playing now</span>
          <h3>{currentGame.name}</h3>
          {currentGame.details && <p>{currentGame.details}</p>}
          {currentGame.state && <p>{currentGame.state}</p>}
          {currentGame.timestamps?.start && <p>for <ElapsedTime start={currentGame.timestamps.start} /></p>}
        </div>
      </div>
    )
  }

  if (data.listening_to_spotify && data.spotify) {
    return (
      <div className="discord-activity-card">
        <div className="activity-images">
          <img src={data.spotify.album_art_url} className="large-image" alt="" />
        </div>
        <div className="activity-info">
          <span className="activity-kicker spotify">spotify</span>
          <h3>{data.spotify.song}</h3>
          <p>by {data.spotify.artist}</p>
        </div>
      </div>
    )
  }

  return <p className="presence-empty">Probably doing something else...</p>
}

function App() {
  const [lanyardData, setLanyardData] = useState(null)
  const [presenceUnavailable, setPresenceUnavailable] = useState(false)
  const [isFaceMode, setIsFaceMode] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    const fetchPresence = () => {
      fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`, { signal: controller.signal })
        .then(res => {
          if (!res.ok) throw new Error('Presence unavailable')
          return res.json()
        })
        .then(response => {
          if (response.success) {
            setLanyardData(response.data)
            setPresenceUnavailable(false)
          } else {
            setPresenceUnavailable(true)
          }
        })
        .catch(error => {
          if (error.name !== 'AbortError') setPresenceUnavailable(true)
        })
    }

    fetchPresence()

    const interval = setInterval(fetchPresence, 3000)
    return () => {
      clearInterval(interval)
      controller.abort()
    }
  }, [])

  const avatarUrl = useMemo(() => {
    const discordUser = lanyardData?.discord_user

    if (!discordUser?.avatar) {
      return defaultHeroImg
    }

    const extension = discordUser.avatar.startsWith('a_') ? 'gif' : 'webp'
    return `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.${extension}?size=256`
  }, [lanyardData])

  const status = presenceUnavailable || !lanyardData ? 'unknown' : lanyardData.discord_status
  const displayAvatar = isFaceMode ? faceImg : avatarUrl

  return (
    <main className="desktop-shell">
      <nav className="taskbar" aria-label="Portfolio sections">
        <a href="#" className="wordmark">DN<span> / </span></a>
        <a href="#about">about</a>
        <a href="#activity">activity</a>
        <a href="#socials">socials</a>
        <a href={curriculoPdf} download="curriculo_damiao.pdf" className="taskbar-icon" aria-label="Download CV">
          <FaDownload />
        </a>
        <LocalTime />
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <img className="hero-art" src={drawingImg} alt="" />
        <div className="hero-content">
          <p className="eyebrow">DEVELOPER & DIGITAL ART ENTHUSIAST</p>
          <h1 id="hero-title">DAMIAO<br />NUNES<span className="hero-period">.</span></h1>
          <p className="hero-description">Code, curiosity<br />& a little bit of chaos.</p>
          <div className="hero-actions">
            <a className="primary-action" href="https://github.com/dnnyzap" target="_blank" rel="noreferrer"><FaGithub /> Explore GitHub <ArrowUpRight size={16} /></a>
            <a className="secondary-action" href={curriculoPdf} download="curriculo_damiao.pdf"><FaDownload /> Download CV</a>
          </div>
        </div>
        <div className="hero-bottom"><span>MANAUS, BR</span><a href="#about">A LITTLE ABOUT ME <ArrowDown size={15} /></a><span>PERSONAL PORTFOLIO / 01</span></div>
      </section>
      <div className="desktop-grid">
        <section className="intro-panel" id="about">
          <p className="eyebrow">01 / ABOUT</p>
          <h2>Always<br />building.</h2>

          <p className="bio-copy">
            Student of <strong>Analysis and Systems Development</strong> based in Manaus.
            Currently focused on <strong>Java</strong>, <strong> Spring Boot</strong>, and
            <strong> JavaScript</strong>, with a soft spot for competitive games, soulslikes,
            and digital art.
          </p>

          <div className="skills-list" aria-label="Skills">
            {skills.map(skill => (
              <span key={skill}>{skill}</span>
            ))}
          </div>
        </section>

        <section className="window-stack" aria-label="Profile details">
          <Window title="DN / PROFILE" className="profile-window">
            <button
              type="button"
              className="avatar-button"
              onClick={() => setIsFaceMode(current => !current)}
              title={isFaceMode ? 'Mostrar avatar' : 'Mostrar rosto'}
              aria-label={isFaceMode ? 'Mostrar avatar' : 'Mostrar rosto'}
              aria-pressed={isFaceMode}
            >
              <img src={displayAvatar} alt="Damiao" className="profile-avatar" />
              <span className={`discord-status-dot ${status}`} />
            </button>
            <div className="status-line">
              <span className={`status-light ${status}`} />
              Discord: {statusLabels[status] || status}
            </div>
          </Window>

          <Window title="DISCORD-ACTIVITY" className="activity-window" id="activity" draggable>
            <DiscordActivity data={lanyardData} unavailable={presenceUnavailable} />
          </Window>

          <Window title="SOCIALS" className="social-window" id="socials" draggable>
            <div className="social-links">
              {socials.map(social => (
                <a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith('mailto:') ? undefined : '_blank'}
                  rel="noreferrer"
                >
                  {social.icon}
                  <span>{social.label}</span>
                </a>
              ))}
            </div>
          </Window>

        </section>
      </div>
      <footer className="site-footer"><a href="mailto:damiao.barbosa.02@gmail.com">LET'S TALK <ArrowUpRight size={24} /></a><span>DAMIAO NUNES / {new Date().getFullYear()}</span><LocalTime /></footer>
    </main>
  )
}

export default App
