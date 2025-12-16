import profileImage from '/img/simon2.jpg'
function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-text">
          <h1>I'm Simon Belenia</h1>
          <h2>Softare Developer/Web Developer</h2>
          <p>Dedicated student developer committed to continuous learning and professional growth in modern web technologies, specializing in C#, React, and SQL.</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn-primary">View Projects</a>
            <a href="#contact" className="btn-secondary">Contact Me</a>
          </div>
        </div>
        <div className="hero-image">
          <img src={profileImage} alt="Simon Belenia" />
        </div>
      </div>
    </section>
  )
}

export default Hero
