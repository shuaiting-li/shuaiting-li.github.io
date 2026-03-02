/* ============================================================
   Shuaiting Li — Portfolio Main JavaScript
   Vanilla JS, no jQuery
   ============================================================ */

(function () {
    'use strict';

    // ---- DOM References ----
    const $ = (sel) => document.querySelector(sel);
    const $$ = (sel) => document.querySelectorAll(sel);

    const navbar = $('#navbar');
    const scrollProgress = $('#scrollProgress');
    const themeToggle = $('#themeToggle');
    const themeIcon = $('#themeIcon');
    const hamburger = $('#hamburger');
    const mobileMenu = $('#mobileMenu');
    const currentYear = $('#currentYear');
    const navLinks = $$('.nav-link');
    const mobileLinks = $$('.mobile-link');
    const sections = $$('.section, .hero');

    // ---- Dynamic Year ----
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // ---- Theme Toggle ----
    function getPreferredTheme() {
        const stored = localStorage.getItem('theme');
        if (stored) return stored;
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    }

    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        if (themeIcon) {
            themeIcon.className = theme === 'dark' ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
        }
        // Re-configure particles for new theme
        if (window.tsParticles && window.tsParticles.domItem(0)) {
            initParticles();
        }
    }

    // Initialize theme
    setTheme(getPreferredTheme());

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            setTheme(current === 'dark' ? 'light' : 'dark');
        });
    }

    // ---- Navbar Scroll Behavior ----
    let lastScroll = 0;

    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Scroll progress bar
        if (scrollProgress) {
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            scrollProgress.style.width = progress + '%';
        }

        // Navbar background
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        lastScroll = scrollTop;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // ---- Active Nav Link (Intersection Observer) ----
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach((link) => {
                    link.classList.toggle('active', link.getAttribute('href') === '#' + id);
                });
            }
        });
    }, observerOptions);

    sections.forEach((section) => sectionObserver.observe(section));

    // ---- Timeline In-View Animation ----
    const timelineObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        },
        { threshold: 0.3 }
    );

    $$('.timeline-item').forEach((item) => timelineObserver.observe(item));

    // ---- Mobile Menu ----
    function closeMobileMenu() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isActive = hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    mobileLinks.forEach((link) => {
        link.addEventListener('click', closeMobileMenu);
    });

    // ---- Smooth Scroll for Nav Links ----
    [...navLinks, ...mobileLinks].forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Scroll indicator smooth scroll
    const scrollIndicator = $('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(scrollIndicator.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Logo click
    const navLogo = $('.nav-logo');
    if (navLogo) {
        navLogo.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ---- AOS Init ----
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 80,
            disable: window.innerWidth < 768 ? 'phone' : false
        });
    }

    // ---- Typed.js Init ----
    if (typeof Typed !== 'undefined' && $('#typed-output')) {
        new Typed('#typed-output', {
            strings: [
                'build systems software.',
                'write compilers.',
                'craft full-stack web apps.',
                'optimize test frameworks.',
                'love embedded systems.',
                'ship clean code.'
            ],
            typeSpeed: 45,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 800,
            loop: true,
            smartBackspace: true
        });
    }

    // ---- tsParticles Init ----
    function initParticles() {
        if (typeof tsParticles === 'undefined') return;

        const theme = document.documentElement.getAttribute('data-theme');
        const particleColor = theme === 'dark' ? '#ffffff' : '#6d28d9';
        const linkColor = theme === 'dark' ? '#ffffff' : '#7c3aed';
        const particleOpacity = theme === 'dark' ? 0.15 : 0.25;
        const linkOpacity = theme === 'dark' ? 0.05 : 0.08;

        tsParticles.load('particles-js', {
            fullScreen: false,
            fpsLimit: 60,
            particles: {
                number: {
                    value: 60,
                    density: {
                        enable: true,
                        area: 900
                    }
                },
                color: {
                    value: particleColor
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: particleOpacity,
                    random: {
                        enable: true,
                        minimumValue: 0.05
                    }
                },
                size: {
                    value: 2.5,
                    random: {
                        enable: true,
                        minimumValue: 1
                    }
                },
                links: {
                    enable: true,
                    distance: 150,
                    color: linkColor,
                    opacity: linkOpacity,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 0.8,
                    direction: 'none',
                    random: true,
                    straight: false,
                    outModes: {
                        default: 'out'
                    }
                }
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: 'grab'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        links: {
                            opacity: 0.2
                        }
                    }
                }
            },
            detectRetina: true
        });
    }

    // Initialize particles after tsParticles script loads
    if (typeof tsParticles !== 'undefined') {
        initParticles();
    } else {
        // Wait for script load
        window.addEventListener('load', initParticles);
    }

    // ---- Vanilla Tilt Init (for devices with hover) ----
    // Vanilla Tilt auto-initializes via data-tilt attributes
    // Disable on touch devices
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        $$('[data-tilt]').forEach((el) => {
            el.removeAttribute('data-tilt');
        });
    }

})();
