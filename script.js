// ============================================
//   CREATIVE COTTON — FULL JAVASCRIPT
// ============================================

const EMAILJS_SERVICE_ID  = "service_jmt4nl8";   
const EMAILJS_TEMPLATE_ID = "template_101bdib";  

document.addEventListener('DOMContentLoaded', function () {

    // ============ TOAST NOTIFICATION ============
    function showToast(type, message) {
        const toast    = document.getElementById('toast');
        const toastMsg = document.getElementById('toastMsg');
        const toastIcon= document.getElementById('toastIcon');

        toast.className = 'toast ' + type;
        toastMsg.textContent = message;
        toastIcon.className  = type === 'success'
            ? 'fas fa-circle-check'
            : 'fas fa-circle-xmark';

        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 5000);
    }


    // ============ HAMBURGER MENU ============
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav    = document.getElementById('mobileNav');
    const mobileLinks  = document.querySelectorAll('.mobile-link');

    function openMenu() {
        hamburgerBtn.classList.add('open');
        mobileNav.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', () => {
            mobileNav.classList.contains('open') ? closeMenu() : openMenu();
        });
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
    }


    // ============ SMOOTH SCROLLING ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerHeight = parseFloat(
                    getComputedStyle(document.documentElement).getPropertyValue('--header-height')
                ) || 122;
                window.scrollTo({ top: target.offsetTop - headerHeight, behavior: 'smooth' });
            }
        });
    });


    // ============ READ MORE / LESS ============
    const readMoreBtn   = document.querySelector('.read-more-btn');
    const storyExpanded = document.querySelector('.story-expanded');

    if (readMoreBtn && storyExpanded) {
        readMoreBtn.addEventListener('click', function () {
            const isShown = storyExpanded.classList.toggle('show');
            readMoreBtn.innerHTML = isShown
                ? 'READ LESS <i class="fas fa-arrow-up"></i>'
                : 'LEARN MORE <i class="fas fa-arrow-right"></i>';
        });
    }


    // ============ SOCK SCIENCE SLIDER ============
    const scienceSlides = document.querySelectorAll('.science-slide');
    const sliderDots    = document.querySelectorAll('.slider-dot');
    const scienceTabs   = document.querySelectorAll('.science-tab');
    let currentSlide    = 0;
    let autoSlideTimer  = null;

    function showSlide(index) {
        scienceSlides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            if (sliderDots[i]) sliderDots[i].classList.toggle('active', i === index);
            if (scienceTabs[i]) scienceTabs[i].classList.toggle('active', i === index);
        });
        currentSlide = index;
    }

    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            showSlide((currentSlide + 1) % scienceSlides.length);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    sliderDots.forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); resetAutoSlide(); }));
    scienceTabs.forEach((tab, i) => tab.addEventListener('click', () => { showSlide(i); resetAutoSlide(); }));

    // Touch/swipe support
    let touchStartX = 0;
    const slider = document.querySelector('.science-slider');
    if (slider) {
        slider.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
        slider.addEventListener('touchend', e => {
            const diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                const next = diff > 0
                    ? (currentSlide + 1) % scienceSlides.length
                    : (currentSlide - 1 + scienceSlides.length) % scienceSlides.length;
                showSlide(next);
                resetAutoSlide();
            }
        }, { passive: true });
    }

    showSlide(0);
    startAutoSlide();


    // ============ STORY SCROLL ANIMATIONS ============
    const storyHeading  = document.querySelector('.story-heading');
    const animateLeft   = document.querySelector('.story-animate-left');
    const animateRight  = document.querySelector('.story-animate-right');

    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                storyObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    [storyHeading, animateLeft, animateRight].forEach(el => { if (el) storyObserver.observe(el); });


    // ============ CONTACT FORM — EMAILJS ============
    const contactForm = document.getElementById('contactForm');
    const submitBtn   = document.getElementById('submitBtn');

    // Live validation helpers
    function validateField(input) {
        const group = input.closest('.form-group');
        if (!group) return true;

        const val = input.value.trim();
        let valid = true;

        if (input.required && val === '') {
            valid = false;
        } else if (input.type === 'email' && val !== '') {
            valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        }

        group.classList.toggle('error', !valid);
        group.classList.toggle('success', valid && val !== '');
        return valid;
    }

    // Validate on blur (when user leaves field)
    if (contactForm) {
        contactForm.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) {
                    validateField(input);
                }
            });
        });
    }

    function setLoading(isLoading) {
        submitBtn.disabled = isLoading;
        submitBtn.classList.toggle('loading', isLoading);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Validate all required fields
            const inputs  = contactForm.querySelectorAll('input[required], textarea[required]');
            let allValid  = true;

            inputs.forEach(input => {
                if (!validateField(input)) allValid = false;
            });

            if (!allValid) {
                showToast('error', 'Please fill in all required fields correctly.');
                return;
            }

            // Show loading state
            setLoading(true);

            // Send via EmailJS
            // template variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
            emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
                .then(function () {
                    setLoading(false);
                    showToast('success', 'Message sent successfully! We\'ll get back to you soon.');
                    contactForm.reset();
                    // Clear validation states
                    contactForm.querySelectorAll('.form-group').forEach(g => {
                        g.classList.remove('success', 'error');
                    });
                })
                .catch(function (error) {
                    setLoading(false);
                    console.error('EmailJS error:', error);
                    showToast('error', 'Failed to send message. Please try again or email us directly.');
                });
        });
    }


    // ============ SCROLL NAV SHADOW ============
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (nav) {
            nav.style.boxShadow = window.scrollY > 10
                ? '0 2px 12px rgba(0,0,0,0.15)'
                : '0 2px 5px rgba(0,0,0,0.1)';
        }
    }, { passive: true });

});