import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa';

function Navbar() {
    return (
      <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo">Portfolio</h2>
        <ul className="nav-links">
          <li><a href="#home"><FaHome/> Home</a></li>
          <li><a href="#tools"><FaUser /> About</a></li>
          <li><a href="#contact"><FaEnvelope /> Contact</a></li>
        </ul>
      </div>
    </nav>
    )
  }
  export default Navbar
  