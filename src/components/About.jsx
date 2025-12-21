import { useEffect } from 'react';

function About() {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('h2')?.classList.add('animate-in');
          setTimeout(() => {
            entry.target.querySelector('.about-content')?.classList.add('animate-in');
          }, 200);
        } else {
          entry.target.querySelector('h2')?.classList.remove('animate-in');
          entry.target.querySelector('.about-content')?.classList.remove('animate-in');
        }
      });
    }, { threshold: 0.2 });

    const section = document.querySelector('.about');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="about">
      <h2>About Me</h2>
      <div className="about-content">
          <p>
          I'm a student developer passionate about building web applications using modern technologies. I'm eager to learn more about software development and continuously grow as a developer.I'm a passionate student developer dedicated to building innovative web applications using modern technologies. I'm committed to continuous learning and professional growth in the field of software development. My journey is driven by curiosity, a love for problem-solving, and the desire to create meaningful digital solutions that make an impact.
          </p>
        </div>
    </section>
  );
}

export default About;
