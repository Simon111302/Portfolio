import profileImage from '../assets/simon2.jpg';

function Hero() {
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
