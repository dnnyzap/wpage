import './App.css'
import heroImg from './assets/robinn.jpg'
import drawingImg from './assets/friri.jpg'

function App() {
  return (
    <div className="main-wrapper">
      
      <div className="profile-card">
        <header className="profile-header">
          <div className="avatar-container">
          <img src={heroImg} alt="Danny" className="profile-avatar" />
          <div className='discord-status.dot'></div>
          </div>
          <h1>Hi, I'm <span className='highlight'>Damiao</span>!</h1>
          
          
          <p className='status'>(=◡=)</p>
          <div className='discord-presence'>
            <img
              src="https://lanyard.websandbox.xyz/api/330702585352683520"
              alt="discord status"
            />
          </div>

        </header>


        <section className="bio-section">
          <p>
            I'm a <strong>25 years old</strong> student of <strong>Analysis and Systems Development</strong> based in Manaus.
            I'm currently in the <strong>fourth period</strong> of my degree and my expertise focuses on <strong>Java, Spring Boot, and JavaScript</strong>.
          </p>

          <p>
            I'm the lead of developer for <span className='highlight'>FisioNear</span>, a computer vision project designed to guide physical therapy movements using body tracking.
          </p>

          <p>
            Outside of coding, I enjoy <strong>competitive vide games and soulslike</strong>, and creating <strong>digital art</strong>.
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
        
    
      <img src={drawingImg} className='full-screen-bg' alt='' />
    </div>
  ) 
}

export default App
