import { useState, useEffect } from 'react'
import './App.css'
import defaultheroImg from './assets/icon.jpg'
import drawingImg from './assets/cosmosteste.gif'


function App() {
  const [lanyardData, setLanyardData] = useState(null)

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
  let activity = "errorrrararar."
  
  let avatarUrl = defaultheroImg


  if (lanyardData) {
    activity ="I'm not doing anythin right now :c"

    if (lanyardData.discord_user && lanyardData.discord_user.avatar) {
      const userId = lanyardData.discord_user.id;
      const avatarHash = lanyardData.discord_user.avatar;

      const isGif = avatarHash.startsWith('a_');
      const extension = isGif ? 'gif' : 'webp';

      avatarUrl = `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=256`;
    }

    if (lanyardData.activities && lanyardData.activities.length > 0) {
      const currentGame = lanyardData.activities.find(act => act.type === 0)

      if (currentGame) {
          if (currentGame.name === "Visual Studio Code") {
        activity = `Coding: ${currentGame.details}`
      } else {
        activity = `Playing: ${currentGame.name}`
      }
    } else if (lanyardData.listening_to_spotify) {
    
      activity = `Listening to: ${lanyardData.spotify.song}`
    }
    }
  
  
  return (
    <div className="main-wrapper">
      <img src={drawingImg} className='full-screen-bg' alt='' />
      
      <div className="portfolio-card">
        <header className="profile-header">
          <div className="avatar-container">
            <img src={avatarUrl} alt="Danny" className="profile-avatar retro-icon" />
            <div className={`discord-status-dot ${status}`}></div>
          </div>
          <h1>Hi, I'm <span className='highlight'>Damiao</span>!</h1>
          <p className='status'>💔</p>
          
          <div className='live-presence-text'>
            <p><em>{activity}</em></p>
          </div>
        </header>

        <section className="bio-section">
          <p>
            I'm a <strong>25 years old</strong> student of <strong>Analysis and Systems Development</strong> based in Manaus. 
            I'm in my <strong>fourth period</strong> focusing on <strong>Java, Spring Boot, and JavaScript</strong>.
          </p>
          <p>
            I'm the lead developer for <span className='highlight'>FisioNear</span>, using computer vision to guide physical therapy movements.
          </p>
          <p>
            Outside of coding, I enjoy <strong>competitive video games, soulslikes</strong>, and creating <strong>digital art</strong>.
          </p>
        </section>

        <footer className='card-footer'>
          <div className='social-links'>
            <a href='https://github.com/dnnyzap' target="_blank" rel="noreferrer">Github</a>
            <a href='https://www.linkedin.com/in/damiaonunes' target='_blank' rel='noreferrer'>Linkedin</a>
            <a href='mailto:damiao.barbosa.02@gmail.com'>Email</a>
            <a href='https://x.com/dnnyzap' target='_blank' rel='noreferrer'>X</a>
          </div>
        </footer>
      </div>
    </div>
  ) 
}
}
export default App