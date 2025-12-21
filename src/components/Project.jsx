import weatherImg from '../assets/weather.png';
import ChatBot from '../assets/chatbot.png';
import movieImg from '../assets/movie.png';

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


function Project() {
  return (
    <section id="projects">
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
    </section>
  );
}

export default Project;
