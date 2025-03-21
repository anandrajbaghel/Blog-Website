// Theme Switching
const themeSwitcher = {
    init() {
        this.themeButtons = document.querySelectorAll('.theme-button');
        this.currentTheme = localStorage.getItem('theme') || 'system';
        this.overlay = this.createTransitionOverlay();
        this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        this.setTheme(this.currentTheme);
        this.setupEventListeners();
    },
    
    createTransitionOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'theme-transition';
        document.body.appendChild(overlay);
        return overlay;
    },
    
    setupEventListeners() {
        // Theme button click handlers
        this.themeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const theme = button.dataset.theme;
                this.animateThemeChange(theme, e);
            });
        });
        
        // System theme change handler
        this.mediaQuery.addEventListener('change', () => {
            if (this.currentTheme === 'system') {
                this.setTheme('system');
            }
        });
    },
    
    async animateThemeChange(theme, event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Position overlay at click location
        this.overlay.style.left = `${x}px`;
        this.overlay.style.top = `${y}px`;
        this.overlay.classList.add('active');
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Update theme
        this.setTheme(theme);
        localStorage.setItem('theme', theme);
        
        // Remove overlay
        this.overlay.classList.remove('active');
    },
    
    setTheme(theme) {
        // Update button states
        this.themeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.theme === theme);
        });
        
        // Set theme attribute
        const systemTheme = this.mediaQuery.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme === 'system' ? systemTheme : theme);
        
        // Update current theme
        this.currentTheme = theme;
        
        // Dispatch theme change event
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
};

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    themeSwitcher.init();
});

// Card hover effect
const cards = document.querySelectorAll('.project-card');
const cursorWeight = 20;

cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        const rotateX = -deltaY * 3;
        const rotateY = deltaX * 3;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
    });
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            observer.unobserve(img);
        }
    });
}, {
    rootMargin: '50px 0px',
    threshold: 0.1
});

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
});

// Scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.className = 'scroll-progress';
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / windowHeight) * 100;
    scrollProgress.style.width = `${progress}%`;
});

// Mobile menu
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navList = document.querySelector('.nav-list');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navList.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
        
        const menuItems = navList.querySelectorAll('li');
        menuItems.forEach((item, index) => {
            item.style.animation = `fadeIn 0.3s ease-out forwards ${index * 0.1}s`;
        });
    });
}

// Intersection Observer for animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (!prefersReducedMotion) {
                entry.target.classList.add('visible');
            } else {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'none';
            }
            observer.unobserve(entry.target);
        }
    });
}, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
});

document.querySelectorAll('.slide-in-left, .slide-in-right').forEach(el => {
    observer.observe(el);
});

// Button hover effect
document.querySelectorAll('.cta-button').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        button.style.setProperty('--x', `${e.clientX - rect.left}px`);
        button.style.setProperty('--y', `${e.clientY - rect.top}px`);
    });
});

// Newsletter form
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        console.log('Newsletter subscription:', email);
        
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Thank you for subscribing!';
        newsletterForm.appendChild(successMessage);
        
        newsletterForm.reset();
        
        setTimeout(() => {
            successMessage.remove();
        }, 3000);
    });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active navigation item
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-list a').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
        link.classList.add('active');
    }
});

// Button click handler
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.cta-button, .submit-button');
    
    buttons.forEach(button => {
        button.addEventListener('click', (e) => {
            const href = button.getAttribute('href');
            if (href) {
                window.location.href = href;
            }
        });
    });
}); 