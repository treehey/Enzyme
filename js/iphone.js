// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all animations and interactive elements
    initParallaxEffects();
    initSmoothScrolling();
    init3DCardEffect();
    initProgressRings();
    initTimelineAnimation();
    initComparisonSlider();
    initScrollTriggers();
  });
  
  // Parallax Effects for Hero Section
  function initParallaxEffects() {
    const heroSection = document.querySelector('.hero-section');
    const heroHeadline = document.querySelector('.hero-headline');
    const heroSubhead = document.querySelector('.hero-subhead');
    
    if (!heroSection) return;
    
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      if (scrollPos <= viewportHeight) {
        // Parallax effect for hero elements
        const parallaxRate = scrollPos * 0.4;
        heroHeadline.style.transform = `translateY(${parallaxRate}px)`;
        heroHeadline.style.opacity = 1 - (scrollPos / (viewportHeight * 0.5));
        
        heroSubhead.style.transform = `translateY(${parallaxRate * 0.8}px)`;
        heroSubhead.style.opacity = 1 - (scrollPos / (viewportHeight * 0.6));
      }
    });
  }
  
  // Smooth Scrolling for Navigation Links
  function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Use modern scroll behavior with easing
          window.scrollTo({
            top: targetElement.offsetTop - 60, // Adjust for fixed header
            behavior: 'smooth'
          });
        }
      });
    });
  }
  
  // 3D Card Hover Effect (Apple's signature tilting effect)
  function init3DCardEffect() {
    const cards = document.querySelectorAll('.glass-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation values (limited range for subtle effect)
        const rotateY = mouseX * 0.01; // Max ±5 degrees
        const rotateX = mouseY * -0.01; // Inverted for natural tilt
        
        // Apply 3D transform with smooth transition
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
        
        // Dynamic highlight effect
        const glare = card.querySelector('.card-glare') || document.createElement('div');
        if (!card.querySelector('.card-glare')) {
          glare.classList.add('card-glare');
          card.appendChild(glare);
        }
        
        // Position the glare effect based on mouse position
        const glareX = (e.clientX - rect.left) / rect.width * 100;
        const glareY = (e.clientY - rect.top) / rect.height * 100;
        
        glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 50%)`;
      });
      
      // Reset card on mouse leave
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        
        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.opacity = '0';
        }
      });
    });
  }
  
  // Animate Progress Rings
  function initProgressRings() {
    const progressRings = document.querySelectorAll('.progress-ring');
    
    progressRings.forEach(ring => {
      const percent = ring.getAttribute('data-percent') || 0;
      const circle = ring.querySelector('.progress-circle');
      
      if (circle) {
        // Set the initial state (0%)
        circle.style.setProperty('--percent', '0');
        
        // Create intersection observer to animate when visible
        const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              // Animate to the target percentage
              setTimeout(() => {
                circle.style.setProperty('--percent', percent);
                
                // Animate the counter
                const valueDisplay = ring.querySelector('.progress-value');
                if (valueDisplay) {
                  let currentValue = 0;
                  const duration = 1500; // 1.5 seconds
                  const interval = 15; // Update every 15ms
                  const increment = Math.ceil(percent / (duration / interval));
                  
                  const counter = setInterval(() => {
                    currentValue += increment;
                    
                    if (currentValue >= percent) {
                      currentValue = percent;
                      clearInterval(counter);
                    }
                    
                    valueDisplay.textContent = `${currentValue}%`;
                  }, interval);
                }
              }, 300);
              
              observer.disconnect();
            }
          });
        }, {
          threshold: 0.3
        });
        
        observer.observe(ring);
      }
    });
  }
  
  // Timeline Animation
  function initTimelineAnimation() {
    const timelineSteps = document.querySelectorAll('.timeline-step');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          
          // Find and animate the step indicator
          const stepNumber = entry.target.querySelector('.step-number');
          if (stepNumber) {
            stepNumber.classList.add('pulse');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -100px 0px'
    });
    
    timelineSteps.forEach(step => {
      observer.observe(step);
    });
  }
  
  // Interactive Comparison Slider
  function initComparisonSlider() {
    const slider = document.querySelector('.comparison-slider');
    if (!slider) return;
    
    const before = slider.querySelector('.comparison-before');
    const handle = slider.querySelector('.comparison-handle');
    
    let isDragging = false;
    
    // Mouse and touch events
    const events = {
      mouse: {
        down: 'mousedown',
        move: 'mousemove',
        up: 'mouseup'
      },
      touch: {
        down: 'touchstart',
        move: 'touchmove',
        up: 'touchend'
      }
    };
    
    // Add all event listeners
    Object.keys(events).forEach(eventCategory => {
      handle.addEventListener(events[eventCategory].down, (e) => {
        isDragging = true;
        e.preventDefault(); // Prevent default only for mouse, not touch
      });
      
      document.addEventListener(events[eventCategory].move, (e) => {
        if (!isDragging) return;
        
        const clientX = eventCategory === 'mouse' ? e.clientX : e.touches[0].clientX;
        const rect = slider.getBoundingClientRect();
        let position = (clientX - rect.left) / rect.width;
        
        // Constrain position within the slider
        position = Math.max(0, Math.min(position, 1));
        
        // Update slider position
        before.style.width = `${position * 100}%`;
        handle.style.left = `${position * 100}%`;
      });
      
      document.addEventListener(events[eventCategory].up, () => {
        isDragging = false;
      });
      
      document.addEventListener('mouseleave', () => {
        isDragging = false;
      });
    });
    
    // Initial position
    slider.addEventListener('click', (e) => {
      const rect = slider.getBoundingClientRect();
      const position = (e.clientX - rect.left) / rect.width;
      
      // Animate to the new position
      before.style.transition = 'width 0.3s ease';
      handle.style.transition = 'left 0.3s ease';
      
      before.style.width = `${position * 100}%`;
      handle.style.left = `${position * 100}%`;
      
      // Remove transition after animation completes
      setTimeout(() => {
        before.style.transition = '';
        handle.style.transition = '';
      }, 300);
    });
  }
  
  // Scroll-triggered animations for all elements
  function initScrollTriggers() {
    const animatedElements = document.querySelectorAll('.fade-up, .feature-card, .glass-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add a slight delay based on the element's position
          const delay = Array.from(animatedElements).indexOf(entry.target) * 100;
          
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    animatedElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Add sticky header behavior (hide/show on scroll)
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.nav-bar');
    const scrollPosition = window.scrollY;
    const scrollThreshold = 100;
    
    if (scrollPosition > scrollThreshold && !header.classList.contains('nav-hidden')) {
      header.classList.add('nav-hidden');
    } else if (scrollPosition <= scrollThreshold && header.classList.contains('nav-hidden')) {
      header.classList.remove('nav-hidden');
    }
  });
  
  // Add smooth inertia scrolling effect (Apple's smooth scroll behavior)
  let scrolling = false;
  let lastScrollTop = 0;
  let scrollTimeout;
  
  window.addEventListener('scroll', () => {
    const currentScrollTop = window.scrollY;
    
    if (!scrolling) {
      scrolling = true;
      requestAnimationFrame(() => {
        document.body.style.setProperty('--scroll-y', `${currentScrollTop}px`);
        scrolling = false;
      });
    }
    
    // Add slight parallax to various sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const scrollDelta = lastScrollTop - currentScrollTop;
        const parallaxSpeed = 0.05;
        const currentTransform = section.style.transform || 'translateY(0px)';
        const currentOffset = parseInt(currentTransform.replace(/[^\d-]/g, '') || 0);
        const newOffset = Math.max(-30, Math.min(30, currentOffset + scrollDelta * parallaxSpeed));
        
        section.style.transform = `translateY(${newOffset}px)`;
      }
    });
    
    lastScrollTop = currentScrollTop;
    
    // Add inertia to scroll
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      lastScrollTop = window.scrollY;
    }, 100);
  });