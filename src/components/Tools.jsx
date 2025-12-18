import { useEffect } from 'react'

function Tools() {
  const languages = [
    { name: 'C#', level: 'Intermediate' },
    { name: 'PHP', level: 'Intermediate' },
    { name: 'JavaScript', level: 'Intermediate' },
    { name: 'Python', level: 'Learning' },
    { name: 'C++', level: 'Intermediate' }
  ]

  const tools = [
    { name: 'VS Code', level: 'Advanced' },
    { name: 'Visual Studio', level: 'Intermediate' },
    { name: 'Git/GitHub', level: 'Intermediate' },
    { name: 'Cursor', level: 'Intermediate' },
    { name: 'Adobe', level: 'Learning' }
  ]

  const databases = [
    { name: 'MySQL', level: 'Intermediate' },
    { name: 'PostgreSQL', level: 'Learning' },
    { name: 'MongoDB', level: 'Learning' },
    { name: 'Supabase', level: 'Learning' },
    { name: 'SQL Server', level: 'Intermediate' }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cards = entry.target.querySelectorAll('.skill-card');
        
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 100);
          });
        } else {
          cards.forEach((card) => {
            card.classList.remove('animate-in');
          });
        }
      });
    }, {
      threshold: 0.2
    });

    const toolsSection = document.querySelector('#tools');
    if (toolsSection) {
      observer.observe(toolsSection);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="tools" className="tools">
      <h2>Tools/Skills</h2>
      <div className="tools-category">
        <h3 className="category-title">Languages</h3>
        <div className="skills-grid">
          {languages.map((lang, index) => (
            <div key={index} className="skill-card">
              <h4>{lang.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="tools-category">
        <h3 className="category-title">Tools & IDEs</h3>
        <div className="skills-grid">
          {tools.map((tool, index) => (
            <div key={index} className="skill-card">
              <h4>{tool.name}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="tools-category">
        <h3 className="category-title">Databases</h3>
        <div className="skills-grid">
          {databases.map((db, index) => (
            <div key={index} className="skill-card">
              <h4>{db.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Tools
