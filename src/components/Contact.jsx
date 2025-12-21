import { useEffect } from 'react';  // ADD THIS IMPORT

function Contact() {
  // ADD THIS useEffect
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('h2')?.classList.add('animate-in');
          setTimeout(() => {
            entry.target.querySelector('.contact-content > p')?.classList.add('animate-in');
          }, 200);
          setTimeout(() => {
            entry.target.querySelectorAll('.contact-item').forEach((item, index) => {
              setTimeout(() => item.classList.add('animate-in'), index * 150);
            });
          }, 400);
        } else {
          entry.target.querySelector('h2')?.classList.remove('animate-in');
          entry.target.querySelector('.contact-content > p')?.classList.remove('animate-in');
          entry.target.querySelectorAll('.contact-item').forEach(item => {
            item.classList.remove('animate-in');
          });
        }
      });
    }, { threshold: 0.2 });

    const section = document.querySelector('.contact');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="contact">
      <h2>Get In Touch</h2>
      <div className="contact-content">
        <p>I'm currently looking for opportunities. Feel free to reach out!</p>
        <div className="contact-info">
          <div className="contact-item">
            <h3>Email</h3>
            <a href="mailto:probelenia9@gmail.com">probelenia9@gmail.com</a>
          </div>
          <div className="contact-item">
            <h3>Facebook</h3>
            <a href="https://web.facebook.com/Simon.Belenia.1" target="_blank" rel="noopener noreferrer">
              Facebook/Simon.Belenia.1
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
