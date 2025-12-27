import { useEffect, Suspense } from 'react';
import FloatingCard3D from './FloatingCard3D';

// Import your tech icons
import cIcon from '../../img/c-.png';
import csharpIcon from '../../img/c-sharp.png';
import jsIcon from '../../img/java-script.png';
import pythonIcon from '../../img/python.png';
import vscodeIcon from '../../img/vscode.png';
import cursorIcon from '../../img/cursor.svg';
import githubIcon from '../../img/github.png';
import mysqlIcon from '../../img/mysql.png';
import postgresIcon from '../../img/postgresql.png';
import mongoIcon from '../../img/mongodb.png';
import sqlIcon from '../../img/ssms.png';
import phpIcon from '../../img/php.png';
import logo from '../../img/logo.png';

function Tools() {
  const allSkills = [
    { name: 'C#', icon: csharpIcon },
    { name: 'PHP',  icon: phpIcon },
    { name: 'JavaScript', icon: jsIcon },
    { name: 'Python', icon: pythonIcon },
    { name: 'C++', icon: cIcon },
    { name: 'VS Code', icon: vscodeIcon },
    { name: 'Visual Studio', icon: logo },
    { name: 'Git/GitHub', icon: githubIcon },
    { name: 'Cursor', icon: cursorIcon },
    { name: 'MySQL', icon: mysqlIcon },
    { name: 'PostgreSQL', icon: postgresIcon },
    { name: 'MongoDB', icon: mongoIcon },
    { name: 'SQL Server', icon: sqlIcon }
  ];

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

  const renderScrollingSection = (items, title) => (
    <div className="tools-category">
      {title && <h3 className="category-title">{title}</h3>}
      <div className="scroll-container">
        <div className="scroll-content">
          {/* First set */}
          {items.map((item, index) => (
            <div key={`${title}-1-${index}`} className="skill-card-scroll">
              {item.icon && <img src={item.icon} alt={item.name} />}
              <h4>{item.name}</h4>
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {items.map((item, index) => (
            <div key={`${title}-2-${index}`} className="skill-card-scroll">
              {item.icon && <img src={item.icon} alt={item.name} />}
              <h4>{item.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <section id="tools" className="tools">
      <h2>About</h2>
      <div className="tools-about-container">
        <div className="tools-about-left">
          <div className="tools-id-section">
            <div className="tools-3d-container">
              <Suspense fallback={<div style={{ color: '#fff', fontSize: '2rem', textAlign: 'center', padding: '50px' }}>Loading...</div>}>
                <FloatingCard3D />
              </Suspense>
            </div>
          </div>
        </div>
        <div className="tools-about-right">
          <h3>About Me</h3>
          <p>
            I'm a student developer passionate about building web applications using modern technologies. I'm eager to learn more about software development and continuously grow as a developer. I'm a passionate student developer dedicated to building innovative web applications using modern technologies. I'm committed to continuous learning and professional growth in the field of software development. My journey is driven by curiosity, a love for problem-solving, and the desire to create meaningful digital solutions that make an impact.
          </p>
        </div>
      </div>
      {renderScrollingSection(allSkills, '')}
    </section>
  );
}

export default Tools;
