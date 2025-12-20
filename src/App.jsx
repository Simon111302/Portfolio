import './design/About.css';
import './design/Contact.css';
import './design/Footer.css';
import './design/Hero.css';
import './design/Navbar.css';
import './design/Project.css';
import './design/Tools.css';
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Contact from './components/Contact'
import Tools from './components/Tools'
import Project from './components/Project'
import Footer from './components/Footer'


function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Tools/>
      <Project/>
      <About />
      <Contact />
      <Footer />
    </>
  )
}


export default App
