/**
 * VINAYAGAM.D - CREATIVE PORTFOLIO
 * Terminal + Editorial Aesthetic
 * JavaScript for Interactions & Animations
 */

(function() {
  'use strict';

  // ========================================
  // MATRIX RAIN EFFECT
  // ========================================
  
  function initMatrixRain() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    function draw() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#ffcc00';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const interval = setInterval(draw, 50);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  window.addEventListener('load', initMatrixRain);

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
  const debounce = (func, wait) => {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
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
  // SMOOTH SCROLL FOR NAVIGATION
  // ========================================
  
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      
      if (target) {
        const navHeight = document.querySelector('.terminal-nav')?.offsetHeight || 80;
        const targetPosition = target.offsetTop - navHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ========================================
  // ACTIVE NAVIGATION HIGHLIGHTING
  // ========================================
  
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-cmd');

  const highlightActiveNav = throttle(() => {
    let currentSection = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      const scrollPosition = window.scrollY + 200;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }, 100);

  window.addEventListener('scroll', highlightActiveNav);
  window.addEventListener('load', highlightActiveNav);

  // ========================================
  // TERMINAL CURSOR BLINK ANIMATION
  // ========================================
  
  const cursorElements = document.querySelectorAll('.cursor-blink');
  
  cursorElements.forEach(cursor => {
    setInterval(() => {
      cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 530);
  });

  // ========================================
  // TYPING EFFECT FOR TERMINAL LINES
  // ========================================
  
  function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      }
    };
    
    type();
  }

  // Apply typing effect to command lines on load
  window.addEventListener('load', () => {
    const commandElements = document.querySelectorAll('.command');
    
    commandElements.forEach((cmd, index) => {
      const originalText = cmd.textContent;
      setTimeout(() => {
        typeWriter(cmd, originalText, 30);
      }, index * 500);
    });
  });

  // ========================================
  // STATS COUNTER ANIMATION
  // ========================================
  
  function animateCounter(element, targetText, duration = 2000) {
    // Extract number and suffix
    const matches = targetText.match(/^(\d+\.?\d*)(.*)/);
    if (!matches) return;
    
    const targetNumber = parseFloat(matches[1]);
    const suffix = matches[2];
    
    const start = 0;
    const increment = targetNumber / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetNumber) {
        element.textContent = targetText;
        clearInterval(timer);
      } else {
        // Preserve decimal places if needed
        const displayNumber = targetText.includes('.') ? current.toFixed(1) : Math.floor(current);
        element.textContent = displayNumber + suffix;
      }
    }, 16);
  }

  // Intersection Observer for counter animation
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numberElement = entry.target;
        const originalText = numberElement.getAttribute('data-value') || numberElement.textContent;
        
        // Store original text if not already stored
        if (!numberElement.getAttribute('data-value')) {
          numberElement.setAttribute('data-value', originalText.trim());
        }
        
        // Check if element contains a number
        if (/\d/.test(originalText)) {
          animateCounter(numberElement, originalText.trim());
          statsObserver.unobserve(numberElement);
        }
      }
    });
  }, { threshold: 0.5 });

  // Observe stat numbers
  document.querySelectorAll('.stat-number, .metric-num, .metric-value').forEach(el => {
    statsObserver.observe(el);
  });

  // ========================================
  // SKILL BAR ANIMATIONS
  // ========================================
  
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillBar = entry.target;
        skillBar.style.animation = 'skillGrow 1s ease-out forwards';
        skillsObserver.unobserve(skillBar);
      }
    });
  }, { threshold: 0.5 });

  // Add animation for skill bars
  const style = document.createElement('style');
  style.textContent = `
    @keyframes skillGrow {
      from {
        transform: scaleX(0);
        transform-origin: left;
      }
      to {
        transform: scaleX(1);
      }
    }
    
    .skill-bar::after {
      transform: scaleX(0);
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('.skill-bar').forEach(bar => {
    skillsObserver.observe(bar);
  });

  // ========================================
  // PROJECT CARD HOVER EFFECTS
  // ========================================
  
  const projectCards = document.querySelectorAll('.project-card');
  
  projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.transition = 'all 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ========================================
  // BENTO STATS HOVER ANIMATION
  // ========================================
  
  const statBoxes = document.querySelectorAll('.stat-box');
  
  statBoxes.forEach(box => {
    box.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-8px) scale(1.02)';
      this.style.borderColor = 'var(--color-accent)';
      this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    box.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0) scale(1)';
      this.style.borderColor = 'var(--color-border)';
    });
  });

  // ========================================
  // TERMINAL OUTPUT REVEAL ANIMATION
  // ========================================
  
  const terminalObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const lines = entry.target.querySelectorAll('.skill-item-terminal, .contact-row');
        
        lines.forEach((line, index) => {
          setTimeout(() => {
            line.style.opacity = '0';
            line.style.transform = 'translateX(-20px)';
            line.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
              line.style.opacity = '1';
              line.style.transform = 'translateX(0)';
            }, 50);
          }, index * 50);
        });
        
        terminalObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.terminal-output, .terminal-output-large').forEach(terminal => {
    terminalObserver.observe(terminal);
  });

  // ========================================
  // PARALLAX EFFECT ON SCROLL
  // ========================================
  
  const parallaxElements = document.querySelectorAll('.ascii-header, .section-number');
  
  const parallaxScroll = throttle(() => {
    const scrolled = window.pageYOffset;
    
    parallaxElements.forEach(el => {
      const speed = el.classList.contains('section-number') ? 0.3 : 0.5;
      const yPos = -(scrolled * speed);
      el.style.transform = `translateY(${yPos}px)`;
    });
  }, 10);

  window.addEventListener('scroll', parallaxScroll);

  // ========================================
  // GLITCH EFFECT ON TITLE (ENHANCED)
  // ========================================
  
  const displayTitle = document.querySelector('.display-title');
  
  if (displayTitle) {
    // Random glitch effect on page load
    setTimeout(() => {
      displayTitle.style.animation = 'glitch 0.5s 3';
    }, 1000);
    
    // Glitch on hover
    displayTitle.addEventListener('mouseenter', function() {
      this.style.animation = 'glitch 0.3s infinite';
    });
    
    displayTitle.addEventListener('mouseleave', function() {
      this.style.animation = 'none';
    });
    
    // Random occasional glitch
    setInterval(() => {
      if (Math.random() > 0.95) {
        displayTitle.style.animation = 'glitch 0.2s 2';
        setTimeout(() => {
          displayTitle.style.animation = 'none';
        }, 400);
      }
    }, 5000);
  }

  // Add enhanced glitch animation
  const glitchStyle = document.createElement('style');
  glitchStyle.textContent = `
    @keyframes glitch {
      0% { 
        transform: translate(0);
        text-shadow: 2px 2px #ffcc00, -2px -2px #ff00ff;
      }
      20% { 
        transform: translate(-3px, 3px);
        text-shadow: -2px -2px #ffcc00, 2px 2px #ff00ff;
      }
      40% { 
        transform: translate(-3px, -3px);
        text-shadow: 2px -2px #00ffff, -2px 2px #ffcc00;
      }
      60% { 
        transform: translate(3px, 3px);
        text-shadow: -2px 2px #ffcc00, 2px -2px #ff00ff;
      }
      80% { 
        transform: translate(3px, -3px);
        text-shadow: 2px 2px #00ffff, -2px -2px #ffcc00;
      }
      100% { 
        transform: translate(0);
        text-shadow: none;
      }
    }
    
    @keyframes textReveal {
      from {
        opacity: 0;
        transform: translateY(20px);
        filter: blur(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
      }
    }
    
    @keyframes neonPulse {
      0%, 100% {
        text-shadow: 
          0 0 10px #ffcc00,
          0 0 20px #ffcc00,
          0 0 30px #ffcc00;
      }
      50% {
        text-shadow: 
          0 0 20px #ffcc00,
          0 0 40px #ffcc00,
          0 0 60px #ffcc00,
          0 0 80px #ffcc00;
      }
    }
    
    .highlight-text {
      animation: neonPulse 3s ease-in-out infinite;
    }
  `;
  document.head.appendChild(glitchStyle);

  // ========================================
  // COPY TO CLIPBOARD FOR CONTACT INFO
  // ========================================
  
  const contactValues = document.querySelectorAll('.contact-value');
  
  contactValues.forEach(value => {
    if (!value.querySelector('a')) {
      value.style.cursor = 'pointer';
      
      value.addEventListener('click', function() {
        const text = this.textContent.trim();
        
        navigator.clipboard.writeText(text).then(() => {
          // Show copied feedback
          const original = this.textContent;
          this.textContent = '✓ Copied!';
          this.style.color = 'var(--color-accent)';
          
          setTimeout(() => {
            this.textContent = original;
            this.style.color = '';
          }, 2000);
        });
      });
    }
  });

  // ========================================
  // EASTER EGG: KONAMI CODE
  // ========================================
  
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      if (konamiIndex === konamiCode.length) {
        // Activate easter egg
        document.body.style.filter = 'hue-rotate(180deg)';
        
        setTimeout(() => {
          document.body.style.filter = 'none';
          konamiIndex = 0;
        }, 3000);
        
        console.log('%c🎮 KONAMI CODE ACTIVATED!', 'color: #ffcc00; font-size: 20px; font-weight: bold;');
      }
    } else {
      konamiIndex = 0;
    }
  });

  // ========================================
  // ANIMATED ASCII ART
  // ========================================
  
  const asciiArt = document.querySelector('.ascii-art');
  
  if (asciiArt) {
    const frames = [
      `╦  ╦╦╔╗╔╔═╗╦ ╦╔═╗╔═╗╔═╗╔╦╗  ╔╦╗
╚╗╔╝║║║║╠═╣╚╦╝╠═╣║ ╦╠═╣║║║   ║║
 ╚╝ ╩╝╚╝╩ ╩ ╩ ╩ ╩╚═╝╩ ╩╩ ╩  ═╩╝`,
      `█░█ █ █▄░█ ▄▀█ █▄█ ▄▀█ █▀▀ ▄▀█ █▀▄▀█   █▀▄
▀▄▀ █ █░▀█ █▀█ ░█░ █▀█ █▄█ █▀█ █░▀░█   █▄▀`,
      `▀█░█▀ ░▀░ █▀█ █▀█ █ █ █▀█ █▀█ █▀█ █▀█▄█   █▀▄
░█▄█░ ░█░ █ █ █▀█ ▀▄▀ █▀█ █▀█ █▀█ █ ░█   █▄▀`
    ];
    
    let currentFrame = 0;
    
    setInterval(() => {
      asciiArt.style.opacity = '0';
      setTimeout(() => {
        currentFrame = (currentFrame + 1) % frames.length;
        asciiArt.textContent = frames[currentFrame];
        asciiArt.style.transition = 'opacity 0.5s';
        asciiArt.style.opacity = '0.3';
      }, 500);
    }, 8000); // Change every 8 seconds
  }

  // ========================================
  // CONSOLE MESSAGE (EASTER EGG)
  // ========================================
  
  console.log('%c' + 
    '╦  ╦╦╔╗╔╔═╗╦ ╦╔═╗╔═╗╔═╗╔╦╗\n' +
    '╚╗╔╝║║║║╠═╣╚╦╝╠═╣║ ╦╠═╣║║║\n' +
    ' ╚╝ ╩╝╚╝╩ ╩ ╩ ╩ ╩╚═╝╩ ╩╩ ╩', 
    'color: #ffcc00; font-family: monospace;'
  );
  
  console.log(
    '%c👋 Hey there, fellow developer!\n' +
    '%cLike what you see? Let\'s build something amazing together.\n' +
    '%c📧 vinayagam.python@gmail.com\n' +
    '%c💼 linkedin.com/in/vinjr',
    'color: #ffcc00; font-size: 16px; font-weight: bold;',
    'color: #e8e8e8; font-size: 14px;',
    'color: #ffcc00; font-size: 14px;',
    'color: #ffcc00; font-size: 14px;'
  );

  // ========================================
  // KEYBOARD NAVIGATION SUPPORT
  // ========================================
  
  let isKeyboardNav = false;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      isKeyboardNav = true;
      document.body.classList.add('keyboard-nav');
    }
  });

  document.addEventListener('mousedown', () => {
    isKeyboardNav = false;
    document.body.classList.remove('keyboard-nav');
  });

  // Add focus styles for keyboard navigation
  const focusStyle = document.createElement('style');
  focusStyle.textContent = `
    .keyboard-nav *:focus {
      outline: 2px solid var(--color-accent);
      outline-offset: 2px;
    }
  `;
  document.head.appendChild(focusStyle);

  // ========================================
  // PERFORMANCE MONITORING (DEV ONLY)
  // ========================================
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perfData = performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        
        console.log('%c⚡ Performance Metrics:', 'color: #ffcc00; font-weight: bold;');
        console.log(`Page Load Time: ${pageLoadTime}ms`);
        console.log(`DOM Ready: ${perfData.domContentLoadedEventEnd - perfData.navigationStart}ms`);
      }, 0);
    });
  }

  // ========================================
  // PAGE VISIBILITY API
  // ========================================
  
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      document.title = '👋 Come back! | VINAYAGAM.D';
    } else {
      document.title = 'VINAYAGAM.D → Python Backend Engineer';
    }
  });

  // ========================================
  // SET CURRENT YEAR IN FOOTER
  // ========================================
  
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // ========================================
  // INITIALIZE ON LOAD
  // ========================================
  
  window.addEventListener('load', () => {
    console.log('%c✨ Creative Portfolio Loaded!', 'color: #ffcc00; font-weight: bold;');
    
    // Fade in page
    document.body.style.opacity = '0';
    setTimeout(() => {
      document.body.style.transition = 'opacity 0.5s ease';
      document.body.style.opacity = '1';
    }, 100);
  });

  // ========================================
  // ERROR HANDLING
  // ========================================
  
  window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
  });

  // ========================================
  // PREVENT ZOOM ON MOBILE
  // ========================================
  
  document.addEventListener('gesturestart', function(e) {
    e.preventDefault();
  });

  // ========================================
  // LAZY LOAD OPTIMIZATION
  // ========================================
  
  if ('IntersectionObserver' in window) {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          if (element.dataset.lazy) {
            element.src = element.dataset.lazy;
            element.removeAttribute('data-lazy');
          }
          lazyObserver.unobserve(element);
        }
      });
    });

    lazyElements.forEach(el => lazyObserver.observe(el));
  }

  // ========================================
  // CUSTOM CURSOR (OPTIONAL ENHANCEMENT)
  // ========================================
  
  const customCursor = document.createElement('div');
  customCursor.className = 'custom-cursor';
  customCursor.style.cssText = `
    position: fixed;
    width: 12px;
    height: 12px;
    background: #ffcc00;
    border-radius: 50%;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: transform 0.15s ease, width 0.15s ease, height 0.15s ease;
    box-shadow: 0 0 20px #ffcc00, 0 0 40px rgba(255, 204, 0, 0.5);
  `;
  document.body.appendChild(customCursor);

  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor follow
  function animateCursor() {
    const speed = 0.15;
    
    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;
    
    customCursor.style.left = cursorX + 'px';
    customCursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  document.addEventListener('mousedown', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
  });

  document.addEventListener('mouseup', () => {
    customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });

  // Enlarge cursor on interactive elements
  document.querySelectorAll('a, button, .project-card, .stat-box, .nav-cmd, .btn').forEach(el => {
    el.addEventListener('mouseenter', () => {
      customCursor.style.width = '30px';
      customCursor.style.height = '30px';
      customCursor.style.background = 'rgba(255, 204, 0, 0.3)';
      customCursor.style.border = '2px solid #ffcc00';
    });
    el.addEventListener('mouseleave', () => {
      customCursor.style.width = '12px';
      customCursor.style.height = '12px';
      customCursor.style.background = '#ffcc00';
      customCursor.style.border = 'none';
    });
  });

  // Hide on mobile
  // Hide on mobile (based on width to match CSS)
  if (window.innerWidth <= 991) {
    customCursor.style.display = 'none';
  }
  
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 991) {
      customCursor.style.display = 'none';
    } else {
      customCursor.style.display = 'block';
    }
  });

  // ========================================
  console.log('%c$ Portfolio initialized successfully!', 'color: #ffcc00; font-family: monospace;');
  // ========================================

})();