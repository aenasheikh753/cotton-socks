// ============================================
//   CREATIVE COTTON — RESPONSIVE JAVASCRIPT
// ============================================

document.addEventListener('DOMContentLoaded', function () {

    // ============ HAMBURGER MENU ============
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileNav    = document.getElementById('mobileNav');
    const mobileLinks  = document.querySelectorAll('.mobile-link');

    function openMenu() {
        hamburgerBtn.classList.add('open');
        mobileNav.classList.add('open');
        hamburgerBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden'; // prevent scroll when menu open
    }

    function closeMenu() {
        hamburgerBtn.classList.remove('open');
        mobileNav.classList.remove('open');
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn && mobileNav) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = mobileNav.classList.contains('open');
            isOpen ? closeMenu() : openMenu();
        });

        // Close menu when a mobile link is clicked
        mobileLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }


    // ============ SMOOTH SCROLLING ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerHeight = parseFloat(
                    getComputedStyle(document.documentElement)
                        .getPropertyValue('--header-height')
                ) || 122;
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });


    // ============ READ MORE / LESS (OUR STORY) ============
    const readMoreBtn    = document.querySelector('.read-more-btn');
    const storyExpanded  = document.querySelector('.story-expanded');

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
            const next = (currentSlide + 1) % scienceSlides.length;
            showSlide(next);
        }, 5000);
    }

    function resetAutoSlide() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
    });

    scienceTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => { showSlide(index); resetAutoSlide(); });
    });

    // Touch/swipe support for slider
    let touchStartX = 0;
    const slider = document.querySelector('.science-slider');
    if (slider) {
        slider.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

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


    // ============ STORY SECTION — SCROLL ANIMATIONS ============
    const storyHeading   = document.querySelector('.story-heading');
    const animateLeft    = document.querySelector('.story-animate-left');
    const animateRight   = document.querySelector('.story-animate-right');

    const storyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                storyObserver.unobserve(entry.target); // fire once
            }
        });
    }, { threshold: 0.15 });

    [storyHeading, animateLeft, animateRight].forEach(el => {
        if (el) storyObserver.observe(el);
    });



    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name    = document.getElementById('name').value.trim();
            const email   = document.getElementById('email').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all required fields.');
                return;
            }

            // Replace with actual form submission logic (e.g., fetch to API)
            alert(`Thank you, ${name}! We've received your message and will get back to you soon.`);
            contactForm.reset();
        });
    }


    // ============ SCROLL-BASED NAV SHADOW ============
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (nav) {
            nav.style.boxShadow = window.scrollY > 10
                ? '0 2px 12px rgba(0,0,0,0.15)'
                : '0 2px 5px rgba(0,0,0,0.1)';
        }
    }, { passive: true });

});