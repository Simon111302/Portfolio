import { useState, useEffect } from 'react'
import { FaHome, FaUser, FaEnvelope, FaSun, FaMoon } from 'react-icons/fa'

function Navbar() {
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    // Theme persistence
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initialDark = saved ? saved === 'dark' : prefersDark
    setIsDark(initialDark)
    document.documentElement.setAttribute('data-theme', initialDark ? 'dark' : 'light')
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <h2 className="logo">Simon</h2>
        
        <div className="nav-right">
          <ul className="nav-links">
            <li><a href="#home"><FaHome /> Home</a></li>
            <li><a href="#tools"><FaUser /> About</a></li>
            <li><a href="#contact"><FaEnvelope /> Contact</a></li>
          </ul>
          
          {/* Theme Toggle - Right of Contact */}
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
