import { useEffect, useRef, useState } from 'react';
import { FaEnvelope, FaFacebook } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

function Contact() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const formRef = useRef(null);

  useEffect(() => {
    emailjs.init('jA5CPdKXB_LHrHRKw');
  }, []);

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

    try {
      await emailjs.sendForm(
        'service_fd8ofoa',     
        'template_ih9tkj8',    
        formRef.current,
        'jA5CPdKXB_LHrHRKw'   
      );
      setStatus('success');
      formRef.current.reset();
    } catch (error) {
      console.error('EmailJS error:', error);
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
              <a href="mailto:probelenia9@gmail.com" className="contact-icon" title="Email">
                <FaEnvelope />
              </a>
              <a href="https://web.facebook.com/Simon.Belenia.1" target="_blank" rel="noopener noreferrer" className="contact-icon">
                <FaFacebook />
              </a>
            </div>
          </div>
          {status === 'success' && (
            <div className="success-message">✅ Message sent successfully!</div>
          )}
          {status === 'error' && (
            <div className="error-message">❌ Failed to send. Try again.</div>
          )}
        </form>
      </div>
    </section>
  );
}

export default Contact;
