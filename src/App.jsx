/// import { GithubIcon, LinkedinIcon, MailIcon, TWitterIcon } from 'lucide-react'
import heroImg from './assets/robinn.jpg'
import './App.css'

function App() {
  return (
    <div className="main-wrapper">
      <div className="portfolio-card">
        {/* Hero Image */}
        <nav className="navbar">
          <img src={heroImg} alt="Danny icon" className="nav-avatar" />

          <div className="nav-links">
            <a href="#work">Work</a>
            <a href="#contact">Contact</a>
          </div>
          
        </nav>

        <header className="hero">
          <p className="overline">Hello, I'm</p>
          <h1>Danny</h1>

          <p className="description">
            blabaerelabvalerbaelbjalerbaerlgkljeakmvaleba <strong> slbakbelkbel </strong>
          </p>
   <div className='social-links'> 
            <a href='https://github.com/dnnyzap' target="_blank" rel="noreferrer">Github</a>
            <a href='https://www.linkedin.com/in/damiaonunes' target='_blank' rel='noreferrer'>Linkedin</a>
            <a href='mailto:damiao.barbosa.02@gmail.com'>Email</a>
            <a href='https://x.com/dnnyzap' target='_blank' rel='noreferrer'>X</a>
          </div>
        </header>
      </div>
    </div>
  )
}

export default App
