// Smooth scroll animation for navbar links + THEME TOGGLE
document.addEventListener('DOMContentLoaded', () => {
    // 👇 YOUR EXISTING NAVBAR CODE (UNCHANGED)
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Get target section
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to section
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 👇 YOUR EXISTING SCROLL HIGHLIGHT (UNCHANGED)
    const sections = document.querySelectorAll('section, div[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 👇 NEW THEME TOGGLE (ADDED)
document.addEventListener('DOMContentLoaded', () => {
    // Your existing navbar code stays here...
    
    // THEME TOGGLE WITH WIPE ANIMATION
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const html = document.documentElement;
            const body = document.body;
            
            // Toggle theme attribute
            if (html.getAttribute('data-theme') === 'dark') {
                html.removeAttribute('data-theme');
            } else {
                html.setAttribute('data-theme', 'dark');
            }
            
            // Trigger wipe animation
            body.classList.add('theme-transitioning');
            setTimeout(() => {
                body.classList.remove('theme-transitioning');
            }, 600); // Match animation duration
        });
    }
});
});
