import { useEffect, useState, useRef } from 'react';
import { FaEnvelope, FaFacebook } from 'react-icons/fa';

function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelector('h2')?.classList.add('animate-in');
          setTimeout(() => {
            entry.target.querySelector('.contact-content > p')?.classList.add('animate-in');
          }, 200);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    const section = document.querySelector('.contact');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    const formData = new FormData(formRef.current);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (result.success) {
        setStatus('success');
        formRef.current.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="contact">
      <h2>Get In Touch</h2>
      <div className="contact-content">
        <p>I'm currently looking for opportunities. Feel free to reach out!</p>

        <form ref={formRef} className="contact-form" onSubmit={sendEmail}>
          <input type="text" name="name" placeholder="Your Name" required />
          <input type="email" name="email" placeholder="Email Address" required />
          <input type="text" name="subject" placeholder="Subject" required />
          <textarea name="message" rows="5" placeholder="Your Message" required />

          <div className="contact-actions">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>

            <div className="contact-icons">
              <a href="mailto:probelenia9@gmail.com" className="contact-icon" title="Email" aria-label="Email">
                <FaEnvelope />
              </a>
              <a 
                href="https://web.facebook.com/Simon.Belenia.1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-icon" 
                title="Facebook" 
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </div>

          {status === 'success' && (
            <div className="success-message">
              ✅ Message sent successfully! I'll get back to you soon.
            </div>
          )}
          {status === 'error' && (
            <div className="error-message">
              ❌ Failed to send message. Please try again.
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
