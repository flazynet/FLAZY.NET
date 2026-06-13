/* FLAZY.NET - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollAnimations();
  initFAQ();
  initContactForm();
  initSmoothScroll();
  initPortfolioImageToggle();
  initCounterAnimations();
});

/* ===== Navigation ===== */
function initNavigation() {
  const header = document.querySelector('.header');
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  // Mobile menu toggle
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // Header scroll effect
  if (header) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    });
  }

  // Active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animatable elements
  document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
  });
}

/* ===== FAQ Accordion ===== */
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all other FAQs
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
        });

        // Toggle current FAQ
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });
}

/* ===== Contact Form ===== */
function initContactForm() {
  const form = document.querySelector('#contact-form');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;

      // Show loading state
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      submitBtn.textContent = 'Message Sent!';
      submitBtn.style.background = '#22c55e';

      // Reset form
      form.reset();

      // Reset button after delay
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.style.background = '';
      }, 3000);
    });
  }
}

/* ===== Smooth Scroll ===== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
          const targetPosition = target.offsetTop - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

/* ===== Portfolio Image Click Fade ===== */
function initPortfolioImageToggle() {
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', (event) => {
      const image = event.target.closest('.portfolio-image');

      if (!image) return;

      const isFaded = item.classList.toggle('is-faded');
      image.style.opacity = isFaded ? '0.45' : '1';
      image.setAttribute('aria-pressed', String(isFaded));
    });
  });
}

/* ===== Counter Animation ===== */
function animateCounter(element, targetText, duration = 1600) {
  const cleanedText = targetText.trim();
  const match = cleanedText.match(/(-?\d+(?:\.\d+)?)/);

  if (!match) return;

  const numericText = match[0];
  const prefix = cleanedText.slice(0, match.index);
  const suffix = cleanedText.slice(match.index + numericText.length);
  const targetValue = Number(numericText);
  const decimals = numericText.includes('.') ? numericText.split('.')[1].length : 0;

  if (!Number.isFinite(targetValue)) return;

  let startTime = null;

  const updateCounter = (timestamp) => {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = targetValue * eased;
    const formattedValue = decimals > 0
      ? currentValue.toFixed(decimals)
      : Math.floor(currentValue).toString();

    element.textContent = `${prefix}${formattedValue}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `${prefix}${targetValue}${suffix}`;
    }
  };

  requestAnimationFrame(updateCounter);
}

// Initialize counter animations on scroll
function initCounterAnimations() {
  const counters = document.querySelectorAll('.stat-number, div[style*="font-size: 2.5rem"][style*="font-weight: 800;"]');

  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observerOptions = { threshold: 0.5 };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        animateCounter(entry.target, entry.target.textContent);
        entry.target.dataset.animated = 'true';
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

/* ===== Testimonial Slider ===== */
function initTestimonialSlider() {
  const slider = document.querySelector('.testimonial-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dot');

  if (!slider || slides.length === 0) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.style.display = i === index ? 'block' : 'none';
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  // Auto-advance every 5 seconds
  setInterval(nextSlide, 5000);

  // Click handlers for dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => showSlide(index));
  });
}

/* ===== Portfolio Filter ===== */
function initPortfolioFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      portfolioItems.forEach(item => {
        if (filter === 'all' || item.dataset.category === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ===== Utility Functions ===== */
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
