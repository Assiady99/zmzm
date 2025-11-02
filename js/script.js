// ============================================
// ZAMZAM COMPANY - PREMIUM WEBSITE SCRIPTS
// Interactive Features & Advanced Animations
// ============================================

// ========== VIEWPORT HEIGHT FIX FOR MOBILE ==========
// Use a CSS variable --vh (1% of viewport height in px) to avoid mobile browser
// behaviour where 100vh changes as address bars hide/show. We set --vh on
// load/resize/orientationchange and trigger a resize/scroll to apply initial transforms.
// Use visualViewport API if available for better mobile support.
function setVh() {
    const vh = (window.visualViewport ? window.visualViewport.height : window.innerHeight) * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Initialize and keep updated
setVh();
window.addEventListener('resize', setVh);
window.addEventListener('orientationchange', setVh);

// Use visualViewport API for dynamic viewport height changes on mobile
if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', setVh);
} else {
    // Fallback for browsers without visualViewport support
    window.addEventListener('scroll', debounce(setVh, 100));
}

window.addEventListener('load', () => {
    setVh();
    // trigger handlers that depend on scroll/resize so the initial layout is correct
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new Event('scroll'));
});

// ========== SMOOTH SCROLL BEHAVIOR ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            document.getElementById('navMenu').classList.remove('active');
            document.getElementById('hamburger').classList.remove('active');
        }
    });
});

// ========== NAVBAR SCROLL EFFECT ==========
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-container')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// ========== ACTIVE NAV LINK ON SCROLL ==========
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function setActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ========== SCROLL TO TOP BUTTON ==========
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========== COUNTER ANIMATION ==========
const statNumbers = document.querySelectorAll('.stat-number');
let countersActivated = false;

function animateCounters() {
    if (countersActivated) return;
    
    const statsSection = document.querySelector('.statistics');
    const statsSectionTop = statsSection.offsetTop;
    const statsSectionHeight = statsSection.clientHeight;
    
    if (window.pageYOffset >= (statsSectionTop - window.innerHeight + 100)) {
        countersActivated = true;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60 FPS
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current).toLocaleString('ar-SA');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target.toLocaleString('ar-SA') + '+';
                }
            };
            
            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateCounters);

// ========== ANIMATE ON SCROLL (AOS) ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('aos-animate');
        }
    });
}, observerOptions);

// Observe all elements with data-aos attribute
document.querySelectorAll('[data-aos]').forEach(element => {
    observer.observe(element);
});

// ========== FORM SUBMISSION ==========
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Show success message
    showNotification('شكراً لتواصلك معنا! سنرد عليك قريباً.', 'success');
    
    // Reset form
    contactForm.reset();
    
    // Log data (in production, send to server)
    console.log('Form Data:', data);
});

// ========== NEWSLETTER FORM ==========
const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('تم الاشتراك في النشرة الإخبارية بنجاح!', 'success');
        newsletterForm.reset();
    }
});

// ========== NOTIFICATION SYSTEM ==========
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #00d4ff, #0066cc)' : 'linear-gradient(135deg, #ff6b6b, #ff5252)'};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        animation: slideInRight 0.5s ease;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    notification.querySelector('i').style.cssText = `
        font-size: 1.5rem;
    `;
    
    notification.querySelector('p').style.cssText = `
        margin: 0;
        font-weight: 600;
        font-size: 1rem;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 4000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== PARALLAX EFFECT ==========
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroOverlay = document.querySelector('.hero-overlay');
    const floatingCards = document.querySelectorAll('.floating-card');
    
    if (heroOverlay) {
        heroOverlay.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
    
    floatingCards.forEach((card, index) => {
        const speed = 0.1 + (index * 0.05);
        card.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========== MOUSE CURSOR EFFECT ==========
let cursor = null;
let cursorFollower = null;

function initCursor() {
    // Create custom cursor elements
    cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        width: 10px;
        height: 10px;
        background: linear-gradient(135deg, #0066cc, #00d4ff);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease;
        mix-blend-mode: difference;
    `;
    
    cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    cursorFollower.style.cssText = `
        width: 40px;
        height: 40px;
        border: 2px solid rgba(0, 102, 204, 0.5);
        border-radius: 50%;
        position: fixed;
        pointer-events: none;
        z-index: 9998;
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    // Update cursor position
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        
        setTimeout(() => {
            cursorFollower.style.left = (e.clientX - 20) + 'px';
            cursorFollower.style.top = (e.clientY - 20) + 'px';
        }, 100);
    });
    
    // Scale up on hover over clickable elements
    const clickableElements = document.querySelectorAll('a, button, .btn, input, textarea, .value-card, .product-card');
    
    clickableElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursorFollower.style.transform = 'scale(1.5)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursorFollower.style.transform = 'scale(1)';
        });
    });
}

// Initialize cursor on desktop only
if (window.innerWidth > 768) {
    initCursor();
}

// ========== LOADING ANIMATION ==========
window.addEventListener('load', () => {
    // Hide loading screen
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }
    
    // Trigger initial animations
    document.body.classList.add('loaded');
});

// ========== LAZY LOADING IMAGES ==========
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

// ========== TYPED TEXT EFFECT ==========
function typeText(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// ========== PAGE TRANSITIONS ==========
function initPageTransitions() {
    // Add fade-in effect to sections
    const sections = document.querySelectorAll('section');
    
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.8s ease';
        
        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// ========== INTERACTIVE CARDS ==========
const cards = document.querySelectorAll('.objective-card, .product-card, .value-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', function(e) {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.zIndex = '1';
    });
    
    // 3D tilt effect
    card.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });
    
    card.addEventListener('mouseleave', function(e) {
        this.style.transform = '';
    });
});

// ========== SCROLL REVEAL ANIMATIONS ==========
function revealOnScroll() {
    const reveals = document.querySelectorAll('.vm-card, .objective-card, .value-card, .product-card, .stat-card');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Initial check

// ========== FORM VALIDATION ==========
const formInputs = document.querySelectorAll('.contact-form input, .contact-form textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
            this.style.borderColor = '#ff5252';
        } else {
            this.style.borderColor = '#0066cc';
        }
    });
    
    input.addEventListener('focus', function() {
        this.style.borderColor = '#0066cc';
    });
});

// ========== SCROLL PROGRESS INDICATOR ==========
function createScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 4px;
        background: linear-gradient(90deg, #0066cc, #00d4ff);
        z-index: 9999;
        transition: width 0.2s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

createScrollProgress();

// ========== PERFORMANCE OPTIMIZATION ==========
// Debounce function for scroll events
function debounce(func, wait = 10) {
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

// Apply debounce to scroll events
window.addEventListener('scroll', debounce(() => {
    // Optimized scroll handlers
}, 10));

// ========== PRINT PAGE ==========
function printPage() {
    window.print();
}

// ========== EASTER EGG ==========
let clickCount = 0;
const logo = document.querySelector('.logo h1');

logo.addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 مرحباً بك في موقع شركة زمزم ! 🎉', 'success');
        clickCount = 0;
        
        // Add rainbow animation to logo
        logo.style.animation = 'rainbow 2s linear infinite';
        setTimeout(() => {
            logo.style.animation = '';
        }, 5000);
    }
});

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
    @keyframes rainbow {
        0% { filter: hue-rotate(0deg); }
        100% { filter: hue-rotate(360deg); }
    }
`;
document.head.appendChild(rainbowStyle);

// ========== CONSOLE MESSAGE ==========
console.log('%c🌊 مرحباً بك في موقع شركة زمزم! 🌊', 'color: #0066cc; font-size: 24px; font-weight: bold;');
console.log('%cتم تطوير هذا الموقع باستخدام HTML, CSS, JavaScript', 'color: #00d4ff; font-size: 14px;');
console.log('%c© 2025 Zamzam Company - All Rights Reserved', 'color: #6c757d; font-size: 12px;');

// ========== INITIALIZE ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('Website initialized successfully!');
    
    // Set initial active nav link
    setActiveLink();
    
    // Trigger any initial animations
    setTimeout(() => {
        document.body.classList.add('ready');
    }, 100);
});