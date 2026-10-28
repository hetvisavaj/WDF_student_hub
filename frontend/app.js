document.addEventListener('DOMContentLoaded', () => {

    /* =========================================================================
       1. Light / Dark Theme Switcher (Persistent with localStorage)
       ========================================================================= */
    const themeBtn = document.getElementById('theme-toggle-btn');
    const root = document.documentElement;

    if (themeBtn) {
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
    }

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

            accordionTriggers.forEach(otherTrigger => {
                const otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
                otherTrigger.setAttribute('aria-expanded', 'false');
                otherTrigger.querySelector('.icon').textContent = '+';
                if (otherPanel) otherPanel.hidden = true;
            });

            if (!isExpanded) {
                trigger.setAttribute('aria-expanded', 'true');
                trigger.querySelector('.icon').textContent = '−';
                if (panel) panel.hidden = false;
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

    if (sliderWrapper && slides.length > 0 && dotsContainer) {
        let currentIndex = 0;
        let sliderInterval = null;

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

        if (prevBtn) prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            restartAutoplay();
        });

        if (nextBtn) nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            restartAutoplay();
        });

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
        if (!modal) return;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        const studentQuery = document.getElementById('student-query');
        if (studentQuery) studentQuery.focus();
    }

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (openModalBtn) openModalBtn.focus();
    }

    if (openModalBtn && modal) {
        openModalBtn.addEventListener('click', openModal);
        if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
        if (cancelModalBtn) cancelModalBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) {
                closeModal();
            }
        });

        if (advisorForm) {
            advisorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                alert('Your query has been sent to Academic Advising.');
                advisorForm.reset();
                closeModal();
            });
        }
    }

    /* =========================================================================
       7. Fetch external JSON data and render search/filter/sort/pagination
       ========================================================================= */
    const renderEventCard = (eventItem) => {
        const formattedDate = new Date(eventItem.date + 'T00:00:00');
        const month = formattedDate.toLocaleString('en-US', { month: 'short' });
        const day = formattedDate.getDate();

        return `
            <article class="event-card" aria-label="${eventItem.title}">
                <div class="event-date-badge" aria-hidden="true">
                    <span class="month">${month}</span>
                    <span class="day">${day}</span>
                </div>
                <div class="event-content">
                    <h2>${eventItem.title}</h2>
                    <p class="event-meta">
                        <span>📅 <time datetime="${eventItem.date}">${formattedDate.toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}</time></span>
                        <span>• 📍 ${eventItem.location}</span>
                    </p>
                    <p class="event-category">${eventItem.category}</p>
                    <p class="event-description">${eventItem.description}</p>
                    <a href="${eventItem.registerLink}" class="btn-register">RSVP / Register</a>
                </div>
            </article>
        `;
    };

    const renderFaqItem = (faqItem) => `
        <details class="faq-item" open>
            <summary>${faqItem.question}</summary>
            <p>${faqItem.answer}</p>
        </details>
    `;

    const paginate = (items, page, perPage) => {
        const start = (page - 1) * perPage;
        return items.slice(start, start + perPage);
    };

    const createPaginationButtons = (container, currentPage, totalPages, callback) => {
        container.innerHTML = '';

        for (let page = 1; page <= totalPages; page++) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = page;
            btn.className = `page-btn ${page === currentPage ? 'active' : ''}`;
            btn.setAttribute('aria-label', `Go to page ${page}`);
            btn.addEventListener('click', () => callback(page));
            container.appendChild(btn);
        }
    };

    const fetchJson = async (url, cacheKey = `hub-cache:${url}`) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Request failed: ${response.status}`);
            }
            const data = await response.json();
            localStorage.setItem(cacheKey, JSON.stringify({ savedAt: Date.now(), data }));
            return data;
        } catch (error) {
            console.error(`Error loading ${url}:`, error);
            const cached = localStorage.getItem(cacheKey);
            if (cached) {
                try {
                    console.warn(`Using cached data for ${url}.`);
                    return JSON.parse(cached).data;
                } catch (cacheError) {
                    localStorage.removeItem(cacheKey);
                }
            }
            throw error;
        }
    };

    const eventsContainer = document.getElementById('events-list');
    const eventSearch = document.getElementById('event-search');
    const eventCategoryFilter = document.getElementById('event-category-filter');
    const eventSort = document.getElementById('event-sort');
    const eventPagination = document.getElementById('event-pagination');

    if (eventsContainer && eventSearch && eventCategoryFilter && eventSort && eventPagination) {
        let allEvents = [];
        let activePage = 1;
        const perPage = 3;

        const updateEventView = () => {
            const searchText = eventSearch.value.trim().toLowerCase();
            const category = eventCategoryFilter.value;
            const sortValue = eventSort.value;

            let filtered = allEvents.filter((item) => {
                const matchesSearch = item.title.toLowerCase().includes(searchText) ||
                    item.location.toLowerCase().includes(searchText) ||
                    item.description.toLowerCase().includes(searchText);
                const matchesCategory = category === 'all' || item.category === category;
                return matchesSearch && matchesCategory;
            });

            if (sortValue === 'date-asc') {
                filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            } else if (sortValue === 'date-desc') {
                filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
            } else if (sortValue === 'title-asc') {
                filtered.sort((a, b) => a.title.localeCompare(b.title));
            }

            const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
            activePage = Math.min(activePage, totalPages);
            const currentPageEvents = paginate(filtered, activePage, perPage);

            eventsContainer.innerHTML = currentPageEvents.length
                ? currentPageEvents.map(renderEventCard).join('')
                : '<div class="empty-state">No events match your search or filter.</div>';

            createPaginationButtons(eventPagination, activePage, totalPages, (page) => {
                activePage = page;
                updateEventView();
            });
        };

        fetchJson('http://localhost/PRACTICAL/events_api.php').then((events) => {
            allEvents = events;
            const categories = [...new Set(events.map(item => item.category))];

            categories.forEach(category => {
                if (eventCategoryFilter.querySelector(`option[value="${category}"]`)) {
                    return;
                }
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                eventCategoryFilter.appendChild(option);
            });

            updateEventView();
        });

        eventSearch.addEventListener('input', () => {
            activePage = 1;
            updateEventView();
        });

        eventCategoryFilter.addEventListener('change', () => {
            activePage = 1;
            updateEventView();
        });

        eventSort.addEventListener('change', () => {
            activePage = 1;
            updateEventView();
        });
    }

    const faqList = document.getElementById('faq-list');
    const faqSearch = document.getElementById('faq-search');
    const faqCategoryFilter = document.getElementById('faq-category-filter');
    const faqSort = document.getElementById('faq-sort');
    const faqPagination = document.getElementById('faq-pagination');

    if (faqList && faqSearch && faqCategoryFilter && faqSort && faqPagination) {
        let allFaqs = [];
        let faqPage = 1;
        const perPage = 4;

        const updateFaqView = () => {
            const searchText = faqSearch.value.trim().toLowerCase();
            const category = faqCategoryFilter.value;
            const sortValue = faqSort.value;

            let filteredFaqs = allFaqs.filter((item) => {
                const questionMatch = item.question.toLowerCase().includes(searchText);
                const answerMatch = item.answer.toLowerCase().includes(searchText);
                const categoryMatch = category === 'all' || item.category === category;
                return (questionMatch || answerMatch) && categoryMatch;
            });

            if (sortValue === 'question-asc') {
                filteredFaqs.sort((a, b) => a.question.localeCompare(b.question));
            } else if (sortValue === 'category-asc') {
                filteredFaqs.sort((a, b) => a.category.localeCompare(b.category));
            } else {
                filteredFaqs.sort((a, b) => a.id - b.id);
            }

            const totalPages = Math.max(1, Math.ceil(filteredFaqs.length / perPage));
            faqPage = Math.min(faqPage, totalPages);
            const currentFaqs = paginate(filteredFaqs, faqPage, perPage);

            faqList.innerHTML = currentFaqs.length
                ? currentFaqs.map(renderFaqItem).join('')
                : '<div class="empty-state">No FAQs match your search.</div>';

            createPaginationButtons(faqPagination, faqPage, totalPages, (page) => {
                faqPage = page;
                updateFaqView();
            });
        };

        fetchJson('data/faqs.json').then((faqs) => {
            allFaqs = faqs;
            const categories = [...new Set(faqs.map(item => item.category))];

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category;
                option.textContent = category;
                faqCategoryFilter.appendChild(option);
            });

            updateFaqView();
        }).catch(() => {
            if (!faqList.children.length) {
                faqList.innerHTML = '<div class="empty-state">Unable to load FAQs. Open this page through a local web server, not directly as a file.</div>';
            }
            faqPagination.innerHTML = '';
        });

        faqSearch.addEventListener('input', () => {
            faqPage = 1;
            updateFaqView();
        });

        faqCategoryFilter.addEventListener('change', () => {
            faqPage = 1;
            updateFaqView();
        });

        faqSort.addEventListener('change', () => {
            faqPage = 1;
            updateFaqView();
        });
    }

    const studentList = document.getElementById('student-list');
    const studentSearch = document.getElementById('student-search');
    const studentStatusFilter = document.getElementById('student-status-filter');
    const studentSort = document.getElementById('student-sort');
    const studentPagination = document.getElementById('student-pagination');

    if (studentList && studentSearch && studentStatusFilter && studentSort && studentPagination) {
        let allStudents = [];
        let studentPage = 1;
        const perPage = 5;

        const updateStudentView = () => {
            const searchText = studentSearch.value.trim().toLowerCase();
            const status = studentStatusFilter.value;
            const sortValue = studentSort.value;
            const filteredStudents = allStudents
                .filter((student) => {
                    const matchesSearch = [student.id, student.name, student.program, student.year]
                        .some(value => value.toLowerCase().includes(searchText));
                    return matchesSearch && (status === 'all' || student.status === status);
                })
                .sort((a, b) => {
                    if (sortValue === 'name-asc') return a.name.localeCompare(b.name);
                    if (sortValue === 'year-asc') return a.year.localeCompare(b.year);
                    return a.id.localeCompare(b.id);
                });

            const totalPages = Math.max(1, Math.ceil(filteredStudents.length / perPage));
            studentPage = Math.min(studentPage, totalPages);
            const currentStudents = paginate(filteredStudents, studentPage, perPage);

            studentList.innerHTML = currentStudents.length
                ? currentStudents.map(student => `
                    <tr>
                        <td><strong>${student.id}</strong></td>
                        <td>${student.name}</td>
                        <td>${student.program}</td>
                        <td>${student.year}</td>
                        <td><span class="role-badge ${student.status === 'Active' ? 'role-student' : 'role-faculty'}">${student.status}</span></td>
                    </tr>
                `).join('')
                : '<tr><td colspan="5" class="empty-state">No students match your search.</td></tr>';

            createPaginationButtons(studentPagination, studentPage, totalPages, (page) => {
                studentPage = page;
                updateStudentView();
            });
        };

        fetchJson('data/students.json').then((students) => {
            allStudents = students;
            [...new Set(students.map(student => student.status))].forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                studentStatusFilter.appendChild(option);
            });
            updateStudentView();
        }).catch(() => {
            studentList.innerHTML = '<tr><td colspan="5" class="empty-state">Unable to load students. Open this page through a local web server.</td></tr>';
        });

        studentSearch.addEventListener('input', () => { studentPage = 1; updateStudentView(); });
        studentStatusFilter.addEventListener('change', () => { studentPage = 1; updateStudentView(); });
        studentSort.addEventListener('change', () => { studentPage = 1; updateStudentView(); });
    }

});