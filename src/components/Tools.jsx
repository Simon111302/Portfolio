import { useEffect, Suspense } from 'react';
import FloatingCard3D from './FloatingCard3D';
import weatherImg from '../assets/weather.png';
import ChatBot from '../assets/chatbot.png';
import movieImg from '../assets/movie.png';


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

  const projects = [
    {
      id: 1,
      title: "Weather App",
      description: "Real-time weather application for Philippine cities using OpenWeatherMap API. Features responsive design with dark theme and hourly forecasts.",
      technologies: ["React", "OpenWeatherMap API", "JavaScript"],
      image: weatherImg,
      liveLink: "https://simonweath.vercel.app/",
      features: [
        "Real-time weather data for Philippine cities",
        "Hourly forecast display",
        "Responsive design (mobile & desktop)",
        "City selector dropdown"
      ]
    },
    {
      id: 2,
      title: "Simple Chatbot",
      description: "An interactive AI chatbot application with a clean and intuitive user interface. Built to demonstrate conversational AI integration.",
      technologies: ["React", "AI Integration", "Vercel", "JavaScript"],
      image: ChatBot, 
      liveLink: "https://simonchatbot.vercel.app",
      features: [
        "Real-time chat interface",
        "AI-powered responses",
        "Clean and modern UI",
        "Fast and responsive"
      ]
    },
    {
      id: 3,
      title: "Movie Website",
      description: "A dynamic movie browsing application built with React and TypeScript. Discover trending movies, search your favorites, and explore detailed information.",
      technologies: ["React", "TypeScript", "Movie API"],
      image: movieImg,
      liveLink: "https://simonmoves.vercel.app/",
      features: [
        "Browse trending and popular movies",
        "Search functionality",
        "Detailed movie information",
        "Responsive design"
      ]
    }
  ];


  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const cards = entry.target.querySelectorAll('.skill-card, .project-card');
        
        if (entry.isIntersecting) {
          cards.forEach((card, index) => {
            setTimeout(() => {
              card.classList.add('animate-in');
            }, index * 100);
          });
          // Disconnect observer after animation triggers once
          observer.unobserve(entry.target);
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
      <div className="tech-stack-section">
      <h2>Tech Stack</h2>
      </div>
      {renderScrollingSection(allSkills, '')}

      {/* Projects Section */}
      <div id="projects" className="projects-section">
        <h2>My Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <img src={project.image} alt={project.title} />
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <div className="tech-stack">
                {project.technologies.map((tech, index) => (
                  <span key={index} className="tech-badge">{tech}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


export default Tools;
