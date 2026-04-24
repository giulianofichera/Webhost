// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const nav = document.querySelector('.nav');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (mobileMenuToggle && nav) {
        const setMobileMenuState = (isOpen) => {
            nav.classList.toggle('active', isOpen);
            mobileMenuToggle.classList.toggle('active', isOpen);
            mobileMenuToggle.setAttribute('aria-expanded', String(isOpen));
            mobileMenuToggle.setAttribute('aria-label', isOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion');
        };

        mobileMenuToggle.addEventListener('click', function() {
            setMobileMenuState(!nav.classList.contains('active'));
        });

        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                setMobileMenuState(false);
            }
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                setMobileMenuState(false);
            });
        });

        window.addEventListener('resize', function() {
            if (window.innerWidth > 768) {
                setMobileMenuState(false);
            }
        });

        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && nav.classList.contains('active')) {
                setMobileMenuState(false);
                mobileMenuToggle.focus();
            }
        });
    }
    
    // Scroll animations using Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Elements to animate
    const animateElements = [
        '.section-title',
        '.about-text',
        '.stat',
        '.flavor-card',
        '.client-group',
        '.contact-item',
        '.social-links'
    ];
    
    animateElements.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element, index) => {
            // Add delay for staggered animation
            if (!reduceMotion) {
                element.style.transitionDelay = `${index * 0.1}s`;
            }
            element.classList.add('fade-in');
            observer.observe(element);
        });
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: reduceMotion ? 'auto' : 'smooth'
                });
            }
        });
    });
    
    // Handle logo click - scroll to top
    const logoLink = document.querySelector('.logo a');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: reduceMotion ? 'auto' : 'smooth'
            });
        });
    }
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        // Add shadow when scrolled
        if (currentScroll > 50) {
            header.style.boxShadow = '0 4px 30px rgba(201, 130, 106, 0.3)';
        } else {
            header.style.boxShadow = '0 2px 20px rgba(44, 24, 16, 0.1)';
        }
        
    });
    
    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-image');
    
    if (hero && heroImage) {
        window.addEventListener('scroll', function() {
            if (reduceMotion) return;
            const scrolled = window.pageYOffset;
            const heroHeight = hero.offsetHeight;
            
            if (scrolled < heroHeight) {
                const parallaxSpeed = 0.3;
                heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
    
    // Counter animation for stats
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stats = entry.target.querySelectorAll('.stat-number');
                stats.forEach(stat => {
                    const target = parseInt(stat.textContent);
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const familyStats = document.querySelector('.family-stats');
    if (familyStats) {
        statsObserver.observe(familyStats);
    }
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = Math.max(1, target / 50);
        const suffix = element.textContent.includes('+') ? '+' : '';
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + suffix;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + suffix;
            }
        }, 30);
    }
    
    // Flavor cards hover effect enhancement
    const flavorCards = document.querySelectorAll('.flavor-card');
    flavorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (reduceMotion) return;
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (reduceMotion) return;
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add loading animation to page
    window.addEventListener('load', function() {
        if (reduceMotion) return;
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });
    
});