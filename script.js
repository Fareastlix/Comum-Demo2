document.addEventListener('DOMContentLoaded', () => {
    // Render data-driven sections BEFORE lucide so new icons get picked up
    renderValues();
    renderArticles();
    // Initialize Lucide icons
    lucide.createIcons();

    // Auth UI — runs on ALL pages (updates Join Us / profile nav)
    initAuthUI();

    // Initialize all modules
    initNavbar();
    initScrollReveal();
    initCounters();
    initHeroParallax();
    initEventsCarousel();
    initValuesReveal();
    initFAQ();
    initMobileMenu();
    // Word-by-word reveal for intro heading — must run BEFORE initInline3DModels
    // so .model-inline elements get their unit-index assigned, then the mouse
    // handler in initInline3DModels can wire up. Word-reveal also owns the
    // play3DEntrance trigger (replaces the old i*220ms stagger observer).
    initHeadingWordReveal();
    initInline3DModels();
    initWheelSpin();
    initIntroPhotoExplosion();
    initSmoothScroll();
    initFeatureIcons();
    initStoreSequence();
    initStoreCTAReveal();
    initIGVideos();
    initEventModal();
    initRuntimePerf();
});

/* =========================================
   SMOOTH SCROLL
   Lightweight wheel-lerp smoother. Intercepts wheel events, animates
   window.scrollY toward a target each frame. Because we scroll the
   native scroll position (not transform), position:sticky and
   scroll-driven animations (intro collage) keep working.
   Disabled on touch devices — mobile native inertia is already smooth.
   ========================================= */
function initSmoothScroll() {
    // Bail on touch / coarse pointer devices (mobile)
    if (window.matchMedia('(pointer: coarse)').matches) return;
    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let targetY = window.scrollY;
    let currentY = window.scrollY;
    let rafId = null;
    const ease = 0.12; // higher = snappier, lower = smoother

    function clampTarget() {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (targetY < 0) targetY = 0;
        if (targetY > max) targetY = max;
    }

    function tick() {
        const delta = targetY - currentY;
        if (Math.abs(delta) < 0.5) {
            currentY = targetY;
            window.scrollTo(0, currentY);
            rafId = null;
            return;
        }
        currentY += delta * ease;
        window.scrollTo(0, currentY);
        rafId = requestAnimationFrame(tick);
    }

    window.addEventListener('wheel', (e) => {
        // Skip if an inner scroller wants the event (e.g. horizontal carousel)
        let el = e.target;
        while (el && el !== document.body) {
            const cs = getComputedStyle(el);
            const ox = cs.overflowX, oy = cs.overflowY;
            const canScrollY = (oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight;
            const canScrollX = (ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth;
            if (canScrollY || canScrollX) return; // let native handle it
            el = el.parentElement;
        }

        e.preventDefault();
        targetY += e.deltaY;
        clampTarget();
        if (!rafId) rafId = requestAnimationFrame(tick);
    }, { passive: false });

    // Keep target in sync when the user uses keyboard / scrollbar / anchor jumps
    window.addEventListener('scroll', () => {
        if (rafId === null) {
            targetY = window.scrollY;
            currentY = window.scrollY;
        }
    }, { passive: true });

    window.addEventListener('resize', clampTarget);
}

/* =========================================
   WHEEL CONTINUOUS 3D SPIN
   Updates model-viewer's `orientation` attribute every frame so the
   actual 3D model rotates around its axle (world X axis, which aligns
   with the wheel's axle in the exported GLB). The static 65° yaw that
   tilts the rim toward the camera is composed AFTER the spin, so the
   visual result is a tilted wheel whose rim/spokes rotate in 3D.

   Only starts after the entrance animation finishes (.entered class).
   ========================================= */
function initWheelSpin() {
    document.querySelectorAll('[data-wheel-spin]').forEach(slot => {
        const mv = slot.querySelector('model-viewer');
        if (!mv) return;

        // Read the static tilt from the current orientation so we preserve
        // whatever yaw the HTML author picked (e.g. 65deg).
        const base = mv.getAttribute('orientation') || '0deg 0deg 0deg';
        const [, , baseYaw = '0deg'] = base.split(/\s+/);

        const PERIOD_MS = 3500;       // one full revolution
        let started = null;

        function tick(now) {
            if (slot.classList.contains('entered')) {
                if (started === null) started = now;
                const angle = ((now - started) * 360 / PERIOD_MS) % 360;
                // Format: "X-rot Y-rot Z-rot". Spin goes in the Y slot (2nd) so
                // the wheel rotates around its native axle before the Z-tilt
                // swings the whole spinning wheel into the camera view.
                mv.setAttribute('orientation', `0deg ${angle.toFixed(2)}deg ${baseYaw}`);
            }
            requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    });
}

/* =========================================
   HEADING WORD-BY-WORD REVEAL
   Walks .intro-heading, wraps each word in <span class="word">, and
   treats each .model-inline slot as a word-unit in DOM order. On scroll-in,
   every unit gets a staggered fade-up transition via --unit-index, and the
   3D models pop in at their natural position in the word flow.
   ========================================= */
function initHeadingWordReveal() {
    const heading = document.querySelector('.intro-heading');
    if (!heading) return;

    // 1) Walk the DOM, flatten into an ordered list of "word units".
    //    - Text nodes: split on whitespace, each word becomes a <span class="word">
    //    - .highlight spans: recurse INTO them (so their inner words still split,
    //      inheriting the blue color from the parent's CSS)
    //    - .model-inline spans: treat as ONE unit — don't recurse, just list it
    const units = [];
    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            if (!text.trim()) return;                  // pure-whitespace node: leave alone
            const parts = text.split(/(\s+)/);         // keep whitespace chunks
            const frag = document.createDocumentFragment();
            parts.forEach(part => {
                if (part === '') return;
                if (/^\s+$/.test(part)) {
                    frag.appendChild(document.createTextNode(part));
                } else {
                    const span = document.createElement('span');
                    span.className = 'word';
                    span.textContent = part;
                    frag.appendChild(span);
                    units.push(span);
                }
            });
            node.parentNode.replaceChild(frag, node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains('model-inline')) {
                // Word-unit marker (different class so CSS fade-up skips it —
                // model-inline has its own scale(0) -> scale(1) entrance)
                node.classList.add('word-unit-model');
                units.push(node);
            } else {
                // .highlight, etc. — recurse so inner words get wrapped
                [...node.childNodes].forEach(walk);
            }
        }
    }
    [...heading.childNodes].forEach(walk);

    // 2) Assign sequential index so CSS delay = --unit-index * stagger
    const STAGGER_MS = 65;  // feel: quick enough to stay dynamic, slow enough to read
    units.forEach((el, i) => {
        el.style.setProperty('--unit-index', i);
    });

    // 3) Trigger on scroll-in: CSS transition fires via .words-revealed,
    //    and each .model-inline gets play3DEntrance at its matching delay.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            heading.classList.add('words-revealed');
            units.forEach((el, i) => {
                if (el.classList.contains('model-inline')) {
                    setTimeout(() => play3DEntrance(el), i * STAGGER_MS);
                }
            });
            observer.unobserve(heading);
        });
    }, { threshold: 0.25, rootMargin: '0px 0px -40px 0px' });
    observer.observe(heading);
}

/* =========================================
   INLINE 3D MODELS (replaces emojis in intro heading)
   - Mouse-reactive camera orbit on the model inside
   - Entrance is triggered by initHeadingWordReveal, not here, so each 3D
     pops in synced with its word position instead of a flat i*220ms order.
   ========================================= */
function initInline3DModels() {
    const slots = document.querySelectorAll('[data-inline-3d]');
    if (!slots.length) return;

    /* --- Mouse-reactive 3D camera orbit (inside each model-viewer) --- */
    // throttled via rAF
    let mouseX = 0, mouseY = 0;
    let ticking = false;

    document.addEventListener('mousemove', (e) => {
        // Normalize to -1..1 based on viewport
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = (e.clientY / window.innerHeight) * 2 - 1;

        if (!ticking) {
            requestAnimationFrame(() => {
                slots.forEach(slot => {
                    if (!slot.classList.contains('entered')) return;
                    const mv = slot.querySelector('model-viewer');
                    if (!mv) return;
                    // Yaw (theta): ±25deg around center
                    // Pitch (phi): per-element rest phi ±12deg (keeps upright-ish)
                    const restPhi = parseFloat(slot.dataset.restPhi) || 75;
                    const theta = (mouseX * 25).toFixed(1);
                    const phi = (restPhi + mouseY * 12).toFixed(1);
                    mv.setAttribute('camera-orbit', `${theta}deg ${phi}deg 115%`);
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

function play3DEntrance(el) {
    // Idempotent: safe if called twice (e.g. by word-reveal + a stray observer)
    if (el.dataset.entranceStarted === '1') return;
    el.dataset.entranceStarted = '1';
    /* Single continuous easeOutBack curve drives ALL three channels
       (scale, Z-tilt, camera-orbit Y spin) in lockstep. One spring shape
       — rises, overshoots ~10%, settles — so there are no velocity kinks
       between keyframe segments like the old 3-stage version had.

       Channels and their settle values:
         - scale     : 0    -> 1               (peaks ~1.10 mid-overshoot)
         - rotateZ   : 0deg -> -6deg           (subtle lean, peaks ~-6.6deg)
         - cam theta : 0deg -> 360deg          (peaks ~395deg)
         - cam phi   : stays at per-element resting phi (data-rest-phi || 75)

       Layer split is kept so the Y spin stays truly 3D:
         - CSS wrapper handles scale + Z-tilt (flat-safe)
         - model-viewer camera-orbit rotates the real 3D scene (not a plane flip) */
    const P = 'perspective(600px)';
    const DURATION = 2200;
    const BACK_BEZIER = 'cubic-bezier(0.34, 1.56, 0.64, 1)';  // easeOutBack
    const mv = el.querySelector('model-viewer');

    // Per-element resting phi (vertical camera angle). Default 75deg works for
    // flat objects like the padel racket; wheel needs lower phi to face its rim.
    const restPhi = parseFloat(el.dataset.restPhi) || 75;

    /* Layer 1 — CSS wrapper: WAAPI interpolates scale + Z-tilt with the
       overshooting bezier. One keyframe pair = one smooth curve. */
    const anim = el.animate([
        { transform: `${P} scale(0) rotateZ(0deg)` },
        { transform: `${P} scale(1) rotateZ(-6deg)` }
    ], {
        duration: DURATION,
        easing: BACK_BEZIER,
        fill: 'forwards'
    });

    /* Layer 2 — camera-orbit theta 0 -> 360deg with the SAME easeOutBack
       (manual JS impl, since model-viewer attributes aren't WAAPI-animatable). */
    if (mv) {
        // Classic easeOutBack with standard s=1.70158 → ~10.14% overshoot,
        // matching the 395deg peak / 360deg settle feel of the prior version.
        const s = 1.70158;
        const easeOutBack = t => {
            const p = t - 1;
            return 1 + (s + 1) * p * p * p + s * p * p;
        };
        const start = performance.now();
        function tick(now) {
            const t = Math.min((now - start) / DURATION, 1);
            const theta = 360 * easeOutBack(t);
            mv.setAttribute('camera-orbit', `${theta.toFixed(1)}deg ${restPhi}deg 115%`);
            if (t < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
    }

    anim.onfinish = () => {
        // Lock in final CSS transform; mouse handler takes over camera-orbit
        // (only runs once `.entered` is set, so no conflict during entrance).
        el.style.transform = `${P} scale(1) rotateZ(-6deg)`;
        el.classList.add('entered');
    };
}

/* =========================================
   COMUM VALUES — data-driven
   Edit the array to change content.  Icons are Lucide names.
   ========================================= */
const COMUM_VALUES = [
    {
        icon: 'heart-handshake',
        title: 'Pemula welcome.',
        description: 'Gatekeeping stay out. Kami bantu kamu dari langkah pertama sampai nyaman di lapangan atau di atas sepeda.'
    },
    {
        icon: 'users',
        title: 'Main bareng, bukan kompetisi.',
        description: 'Nggak ada drama ranking di sini. Yang penting keringat keluar bareng, ketawa keluar bareng.'
    },
    {
        icon: 'sparkles',
        title: 'Komunitas dulu, performa ikut.',
        description: 'Progres paling cepet datang dari circle yang benar. Teman main dulu, PR bakal ngejar sendiri.'
    },
    {
        icon: 'bike',
        title: 'Padel dan sepeda, satu keluarga.',
        description: 'Dua olahraga berbeda, satu semangat sama. Di Comum, kedua dunia ini saling dukung — bukan saling pisah.'
    }
];

function renderValues() {
    const grid = document.getElementById('values-grid');
    if (!grid) return;

    grid.innerHTML = COMUM_VALUES.map((v, i) => `
        <article class="value-card" data-value-index="${i}">
            <span class="value-number">0${i + 1}</span>
            <div class="value-icon">
                <i data-lucide="${v.icon}"></i>
            </div>
            <h3>${v.title}</h3>
            <p>${v.description}</p>
        </article>
    `).join('');
}

/* Staggered scroll reveal for value cards (uses IntersectionObserver). */
function initValuesReveal() {
    const cards = document.querySelectorAll('.value-card');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const i = parseInt(el.dataset.valueIndex) || 0;
                setTimeout(() => el.classList.add('revealed'), i * 120);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    cards.forEach(el => observer.observe(el));
}

/* =========================================
   ARTICLES — data-driven
   Community-first content: rides, tips, openings, culture.
   ========================================= */
const ARTICLES = [
    {
        title: 'Lebaran Usai, Saatnya Balik Gerak: Mulai Lagi dari yang Ringan',
        date: '25 March 2026',
        category: 'Community',
        excerpt: 'Setelah Ramadan, tubuh butuh waktu untuk kembali ke ritme semula. Momen setelah Lebaran jadi waktu yang tepat untuk mulai aktif lagi — pelan, konsisten, dan tetap fun lewat cycling, running, atau padel.',
        image: './Asset/WebP/Cycling_GroupPic3_result.webp'
    },
    {
        title: 'Tempat Terbaik untuk Menemukan Raket Padel yang Tepat',
        date: '27 January 2026',
        category: 'Padel',
        excerpt: 'Comum bukan cuma tempat beli peralatan padel. Di sini, kamu bisa mencoba berbagai raket, merasakan performanya lewat simulator, dan booking pengalaman bermain dengan mudah lewat Ayo.',
        image: './Asset/WebP/Padel_Photo2_result.webp'
    },
    {
        title: 'Grand Opening Comum Bike & Padel Alam Sutera: Pengalaman Sport Lifestyle yang Lebih Dekat',
        date: '26 November 2025',
        category: 'News',
        excerpt: 'Comum resmi membuka store terbaru Comum Bike & Padel Alam Sutera, menghadirkan ruang sport-lifestyle yang modern, lengkap, dan nyaman untuk para pecinta sepeda dan padel.',
        image: './Asset/WebP/Cycling_GroupPic_result.webp'
    }
];

function renderArticles() {
    const list = document.getElementById('articles-list');
    if (!list) return;

    list.innerHTML = ARTICLES.map(a => `
        <article class="article-row">
            <div class="article-body">
                <span class="article-category">${a.category}</span>
                <h3><a href="#">${a.title}</a></h3>
                <span class="article-date">${a.date}</span>
                <p class="article-excerpt">${a.excerpt}</p>
            </div>
            <div class="article-thumb">
                <img src="${a.image}" alt="${a.title}">
            </div>
        </article>
    `).join('');
}


/* =========================================
   Auth UI: Update nav CTA on all pages
   ========================================= */
function initAuthUI() {
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    const cartCount = (JSON.parse(localStorage.getItem('comum-cart') || '[]'))
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

    // Desktop nav CTA — always Profile (or Login if not signed in)
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        if (user) {
            const initials = (user.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
            navCta.href = 'profile.html';
            navCta.innerHTML = `<span style="width:24px;height:24px;border-radius:50%;background:white;color:var(--primary-blue);display:inline-flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;">${initials}</span> ${user.name.split(' ')[0]}`;
        } else {
            navCta.href = 'login.html';
            navCta.innerHTML = `<i data-lucide="user"></i> Login`;
        }

        // Inject a separate cart icon directly next to the profile CTA.
        // Both share a .nav-actions wrapper so they cluster together rather
        // than being split apart by the nav's space-between layout.
        let cartBtn = document.querySelector('.nav-cart-btn');
        if (!cartBtn) {
            const wrapper = document.createElement('div');
            wrapper.className = 'nav-actions';
            cartBtn = document.createElement('a');
            cartBtn.className = 'nav-cart-btn';
            cartBtn.href = 'cart.html';
            cartBtn.setAttribute('aria-label', 'Cart');
            cartBtn.innerHTML = `<i data-lucide="shopping-cart"></i><span class="cart-count" id="cart-count">${cartCount}</span>`;
            navCta.parentNode.insertBefore(wrapper, navCta);
            wrapper.appendChild(cartBtn);
            wrapper.appendChild(navCta);
        } else {
            const badge = cartBtn.querySelector('.cart-count');
            if (badge) badge.textContent = cartCount;
        }
        // Hide the badge entirely when empty
        const badge = cartBtn.querySelector('.cart-count');
        if (badge) badge.style.display = cartCount > 0 ? '' : 'none';
    }

    // Mobile drawer CTA — Profile chip
    const drawerCta = document.querySelector('.drawer-cta');
    if (drawerCta) {
        if (user) {
            drawerCta.href = 'profile.html';
            drawerCta.textContent = 'My Profile';
        } else {
            drawerCta.href = 'login.html';
            drawerCta.textContent = 'Login';
        }
    }

    // Drawer cart link — inject above the CTA
    const drawerLinks = document.querySelector('.drawer-links');
    if (drawerLinks && !drawerLinks.querySelector('.drawer-cart-link')) {
        const a = document.createElement('a');
        a.href = 'cart.html';
        a.className = 'drawer-cart-link';
        a.innerHTML = `Cart${cartCount > 0 ? ` <span class="cart-count">${cartCount}</span>` : ''}`;
        drawerLinks.appendChild(a);
    }

    if (window.lucide) lucide.createIcons();
}

/* =========================================
   Navbar: Hide on scroll down, show on up
   ========================================= */
function initNavbar() {
    const nav = document.querySelector('.navbar');
    let lastY = 0;
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const y = window.scrollY;
                nav.classList.toggle('scrolled', y > 100);
                // Only hide if scrolling down AND past 300px
                if (y > lastY && y > 300) {
                    nav.classList.add('hidden');
                } else {
                    nav.classList.remove('hidden');
                }
                lastY = y;
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* =========================================
   Scroll Reveal (IntersectionObserver)
   ========================================= */
function initScrollReveal() {
    const reveals = document.querySelectorAll('[data-reveal]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseInt(el.dataset.revealDelay) || 0;
                setTimeout(() => el.classList.add('revealed'), delay);
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(el => observer.observe(el));
}

/* =========================================
   Animated Counters
   ========================================= */
function initCounters() {
    const counters = document.querySelectorAll('.counter');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.target);
                // Small delay so it feels intentional
                setTimeout(() => animateCounter(el, target), 600);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    counters.forEach(el => observer.observe(el));
}

function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();

    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }

    requestAnimationFrame(update);
}

/* =========================================
   Hero Parallax
   ========================================= */
function initHeroParallax() {
    const heroImg = document.getElementById('hero-img');
    if (!heroImg) return;

    // Parallax disabled — hero background stays still, no transform on scroll.
    heroImg.style.transform = 'none';

    /* Pause the hero video when scrolled offscreen so it stops decoding
       frames in the background — biggest single heat win on phones. */
    if (heroImg.tagName === 'VIDEO') {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) heroImg.play().catch(() => {});
                else heroImg.pause();
            });
        }, { threshold: 0 });
        io.observe(heroImg);
    }
}

/* =========================================
   RUNTIME PERF — global safeguards that
   reduce CPU/GPU work whenever the page is
   not actively visible to the user.
   ========================================= */
function initRuntimePerf() {
    const marquees = document.querySelectorAll('.partner-logos-track, .ig-video-track');

    /* Pause CSS marquee animations when their section is offscreen.
       Even off-screen CSS animations keep the compositor running. */
    if (marquees.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                e.target.classList.toggle('marquee-offscreen', !e.isIntersecting);
            });
        }, { threshold: 0 });
        marquees.forEach(m => {
            m.classList.add('marquee-offscreen');
            io.observe(m);
        });
    }

    /* Tab visibility:
       - hidden: pause videos + freeze marquees (browsers also throttle
         background tabs, but this is more aggressive on phones).
       - visible: re-evaluate each marquee's onscreen state directly
         (IO won't re-fire if intersection didn't change while hidden,
         which would otherwise leave them stuck paused forever). */
    function isInViewport(el) {
        const r = el.getBoundingClientRect();
        return r.bottom > 0 && r.top < window.innerHeight;
    }
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            document.querySelectorAll('video').forEach(v => v.pause());
            marquees.forEach(m => m.classList.add('marquee-offscreen'));
        } else {
            marquees.forEach(m => {
                m.classList.toggle('marquee-offscreen', !isInViewport(m));
            });
            const hero = document.getElementById('hero-img');
            if (hero && hero.tagName === 'VIDEO' && isInViewport(hero)) {
                hero.play().catch(() => {});
            }
        }
    });
}

/* =========================================
   Events Carousel: Horizontal scroll + arrow buttons
   ========================================= */
function initEventsCarousel() {
    const track = document.getElementById('events-carousel');
    if (!track) return;

    const prevBtn = document.querySelector('.carousel-btn[data-dir="prev"]');
    const nextBtn = document.querySelector('.carousel-btn[data-dir="next"]');
    if (!prevBtn || !nextBtn) return;

    const getScrollStep = () => {
        const card = track.querySelector('.event-card');
        if (!card) return 320;
        const gap = parseInt(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 24);
        return card.offsetWidth + gap;
    };

    function updateButtonState() {
        const maxScroll = track.scrollWidth - track.clientWidth - 1;
        prevBtn.disabled = track.scrollLeft <= 0;
        nextBtn.disabled = track.scrollLeft >= maxScroll;
    }

    prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -getScrollStep(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: getScrollStep(), behavior: 'smooth' });
    });

    track.addEventListener('scroll', updateButtonState, { passive: true });
    window.addEventListener('resize', updateButtonState);
    updateButtonState();
}

/* =========================================
   FAQ Accordion
   ========================================= */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others
            faqItems.forEach(other => other.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* =========================================
   Mobile Menu
   ========================================= */
function initMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const openBtn = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.drawer-close');

    if (!drawer || !openBtn || !closeBtn) return;

    openBtn.addEventListener('click', () => {
        drawer.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
        // Close all open dropdowns when drawer closes
        drawer.querySelectorAll('.nav-dropdown.open').forEach(dd => dd.classList.remove('open'));
    });

    // Drawer dropdown accordion: tap trigger to expand/collapse
    drawer.querySelectorAll('.drawer-links .nav-dropdown').forEach(dropdown => {
        const trigger = dropdown.querySelector('.nav-dropdown-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Close other dropdowns in the drawer
            drawer.querySelectorAll('.drawer-links .nav-dropdown.open').forEach(other => {
                if (other !== dropdown) other.classList.remove('open');
            });
            dropdown.classList.toggle('open');
        });
    });

    // Close drawer on link click (but not on dropdown trigger clicks)
    drawer.querySelectorAll('a').forEach(link => {
        // Skip dropdown triggers — they toggle the accordion
        if (link.classList.contains('nav-dropdown-trigger')) return;
        link.addEventListener('click', () => {
            drawer.classList.remove('open');
            document.body.style.overflow = '';
            drawer.querySelectorAll('.nav-dropdown.open').forEach(dd => dd.classList.remove('open'));
        });
    });
}

/* =========================================
   INTRO PHOTO EXPLOSION — Scroll-Driven
   As the user scrolls through .intro-scroll-spacer, the sticky
   section stays pinned and JS drives:
     • Dark overlay fading in
     • Heading text dissolving (opacity + blur)
     • Original 5 photos flattening rotation & spreading
     • New 8 photos emerging from center behind text
   On mobile (<768px) the effect is disabled entirely — photos
   show as a simple grid.
   ========================================= */
function initIntroPhotoExplosion() {
    const spacer = document.querySelector('.intro-scroll-spacer');
    const sticky = document.querySelector('.intro-sticky');
    if (!spacer || !sticky) return;

    // Bail on mobile — phones can't keep up with per-frame transform
    // recalcs on a perspective parent. CSS shows a simple static grid.
    if (window.innerWidth < 768) return;
    const isMobile = false;

    const textWrap = sticky.querySelector('.intro-text-wrap');
    const originals = Array.from(sticky.querySelectorAll('[data-collage-original]'));
    const newPhotos = Array.from(sticky.querySelectorAll('.c-new'));

    /* ---- Easing helpers ---- */
    const clamp01 = v => Math.max(0, Math.min(1, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeInCubic = t => t * t * t;
    const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    /* Wavy starting row: per-photo tilt + vertical offset (px).
       Applied in row phase AND as start-values for fromRow morph. */
    const ROW_ROT = [-7, 4, -2, 5, -6];
    const ROW_YOFF = [10, -14, 6, -10, 14];

    /* ---- Timeline ----
       dur is long so fade-in/out feel smooth; rounds overlap so the
       stage is never empty. Entries tagged `fromRow` morph FROM the
       original's wavy-row slot INTO the zoom scatter — they "join the fun"
       instead of fading out from the row.                               */
    const D = 0.40;
    const D_FROM_ROW = 0.62;  // longer so row→scatter morph feels unhurried

    /* Mobile timeline — 2 photos at a time, ~5 rounds, larger sizes (vw)
       to fill the narrow viewport. No fromRow morph on mobile; originals
       stay hidden until their first zoom entry fires. */
    const MOBILE_TL = [
        // Round 1
        { idx: 0, start: 0.04, dur: 0.32, x: 8,  y: 10, w: 55, h: 40 },
        { idx: 5, start: 0.10, dur: 0.32, x: 38, y: 50, w: 55, h: 40 },
        // Round 2
        { idx: 1, start: 0.24, dur: 0.32, x: 38, y: 8,  w: 55, h: 40 },
        { idx: 6, start: 0.30, dur: 0.32, x: 6,  y: 48, w: 55, h: 40 },
        // Round 3
        { idx: 2, start: 0.44, dur: 0.32, x: 10, y: 12, w: 55, h: 40 },
        { idx: 7, start: 0.50, dur: 0.32, x: 36, y: 52, w: 55, h: 40 },
        // Round 4
        { idx: 3, start: 0.64, dur: 0.32, x: 36, y: 8,  w: 55, h: 40 },
        { idx: 8, start: 0.70, dur: 0.32, x: 4,  y: 50, w: 55, h: 40 },
    ];

    const TL_DESKTOP = [
        // -- Round 1 --  5 originals morph from row into scatter
        { idx: 0, fromRow: true, start: 0.08, dur: D_FROM_ROW, x: 4, y: 14, w: 22, h: 17 },
        { idx: 1, fromRow: true, start: 0.12, dur: D_FROM_ROW, x: 62, y: 6, w: 21, h: 16 },
        { idx: 2, fromRow: true, start: 0.16, dur: D_FROM_ROW, x: 42, y: 30, w: 21, h: 16 },
        { idx: 3, fromRow: true, start: 0.20, dur: D_FROM_ROW, x: 78, y: 52, w: 16, h: 21 },
        { idx: 4, fromRow: true, start: 0.24, dur: D_FROM_ROW, x: 8, y: 54, w: 17, h: 22 },

        // -- Round 2 --  c-n1..c-n4
        { idx: 5, start: 0.34, dur: D, x: 58, y: 6, w: 18, h: 22 },
        { idx: 6, start: 0.37, dur: D, x: 20, y: 8, w: 17, h: 22 },
        { idx: 7, start: 0.40, dur: D, x: 78, y: 44, w: 16, h: 21 },
        { idx: 8, start: 0.43, dur: D, x: 2, y: 52, w: 22, h: 16 },

        // -- Round 3 --  c-n5..c-n8 + originals re-appearing
        { idx: 9, start: 0.56, dur: D, x: 38, y: 52, w: 17, h: 17 },
        { idx: 10, start: 0.59, dur: D, x: 30, y: 10, w: 22, h: 17 },
        { idx: 11, start: 0.62, dur: D, x: 72, y: 22, w: 16, h: 18 },
        { idx: 12, start: 0.65, dur: D, x: 60, y: 50, w: 18, h: 18 },
        { idx: 0, start: 0.68, dur: D, x: 8, y: 24, w: 21, h: 17 }, // c-1 re-appears
        { idx: 4, start: 0.71, dur: D, x: 48, y: 32, w: 17, h: 22 }, // c-5 re-appears

        // -- Round 4 --  c-n9..c-n12 finish the parade
        { idx: 13, start: 0.78, dur: D, x: 12, y: 8,  w: 21, h: 17 },
        { idx: 14, start: 0.81, dur: D, x: 70, y: 14, w: 17, h: 22 },
        { idx: 15, start: 0.84, dur: D, x: 24, y: 48, w: 18, h: 22 },
        { idx: 16, start: 0.87, dur: D, x: 64, y: 46, w: 21, h: 17 },
    ];

    const TL = isMobile ? MOBILE_TL : TL_DESKTOP;
    /* Index map:
         0..4 = originals c-1..c-5
         5..12 = new c-n1..c-n8 */
    const allPhotos = [...originals, ...newPhotos];

    /* Build a per-element lookup: element -> array of timeline entries */
    const entriesByEl = new Map();
    TL.forEach(entry => {
        const el = allPhotos[entry.idx];
        if (!el) return;
        if (!entriesByEl.has(el)) entriesByEl.set(el, []);
        entriesByEl.get(el).push(entry);
    });

    /* Earliest zoom entry start-time per original (for row → zoom handoff) */
    const firstEntryStartByOrig = originals.map((el) =>
        Math.min(...(entriesByEl.get(el) || [{ start: 0.10 }]).map(e => e.start))
    );

    /* Row-at-rest positioning for originals: center a row inside the sticky container.
       Recomputed on resize. Returns {leftPx} for each original index. */
    let rowSlots = [];
    function layoutRowSlots() {
        const cw = sticky.clientWidth;
        const n = originals.length;
        if (!n) return;
        // Use first original's computed size as reference
        const refW = originals[0].offsetWidth || 172;
        const gap = 12;
        const total = n * refW + (n - 1) * gap;
        const startLeft = (cw - total) / 2;
        rowSlots = originals.map((_, i) => startLeft + i * (refW + gap));
    }

    /* Zoom window: longer fade-in/out (smoother). For `fromRow` entries,
       fade-in morphs FROM the original's wavy-row slot INTO the zoom
       scatter (position, size, rotation all interpolated). */
    const FADE_IN = 0.32;
    const FADE_OUT = 0.60;
    const FADE_IN_FROM_ROW = 0.55;  // row→scatter morph (longer, smoother)
    const FADE_OUT_FROM_ROW = 0.82;  // start fade-out later for fromRow
    function applyZoomStyle(el, localP, entry, vw, origIndex) {
        const cw = sticky.clientWidth;
        const ch = sticky.clientHeight;
        const targetLeft = cw * entry.x / 100;
        const targetTop = ch * entry.y / 100;
        const targetW = entry.w * vw;
        const targetH = entry.h * vw;

        if (localP < FADE_IN_FROM_ROW && entry.fromRow && origIndex != null) {
            // Morph from row slot → zoom position
            const t = easeInOutCubic(localP / FADE_IN_FROM_ROW);
            const rowW = originals[0].offsetWidth || 224;
            const rowH = originals[0].offsetHeight || 154;
            // Row CSS uses top:60% + translateY(-50% + yOff). Compute effective
            // top-edge (px) so we can interpolate in a single coord system.
            const rowTopEdge = ch * 0.60 - rowH / 2 + ROW_YOFF[origIndex];
            const curLeft = lerp(rowSlots[origIndex] ?? 0, targetLeft, t);
            const curTop = lerp(rowTopEdge, targetTop, t);
            const curW = lerp(rowW, targetW, t);
            const curH = lerp(rowH, targetH, t);
            const curRot = lerp(ROW_ROT[origIndex], 0, t);
            el.style.left = `${curLeft.toFixed(0)}px`;
            el.style.top = `${curTop.toFixed(0)}px`;
            el.style.width = `${curW.toFixed(0)}px`;
            el.style.height = `${curH.toFixed(0)}px`;
            el.style.right = 'auto';
            el.style.bottom = 'auto';
            el.style.opacity = '1';
            el.style.filter = 'none';
            el.style.transform = `rotate(${curRot.toFixed(2)}deg)`;
            return;
        }

        // fromRow items after their morph completes: hold at target,
        // then fade out with a later-start window so the morph feels calm.
        const fadeInEnd = entry.fromRow ? FADE_IN_FROM_ROW : FADE_IN;
        const fadeOutStart = entry.fromRow ? FADE_OUT_FROM_ROW : FADE_OUT;

        // 3D zoom through Z-space: photos fly toward camera (z: -900 → 0)
        // on entry and past camera (z: 0 → +500) on exit. Combined with the
        // container's perspective, this reads as true depth rather than scale.
        let opacity, zPx, blur;
        if (localP < fadeInEnd) {
            const t = easeOutCubic(localP / fadeInEnd);
            opacity = t;
            zPx = entry.fromRow ? 0 : lerp(-1600, 0, t);
            blur = entry.fromRow ? 0 : lerp(4, 0, t);
        } else if (localP < fadeOutStart) {
            opacity = 1; zPx = 0; blur = 0;
        } else {
            const t = easeInCubic((localP - fadeOutStart) / (1 - fadeOutStart));
            opacity = 1 - t;
            zPx = lerp(0, 550, t);
            blur = lerp(0, 5, t);
        }

        el.style.width = `${targetW.toFixed(0)}px`;
        el.style.height = `${targetH.toFixed(0)}px`;
        el.style.left = `${entry.x}%`;
        el.style.top = `${entry.y}%`;
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.opacity = opacity.toFixed(3);
        el.style.filter = blur > 0.1 ? `blur(${blur.toFixed(1)}px)` : 'none';
        el.style.transform = `translateZ(${zPx.toFixed(0)}px)`;
    }

    /* Wavy row display for originals (until their first zoom entry starts) */
    function applyRowStyle(el, origIndex) {
        const leftPx = rowSlots[origIndex] ?? 0;
        el.style.left = `${leftPx}px`;
        el.style.top = '';     // CSS top:60%
        el.style.width = '';
        el.style.height = '';
        el.style.right = 'auto';
        el.style.bottom = 'auto';
        el.style.opacity = '1';
        el.style.filter = 'none';
        el.style.transform = `translateY(calc(-50% + ${ROW_YOFF[origIndex]}px)) rotate(${ROW_ROT[origIndex]}deg)`;
    }

    /* ---- Scroll handler ----
       Progress lerps toward the raw scroll target each frame so the
       visual animation eases gently behind the native scroll. Keeps the
       section feeling smooth without hijacking scroll (no momentum steal). */
    let currentProgress = 0;
    let rafPending = false;
    function readTargetProgress() {
        const spacerRect = spacer.getBoundingClientRect();
        const spacerH = spacer.offsetHeight;
        const scrolled = -spacerRect.top;
        return clamp01(scrolled / (spacerH - window.innerHeight));
    }
    function onScroll() {
        if (rafPending) return;
        rafPending = true;
        requestAnimationFrame(tick);
    }
    function tick() {
        const target = readTargetProgress();
        const delta = target - currentProgress;
        currentProgress += delta * 0.18;  // smoothing (higher = tighter follow)
        if (Math.abs(delta) < 0.0005) {
            currentProgress = target;
            rafPending = false;
        } else {
            requestAnimationFrame(tick);
        }
        update(currentProgress);
    }

    function update(progress) {

        const vw = window.innerWidth / 100;

        /* --- Heading fade: gentle delayed start, much wider window so the
               text doesn't blur out the instant the user starts scrolling.
               Window: progress 0.05 → 0.22 (was 0.00 → 0.09). The eased
               curve also leans flatter at the start so the first few %
               of scroll do almost nothing visible. */
        const textP = clamp01((progress - 0.05) / 0.17);
        const textEased = easeInCubic(textP); // slow start, accelerates later
        const textOpacity = 1 - textEased;
        const textBlur = textEased * 18;
        const textScale = lerp(1, 0.94, textEased);
        textWrap.style.opacity = textOpacity.toFixed(3);
        textWrap.style.filter = textBlur > 0.1 ? `blur(${textBlur.toFixed(1)}px)` : 'none';
        textWrap.style.transform = `translateY(-9vh) scale(${textScale.toFixed(3)})`;

        /* --- Per-photo state ---
               · if in an active zoom window → zoom style (fromRow morphs
                 seamlessly from the row slot)
               · else if original AND its first zoom hasn't started yet →
                 wavy row style
               · else hide                                                */
        allPhotos.forEach((el, i) => {
            const entries = entriesByEl.get(el);
            let activeEntry = null;
            let localP = 0;
            if (entries) {
                for (const e of entries) {
                    if (progress >= e.start && progress <= e.start + e.dur) {
                        activeEntry = e;
                        localP = (progress - e.start) / e.dur;
                        break;
                    }
                }
            }

            const isOrig = i < originals.length;

            if (activeEntry) {
                applyZoomStyle(el, localP, activeEntry, vw, isOrig ? i : null);
                return;
            }

            if (isOrig && !isMobile) {
                const firstStart = firstEntryStartByOrig[i] ?? 0.10;
                if (progress < firstStart) {
                    applyRowStyle(el, i);
                    return;
                }
            }
            // Hidden between/after zoom windows
            el.style.opacity = '0';
            el.style.transform = 'scale(0.85)';
            el.style.filter = 'none';
        });
    }

    function init() {
        layoutRowSlots();
        currentProgress = readTargetProgress();
        update(currentProgress);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        layoutRowSlots();
        update(currentProgress);
    });

    // Initial layout — wait a frame for any font/layout settle
    requestAnimationFrame(init);
}

/* =========================================
   Home Feature Icons — 3D Scroll + Mouse
   =========================================
   LIGHT CONTROLS — tweak these freely:
   ---------------------------------------- */
const ICON_LIGHT = {
    exposure: 1.5,     // overall brightness (1.0 = neutral, higher = brighter)
    shadowIntensity: 0.0,      // ground shadow (0 = none, 1 = strong)
    shadowSoftness: 1.0,      // shadow edge softness
    environmentImage: 'neutral', // IBL: 'neutral' | 'legacy' | 'commerce' | URL to HDR
};

/* Camera resting position (what you see after scroll-in settles) */
const ICON_CAMERA = {
    azimuth: -12,   // degrees: negative = slightly left of centre
    polar: 78,   // degrees: 90 = perfectly horizontal, lower = looking down more
    fov: '26deg',
};

/* =====================================================
   MOUSE-FOLLOW INTENSITY  ← adjust this single value
   1  = barely perceptible   |   5  = noticeable
   10 = dramatic             |   20 = very strong
   ===================================================== */
const ICON_MOUSE_INTENSITY = 8;   // ← CHANGE ME

/* Per-axis multipliers — scale relative to each other.
   Azimuth (left/right) should feel slightly stronger than
   polar (up/down) for a natural parallax feel. */
const ICON_MOUSE = {
    azimuthStrength: 2.5 * ICON_MOUSE_INTENSITY,   // left↔right
    polarStrength: 1.5 * ICON_MOUSE_INTENSITY,   // up↕down
};

/* Scroll-in spin: icons arrive from this many degrees offset */
const ICON_SPIN_FROM = 120; // degrees extra azimuth at animation start

/* Per-icon stagger delay (ms) */
const ICON_STAGGER = 80;

/* Duration of the spin-in animation (ms) */
const ICON_ANIM_DUR = 900;

/* Snap-back duration when mouse leaves (ms) */
const ICON_SNAPBACK_DUR = 500;
/* ---------------------------------------- */

function initFeatureIcons() {
    const items = Array.from(document.querySelectorAll('.home-feature-icon model-viewer'));
    if (!items.length) return;

    const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    /* Per-icon runtime state */
    const state = items.map(() => ({
        settled: false,
        curAz: ICON_CAMERA.azimuth + ICON_SPIN_FROM,
        curPo: ICON_CAMERA.polar,
        mouseAz: ICON_CAMERA.azimuth,
        mousePo: ICON_CAMERA.polar,
    }));

    function setOrbit(mv, az, po) {
        mv.setAttribute('camera-orbit', `${az.toFixed(2)}deg ${po.toFixed(2)}deg auto`);
    }

    /* Apply static light attributes (easy to change via ICON_LIGHT above) */
    function applyLight(mv) {
        mv.setAttribute('exposure', ICON_LIGHT.exposure);
        mv.setAttribute('shadow-intensity', ICON_LIGHT.shadowIntensity);
        mv.setAttribute('shadow-softness', ICON_LIGHT.shadowSoftness);
        mv.setAttribute('environment-image', ICON_LIGHT.environmentImage);
        mv.setAttribute('field-of-view', ICON_CAMERA.fov);
    }

    /* Initialise all icons: hidden, spun to start angle */
    items.forEach((mv, i) => {
        applyLight(mv);
        mv.style.opacity = '0';
        setOrbit(mv, state[i].curAz, state[i].curPo);
    });

    /* Scroll-in: IntersectionObserver triggers spin + fade per icon */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const mv = entry.target;
            const i = items.indexOf(mv);
            if (i < 0 || state[i].settled) return;
            observer.unobserve(mv);

            const startAz = ICON_CAMERA.azimuth + ICON_SPIN_FROM;

            setTimeout(() => {
                /* Fade in */
                mv.style.transition = 'opacity 0.55s ease';
                mv.style.opacity = '1';

                /* Spin from startAz → ICON_CAMERA.azimuth */
                const t0 = performance.now();
                function spinFrame(now) {
                    const progress = Math.min((now - t0) / ICON_ANIM_DUR, 1);
                    const eased = easeOutQuart(progress);
                    const az = startAz + (ICON_CAMERA.azimuth - startAz) * eased;
                    const po = ICON_CAMERA.polar;
                    state[i].curAz = az;
                    state[i].curPo = po;
                    setOrbit(mv, az, po);

                    if (progress < 1) {
                        requestAnimationFrame(spinFrame);
                    } else {
                        state[i].settled = true;
                        state[i].mouseAz = ICON_CAMERA.azimuth;
                        state[i].mousePo = ICON_CAMERA.polar;
                        setOrbit(mv, ICON_CAMERA.azimuth, ICON_CAMERA.polar);
                    }
                }
                requestAnimationFrame(spinFrame);

            }, i * ICON_STAGGER);
        });
    }, { threshold: 0.25 });

    items.forEach(mv => observer.observe(mv));

    /* Mouse tracking — subtle tilt toward cursor */
    let rafMouse = null;
    document.addEventListener('mousemove', (e) => {
        // Normalised -1..+1 across the viewport
        const nx = (e.clientX / window.innerWidth) * 2 - 1;
        const ny = -(e.clientY / window.innerHeight) * 2 + 1; // flip Y so up = positive

        items.forEach((mv, i) => {
            if (!state[i].settled) return;
            // Inverted so the icon "looks toward" the cursor instead of away
            state[i].mouseAz = ICON_CAMERA.azimuth - nx * ICON_MOUSE.azimuthStrength;
            state[i].mousePo = ICON_CAMERA.polar + ny * ICON_MOUSE.polarStrength;
        });

        if (rafMouse) return;
        rafMouse = requestAnimationFrame(() => {
            rafMouse = null;
            items.forEach((mv, i) => {
                if (!state[i].settled) return;
                setOrbit(mv, state[i].mouseAz, state[i].mousePo);
            });
        });
    });

    /* Snap back to resting angle when mouse leaves the strip */
    const strip = document.querySelector('.home-features-strip');
    if (strip) {
        strip.addEventListener('mouseleave', () => {
            items.forEach((mv, i) => {
                if (!state[i].settled) return;
                const fromAz = state[i].mouseAz;
                const fromPo = state[i].mousePo;
                const snapT0 = performance.now();

                function snapFrame(now) {
                    const t = Math.min((now - snapT0) / ICON_SNAPBACK_DUR, 1);
                    const eased = easeOutCubic(t);
                    const az = fromAz + (ICON_CAMERA.azimuth - fromAz) * eased;
                    const po = fromPo + (ICON_CAMERA.polar - fromPo) * eased;
                    state[i].mouseAz = az;
                    state[i].mousePo = po;
                    setOrbit(mv, az, po);
                    if (t < 1) requestAnimationFrame(snapFrame);
                }
                requestAnimationFrame(snapFrame);
            });
        });
    }
}

/* =========================================
   STORE SEQUENCE — Scroll-driven WebP Playback
   Preloads all frames and maps scroll progress
   through .store-explode-section to the frame index.
   Speed is controlled by --seq-frame-skip on the stage:
     1   = one full scroll through plays all frames once
     2   = plays twice as fast (reaches end at 50% scroll)
     0.5 = plays half speed (each frame takes 2× longer)
   ========================================= */
function initStoreSequence() {
    const section = document.querySelector('.store-explode-section');
    const img     = document.getElementById('store-seq-img');
    if (!section || !img) return;

    // Skip on mobile — the 59-frame WebP scrub is way too heavy for phones
    // and the surrounding section is a desktop-only flourish anyway.
    if (window.innerWidth < 768) return;
    // Honor user's reduced-motion preference — show static frame 0.
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        img.src = './Asset/WebP_Explosion/WebP_Explosion0001.webp';
        return;
    }

    const TOTAL_FRAMES = 59;
    const BASE_PATH    = './Asset/WebP_Explosion/WebP_Explosion';

    /* Lazy preload — only fetch the 59 frames when the section is within
       2 viewports of the user. Keeps the initial page load light. */
    const frames = [];
    let preloaded = false;
    function preloadFrames() {
        if (preloaded) return;
        preloaded = true;
        for (let i = 1; i <= TOTAL_FRAMES; i++) {
            const f = new Image();
            f.src   = BASE_PATH + String(i).padStart(4, '0') + '.webp';
            frames.push(f);
        }
        img.src = frames[0].src;
    }
    const preloadObserver = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
            preloadFrames();
            preloadObserver.disconnect();
        }
    }, { rootMargin: '200% 0px' });
    preloadObserver.observe(section);

    let lastFrameIdx = -1;

    function update() {
        if (!frames.length) return;  // not preloaded yet
        const rect       = section.getBoundingClientRect();
        const sectionH   = section.offsetHeight;
        const viewH      = window.innerHeight;
        const scrollable = sectionH - viewH;

        if (scrollable <= 0) { img.src = frames[0].src; return; }

        const stage     = section.querySelector('.store-explode-stage');
        const cs        = getComputedStyle(stage);
        const frameSkip = parseFloat(cs.getPropertyValue('--seq-frame-skip').trim())   || 1;
        const startBias = parseFloat(cs.getPropertyValue('--seq-scroll-start').trim()) || 0;

        const scrolled  = -rect.top + viewH * startBias;
        const progress  = Math.min(Math.max(0, scrolled) / scrollable, 1);
        const frameIdx  = Math.min(Math.floor(progress * (TOTAL_FRAMES - 1) * frameSkip), TOTAL_FRAMES - 1);

        /* Same frame as before — do nothing, image stays as-is */
        if (frameIdx === lastFrameIdx) return;
        lastFrameIdx = frameIdx;

        /* Set the frame. On last frame this freezes it until section scrolls off. */
        img.src = frames[frameIdx].src;
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => { update(); ticking = false; });
            ticking = true;
        }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
}

/* =========================================
   STORE CTA TEXT REVEAL — word by word
   Splits h2 and p text into .cta-word spans.
   Eyebrow + button animate as single units.
   IntersectionObserver fires once → adds .cta-visible
   → CSS transitions stagger each word in.
   ========================================= */
function initStoreCTAReveal() {
    const el = document.querySelector('[data-cta-reveal]');
    if (!el) return;

    const STEP = 0.055;  /* seconds between each word */
    let i = 0;
    function delay() { return (i++ * STEP).toFixed(3) + 's'; }

    /* Wrap each non-whitespace chunk in the element's text nodes as a
       .cta-word span. Preserves child elements (em, br, strong…) intact. */
    function wrapWords(parent) {
        const snapshot = [...parent.childNodes];
        parent.innerHTML = '';

        snapshot.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                node.textContent.split(/(\s+)/).forEach(chunk => {
                    if (/\S/.test(chunk)) {
                        const s = document.createElement('span');
                        s.className  = 'cta-word';
                        s.textContent = chunk;
                        s.style.transitionDelay = delay();
                        parent.appendChild(s);
                    } else if (chunk) {
                        /* preserve spaces as plain text nodes */
                        parent.appendChild(document.createTextNode(chunk));
                    }
                });
            } else if (node.nodeName === 'BR') {
                parent.appendChild(node.cloneNode());
            } else {
                /* em / strong / etc. → single word unit */
                node.classList.add('cta-word');
                node.style.transitionDelay = delay();
                parent.appendChild(node);
            }
        });
    }

    /* Eyebrow — single block */
    const eyebrow = el.querySelector('.store-cta-eyebrow');
    if (eyebrow) {
        eyebrow.classList.add('cta-word');
        eyebrow.style.transitionDelay = delay();
    }

    /* H2 — word by word (handles inner <em> and <br>) */
    const h2 = el.querySelector('h2');
    if (h2) wrapWords(h2);

    /* P — word by word */
    const p = el.querySelector('p');
    if (p) wrapWords(p);

    /* Button — single block */
    const btn = el.querySelector('.btn');
    if (btn) {
        btn.classList.add('cta-word');
        btn.style.transitionDelay = delay();
    }

    /* Fire once when CTA enters viewport */
    const io = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            el.classList.add('cta-visible');
            io.disconnect();
        }
    }, { threshold: 0.2 });

    io.observe(el);
}

/* =========================================
   INSTAGRAM SHOWCASE — infinite marquee
   ========================================= */
function initIGVideos() {
    const track = document.getElementById('ig-track');
    if (!track) return;

    /* Clone all cards and append — gives us 2× cards so translateX(-50%)
       brings us back to the start seamlessly */
    const origCards = [...track.querySelectorAll('.ig-card')];
    origCards.forEach(card => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
    });

    const videos = [...track.querySelectorAll('video')];
    videos.forEach(vid => {
        vid.muted       = true;
        vid.loop        = true;
        vid.playsInline = true;
        vid.disablePictureInPicture = true;
        if ('disableRemotePlayback' in vid) vid.disableRemotePlayback = true;
    });

    /* Lazy-upgrade preload from "none" → "metadata" when the section is
       within ~2 viewports. With "none" the cards render empty grey
       boxes; "metadata" fetches just enough for the browser to show the
       natural first frame as a thumbnail without playing the video. */
    const preloadObs = new IntersectionObserver((entries) => {
        if (entries.some(e => e.isIntersecting)) {
            videos.forEach(v => {
                if (v.preload !== 'metadata' && v.preload !== 'auto') {
                    v.preload = 'metadata';
                    v.load();
                }
            });
            preloadObs.disconnect();
        }
    }, { rootMargin: '200% 0px' });
    preloadObs.observe(track);

    /* Skip autoplay entirely if the user opted out of motion */
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    /* Limit concurrent decoding: only the N videos closest to the viewport
       center play at once. Keeps the "lots of activity" feel in the middle
       while pausing the rest so phones don't heat up. */
    const MAX_ACTIVE = 4;

    /* Track which videos are even in the visible band; only those are
       candidates for the active set. */
    const visible = new Set();
    const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) visible.add(e.target);
            else { visible.delete(e.target); e.target.pause(); }
        });
        schedule();
    }, { threshold: 0.1 });
    videos.forEach(v => visObserver.observe(v));

    let ticking = false;
    function schedule() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; pickActive(); });
    }

    /* Hovered videos always stay in the active set, so users can play
       any video by pointing at it — including ones outside the
       center-cluster. We listen on the wrapping .ig-card because the
       overlay div sits on top of the <video> and would swallow the
       mouseenter event. */
    const hovered = new Set();
    track.querySelectorAll('.ig-card').forEach(card => {
        const v = card.querySelector('video');
        if (!v) return;
        card.addEventListener('mouseenter', () => {
            hovered.add(v);
            if (v.preload === 'none') { v.preload = 'metadata'; v.load(); }
            v.play().catch(() => {});
        });
        card.addEventListener('mouseleave', () => {
            hovered.delete(v);
            pickActive();
        });
    });

    function pickActive() {
        if (!visible.size) return;
        const centerY = window.innerHeight / 2;
        const centerX = window.innerWidth  / 2;
        /* Sort visible videos by distance from viewport center.
           IG strip is horizontal so X distance dominates, but we
           include Y so it works regardless of layout. */
        const ranked = [...visible].map(v => {
            const r  = v.getBoundingClientRect();
            const cx = r.left + r.width  / 2;
            const cy = r.top  + r.height / 2;
            return { v, d: Math.hypot(cx - centerX, cy - centerY) };
        }).sort((a, b) => a.d - b.d);

        const keep = new Set(ranked.slice(0, MAX_ACTIVE).map(x => x.v));
        hovered.forEach(v => keep.add(v));
        ranked.forEach(({ v }) => {
            if (keep.has(v)) {
                if (v.paused) v.play().catch(() => {});
            } else if (!v.paused) {
                v.pause();
            }
        });
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    /* The horizontal marquee continually slides cards through the
       viewport center — re-pick the active set every 400ms while the
       strip is on screen so the playing cluster cycles with the
       animation. Cheap (a handful of getBoundingClientRect calls) and
       paused entirely when the section is offscreen. */
    let pollId = null;
    const sectionObs = new IntersectionObserver((entries) => {
        const onscreen = entries.some(e => e.isIntersecting);
        if (onscreen && !pollId) {
            pollId = setInterval(pickActive, 400);
        } else if (!onscreen && pollId) {
            clearInterval(pollId); pollId = null;
        }
    }, { threshold: 0 });
    sectionObs.observe(track);
}

/* =========================================
   EVENT MODAL
   ========================================= */
const EVENT_DB = {
    "1": { 
        host: "Comum Padel", 
        level: "All Levels", 
        price: "IDR 150.000", 
        slots: "8/12",
        reqs: "Raket (sewa tersedia), sepatu indoor, air minum.",
        maps: "https://maps.app.goo.gl/xxx",
        desc: "Ayo bergabung di Sunday Long Ride spesial rute Puncak. Rute menantang tapi kita gowes santai dengan pace komunal. Disediakan support car dan refreshment di titik kumpul." 
    },
    "2": { 
        host: "Comum Padel", 
        level: "Intermediate", 
        price: "IDR 200.000", 
        slots: "4/16",
        reqs: "Raket pribadi, pakaian olahraga, semangat kompetitif.",
        maps: "https://maps.app.goo.gl/xxx",
        desc: "Padel Night League mingguan untuk mengasah skill kompetitif kamu. Sistem liga mini dengan hadiah menarik untuk pemenang tiap minggunya. Termasuk sewa lapangan dan bola." 
    },
    "3": { 
        host: "Comum Community", 
        level: "Beginner Friendly", 
        price: "Gratis", 
        slots: "12/20",
        reqs: "Sepeda (road/folding), helm (wajib), lampu depan/belakang.",
        maps: "https://maps.app.goo.gl/xxx",
        desc: "Mulai hari dengan segar! Morning Coffee Ride rute santai keliling Alam Sutera. Rute flat, pace ngobrol. Berakhir dengan ngopi bareng di Comum Cafe." 
    },
    "4": { 
        host: "Coach Bima", 
        level: "Beginner", 
        price: "IDR 250.000", 
        slots: "2/8",
        reqs: "Pakaian olahraga nyaman, air minum, handuk kecil.",
        maps: "https://maps.app.goo.gl/xxx",
        desc: "Baru pertama kali main Padel? Clinic ini cocok buat kamu. Belajar basic grip, aturan main, dan positioning langsung dari Coach bersertifikat. Raket disediakan!" 
    },
    "5": { 
        host: "Comum Community", 
        level: "All Levels", 
        price: "Gratis", 
        slots: "Full",
        reqs: "Sepeda apa saja, helm, uang jajan kopi.",
        maps: "https://maps.app.goo.gl/xxx",
        desc: "Coffee cruise santai keliling SCBD dan Senayan. Cocok untuk recovery ride atau sekadar mencari keringat pagi sambil ngobrol santai dengan member lain." 
    }
};

function initEventModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    const triggers = document.querySelectorAll('.event-detail-trigger');
    const closeBtns = document.querySelectorAll('[data-modal-close]');

    const mImg = document.getElementById('modal-event-img');
    const mBadge = document.getElementById('modal-event-badge');
    const mTitle = document.getElementById('modal-event-title');
    const mDate = document.getElementById('modal-event-date');
    const mTime = document.getElementById('modal-event-time');
    const mLocation = document.getElementById('modal-event-location');
    const mHost = document.getElementById('modal-event-host');
    const mLevel = document.getElementById('modal-event-level');
    const mPrice = document.getElementById('modal-event-price');
    const mSlots = document.getElementById('modal-event-slots');
    const mReqs = document.getElementById('modal-event-reqs');
    const mDesc = document.getElementById('modal-event-desc');
    
    const btnWa = document.getElementById('modal-btn-wa');
    const btnMaps = document.getElementById('modal-btn-maps');
    const btnJoin = document.getElementById('modal-btn-join');

    const detailsView = document.getElementById('modal-details-view');
    const successView = document.getElementById('modal-success-view');
    const successWaBtn = document.getElementById('modal-success-wa');

    function resetModalState() {
        detailsView.style.display = 'flex';
        successView.style.display = 'none';
        btnJoin.innerHTML = 'Daftar';
        btnJoin.disabled = false;
    }

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.event-card');
            if (!card) return;

            resetModalState();

            const eventId = card.getAttribute('data-event-id');
            const title = card.querySelector('h3').textContent;
            
            const badgeEl = card.querySelector('.difficulty-chip') || card.querySelector('.badge');
            const badge = badgeEl ? badgeEl.textContent : 'Event';
            
            const imgEl = card.querySelector('.event-card-image img') || card.querySelector('.card-image');
            const img = imgEl ? imgEl.src : '';
            
            // Extract basic info from the card
            const dayTimeStr = card.querySelector('.event-day')?.textContent.trim() || "";
            const locStr = card.querySelector('.ec-detail span')?.textContent.trim() || "";
            
            // Get date from the badge if possible
            const dMonth = card.querySelector('.dmonth')?.textContent.trim() || "";
            const dDay = card.querySelector('.dday')?.textContent.trim() || "";
            
            // Map short month to full name
            const monthMap = {
                'JAN': 'January', 'FEB': 'February', 'MAR': 'March', 'APR': 'April',
                'MAY': 'May', 'JUN': 'June', 'JUL': 'July', 'AUG': 'August',
                'SEP': 'September', 'OCT': 'October', 'NOV': 'November', 'DEC': 'December'
            };
            const fullMonth = monthMap[dMonth] || dMonth;
            
            let dateLabel = dayTimeStr.split('•')[0].trim();
            if (dDay && fullMonth) {
                dateLabel = `${dateLabel}, ${dDay} ${fullMonth}`;
            }
            
            const timeLabel = dayTimeStr.split('•')[1]?.trim() || "";

            // Get rich data from DB, fallback if not found
            const fallback = { host: "Comum", level: "All Levels", price: "Gratis", slots: "Available", reqs: "None", maps: "#", desc: "Ayo bergabung bersama komunitas Comum! Pastikan kamu hadir tepat waktu." };
            const richData = EVENT_DB[eventId] || fallback;

            mImg.src = img;
            mBadge.textContent = badge;
            mTitle.textContent = title;
            mDate.textContent = dateLabel || "TBA";
            mTime.textContent = timeLabel || "TBA";
            mLocation.textContent = locStr || "TBA";
            
            if(mHost) mHost.textContent = richData.host;
            if(mLevel) mLevel.textContent = richData.level;
            if(mPrice) mPrice.textContent = richData.price;
            if(mSlots) mSlots.textContent = richData.slots;
            if(mReqs) mReqs.textContent = richData.reqs;
            if(mDesc) mDesc.textContent = richData.desc;

            if(btnMaps) btnMaps.href = richData.maps;

            // Generate WA Link
            let waLink = '';
            if (window.ComumJoin) {
                waLink = window.ComumJoin.buildWhatsAppLink({ title, date: dateLabel, time: timeLabel, location: locStr });
            } else {
                waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya mau ikutan event "${title}" di ${locStr}. Bisa info lebih lanjut?`)}`;
            }
            if(btnWa) btnWa.href = waLink;
            if(successWaBtn) successWaBtn.href = waLink;

            // Handle Join Button
            if(btnJoin) {
                btnJoin.onclick = () => {
                    // Mock loading state
                    btnJoin.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; margin-right: 8px; vertical-align: middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Memproses...';
                    btnJoin.disabled = true;

                    setTimeout(() => {
                        detailsView.style.display = 'none';
                        successView.style.display = 'flex';
                        lucide.createIcons(); // ensure checkmark icon appears
                    }, 800);
                };
            }

            modal.classList.add('active');
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // prevent background scrolling
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.classList.remove('active');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        });
    });
}

