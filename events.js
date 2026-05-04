// ============================================================
// Comum Events Page
// ============================================================

// ---------- Events Data (loaded from events-data.js) ----------
const EVENTS = window.COMUM_EVENTS || [];

/* ORIGINAL INLINE EVENTS — moved to events-data.js so profile.html can share
const _UNUSED_EVENTS = [
    {
        id: 1,
        title: 'Sunday Long Ride: Puncak Pass',
        category: 'cycling',
        date: '2026-04-19',
        time: '05:30',
        day: 'Sunday',
        location: 'Comum Hub Sutera',
        locationKey: 'sutera',
        distance: '120 km',
        difficulty: 'hard',
        difficultyLabel: 'Advanced',
        price: 0,
        priceLabel: 'Free',
        attendees: 24,
        capacity: 32,
        image: './Asset/Cycling_GroupPic.png',
        tags: ['cycling', 'weekend'],
        description: '120km epic ride ke Puncak. SAG support, coffee stops, lunch di atas.',
        featured: true
    },
    {
        id: 2,
        title: 'Padel Night League - Round 4',
        category: 'padel',
        date: '2026-04-17',
        time: '19:00',
        day: 'Friday',
        location: 'Comum Hub Panglima Polim',
        locationKey: 'panglima',
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        price: 150000,
        priceLabel: 'Rp 150K',
        attendees: 28,
        capacity: 32,
        image: './Asset/Padel_Photo1.png',
        tags: ['padel', 'weekend'],
        description: 'Weekly padel tournament. Mixed doubles, best of 3 sets.'
    },
    {
        id: 3,
        title: 'Morning Coffee Ride',
        category: 'cycling',
        date: '2026-04-16',
        time: '06:00',
        day: 'Thursday',
        location: 'Alam Sutera',
        locationKey: 'sutera',
        distance: '35 km',
        difficulty: 'easy',
        difficultyLabel: 'Beginner',
        price: 0,
        priceLabel: 'Free',
        attendees: 18,
        capacity: 25,
        image: './Asset/Cycliong_GroupPicPoint.png',
        tags: ['cycling', 'beginner'],
        description: 'Easy ride 35km + coffee stop. Perfect for beginners.'
    },
    {
        id: 4,
        title: 'Sunrise Run Club',
        category: 'running',
        date: '2026-04-18',
        time: '05:45',
        day: 'Saturday',
        location: 'GBK Senayan',
        locationKey: 'outside',
        distance: '10 km',
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        price: 0,
        priceLabel: 'Free',
        attendees: 22,
        capacity: 40,
        image: './Asset/Run_GroupPic.png',
        tags: ['running', 'weekend', 'beginner']
    },
    {
        id: 5,
        title: 'Women Only Padel Clinic',
        category: 'padel',
        date: '2026-04-20',
        time: '09:00',
        day: 'Monday',
        location: 'Comum Hub Sutera',
        locationKey: 'sutera',
        difficulty: 'easy',
        difficultyLabel: 'Beginner',
        price: 200000,
        priceLabel: 'Rp 200K',
        attendees: 8,
        capacity: 12,
        image: './Asset/Padel_Photo2.png',
        tags: ['padel', 'women', 'beginner'],
        description: 'Clinic khusus perempuan. Dari basics sampai strategy.'
    },
    {
        id: 6,
        title: 'Weekend Warrior Ride',
        category: 'cycling',
        date: '2026-04-18',
        time: '06:00',
        day: 'Saturday',
        location: 'BSD Sentul',
        locationKey: 'outside',
        distance: '80 km',
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        price: 0,
        priceLabel: 'Free',
        attendees: 16,
        capacity: 30,
        image: './Asset/Cycling_GroupPic2.png',
        tags: ['cycling', 'weekend']
    },
    {
        id: 7,
        title: 'Community Coffee & Chat',
        category: 'social',
        date: '2026-04-22',
        time: '18:00',
        day: 'Wednesday',
        location: 'Comum Hub Sutera',
        locationKey: 'sutera',
        difficulty: 'easy',
        difficultyLabel: 'Santai',
        price: 0,
        priceLabel: 'Free',
        attendees: 34,
        capacity: 50,
        image: './Asset/Cycling_HangoutUndian.png',
        tags: ['social', 'beginner'],
        description: 'Hangout santai, kopi-kopi, cerita-cerita. No agenda.'
    },
    {
        id: 8,
        title: 'Beginner Padel Intro',
        category: 'padel',
        date: '2026-04-21',
        time: '19:30',
        day: 'Tuesday',
        location: 'Comum Hub Alam Sutera',
        locationKey: 'sutera',
        difficulty: 'easy',
        difficultyLabel: 'Beginner',
        price: 100000,
        priceLabel: 'Rp 100K',
        attendees: 10,
        capacity: 16,
        image: './Asset/Padel_Photo3.png',
        tags: ['padel', 'beginner'],
        description: 'First time di padel? Start here. Racket dan bola disediakan.'
    },
    {
        id: 9,
        title: 'Gravel Adventure Ride',
        category: 'cycling',
        date: '2026-04-25',
        time: '06:30',
        day: 'Saturday',
        location: 'Sentul Loop',
        locationKey: 'outside',
        distance: '60 km',
        difficulty: 'medium',
        difficultyLabel: 'Intermediate',
        price: 50000,
        priceLabel: 'Rp 50K',
        attendees: 14,
        capacity: 20,
        image: './Asset/Cycling_GroupPic3.png',
        tags: ['cycling', 'weekend']
    },
    {
        id: 10,
        title: 'Padel Doubles Open',
        category: 'padel',
        date: '2026-04-26',
        time: '14:00',
        day: 'Sunday',
        location: 'Comum Hub Panglima Polim',
        locationKey: 'panglima',
        difficulty: 'hard',
        difficultyLabel: 'Advanced',
        price: 250000,
        priceLabel: 'Rp 250K',
        attendees: 30,
        capacity: 32,
        image: './Asset/Padel.png',
        tags: ['padel', 'weekend']
    },
    {
        id: 11,
        title: 'Night Ride CBD Loop',
        category: 'cycling',
        date: '2026-04-24',
        time: '20:00',
        day: 'Friday',
        location: 'Comum Hub Panglima Polim',
        locationKey: 'panglima',
        distance: '25 km',
        difficulty: 'easy',
        difficultyLabel: 'Beginner',
        price: 0,
        priceLabel: 'Free',
        attendees: 20,
        capacity: 35,
        image: './Asset/cycling1.png',
        tags: ['cycling', 'beginner']
    },
    {
        id: 12,
        title: 'Hills Hunter Ride',
        category: 'cycling',
        date: '2026-04-23',
        time: '05:30',
        day: 'Thursday',
        location: 'Cimahi Hills',
        locationKey: 'outside',
        distance: '90 km',
        difficulty: 'hard',
        difficultyLabel: 'Advanced',
        price: 0,
        priceLabel: 'Free',
        attendees: 12,
        capacity: 20,
        image: './Asset/Woman_cycling.png',
        tags: ['cycling']
    }
];
*/

// ---------- State ----------
const state = {
    category: 'all',
    view: 'grid',
    quickFilters: new Set(),
    search: '',
    location: '',
    dateFilter: null,
    calMonth: new Date(2026, 3, 1), // April 2026
    bookmarks: new Set(),
    pageSize: 6,
    visibleCount: 6
};

const bookmarks = new Set(JSON.parse(localStorage.getItem('comum-bookmarks') || '[]'));
state.bookmarks = bookmarks;

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_SHORT = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// ============================================================
// User preferences (from onboarding)
// ============================================================
function applyUserPreferences() {
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    const prefs = user && user.preferences;
    if (!prefs || prefs.skipped || !prefs.sport) return;

    const sportToCategory = { padel: 'padel', cycling: 'cycling', both: 'all' };
    const cat = sportToCategory[prefs.sport];
    if (!cat || cat === 'all') return;

    state.category = cat;

    // Reflect on tabs (script runs before tab init handlers but after DOM is parsed)
    const container = document.getElementById('event-category-tabs');
    if (container) {
        container.querySelectorAll('.evt-tab').forEach(t => {
            t.classList.toggle('active', t.dataset.category === cat);
        });
    }

    // Inline banner above grid
    const grid = document.getElementById('events-grid-view');
    if (grid && !document.getElementById('prefs-banner')) {
        const banner = document.createElement('div');
        banner.id = 'prefs-banner';
        banner.className = 'prefs-banner';
        const sportLabel = cat === 'padel' ? 'Padel' : 'Cycling';
        banner.innerHTML = `
            <span><i data-lucide="sparkles"></i> Disesuaikan dengan preferensi kamu · <strong>${sportLabel}</strong></span>
            <button type="button" id="prefs-banner-reset">Lihat semua</button>
        `;
        grid.parentNode.insertBefore(banner, grid);
        if (window.lucide) lucide.createIcons();

        document.getElementById('prefs-banner-reset').addEventListener('click', () => {
            const allTab = container && container.querySelector('.evt-tab[data-category="all"]');
            if (allTab) allTab.click();
            banner.remove();
        });
    }
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    applyUserPreferences();
    initCategoryTabs();
    initViewToggle();
    initQuickFilters();
    initSearch();
    initCalendarNav();
    initEventModal();
    initNewsletter();
    initLoadMore();
    initFeaturedActions();
    renderEvents();
    renderCalendar();
});

// ============================================================
// Rendering
// ============================================================
function getFilteredEvents() {
    return EVENTS.filter(e => {
        // Category
        if (state.category !== 'all' && e.category !== state.category) return false;

        // Specific date (from calendar day click)
        if (state.dateFilter && e.date !== state.dateFilter) return false;

        // Search
        if (state.search) {
            const q = state.search.toLowerCase();
            if (!e.title.toLowerCase().includes(q) && !e.location.toLowerCase().includes(q)) return false;
        }

        // Location
        if (state.location && e.locationKey !== state.location) return false;

        // Quick filters
        for (const f of state.quickFilters) {
            if (f === 'today') {
                const todayStr = new Date().toISOString().slice(0, 10);
                if (e.date !== todayStr) return false;
            } else if (f === 'weekend') {
                if (!e.tags.includes('weekend')) return false;
            } else if (f === 'free') {
                if (e.price !== 0) return false;
            } else if (f === 'beginner') {
                if (!e.tags.includes('beginner')) return false;
            } else if (f === 'women') {
                if (!e.tags.includes('women')) return false;
            } else if (f === 'spots-left') {
                if ((e.capacity - e.attendees) > 10 || (e.capacity - e.attendees) <= 0) return false;
            }
        }
        return true;
    });
}

function renderEvents() {
    const grid = document.getElementById('events-grid');
    const loadMoreWrap = document.getElementById('events-load-more-wrap');
    if (!grid) return;

    // Active-date-filter banner (appears above grid when a day is clicked in calendar)
    renderActiveDateBanner();

    const filtered = getFilteredEvents();

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="events-empty">
                <i data-lucide="search-x"></i>
                <h3>Nggak ada event yang match</h3>
                <p>Coba reset filter atau pilih kategori lain.</p>
                <button class="btn btn-ghost" id="reset-filters-btn">Reset filter</button>
            </div>
        `;
        if (loadMoreWrap) loadMoreWrap.style.display = 'none';
        if (window.lucide) lucide.createIcons();
        const rb = document.getElementById('reset-filters-btn');
        if (rb) rb.addEventListener('click', resetAllFilters);
        return;
    }

    // Pagination
    const visible = filtered.slice(0, state.visibleCount);
    if (loadMoreWrap) {
        loadMoreWrap.style.display = filtered.length > state.visibleCount ? '' : 'none';
    }

    grid.innerHTML = visible.map(eventCardHTML).join('');
    if (window.lucide) lucide.createIcons();

    // Wire up cards — Join button opens RSVP modal
    grid.querySelectorAll('.event-card-rsvp').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.eventId);
            openEventModal(EVENTS.find(ev => ev.id === id));
        });
    });

    // Bookmark button on image corner
    grid.querySelectorAll('.event-card-bookmark').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.eventId);
            toggleBookmark(id, btn);
        });
    });
}

function eventCardHTML(e) {
    const dateObj = new Date(e.date + 'T00:00:00');
    const monthShort = MONTH_SHORT[dateObj.getMonth()];
    const dayNum = dateObj.getDate();
    const spotsLeft = e.capacity - e.attendees;
    const isBookmarked = state.bookmarks.has(e.id);
    const isAlmostFull = spotsLeft <= 5 && spotsLeft > 0;

    const isFree = (e.priceLabel || '').toLowerCase() === 'free' || (e.priceLabel || '').toLowerCase() === 'gratis';

    return `
        <article class="event-card" data-category="${e.category}">
            <div class="event-card-image">
                <img src="${e.image}" alt="${e.title}" loading="lazy">
                <span class="event-badge badge-${e.category}">
                    <i data-lucide="${categoryIcon(e.category)}"></i> ${capitalize(e.category)}
                </span>
                <button class="event-card-bookmark ${isBookmarked ? 'active' : ''}" data-event-id="${e.id}" aria-label="Bookmark">
                    <i data-lucide="bookmark"></i>
                </button>
                ${isAlmostFull ? `<div class="spots-left-indicator"><span class="pulse-badge"></span>${spotsLeft} spots left</div>` : ''}
                <div class="event-card-date">
                    <span class="dmonth">${monthShort}</span>
                    <span class="dday">${dayNum}</span>
                </div>
            </div>

            <div class="event-card-content">
                <div class="event-meta-top">
                    <span class="event-day">${e.day} • ${e.time}</span>
                </div>
                <h3>${e.title}</h3>
                ${e.description ? `<p class="event-desc">${e.description}</p>` : ''}

                <div class="event-card-details">
                    <div class="ec-detail">
                        <i data-lucide="map-pin"></i>
                        <span>${e.location}</span>
                    </div>
                    ${e.distance ? `
                    <div class="ec-detail">
                        <i data-lucide="route"></i>
                        <span>${e.distance}</span>
                    </div>` : ''}
                </div>
            </div>

            <div class="event-card-footer">
                <div class="event-card-attendees">
                    <div class="mini-avatars">
                        <img src="./Asset/WebP/speda_one.webp" alt="">
                        <img src="./Asset/WebP/Woman_cycling_result.webp" alt="">
                        <img src="./Asset/WebP/1_guy.webp" alt="">
                    </div>
                    <div class="ec-attendee-info">
                        <span><strong>${e.attendees}</strong> going</span>
                        <span class="ec-price ${isFree ? 'ec-price-free' : ''}">${e.priceLabel}</span>
                    </div>
                </div>
                <button class="event-card-rsvp" data-event-id="${e.id}">
                    Join
                </button>
            </div>
        </article>
    `;
}

function categoryIcon(cat) {
    return {
        cycling: 'bike',
        padel: 'circle-dot',
        social: 'coffee'
    }[cat] || 'calendar';
}

function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

// ============================================================
// Category Tabs — FLIP morphing highlight indicator
// ============================================================
function initCategoryTabs() {
    const container = document.getElementById('event-category-tabs');
    if (!container) return;
    const indicator = container.querySelector('.evt-tab-indicator');
    const tabs = container.querySelectorAll('.evt-tab');

    function moveIndicatorTo(tab, animate = true) {
        if (!indicator || !tab) return;
        const containerRect = container.getBoundingClientRect();
        const tabRect = tab.getBoundingClientRect();
        const x = tabRect.left - containerRect.left;
        const w = tabRect.width;
        const h = tabRect.height;
        const y = tabRect.top - containerRect.top;

        indicator.style.transition = animate
            ? 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1), width 0.45s cubic-bezier(0.65, 0, 0.35, 1), height 0.45s cubic-bezier(0.65, 0, 0.35, 1)'
            : 'none';
        indicator.style.transform = `translate(${x}px, ${y}px)`;
        indicator.style.width = `${w}px`;
        indicator.style.height = `${h}px`;
        indicator.style.opacity = '1';
    }

    // Position indicator on the initially active tab
    const initialActive = container.querySelector('.evt-tab.active') || tabs[0];
    // Use rAF so layout is settled before measuring
    requestAnimationFrame(() => moveIndicatorTo(initialActive, false));
    // Also reposition on window resize (tabs may reflow)
    window.addEventListener('resize', () => {
        const active = container.querySelector('.evt-tab.active');
        if (active) moveIndicatorTo(active, false);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            moveIndicatorTo(tab, true);
            state.category = tab.dataset.category;
            state.visibleCount = state.pageSize;
            renderEvents();
            renderCalendar();
        });
    });
}

// ============================================================
// View Toggle (Grid / Calendar)
// ============================================================
function initViewToggle() {
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.view = btn.dataset.view;

            const grid = document.getElementById('events-grid-view');
            const cal = document.getElementById('events-calendar-view');
            if (state.view === 'grid') {
                grid.style.display = '';
                cal.style.display = 'none';
            } else {
                grid.style.display = 'none';
                cal.style.display = '';
                renderCalendar();
            }
        });
    });
}

// ============================================================
// Quick Filters
// ============================================================
function initQuickFilters() {
    document.querySelectorAll('.qf-chip').forEach(chip => {
        chip.addEventListener('click', () => {
            const f = chip.dataset.filter;
            if (state.quickFilters.has(f)) {
                state.quickFilters.delete(f);
                chip.classList.remove('active');
            } else {
                state.quickFilters.add(f);
                chip.classList.add('active');
            }
            state.visibleCount = state.pageSize;
            renderEvents();
            renderCalendar();
        });
    });
}

function resetAllFilters() {
    state.category = 'all';
    state.quickFilters.clear();
    state.search = '';
    state.location = '';
    state.dateFilter = null;
    state.visibleCount = state.pageSize;

    document.querySelectorAll('.evt-tab').forEach(t => t.classList.remove('active'));
    const allTab = document.querySelector('.evt-tab[data-category="all"]');
    if (allTab) allTab.classList.add('active');
    document.querySelectorAll('.qf-chip').forEach(c => c.classList.remove('active'));

    const s = document.getElementById('event-search'); if (s) s.value = '';
    const l = document.getElementById('event-location'); if (l) l.value = '';

    // Re-sync FLIP indicator to the now-active "Semua" tab
    const container = document.getElementById('event-category-tabs');
    const indicator = container?.querySelector('.evt-tab-indicator');
    if (container && indicator && allTab) {
        const cRect = container.getBoundingClientRect();
        const tRect = allTab.getBoundingClientRect();
        indicator.style.transition = 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1), width 0.45s cubic-bezier(0.65, 0, 0.35, 1), height 0.45s cubic-bezier(0.65, 0, 0.35, 1)';
        indicator.style.transform = `translate(${tRect.left - cRect.left}px, ${tRect.top - cRect.top}px)`;
        indicator.style.width = `${tRect.width}px`;
        indicator.style.height = `${tRect.height}px`;
        indicator.style.opacity = '1';
    }

    renderEvents();
    renderCalendar();
}

// ============================================================
// Search
// ============================================================
function initSearch() {
    const searchInput = document.getElementById('event-search');
    const locationSelect = document.getElementById('event-location');
    const submit = document.querySelector('.search-submit');

    const doSearch = () => {
        state.search = searchInput?.value || '';
        state.location = locationSelect?.value || '';
        state.visibleCount = state.pageSize;
        renderEvents();
        renderCalendar();
    };

    if (searchInput) {
        searchInput.addEventListener('input', debounce(doSearch, 250));
        searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); doSearch(); } });
    }
    if (locationSelect) locationSelect.addEventListener('change', doSearch);
    if (submit) submit.addEventListener('click', (e) => { e.preventDefault(); doSearch(); document.getElementById('all-events')?.scrollIntoView({ behavior: 'smooth' }); });
}

function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// ============================================================
// Calendar
// ============================================================
function initCalendarNav() {
    document.getElementById('cal-prev')?.addEventListener('click', () => {
        state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() - 1, 1);
        renderCalendar();
    });
    document.getElementById('cal-next')?.addEventListener('click', () => {
        state.calMonth = new Date(state.calMonth.getFullYear(), state.calMonth.getMonth() + 1, 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const label = document.getElementById('cal-month-label');
    if (!grid || !label) return;

    const year = state.calMonth.getFullYear();
    const month = state.calMonth.getMonth();
    label.textContent = `${MONTH_NAMES[month]} ${year}`;

    const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const filtered = getFilteredEvents();
    const eventsByDate = {};
    filtered.forEach(e => {
        const d = new Date(e.date + 'T00:00:00');
        if (d.getFullYear() === year && d.getMonth() === month) {
            const key = d.getDate();
            if (!eventsByDate[key]) eventsByDate[key] = [];
            eventsByDate[key].push(e);
        }
    });

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const isCurrentMonth = todayDate.getFullYear() === year && todayDate.getMonth() === month;
    const todayDay = todayDate.getDate();

    const pad = (n) => String(n).padStart(2, '0');
    let html = '';

    // Prev month padding
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        html += `<div class="cal-day cal-day-muted cal-day-empty"><span class="cal-day-num">${day}</span></div>`;
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEvents = eventsByDate[d] || [];
        const isToday = isCurrentMonth && d === todayDay;
        const dateKey = `${year}-${pad(month + 1)}-${pad(d)}`;
        html += `
            <div class="cal-day ${isToday ? 'cal-day-today today' : ''} ${dayEvents.length ? 'cal-day-has-events' : ''}"
                 data-date="${dateKey}"
                 role="button"
                 tabindex="0"
                 aria-label="${dayEvents.length} event pada ${d} ${MONTH_NAMES[month]} ${year}">
                <span class="cal-day-num">${d}</span>
                <div class="cal-day-events cal-events">
                    ${dayEvents.slice(0, 3).map(ev => `
                        <button class="cal-event-pill cal-event cal-event-${ev.category}" data-event-id="${ev.id}" title="${ev.title} — ${ev.time}">
                            ${ev.time} ${ev.title}
                        </button>
                    `).join('')}
                    ${dayEvents.length > 3 ? `<span class="cal-event-more cal-more">+${dayEvents.length - 3} lagi</span>` : ''}
                </div>
            </div>
        `;
    }

    // Next month padding
    const totalCells = firstDay + daysInMonth;
    const trailing = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= trailing; i++) {
        html += `<div class="cal-day cal-day-muted cal-day-empty"><span class="cal-day-num">${i}</span></div>`;
    }

    grid.innerHTML = html;

    // Click a day pill → open RSVP for that event (stop propagation so cell click doesn't also fire)
    grid.querySelectorAll('.cal-event, .cal-event-pill').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.eventId);
            const ev = EVENTS.find(ee => ee.id === id);
            if (ev) openEventModal(ev);
        });
    });

    // Click a day cell with events → jump to grid view, filtered to that date
    grid.querySelectorAll('.cal-day[data-date]').forEach(cell => {
        const activate = () => {
            const dateKey = cell.dataset.date;
            const matches = EVENTS.filter(ev => ev.date === dateKey);
            if (matches.length === 0) return;

            // Switch to grid view
            const gridViewBtn = document.querySelector('.view-btn[data-view="grid"]');
            gridViewBtn?.click();

            // Seed search with ISO date — simplest way to reuse search filter path.
            // But search currently matches title/location. We'll use a dedicated date filter via state.
            state.dateFilter = dateKey;
            state.visibleCount = state.pageSize;
            renderEvents();
            showToast(`${matches.length} event tanggal ${cell.querySelector('.cal-day-num').textContent}`);
            document.getElementById('all-events')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
        cell.addEventListener('click', activate);
        cell.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    });
}

// ============================================================
// RSVP Modal
// ============================================================
let currentRsvpEvent = null;

function initEventModal() {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    const closeBtns = modal.querySelectorAll('[data-modal-close]');
    const joinBtn = document.getElementById('modal-btn-join');
    const detailsView = document.getElementById('modal-details-view');
    const successView = document.getElementById('modal-success-view');

    const close = () => {
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    closeBtns.forEach(btn => btn.addEventListener('click', close));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // Handle Join Button
    if(joinBtn) {
        joinBtn.addEventListener('click', () => {
            if (!currentRsvpEvent) return;
            
            // If ComumJoin is available, we use it
            if (window.ComumJoin) {
                const joined = window.ComumJoin.joinEvent(currentRsvpEvent.id);
                if (!joined) return; // Likely redirected to login
            }

            // Show success state
            joinBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite; margin-right: 8px; vertical-align: middle;"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg> Memproses...';
            joinBtn.disabled = true;

            setTimeout(() => {
                if (detailsView) detailsView.style.display = 'none';
                if (successView) successView.style.display = 'flex';
                if (window.lucide) lucide.createIcons();
            }, 800);
        });
    }

    // Featured event Join button
    const featuredJoin = document.querySelector('.rsvp-btn[data-event-id="featured"]');
    if (featuredJoin) {
        featuredJoin.addEventListener('click', () => {
            const featured = EVENTS.find(e => e.featured) || EVENTS[0];
            openEventModal(featured);
        });
    }

    // Deep-link: events.html?id=N opens that event's RSVP automatically
    const urlId = parseInt(new URLSearchParams(window.location.search).get('id'), 10);
    if (urlId) {
        const ev = EVENTS.find(e => e.id === urlId);
        if (ev) setTimeout(() => openEventModal(ev), 200);
    }
}

/* Updates the modal's join-state UI based on whether the current event
   has been joined by the logged-in user. The "already joined" state
   only shows when there's an actual logged-in user — anonymous visitors
   always see a fresh "Confirm hadir" prompt that triggers the login flow. */
function refreshRsvpJoinedState() {
    if (!currentRsvpEvent) return;
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    const joined = !!user && window.ComumJoin && window.ComumJoin.hasJoinedEvent(currentRsvpEvent.id);
    const submit = document.getElementById('rsvp-submit-btn');
    const already = document.getElementById('rsvp-already');
    if (submit) submit.style.display = joined ? 'none' : '';
    if (already) {
        already.hidden = !joined;
        if (window.lucide) lucide.createIcons();
    }
}

// ============================================================
// Active Date Filter Banner (shown above grid when a day is picked)
// ============================================================
function renderActiveDateBanner() {
    let banner = document.getElementById('active-date-banner');
    const host = document.getElementById('events-grid-view');
    if (!host) return;

    if (!state.dateFilter) {
        if (banner) banner.remove();
        return;
    }

    const dateObj = new Date(state.dateFilter + 'T00:00:00');
    const label = `${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'active-date-banner';
        banner.className = 'active-date-banner';
        host.prepend(banner);
    }
    banner.innerHTML = `
        <span><i data-lucide="calendar"></i> Menampilkan event untuk <strong>${label}</strong></span>
        <button class="btn btn-ghost btn-sm" id="clear-date-filter"><i data-lucide="x"></i> Hapus filter</button>
    `;
    if (window.lucide) lucide.createIcons();
    document.getElementById('clear-date-filter')?.addEventListener('click', () => {
        state.dateFilter = null;
        state.visibleCount = state.pageSize;
        renderEvents();
    });
}

// ============================================================
// Load More pagination
// ============================================================
function initLoadMore() {
    const btn = document.getElementById('events-load-more-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        state.visibleCount += state.pageSize;
        renderEvents();
        // Smooth-scroll slightly so user sees new cards entering
        const grid = document.getElementById('events-grid');
        if (grid) {
            const lastCards = grid.querySelectorAll('.event-card');
            const target = lastCards[Math.max(0, lastCards.length - state.pageSize)];
            target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
}

// ============================================================
// Featured action buttons (bookmark + share)
// ============================================================
function initFeaturedActions() {
    const featured = EVENTS.find(e => e.featured) || EVENTS[0];
    if (!featured) return;

    // Bookmark
    const bookmarkBtn = document.querySelector('.featured-bookmark[data-event-id="featured"]');
    if (bookmarkBtn) {
        // Sync visual state with persisted bookmarks
        if (state.bookmarks.has(featured.id)) bookmarkBtn.classList.add('active');
        bookmarkBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleBookmark(featured.id, bookmarkBtn);
        });
    }

    // Share
    const shareBtn = document.querySelector('.featured-share[data-event-id="featured"]');
    if (shareBtn) {
        shareBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            shareEvent(featured, shareBtn);
        });
    }
}

async function shareEvent(ev, btn) {
    const shareData = {
        title: `Comum — ${ev.title}`,
        text: `${ev.title} · ${ev.day} ${ev.time} · ${ev.location}`,
        url: window.location.href
    };
    try {
        if (navigator.share) {
            await navigator.share(shareData);
            return;
        }
    } catch (_) { /* user cancelled — fall through to copy */ }

    try {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        showToast('Link disalin ke clipboard');
        if (btn) {
            btn.classList.add('bookmark-pop');
            setTimeout(() => btn.classList.remove('bookmark-pop'), 500);
        }
    } catch (_) {
        showToast('Gagal share — coba lagi');
    }
}

function openEventModal(ev) {
    if (!ev) return;
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    currentRsvpEvent = ev;

    // Reset state
    const detailsView = document.getElementById('modal-details-view');
    const successView = document.getElementById('modal-success-view');
    const joinBtn = document.getElementById('modal-btn-join');
    if (detailsView) detailsView.style.display = 'flex';
    if (successView) successView.style.display = 'none';
    if (joinBtn) {
        joinBtn.innerHTML = 'Daftar';
        joinBtn.disabled = false;
    }

    // Populate
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
    const successWaBtn = document.getElementById('modal-success-wa');

    if (mImg) mImg.src = ev.image;
    if (mBadge) mBadge.textContent = capitalize(ev.category);
    if (mTitle) mTitle.textContent = ev.title;
    
    const dateObj = new Date(ev.date + 'T00:00:00');
    if (mDate) mDate.textContent = `${ev.day}, ${dateObj.getDate()} ${MONTH_NAMES[dateObj.getMonth()]}`;
    if (mTime) mTime.textContent = ev.time;
    if (mLocation) mLocation.textContent = ev.location;

    // Get rich data if available in global EVENT_DB (from script.js)
    const richData = (window.EVENT_DB && window.EVENT_DB[ev.id]) || {
        host: "Comum Community",
        level: ev.difficultyLabel || "All Levels",
        price: ev.priceLabel || "Gratis",
        slots: `${ev.attendees}/${ev.capacity}`,
        reqs: "None",
        maps: "#",
        desc: ev.description || "Ayo bergabung bersama komunitas Comum! Pastikan kamu hadir tepat waktu."
    };

    if (mHost) mHost.textContent = richData.host;
    if (mLevel) mLevel.textContent = richData.level;
    if (mPrice) mPrice.textContent = richData.price;
    if (mSlots) mSlots.textContent = richData.slots;
    if (mReqs) mReqs.textContent = richData.reqs;
    if (mDesc) mDesc.textContent = richData.desc;
    if (btnMaps) btnMaps.href = richData.maps;

    // WA Link
    let waLink = '';
    if (window.ComumJoin) {
        waLink = window.ComumJoin.buildWhatsAppLink({ 
            title: ev.title, 
            date: ev.date, 
            time: ev.time, 
            location: ev.location 
        });
    } else {
        waLink = `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya mau ikutan event "${ev.title}". Bisa info lebih lanjut?`)}`;
    }
    if (btnWa) btnWa.href = waLink;
    if (successWaBtn) successWaBtn.href = waLink;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
}

function refreshRsvpJoinedState() {
    // No longer used in the new modal but kept to avoid breaks if called elsewhere
}

// ============================================================
// Bookmarks
// ============================================================
function toggleBookmark(id, btn) {
    const willBookmark = !state.bookmarks.has(id);
    if (willBookmark) {
        state.bookmarks.add(id);
        showToast('Disimpan ke bookmark');
    } else {
        state.bookmarks.delete(id);
        showToast('Dihapus dari bookmark');
    }

    // Sync every button tied to this event (card + featured) so state is coherent
    const selectors = [
        `.event-card-bookmark[data-event-id="${id}"]`,
        `.featured-bookmark[data-event-id="featured"]`
    ];
    const featured = EVENTS.find(e => e.featured) || EVENTS[0];
    document.querySelectorAll(selectors.join(',')).forEach(b => {
        const bid = b.dataset.eventId === 'featured' ? (featured?.id) : parseInt(b.dataset.eventId);
        if (bid !== id) return;
        b.classList.toggle('active', willBookmark);
    });

    // Pop animation on the clicked button for tactile feedback
    if (btn) {
        btn.classList.remove('bookmark-pop');
        void btn.offsetWidth; // restart animation
        btn.classList.add('bookmark-pop');
        setTimeout(() => btn.classList.remove('bookmark-pop'), 500);
    }

    localStorage.setItem('comum-bookmarks', JSON.stringify([...state.bookmarks]));
}

// ============================================================
// Newsletter
// ============================================================
function initNewsletter() {
    const form = document.getElementById('newsletter-form');
    form?.addEventListener('submit', (e) => {
        e.preventDefault();
        form.reset();
        showToast('Berhasil subscribe! Cek email kamu.');
    });
}

// ============================================================
// Toast
// ============================================================
let toastTimer;
function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
