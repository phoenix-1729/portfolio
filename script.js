// Theme Toggle
function toggleTheme() {
  const html = document.documentElement;
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Load saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
});

// Mobile Menu Toggle
function toggleMenu() {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger');
  
  mobileNav.classList.toggle('active');
  hamburger.classList.toggle('active');
}

// Smooth scroll for all anchor links
document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        
        // Close mobile menu if open
        const mobileNav = document.getElementById('mobileNav');
        const hamburger = document.querySelector('.hamburger');
        if (mobileNav.classList.contains('active')) {
          mobileNav.classList.remove('active');
          hamburger.classList.remove('active');
        }
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe grid items for animation
  const gridItems = document.querySelectorAll('.grid-item');
  gridItems.forEach(item => {
    observer.observe(item);
  });

  // Add active state to nav links on scroll
  const sections = document.querySelectorAll('.grid-item[id]');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    document.querySelectorAll('.nav-menu a, .mobile-nav a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // Parallax effect on hero section (subtle)
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        const heroCard = document.querySelector('.hero-large');
        
        if (heroCard && scrolled < 800) {
          const speed = 0.3;
          heroCard.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        }
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const mobileNav = document.getElementById('mobileNav');
  const hamburger = document.querySelector('.hamburger');
  const floatingNav = document.querySelector('.floating-nav');
  
  if (mobileNav.classList.contains('active') && 
      !mobileNav.contains(e.target) && 
      !floatingNav.contains(e.target)) {
    mobileNav.classList.remove('active');
    hamburger.classList.remove('active');
  }
});

// Magnetic Cursor Implementation
document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.querySelector('.custom-cursor');
  const cursorOutline = document.querySelector('.custom-cursor-outline');
  
  let mouseX = 0;
  let mouseY = 0;
  let cursorX = 0;
  let cursorY = 0;
  let outlineX = 0;
  let outlineY = 0;
  
  let magneticTarget = null;
  const magneticStrength = 0.3; // How strong the magnetic pull is (0-1)
  const magneticRadius = 80; // Distance in pixels where magnetic effect activates
  
  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    // Check if near any magnetic element
    updateMagneticTarget(e);
  });
  
  // Find if cursor is near a magnetic element
  function updateMagneticTarget(e) {
    const magneticElements = document.querySelectorAll(
      'a, button, .hamburger, .theme-toggle, .social-btn, ' +
      '.contact-method, .nav-menu a, .skill-tags span, .btn-download, .btn-contact'
    );
    
    let closestElement = null;
    let closestDistance = magneticRadius;
    
    magneticElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestElement = { el, centerX, centerY, distance };
      }
    });
    
    magneticTarget = closestElement;
  }
  
  // Smooth cursor animation with magnetic effect
  function animateCursor() {
    let targetX = mouseX;
    let targetY = mouseY;
    
    // Apply magnetic effect if near element
    if (magneticTarget) {
      const pull = 1 - (magneticTarget.distance / magneticRadius);
      const magnetX = (magneticTarget.centerX - mouseX) * pull * magneticStrength;
      const magnetY = (magneticTarget.centerY - mouseY) * pull * magneticStrength;
      
      targetX += magnetX;
      targetY += magnetY;
    }
    
    // Main cursor follows with magnetic attraction
    cursorX += (targetX - cursorX) * 0.2;
    cursorY += (targetY - cursorY) * 0.2;
    
    // Outline follows with slight delay
    outlineX += (targetX - outlineX) * 0.12;
    outlineY += (targetY - outlineY) * 0.12;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    cursorOutline.style.left = outlineX + 'px';
    cursorOutline.style.top = outlineY + 'px';
    
    requestAnimationFrame(animateCursor);
  }
  
  animateCursor();
  
  // Add hover effect to clickable elements
  const clickableElements = document.querySelectorAll(
    'a, button, .hamburger, .theme-toggle, .social-btn, .project-link, ' +
    '.contact-method, .nav-menu a, input, textarea, select, .grid-item, ' +
    '.skill-tags span'
  );
  
  clickableElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      cursorOutline.classList.add('hover');
    });
    
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      cursorOutline.classList.remove('hover');
      magneticTarget = null; // Reset magnetic target
    });
  });
  
  // Hide cursor when leaving viewport
  document.addEventListener('mouseleave', () => {
    cursor.style.opacity = '0';
    cursorOutline.style.opacity = '0';
  });
  
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity = '1';
    cursorOutline.style.opacity = '0.5';
  });
});
