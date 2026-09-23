document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Light / Dark Theme Switcher (Persistent with localStorage)
       ========================================================================= */
    const themeBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;

    const savedTheme = localStorage.getItem('hub-theme') || 
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('hub-theme', theme);
        themeBtn.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    applyTheme(savedTheme);

    themeBtn.addEventListener('click', () => {
        const nextTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
    });

    /* =========================================================================
       2. Hamburger Menu Toggle
       ========================================================================= */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('main-nav');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('open');
            hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
        });
    }

    /* =========================================================================
       3. Dismissible Notification Banner
       ========================================================================= */
    const banner = document.getElementById('announcement-banner');
    const bannerCloseBtn = document.getElementById('banner-close-btn');

    if (banner && bannerCloseBtn) {
        if (sessionStorage.getItem('hub-banner-dismissed') === 'true') {
            banner.style.display = 'none';
        }

        bannerCloseBtn.addEventListener('click', () => {
            banner.style.display = 'none';
            sessionStorage.setItem('hub-banner-dismissed', 'true');
        });
    }

    /* =========================================================================
       4. Accessible Collapsible FAQ Accordion (Single expansion mode)
       ========================================================================= */
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

            // Close all open panels
            accordionTriggers.forEach(otherTrigger => {
                const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.querySelector('.icon').textContent = '+';
                otherPanel.hidden = true;
            });

            // Toggle clicked panel
            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                trigger.querySelector('.icon').textContent = '−';
                panel.hidden = false;
            }
        });
    });

    /* =========================================================================
       5. Content / Image Slider (Prev, Next, Dots, Auto-play)
       ========================================================================= */
    const sliderWrapper = document.getElementById('slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.getElementById('slider-prev');
    const nextBtn = document.getElementById('slider-next');
    const dotsContainer = document.getElementById('slider-dots');
    
    if (sliderWrapper && slides.length > 0) {
        let currentIndex = 0;
        let sliderInterval = null;

        // Create navigation dots
        slides.forEach((_, idx) => {
            const dot = document.createElement('button');
            dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
            dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
            dot.addEventListener('click', () => {
                goToSlide(idx);
                restartAutoplay();
            });
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.slider-dot');

        function goToSlide(index) {
            currentIndex = (index + slides.length) % slides.length;
            sliderWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
        }

        function restartAutoplay() {
            clearInterval(sliderInterval);
            sliderInterval = setInterval(() => goToSlide(currentIndex + 1), 5000);
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            restartAutoplay();
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            restartAutoplay();
        });

        // Initialize autoplay
        restartAutoplay();
    }

    /* =========================================================================
       6. Modal Popup (Open, Close, ESC key, Click Outside)
       ========================================================================= */
    const modal = document.getElementById('advisor-modal');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const advisorForm = document.getElementById('advisor-form');

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        document.getElementById('student-query').focus();
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openModalBtn) openModalBtn.focus();
    }

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', openModal);
        closeModalBtn.addEventListener('click', closeModal);
        cancelModalBtn.addEventListener('click', closeModal);

        // Click outside dialog to dismiss
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Escape key to dismiss
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        advisorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Your query has been sent to Academic Advising.');
            advisorForm.reset();
            closeModal();
        });
    }
});