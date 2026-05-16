import { useState, useEffect } from 'react'
import './App.css'
import defaultheroImg from './assets/robinn.jpg'
import drawingImg from './assets/friri.jpg'

function App() {
  const [status, setStatus] = useState('offline')
  const [activity, setActivity] = useState("I'm not doing anything right now...")

  useEffect(() => {
    fetch('https://api.lanyard.rest/v1/users/330702585352683520')
      .then(res => res.json())
      .then(response => {
        if (response && response.data) {
          setStatus(response.data.discord_status || 'offline')
          
          if (response.data.activities && response.data.activities.length > 0) {
            const currentGame = response.data.activities.find(act => act.type === 0)
            if (currentGame) {
              setActivity(`Playing: ${currentGame.name}`)
            } else if (response.data.listening_to_spotify) {
              setActivity(`Listening to Spotify: ${response.data.spotify.song}`)
            }
          }
        }
      })
      .catch(() => {
        setActivity("vou me matar amanhã...")
      })
  }, [])

  return (
    <div className="main-wrapper">
      <img src={drawingImg} className='full-screen-bg' alt='' />
      
      <div className="portfolio-card">
        <header className="profile-header">
          <div className="avatar-container">
            <img src={defaultheroImg} alt="Danny" className="profile-avatar" />
            <div className={`discord-status-dot ${status}`}></div>
          </div>
          <h1>Hi, I'm <span className='highlight'>Damiao</span>!</h1>
          <p className='status'>(=◡=)</p>
          
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

export default App