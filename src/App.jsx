import './design/Contact.css';
import './design/Footer.css';
import './design/Hero.css';
import './design/Navbar.css';
import './design/Project.css';
import './design/Tools.css';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import Contact from './components/Contact.jsx';
import Tools from './components/Tools.jsx';
import Project from './components/Project.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Tools/>
      <Project/>
      <Contact />
      <Footer />
    </>
  );
}

export default App;
