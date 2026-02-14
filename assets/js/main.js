/**
 * VINAYAGAM - BACKEND ENGINEER PORTFOLIO
 * Enhanced JavaScript for Professional Interactions
 */

(function() {
  "use strict";

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  const throttle = (func, limit) => {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // ========================================
  // HEADER SCROLL BEHAVIOR
  // ========================================
  
  const header = document.querySelector('#header');
  if (header) {
    const handleHeaderScroll = throttle(() => {
      if (window.scrollY > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, 100);

    window.addEventListener('load', handleHeaderScroll);
    window.addEventListener('scroll', handleHeaderScroll);
  }

  // ========================================
  // MOBILE NAVIGATION
  // ========================================
  
  const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
  const body = document.body;

  if (mobileNavToggle) {
    mobileNavToggle.addEventListener('click', () => {
      body.classList.toggle('mobile-nav-active');
      mobileNavToggle.classList.toggle('bi-list');
      mobileNavToggle.classList.toggle('bi-x');
    });

    // Close mobile nav when clicking on a link
    document.querySelectorAll('.navmenu a').forEach(link => {
      link.addEventListener('click', () => {
        if (body.classList.contains('mobile-nav-active')) {
          body.classList.remove('mobile-nav-active');
          mobileNavToggle.classList.add('bi-list');
          mobileNavToggle.classList.remove('bi-x');
        }
      });
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
      const navmenu = document.querySelector('.navmenu');
      if (body.classList.contains('mobile-nav-active') && 
          !navmenu.contains(e.target) && 
          !mobileNavToggle.contains(e.target)) {
        body.classList.remove('mobile-nav-active');
        mobileNavToggle.classList.add('bi-list');
        mobileNavToggle.classList.remove('bi-x');
      }
    });
  }

  // ========================================
  // ACTIVE SECTION HIGHLIGHTING
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navmenu a[href^="#"]');

  const highlightActiveSection = throttle(() => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, 100);

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', highlightActiveSection);
    window.addEventListener('load', highlightActiveSection);
  }

  // ========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // SCROLL TO TOP BUTTON
  // ========================================
  
  const scrollTop = document.querySelector('.scroll-top');
  
  if (scrollTop) {
    const toggleScrollTop = throttle(() => {
      if (window.scrollY > 500) {
        scrollTop.classList.add('active');
      } else {
        scrollTop.classList.remove('active');
      }
    }, 100);

    window.addEventListener('load', toggleScrollTop);
    window.addEventListener('scroll', toggleScrollTop);

    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ========================================
  // ANIMATION ON SCROLL (AOS) INITIALIZATION
  // ========================================
  
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 100,
        delay: 0,
      });
    }
  }

  window.addEventListener('load', initAOS);

  // ========================================
  // GLIGHTBOX INITIALIZATION
  // ========================================
  
  function initGLightbox() {
    if (typeof GLightbox !== 'undefined') {
      const lightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        autoplayVideos: false,
      });
    }
  }

  window.addEventListener('load', initGLightbox);

  // ========================================
  // CODE WINDOW - Show immediately (no animation)
  // ========================================
  
  // Code is visible by default - no animation needed
  // This ensures the code shows up immediately without any fade effects

  // ========================================
  // SKILL LEVEL ANIMATION
  // ========================================
  
  function animateSkillLevels() {
    const skillLevels = document.querySelectorAll('.skill-level');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'skillGrow 1s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });

    skillLevels.forEach(level => {
      observer.observe(level);
    });
  }

  // Add CSS animation for skill levels
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skillGrow {
      from {
        opacity: 0;
        transform: scaleX(0);
        transform-origin: left;
      }
      to {
        opacity: 1;
        transform: scaleX(1);
      }
    }
  `;
  document.head.appendChild(style);

  window.addEventListener('load', animateSkillLevels);

  // ========================================
  // NUMBER COUNTER ANIMATION
  // ========================================
  
  function animateNumbers() {
    const numberElements = document.querySelectorAll('[data-count]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const target = parseInt(element.getAttribute('data-count'));
          const duration = 2000; // 2 seconds
          const step = target / (duration / 16); // 60fps
          let current = 0;

          const updateNumber = () => {
            current += step;
            if (current < target) {
              element.textContent = Math.floor(current);
              requestAnimationFrame(updateNumber);
            } else {
              element.textContent = target;
            }
          };

          updateNumber();
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.5
    });

    numberElements.forEach(el => observer.observe(el));
  }

  window.addEventListener('load', animateNumbers);

  // ========================================
  // FORM VALIDATION (if contact form exists)
  // ========================================
  
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const formData = new FormData(this);
      const formObject = {};
      
      formData.forEach((value, key) => {
        formObject[key] = value;
      });

      // Basic validation
      let isValid = true;
      const requiredFields = this.querySelectorAll('[required]');
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
        } else {
          field.classList.remove('error');
        }
      });

      if (isValid) {
        // Show success message (customize based on your backend)
        console.log('Form submitted:', formObject);
        this.reset();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'alert alert-success';
        successMessage.textContent = 'Thank you! Your message has been sent.';
        this.appendChild(successMessage);
        
        setTimeout(() => {
          successMessage.remove();
        }, 5000);
      }
    });
  }

  // ========================================
  // PARALLAX EFFECT FOR GRADIENT ORBS
  // ========================================
  
  function initParallax() {
    const gradientOrbs = document.querySelector('.gradient-orbs');
    
    if (!gradientOrbs) return;
    
    const handleParallax = throttle((e) => {
      const mouseX = e.clientX / window.innerWidth;
      const mouseY = e.clientY / window.innerHeight;
      
      gradientOrbs.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
    }, 50);

    window.addEventListener('mousemove', handleParallax);
  }

  window.addEventListener('load', initParallax);

  // ========================================
  // DYNAMIC COPYRIGHT YEAR
  // ========================================
  
  const copyrightYear = document.getElementById('copyright-year');
  if (copyrightYear) {
    copyrightYear.textContent = new Date().getFullYear();
  }

  // ========================================
  // LOADING OPTIMIZATION
  // ========================================
  
  // Lazy load images
  function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  window.addEventListener('load', initLazyLoading);

  // ========================================
  // PERFORMANCE MONITORING
  // ========================================
  
  function logPerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const perfData = window.performance.timing;
          const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
          const connectTime = perfData.responseEnd - perfData.requestStart;
          const renderTime = perfData.domComplete - perfData.domLoading;
          
          console.log('Performance Metrics:');
          console.log(`Page Load Time: ${pageLoadTime}ms`);
          console.log(`Server Response Time: ${connectTime}ms`);
          console.log(`Render Time: ${renderTime}ms`);
        }, 0);
      });
    }
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    logPerformance();
  }

  // ========================================
  // ACCESSIBILITY ENHANCEMENTS
  // ========================================
  
  // Add keyboard navigation support
  function enhanceKeyboardNav() {
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );

    focusableElements.forEach(element => {
      element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && element.tagName === 'A') {
          element.click();
        }
      });
    });

    // Focus visible for keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  window.addEventListener('load', enhanceKeyboardNav);

  // ========================================
  // CONSOLE MESSAGE (Easter Egg)
  // ========================================
  
  function showConsoleMessage() {
    const styles = [
      'color: #3b82f6',
      'font-size: 16px',
      'font-weight: bold',
      'padding: 10px',
      'background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
      'border-radius: 4px',
      'color: white'
    ].join(';');

    console.log('%c👋 Hey there, fellow developer!', styles);
    console.log(
      '%cLike what you see? Let\'s build something amazing together.\n' +
      'Email: vinayagamsankar03@gmail.com\n' +
      'LinkedIn: linkedin.com/in/vinjr',
      'color: #9ca3af; font-size: 14px; padding: 5px;'
    );
    console.log(
      '%c💡 Fun fact: This portfolio is built with clean, semantic HTML, modern CSS, and vanilla JavaScript - no frameworks needed!',
      'color: #10b981; font-size: 12px; font-style: italic; padding: 5px;'
    );
  }

  window.addEventListener('load', showConsoleMessage);

  // ========================================
  // ERROR HANDLING
  // ========================================
  
  window.addEventListener('error', (e) => {
    console.error('An error occurred:', e.error);
    // You can send this to an error tracking service in production
  });

  // ========================================
  // PAGE VISIBILITY API
  // ========================================
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👋 Come back soon! | Vinayagam';
    } else {
      document.title = 'Vinayagam | Backend Engineer & System Architect';
    }
  });

  // ========================================
  // INIT ALL ON DOM READY
  // ========================================
  
  console.log('%c✨ Portfolio initialized successfully!', 'color: #10b981; font-weight: bold;');

})();