import profileImage from '../assets/simon2.jpg';

function Hero() {
    // Calculate padding based on screen width
  const getPaddingTop = () => {
    if (window.innerWidth <= 480) return '70px';      // Small phones
    if (window.innerWidth <= 768) return '75px';      // Mobile
    if (window.innerWidth <= 1024) return '80px';     // Tablet
    return '30px';                                     // Desktop
  };
  
  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-text">
          <div className="hero-title">
            <h1>I'm Simon Belenia</h1>
          </div>
          <h2>Software Developer</h2>
          <p>
            Dedicated student developer committed to continuous learning and professional
            growth in modern web technologies and full-stack development.
          </p>

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
  );
}

export default Hero;
