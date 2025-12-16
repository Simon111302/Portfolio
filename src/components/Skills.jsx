import { useEffect } from 'react'

function Skills() {
  const skills = [
    { name: 'C#', level: 'Intermediate' },
    { name: 'SQL', level: 'Intermediate' },
    { name: 'React', level: 'Learning' },
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'Windows Forms', level: 'Intermediate' },
    { name: 'Git/GitHub', level: 'Intermediate' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cards = entry.target.querySelectorAll('.skill-card');
        
        if (entry.isIntersecting) {
          // Animate cards when entering view
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 100);
          });
        } else {
          // Remove animation class when leaving view
          cards.forEach((card) => {
            card.classList.remove('animate-in');
          });
        }
      });
    }, {
      threshold: 0.2
    });

    const skillsSection = document.querySelector('#skills');
    if (skillsSection) {
      observer.observe(skillsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="skills" className="skills">
      <h2>Skills</h2>
      <div className="skills-grid">
        {skills.map((skill, index) => (
          <div key={index} className="skill-card">
            <h3>{skill.name}</h3>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
