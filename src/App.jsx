import { useState, useEffect, use } from 'react'
import './App.css'
import defaultheroImg from './assets/icon.jpg'
import drawingImg from './assets/robbie.gif'

import { get } from 'use-lanyard'
import { FaGithub, FaLinkedin, FaEnvelope, FaCalendarAlt, FaClock, FaDownload } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import faceImg from './assets/IMG_2948.png'
import curriculoPdf from './assets/curriculo_damiao_nunes_21_07.pdf'





const ElapsedTime = ({ start }) => {
  const [time, setTime] = useState('00:00')

}

const LocalTime = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const dateStr = new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'America/Manaus',
    weekday: 'short',
    day: 'numeric',
    month: 'short'

  }).format(time)

  const timeStr = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Manaus',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  }).format(time)

  return (
    <div className="local-time-wrapper">
      <p className="local-time-label">Local Time:</p>
      <div className="time-badges">
        <div className="badge date-badge">
          <FaCalendarAlt /> <span>{dateStr}</span>
          </div>
        <div className="badge time-badge">
          <FaClock /> <span>{timeStr}</span>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [lanyardData, setLanyardData] = useState(null)
  const [isFaceMode, setIsFaceMode] = useState(false)

  useEffect(() => {
    const fetchPresence = () => {
      fetch('https://api.lanyard.rest/v1/users/330702585352683520')
        .then(res => res.json())
        .then(response => {
          if (response.success) {
            setLanyardData(response.data)
          }
        })
        .catch(error => console.error("Lanyard fetch error:", error))
    }

    fetchPresence()

    const interval = setInterval(fetchPresence, 3000)
    return () => clearInterval(interval)
  }, [])


  const status = lanyardData?.discord_status || 'offline'
  let avatarUrl = defaultheroImg

  let decorationUrl = null;

  let activityUI = <p className='live-presence-text'><em>Connecting....</em></p>


  if (lanyardData) {
    if (lanyardData.discord_user?.avatar_decoration_data) {
      const decorationId = lanyardData.discord_user.avatar_decoration_data.asset;
      decorationUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decorationId}.png?size=256`;
    }
    activityUI = <p className='live-presence-text'><em>Probably doing something else...</em></p>

    if (lanyardData.discord_user?.avatar) {
      const { id, avatar } = lanyardData.discord_user
      const extension = avatar.startsWith('a_') ? 'gif' : 'webp'
      avatarUrl = `https://cdn.discordapp.com/avatars/${id}/${avatar}.${extension}?size=256`;
    }

    if (lanyardData.activities && lanyardData.activities.length > 0) {
      const currentGame = lanyardData.activities.find(act => act.type === 0)

      if (currentGame) {
        const appId = currentGame.application_id
        const largeImage = currentGame.assets?.large_image
        const smallImage = currentGame.assets?.small_image

        const getImageUrl = (assetId) => {
          if (!assetId) return null;
          if (assetId.startsWith('mp:')) return `https://media.discordapp.net/${assetId.replace('mp:', '')}`;
          return `https://cdn.discordapp.com/app-assets/${appId}/${assetId}.png`;
        }

        const largeUrl = getImageUrl(largeImage)
        const smallUrl = getImageUrl(smallImage)

        activityUI = (
          <div className="discord-activity-card">
            <div className='activity-images'>
              {largeUrl && <img src={largeUrl} className='large-image' alt='Large Asset' />}
              {smallUrl && <img src={smallUrl} className='small-image' alt='Small Asset' />}
            </div>
            <div className='activity-info'>
              <h4>{currentGame.name}</h4>
              {currentGame.details && <p>{currentGame.details}</p>}
              {currentGame.state && <p>{currentGame.state}</p>}
              {currentGame.timestamps?.start && (
                <p><ElapsedTime start={currentGame.timestamps.start} /></p>
              )}
            </div>
          </div>
        )
      } else if (lanyardData.listening_to_spotify) {
        const spotify = lanyardData.spotify;
        activityUI = (
          <div className='discord-activity-card'>
            <div className='activity-images'>
              <img src={spotify.album_art_url} className='large-image' alt='Album Art' />
            </div>
            <div className='activity-info'>
              <h4>Listening to Spotify</h4>
              <p style={{ color: '#1DB954', fontWeight: 'bold' }}>{spotify.song}</p>
              <p>by {spotify.artist}</p>
            </div>
          </div>
        )
      }
    }
  }


  let displayAvatar = isFaceMode ? faceImg : avatarUrl;


  return (
    <div className="main-wrapper">
      <img src={drawingImg} className='full-screen-bg' alt='' />

      <div className="portfolio-card">
        <header className="profile-header">
          <div className="avatar-container">
            <img
              src={displayAvatar}
              alt="Danny"
              className="profile-avatar retro-icon"
              onClick={() => setIsFaceMode(!isFaceMode)}
              style={{ cursor: 'pointer' }}
              title={isFaceMode ? 'Mostrar Avatar' : 'Mostrar Rosto'}
            />

            <img
              src={decorationUrl}
              alt="Avatar Decoration"
              className="avatar-decoration"
            />
            <div className={`discord-status-dot ${status}`}></div>
          </div>
          <h1>Hi, I'm <span className='highlight'>Damiao</span>!</h1>
          <p className='status'>💔</p>

          <LocalTime />

          {activityUI}
        </header>

        <section className="bio-section">
          <p>
            I'm a <strong>25 years old</strong> student of <strong>Analysis and Systems Development</strong> based in Manaus.
            I'm in my <strong>fourth period</strong> focusing on <strong>Java, Spring Boot, and JavaScript</strong>.
          </p>
          <p>
            Outside of coding, I enjoy <strong>competitive video games, soulslikes</strong>, and creating <strong>digital art</strong>.
          </p>
        </section>

        <footer className='card-footer'>
          <div className='social-links'>
            <a href='https://github.com/dnnyzap' target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href='https://www.linkedin.com/in/damiaonunes' target='_blank' rel='noreferrer'>
              <FaLinkedin />
            </a>
            <a href='mailto:damiao.barbosa.02@gmail.com'>
              <FaEnvelope />
            </a>
            <a href='https://x.com/dnnyzap' target='_blank' rel='noreferrer'>
              <FaXTwitter />
            </a>
          </div>
          <a 
          href={curriculoPdf}
          download="curriculo_damiao.pdf" 
          className='download-cv-button'>
            <FaDownload />
          </a>
        </footer>
      </div>
    </div>
  )
}

export default App