import './App.css'
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
