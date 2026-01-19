/* =====================================================
   ZIEBA BYGG - Main JavaScript
   Profesjonell Gulvlegging og Tapetsering i Lørenskog
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initStickyHeader();
    initSmoothScroll();
    initContactForm();
    initScrollAnimations();
    initGalleryFilter();
});

/* =====================================================
   Mobile Menu
   ===================================================== */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.header__nav');
    const navLinks = document.querySelectorAll('.nav__link');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('active')) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    });
}

/* =====================================================
   Sticky Header
   ===================================================== */
function initStickyHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;
    const scrollThreshold = 100;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* =====================================================
   Smooth Scroll
   ===================================================== */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            // Skip if it's just "#" or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();

            const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

/* =====================================================
   Contact Form
   ===================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');
    const formMessage = form.querySelector('.form-message');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validate form
        if (!validateForm(form)) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const formData = new FormData(form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            projectType: formData.get('projectType'),
            area: formData.get('area'),
            description: formData.get('description'),
            wantSiteVisit: formData.get('siteVisit') === 'on'
        };

        try {
            // Simulate form submission (replace with actual API call)
            await simulateFormSubmission(data);

            // Show success message
            showFormMessage(formMessage, 'success', 'Takk for din henvendelse! Vi kontakter deg snart.');
            form.reset();

        } catch (error) {
            // Show error message
            showFormMessage(formMessage, 'error', 'Noe gikk galt. Vennligst prøv igjen eller ring oss direkte.');
            console.error('Form submission error:', error);
        } finally {
            // Remove loading state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });

    // Real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Check required
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Dette feltet er påkrevd';
    }

    // Check email format
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Vennligst oppgi en gyldig e-postadresse';
        }
    }

    // Check phone format (Norwegian)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^(\+47)?[\s-]?[0-9]{8}$/;
        const cleanPhone = value.replace(/[\s-]/g, '');
        if (!phoneRegex.test(cleanPhone) && cleanPhone.length < 8) {
            isValid = false;
            errorMessage = 'Vennligst oppgi et gyldig telefonnummer';
        }
    }

    // Update UI
    if (isValid) {
        field.classList.remove('error');
        removeFieldError(field);
    } else {
        field.classList.add('error');
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    removeFieldError(field);

    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: var(--color-error); font-size: 0.75rem; display: block; margin-top: 0.25rem;';

    field.parentNode.appendChild(errorElement);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function showFormMessage(element, type, message) {
    if (!element) return;

    element.className = 'form-message ' + type;
    element.textContent = message;
    element.style.display = 'block';

    // Scroll to message
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Auto-hide success message after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Simulate form submission (replace with actual Resend API call)
async function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Log form data for development
            console.log('Form submission data:', data);

            // Simulate success (90% of the time)
            if (Math.random() > 0.1) {
                resolve({ success: true });
            } else {
                reject(new Error('Simulated error'));
            }
        }, 1500);
    });
}

/* =====================================================
   Scroll Animations
   ===================================================== */
function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll(
        '.service-card, .why-us__item, .value-card, .project-card, .pricing-card, .intro__content, .intro__image'
    );

    if (animatedElements.length === 0) return;

    // Add initial styles
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
}

/* =====================================================
   Gallery Filter
   ===================================================== */
function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery__filter-btn');
    const galleryItems = document.querySelectorAll('.gallery__item');

    if (filterBtns.length === 0 || galleryItems.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.dataset.filter;

            // Filter items
            galleryItems.forEach(item => {
                const category = item.dataset.category;

                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* =====================================================
   Utility Functions
   ===================================================== */

// Throttle function for scroll events
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

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/* =====================================================
   Form Submission with Resend (Production Ready)
   ===================================================== */

// Uncomment and configure for production use with Resend API
/*
async function submitFormWithResend(data) {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: 'ZIEBA BYGG Nettside <nettside@ziebabygg.no>',
            to: ['post@ziebabygg.no'],
            subject: `Ny henvendelse fra ${data.name}`,
            html: `
                <h2>Ny henvendelse fra nettsiden</h2>
                <p><strong>Navn:</strong> ${data.name}</p>
                <p><strong>E-post:</strong> ${data.email}</p>
                <p><strong>Telefon:</strong> ${data.phone}</p>
                <p><strong>Adresse:</strong> ${data.address || 'Ikke oppgitt'}</p>
                <p><strong>Type prosjekt:</strong> ${data.projectType}</p>
                <p><strong>Areal:</strong> ${data.area ? data.area + ' m²' : 'Ikke oppgitt'}</p>
                <p><strong>Ønsker befaring:</strong> ${data.wantSiteVisit ? 'Ja' : 'Nei'}</p>
                <hr>
                <p><strong>Beskrivelse:</strong></p>
                <p>${data.description}</p>
            `,
        }),
    });

    if (!response.ok) {
        throw new Error('Failed to send email');
    }

    return response.json();
}
*/

/* =====================================================
   Click-to-Call Tracking (Optional Analytics)
   ===================================================== */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', function() {
        // Track phone call clicks (integrate with your analytics)
        console.log('Phone call initiated:', this.href);

        // Example: Google Analytics tracking
        // gtag('event', 'click', {
        //     'event_category': 'Contact',
        //     'event_label': 'Phone Call'
        // });
    });
});

/* =====================================================
   Lazy Loading Images (Native + Fallback)
   ===================================================== */
document.addEventListener('DOMContentLoaded', function() {
    // Use native lazy loading
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    // Add fallback for older browsers
    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        return;
    }

    // Fallback: Use IntersectionObserver
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }
});
