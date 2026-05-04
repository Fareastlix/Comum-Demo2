// ============================================================
// Comum Profile / Dashboard — high-fidelity functional prototype
// ============================================================

// Membership perks themed around Comum's partner network — small sports
// businesses that give discounts to community members. Pattern: discount,
// more discount, exclusive discount + early access tier.
const TIERS = {
    rookie: {
        name: 'Rookie', icon: '🌱', label: 'ROOKIE',
        min: 0, max: 999, nextTier: 'crew',
        perks: [
            { icon: 'percent', text: '5% diskon di partner stores' },
            { icon: 'calendar-check', text: 'Update event komunitas' },
            { icon: 'gift', text: 'Bonus ulang tahun 50 poin' }
        ]
    },
    crew: {
        name: 'Crew', icon: '⚡', label: 'CREW',
        min: 1000, max: 4999, nextTier: 'captain',
        perks: [
            { icon: 'percent', text: '10% diskon di partner stores' },
            { icon: 'zap', text: 'Akses awal ke event komunitas' },
            { icon: 'gift', text: 'Bonus ulang tahun 100 poin' }
        ]
    },
    captain: {
        name: 'Captain', icon: '👑', label: 'CAPTAIN',
        min: 5000, max: Infinity, nextTier: null,
        perks: [
            { icon: 'percent', text: '15% diskon eksklusif partner stores' },
            { icon: 'sparkles', text: 'Akses awal ke item drop terbatas' },
            { icon: 'crown', text: 'Priority RSVP semua event' },
            { icon: 'gift', text: 'Bonus ulang tahun 250 poin' }
        ]
    }
};

// ---------- Mock data ----------
const MOCK_ORDERS = [
    { id: 'COM-982341', title: 'Royal Padel Whip 2026 Pro', date: '12 Apr 2026', status: 'completed', amount: 4500000, points: 450, items: [{name: 'Royal Padel Whip 2026 Pro', qty: 1, price: 4500000}] },
    { id: 'COM-978122', title: 'Castelli Free Aero Jersey', date: '8 Apr 2026', status: 'shipped', amount: 1850000, points: 185, items: [{name: 'Castelli Free Aero Jersey', qty: 1, price: 1850000}], tracking: 'JNE-TRK-91820344' },
    { id: 'COM-971055', title: 'Sewa: Head Delta Pro (3 hari)', date: '2 Apr 2026', status: 'completed', amount: 148500, points: 15, items: [{name: 'Head Delta Pro (rental 3 hari)', qty: 1, price: 148500}] }
];

const MOCK_EVENTS = [
    { id: 'mock-1', title: 'Sunday Long Ride: Puncak Pass', date: '19 Apr', month: 'APR', day: '19', location: 'Comum Hub Sutera', time: '05:30', status: 'upcoming', image: './Asset/Cycling_GroupPic.png', description: '120km epic ride ke Puncak. SAG support, coffee stops, lunch di atas.' },
    { id: 'mock-2', title: 'Morning Coffee Ride', date: '16 Apr', month: 'APR', day: '16', location: 'Alam Sutera', time: '06:00', status: 'upcoming', image: './Asset/Cycliong_GroupPicPoint.png', description: 'Easy ride 35km + coffee stop. Perfect for beginners.' },
    { id: 'mock-3', title: 'Padel Night League - Round 3', date: '10 Apr', month: 'APR', day: '10', location: 'Panglima Polim', time: '19:00', status: 'attended', image: './Asset/Padel_Photo1.png', description: 'Weekly padel tournament. Mixed doubles, best of 3 sets.' },
    { id: 'mock-4', title: 'Community Hangout', date: '5 Apr', month: 'APR', day: '5', location: 'Comum Hub', time: '18:00', status: 'attended', image: './Asset/Cycling_HangoutUndian.png', description: 'Hangout santai, kopi-kopi, cerita-cerita.' }
];

const MOCK_POINTS_HISTORY = [
    { title: 'Pembelian: Royal Padel Whip', date: '12 Apr 2026', amount: 450, type: 'earn' },
    { title: 'Pembelian: Castelli Jersey', date: '8 Apr 2026', amount: 185, type: 'earn' },
    { title: 'Event: Sunday Long Ride', date: '5 Apr 2026', amount: 50, type: 'earn' },
    { title: 'Sewa: Head Delta Pro', date: '2 Apr 2026', amount: 15, type: 'earn' },
    { title: 'Referral bonus', date: '28 Mar 2026', amount: 100, type: 'earn' },
    { title: 'Welcome bonus', date: '15 Mar 2026', amount: 50, type: 'earn' }
];

const CLAIMABLE_REWARDS = [
    { id: 'r1', cost: 200,  title: 'Voucher Rp 20K — Padel Court Sutera',     desc: 'Sewa lapangan padel partner', icon: 'percent', tint: 'blue' },
    { id: 'r2', cost: 500,  title: 'Voucher Rp 50K — Bike Studio Kemang',     desc: 'Service / fitting di partner store', icon: 'tag', tint: 'blue' },
    { id: 'r3', cost: 800,  title: 'Free 1x rental racket — Royal Padel',     desc: 'Racket premium 1 hari', icon: 'ticket', tint: 'purple' },
    { id: 'r4', cost: 1200, title: 'Free 1x rental sepeda — Wheelhaus',       desc: 'Road / gravel 1 hari', icon: 'bike', tint: 'green' },
    { id: 'r5', cost: 2000, title: 'Free entry event premium',                desc: 'Akses 1x event berbayar', icon: 'star', tint: 'yellow' },
    { id: 'r6', cost: 5000, title: 'Comum merch bundle',                      desc: 'T-shirt + bottle + cap', icon: 'shirt', tint: 'orange' }
];

const AVATAR_GRADIENTS = [
    { id: 'blue-purple', bg: 'linear-gradient(135deg, #0066FF 0%, #7C3AED 100%)' },
    { id: 'sunset',      bg: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)' },
    { id: 'green-teal',  bg: 'linear-gradient(135deg, #22C55E 0%, #0EA5E9 100%)' },
    { id: 'pink-orange', bg: 'linear-gradient(135deg, #EC4899 0%, #F97316 100%)' },
    { id: 'dark',        bg: 'linear-gradient(135deg, #0F172A 0%, #475569 100%)' },
    { id: 'violet',      bg: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)' }
];

let currentUser = null;

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    currentUser = JSON.parse(localStorage.getItem('comum-user') || 'null');
    if (!currentUser) {
        window.location.href = 'login.html';
        return;
    }

    // Seed demo data if brand new
    if (currentUser.points === 0 && !currentUser.demoed) {
        currentUser.points = 850;
        currentUser.totalSpent = 6498500;
        currentUser.eventsAttended = 4;
        currentUser.orders = MOCK_ORDERS;
        currentUser.avatarGradient = 'blue-purple';
        currentUser.email = currentUser.email || (currentUser.name ? currentUser.name.toLowerCase().replace(/\s+/g, '.') + '@comum.id' : 'you@comum.id');
        currentUser.demoed = true;
        saveUser();
    }

    // Drop any events the user has previously cancelled
    const cancelled = JSON.parse(localStorage.getItem('comum-cancelled-rsvps') || '[]');
    if (cancelled.length) {
        for (let i = MOCK_EVENTS.length - 1; i >= 0; i--) {
            if (cancelled.includes(MOCK_EVENTS[i].id)) MOCK_EVENTS.splice(i, 1);
        }
    }

    renderProfile();
    initDashTabs();
    renderOrders();
    renderEvents();
    renderSavedEvents();
    renderWishlist();
    renderRewards();
    initSettings();

    // Global interactive wiring
    initStatCardNav();
    initModal();
    initAvatarEdit();
    initMembershipDetail();
    initHashNavigation();
});

// ============================================================
// Persistence helpers
// ============================================================
function saveUser() {
    localStorage.setItem('comum-user', JSON.stringify(currentUser));
    const users = JSON.parse(localStorage.getItem('comum-users') || '{}');
    users[currentUser.phone] = currentUser;
    localStorage.setItem('comum-users', JSON.stringify(users));
}

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function calculateTier(points) {
    if (points >= 5000) return 'captain';
    if (points >= 1000) return 'crew';
    return 'rookie';
}

// ============================================================
// Render Profile
// ============================================================
function renderProfile() {
    const tier = calculateTier(currentUser.points);
    currentUser.tier = tier;
    saveUser();
    const tierData = TIERS[tier];

    const initials = (currentUser.name || 'U').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    const avatarEl = document.getElementById('profile-avatar');
    // If user uploaded a photo, use it; otherwise show initials + gradient
    if (currentUser.avatarPhoto) {
        avatarEl.textContent = '';
        avatarEl.style.background = `url('${currentUser.avatarPhoto}') center/cover no-repeat`;
    } else {
        avatarEl.textContent = initials;
        const chosen = AVATAR_GRADIENTS.find(g => g.id === currentUser.avatarGradient) || AVATAR_GRADIENTS[0];
        avatarEl.style.background = chosen.bg;
    }

    document.getElementById('profile-name').textContent = currentUser.name;
    document.getElementById('profile-phone').textContent = currentUser.phone;
    document.getElementById('profile-joined-date').textContent = formatDate(currentUser.joinDate);
    // Note: script.js's initAuthUI() may have already replaced the nav-cta innerHTML
    // (avatar pill + first name), so this element may not exist anymore.
    const navName = document.getElementById('nav-user-name');
    if (navName) navName.textContent = (currentUser.name || 'Me').split(' ')[0];

    const card = document.getElementById('membership-card');
    card.className = 'membership-card tier-' + tier;

    document.getElementById('tier-icon').textContent = tierData.icon;
    document.getElementById('tier-label').textContent = tierData.label;
    document.getElementById('tier-name').textContent = tierData.name;
    document.getElementById('points-current').textContent = currentUser.points.toLocaleString();

    if (tierData.nextTier) {
        const nextData = TIERS[tierData.nextTier];
        const pointsInTier = currentUser.points - tierData.min;
        const tierRange = nextData.min - tierData.min;
        const progress = Math.min(100, (pointsInTier / tierRange) * 100);
        const pointsLeft = nextData.min - currentUser.points;
        document.getElementById('progress-fill').style.width = progress + '%';
        document.getElementById('points-next-text').innerHTML = `${pointsLeft} poin lagi ke <strong>${nextData.name}</strong>`;
    } else {
        document.getElementById('progress-fill').style.width = '100%';
        document.getElementById('points-next-text').textContent = 'Kamu sudah di tier tertinggi!';
    }

    const perksEl = document.getElementById('tier-perks');
    perksEl.innerHTML = tierData.perks.map(p =>
        `<span class="perk-chip"><i data-lucide="${p.icon}"></i> ${p.text}</span>`
    ).join('');

    document.getElementById('stat-orders').textContent = (currentUser.orders || []).length;
    document.getElementById('stat-events').textContent = currentUser.eventsAttended || 0;
    document.getElementById('stat-points').textContent = currentUser.points.toLocaleString();
    document.getElementById('stat-wishlist').textContent = JSON.parse(localStorage.getItem('comum-wishlist') || '[]').length;

    if (window.lucide) lucide.createIcons();
}

// ============================================================
// Dashboard Tabs — FLIP morphing indicator (matches events page)
// ============================================================
function initDashTabs() {
    const container = document.getElementById('dash-tabs');
    if (!container) return;
    const indicator = container.querySelector('.dash-tab-indicator');
    const tabs = container.querySelectorAll('.dash-tab');

    function moveIndicator(tab, animate = true) {
        if (!indicator || !tab) return;
        const cRect = container.getBoundingClientRect();
        const tRect = tab.getBoundingClientRect();
        indicator.style.transition = animate
            ? 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1), width 0.45s cubic-bezier(0.65, 0, 0.35, 1), height 0.45s cubic-bezier(0.65, 0, 0.35, 1)'
            : 'none';
        indicator.style.transform = `translate(${tRect.left - cRect.left}px, ${tRect.top - cRect.top}px)`;
        indicator.style.width  = `${tRect.width}px`;
        indicator.style.height = `${tRect.height}px`;
        indicator.style.opacity = '1';
    }

    const initialActive = container.querySelector('.dash-tab.active') || tabs[0];
    requestAnimationFrame(() => moveIndicator(initialActive, false));
    window.addEventListener('resize', () => {
        const active = container.querySelector('.dash-tab.active');
        if (active) moveIndicator(active, false);
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('active')) return;
            switchTab(tab.dataset.tab);
        });
    });
}

function switchTab(name) {
    const tab = document.querySelector(`.dash-tab[data-tab="${name}"]`);
    if (!tab) return;
    document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById('panel-' + name)?.classList.add('active');

    // Move FLIP indicator
    const container = document.getElementById('dash-tabs');
    const indicator = container?.querySelector('.dash-tab-indicator');
    if (container && indicator) {
        const cRect = container.getBoundingClientRect();
        const tRect = tab.getBoundingClientRect();
        indicator.style.transition = 'transform 0.45s cubic-bezier(0.65, 0, 0.35, 1), width 0.45s cubic-bezier(0.65, 0, 0.35, 1), height 0.45s cubic-bezier(0.65, 0, 0.35, 1)';
        indicator.style.transform = `translate(${tRect.left - cRect.left}px, ${tRect.top - cRect.top}px)`;
        indicator.style.width = `${tRect.width}px`;
        indicator.style.height = `${tRect.height}px`;
    }

    // Update URL hash without jump
    const newHash = '#' + name;
    if (location.hash !== newHash) {
        history.replaceState(null, '', newHash);
    }
}

// ============================================================
// Hash-based deep linking (/profile.html#events → Events tab)
// ============================================================
function initHashNavigation() {
    const valid = ['orders', 'events', 'wishlist', 'rewards', 'settings'];
    const jump = () => {
        const target = (location.hash || '').replace('#', '');
        if (valid.includes(target)) switchTab(target);
    };
    jump();
    window.addEventListener('hashchange', jump);
}

// ============================================================
// Stat cards → tab navigation
// ============================================================
function initStatCardNav() {
    document.querySelectorAll('.stat-card[data-tab-target]').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.tabTarget;
            switchTab(target);
            // Smooth-scroll to dashboard
            document.querySelector('.profile-dashboard')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ============================================================
// Orders — clickable list, opens detail modal
// ============================================================
function renderOrders() {
    const orders = currentUser.orders || [];
    const emptyEl = document.getElementById('orders-empty');
    const listEl = document.getElementById('orders-list');

    if (orders.length === 0) {
        emptyEl.style.display = '';
        listEl.style.display = 'none';
        return;
    }
    emptyEl.style.display = 'none';
    listEl.style.display = '';

    const statusLabels = { completed: 'Selesai', processing: 'Diproses', shipped: 'Dikirim' };

    listEl.innerHTML = orders.map(o => `
        <button type="button" class="order-item" data-order-id="${o.id}">
            <div class="order-icon"><i data-lucide="package"></i></div>
            <div class="order-info">
                <h4>${o.title}</h4>
                <p>${o.id} • ${o.date}</p>
            </div>
            <span class="order-status status-${o.status}">${statusLabels[o.status] || o.status}</span>
            <span class="order-amount">${formatRupiah(o.amount)}</span>
            <i data-lucide="chevron-right" class="order-chevron"></i>
        </button>
    `).join('');

    if (window.lucide) lucide.createIcons();

    listEl.querySelectorAll('.order-item').forEach(btn => {
        btn.addEventListener('click', () => openOrderDetail(btn.dataset.orderId));
    });
}

function openOrderDetail(orderId) {
    const order = (currentUser.orders || []).find(o => o.id === orderId);
    if (!order) return;

    // Status timeline — visualize progression
    const statusSteps = [
        { key: 'placed',    label: 'Pesanan dibuat',     reached: true },
        { key: 'processing', label: 'Diproses',          reached: order.status !== 'placed' },
        { key: 'shipped',   label: 'Dikirim',             reached: ['shipped', 'completed'].includes(order.status) },
        { key: 'completed', label: 'Diterima / Selesai',  reached: order.status === 'completed' }
    ];

    const itemsHtml = (order.items || []).map(it => `
        <div class="order-detail-item">
            <span>${it.name} × ${it.qty}</span>
            <strong>${formatRupiah(it.price * it.qty)}</strong>
        </div>
    `).join('');

    const body = `
        <div class="order-detail">
            <span class="modal-label">Order ${order.id}</span>
            <h2 id="modal-title">${order.title}</h2>
            <span class="modal-subline">${order.date}</span>

            <div class="order-timeline">
                ${statusSteps.map((s, i) => `
                    <div class="timeline-step ${s.reached ? 'reached' : ''}">
                        <div class="timeline-dot">${s.reached ? '<i data-lucide="check"></i>' : i + 1}</div>
                        <span>${s.label}</span>
                    </div>
                `).join('')}
            </div>

            <div class="order-detail-items">
                <h4>Item pesanan</h4>
                ${itemsHtml}
                <div class="order-detail-total">
                    <span>Total</span>
                    <strong>${formatRupiah(order.amount)}</strong>
                </div>
                <div class="order-detail-points">
                    <i data-lucide="sparkles"></i> +${order.points} poin earned
                </div>
            </div>

            ${order.tracking ? `
                <div class="order-tracking">
                    <span class="modal-label">Resi</span>
                    <code>${order.tracking}</code>
                </div>
            ` : ''}

            <div class="modal-actions">
                <button class="btn btn-ghost" data-action="invoice">
                    <i data-lucide="file-text"></i> Invoice
                </button>
                ${order.status === 'shipped' ? `<button class="btn btn-ghost" data-action="track">
                    <i data-lucide="truck"></i> Lacak
                </button>` : ''}
                <button class="btn btn-primary" data-action="reorder">
                    <i data-lucide="repeat-2"></i> Pesan lagi
                </button>
            </div>
        </div>
    `;

    openModal(body);

    // Wire action buttons
    const modal = document.getElementById('profile-modal');
    modal.querySelector('[data-action="invoice"]')?.addEventListener('click', () => {
        openInvoiceWindow(order);
    });
    modal.querySelector('[data-action="track"]')?.addEventListener('click', () => {
        // Guess carrier from tracking prefix
        const t = (order.tracking || '').toUpperCase();
        let url;
        if (t.startsWith('JNE')) url = 'https://www.jne.co.id/id/tracking/trace';
        else if (t.startsWith('JNT') || t.startsWith('J&T')) url = 'https://jet.co.id/track';
        else if (t.startsWith('SICEPAT')) url = 'https://www.sicepat.com/checkAwb';
        else url = 'https://cekresi.com/?noresi=' + encodeURIComponent(order.tracking || '');
        window.open(url, '_blank', 'noopener');
        showToast(`Tracking: ${order.tracking}`);
    });
    modal.querySelector('[data-action="reorder"]')?.addEventListener('click', () => {
        // Add to cart via localStorage
        const cart = JSON.parse(localStorage.getItem('comum-cart') || '[]');
        (order.items || []).forEach(it => {
            cart.push({ name: it.name, qty: it.qty, price: it.price });
        });
        localStorage.setItem('comum-cart', JSON.stringify(cart));
        closeModal();
        showToast('Item ditambahkan ke cart');
    });
}

// ============================================================
// Events list (upcoming / attended) — clickable → detail modal
// ============================================================
function renderEvents() {
    const emptyEl = document.getElementById('events-empty');
    const listEl = document.getElementById('events-list');
    const countEl = document.getElementById('my-events-count');

    /* Pull the joined-events IDs from localStorage and look them up in
       the shared events-data.js list. Falls back to MOCK_EVENTS for demo
       continuity if the join system isn't available. */
    let joinedItems = [];
    if (window.ComumJoin && Array.isArray(window.COMUM_EVENTS)) {
        const joinedIds = window.ComumJoin.getJoinedEvents();
        const monthsShort = window.COMUM_MONTH_SHORT || ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
        joinedItems = joinedIds
            .map(id => window.COMUM_EVENTS.find(e => e.id === id))
            .filter(Boolean)
            .map(e => {
                const dt = new Date(e.date + 'T00:00:00');
                return {
                    id: e.id,
                    title: e.title,
                    month: monthsShort[dt.getMonth()],
                    day: String(dt.getDate()),
                    date: `${dt.getDate()} ${monthsShort[dt.getMonth()]}`,
                    location: e.location,
                    time: e.time,
                    image: e.image,
                    description: e.description || '',
                    status: 'upcoming'
                };
            });
    } else {
        joinedItems = MOCK_EVENTS.slice();
    }

    if (joinedItems.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        if (listEl) listEl.style.display = 'none';
        if (countEl) countEl.textContent = '0';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    if (listEl) listEl.style.display = '';
    if (countEl) countEl.textContent = joinedItems.length;

    listEl.innerHTML = joinedItems.map(e => `
        <button type="button" class="event-item" data-event-id="${e.id}">
            <div class="event-item-date">
                <span class="month">${e.month}</span>
                <span class="day">${e.day}</span>
            </div>
            <div class="event-item-info">
                <h4>${e.title}</h4>
                <p><i data-lucide="map-pin"></i> ${e.location} · ${e.time}</p>
            </div>
            <span class="event-item-badge badge-${e.status}">
                ${e.status === 'upcoming' ? 'Upcoming' : 'Hadir'}
            </span>
            <i data-lucide="chevron-right" class="event-chevron"></i>
        </button>
    `).join('');

    if (window.lucide) lucide.createIcons();

    listEl.querySelectorAll('.event-item').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.dataset.eventId;
            // Match by either string or numeric id (mock vs real)
            const ev = joinedItems.find(x => String(x.id) === String(id));
            if (ev) openEventDetail(ev);
        });
    });
}

function openEventDetail(ev) {
    const isUpcoming = ev.status === 'upcoming';
    const body = `
        <div class="event-detail">
            <div class="event-detail-image">
                <img src="${ev.image}" alt="${ev.title}">
                <span class="event-detail-status badge-${ev.status}">
                    ${isUpcoming ? 'Upcoming' : 'Sudah dihadiri'}
                </span>
            </div>
            <div class="event-detail-body">
                <span class="modal-label">${ev.month} ${ev.day} · ${ev.time}</span>
                <h2 id="modal-title">${ev.title}</h2>
                <p class="modal-subline"><i data-lucide="map-pin"></i> ${ev.location}</p>
                <p class="event-detail-desc">${ev.description || ''}</p>

                <div class="modal-actions">
                    ${isUpcoming ? `
                        <button class="btn btn-ghost" data-action="calendar">
                            <i data-lucide="calendar-plus"></i> Tambah ke kalender
                        </button>
                        <button class="btn btn-ghost" data-action="share">
                            <i data-lucide="share-2"></i> Share
                        </button>
                        <button class="btn btn-ghost btn-danger" data-action="cancel">
                            <i data-lucide="x-circle"></i> Batal RSVP
                        </button>
                    ` : `
                        <button class="btn btn-ghost" data-action="share">
                            <i data-lucide="share-2"></i> Share
                        </button>
                        <button class="btn btn-primary" data-action="similar">
                            <i data-lucide="search"></i> Event serupa
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    openModal(body);

    const modal = document.getElementById('profile-modal');
    modal.querySelector('[data-action="calendar"]')?.addEventListener('click', () => {
        const url = buildGoogleCalendarUrl(ev);
        window.open(url, '_blank', 'noopener');
        showToast('Membuka Google Calendar...');
    });
    modal.querySelector('[data-action="share"]')?.addEventListener('click', async () => {
        const shareText = `${ev.title} · ${ev.month} ${ev.day} · ${ev.location}`;
        try {
            if (navigator.share) {
                await navigator.share({ title: ev.title, text: shareText, url: location.href });
            } else {
                await navigator.clipboard.writeText(shareText + '\n' + location.href);
                showToast('Link disalin ke clipboard');
            }
        } catch (_) { /* cancelled */ }
    });
    modal.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
        closeModal();
        confirmDialog({
            title: 'Batal RSVP?',
            message: `RSVP untuk "${ev.title}" akan dihapus dari daftar event kamu.`,
            okLabel: 'Ya, batal',
            iconName: 'calendar-x',
            onConfirm: () => {
                // Real events (numeric id) → use ComumJoin.leaveEvent
                if (typeof ev.id === 'number' && window.ComumJoin) {
                    window.ComumJoin.leaveEvent(ev.id);
                } else {
                    // Mock events fall back to the cancellation list
                    const cancelled = JSON.parse(localStorage.getItem('comum-cancelled-rsvps') || '[]');
                    if (!cancelled.includes(ev.id)) cancelled.push(ev.id);
                    localStorage.setItem('comum-cancelled-rsvps', JSON.stringify(cancelled));
                    const idx = MOCK_EVENTS.findIndex(x => x.id === ev.id);
                    if (idx > -1) MOCK_EVENTS.splice(idx, 1);
                }
                renderEvents();
                showToast('Attendance dibatalkan');
            }
        });
    });
    modal.querySelector('[data-action="similar"]')?.addEventListener('click', () => {
        window.location.href = 'events.html';
    });
}

// ============================================================
// Saved / Bookmarked Events (pulled from events-data.js + localStorage)
// ============================================================
function renderSavedEvents() {
    const emptyEl = document.getElementById('saved-events-empty');
    const listEl = document.getElementById('saved-events-list');
    const countEl = document.getElementById('saved-events-count');
    if (!listEl) return;

    const all = Array.isArray(window.COMUM_EVENTS) ? window.COMUM_EVENTS : [];
    const monthsShort = window.COMUM_MONTH_SHORT || ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    const bookmarkIds = JSON.parse(localStorage.getItem('comum-bookmarks') || '[]');
    const saved = all.filter(ev => bookmarkIds.includes(ev.id));

    if (countEl) countEl.textContent = saved.length;

    if (saved.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        listEl.style.display = 'none';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    listEl.style.display = '';

    const today = new Date(); today.setHours(0, 0, 0, 0);
    saved.sort((a, b) => new Date(a.date) - new Date(b.date));

    listEl.innerHTML = saved.map(ev => {
        const d = new Date(ev.date + 'T00:00:00');
        const isPast = d < today;
        return `
            <div class="event-item event-item-saved" data-saved-id="${ev.id}" role="button" tabindex="0">
                <div class="event-item-date">
                    <span class="month">${monthsShort[d.getMonth()]}</span>
                    <span class="day">${d.getDate()}</span>
                </div>
                <div class="event-item-info">
                    <h4>${ev.title}</h4>
                    <p><i data-lucide="map-pin"></i> ${ev.location} · ${ev.time}</p>
                </div>
                <div class="event-item-actions">
                    <span class="event-item-badge ${isPast ? 'badge-attended' : 'badge-upcoming'}">
                        ${isPast ? 'Lewat' : 'Upcoming'}
                    </span>
                    <button class="btn-icon event-item-unsave" data-event-id="${ev.id}" aria-label="Hapus dari tersimpan" title="Hapus dari tersimpan">
                        <i data-lucide="bookmark-x"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');

    if (window.lucide) lucide.createIcons();

    // Unsave
    listEl.querySelectorAll('.event-item-unsave').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.eventId);
            const current = JSON.parse(localStorage.getItem('comum-bookmarks') || '[]');
            const next = current.filter(bid => bid !== id);
            localStorage.setItem('comum-bookmarks', JSON.stringify(next));
            renderSavedEvents();
            showToast('Dihapus dari bookmark');
        });
    });

    // Click row → open event detail (reuse openEventDetail with shape-adapted data)
    listEl.querySelectorAll('.event-item-saved').forEach(row => {
        const open = () => {
            const id = parseInt(row.dataset.savedId);
            const ev = all.find(x => x.id === id);
            if (!ev) return;
            const d = new Date(ev.date + 'T00:00:00');
            openEventDetail({
                id: ev.id,
                title: ev.title,
                month: monthsShort[d.getMonth()],
                day: d.getDate(),
                location: ev.location,
                time: ev.time,
                status: d < today ? 'attended' : 'upcoming',
                image: ev.image,
                description: ev.description || `${ev.title} · ${ev.day} ${ev.time}`
            });
        };
        row.addEventListener('click', open);
        row.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
}

// ============================================================
// Wishlist — pulls product IDs from localStorage, looks them up in COMUM_PRODUCTS
// ============================================================
function renderWishlist() {
    const emptyEl = document.getElementById('wishlist-empty');
    const listEl = document.getElementById('wishlist-list');
    const countEl = document.getElementById('wishlist-count');
    if (!listEl) return;

    const ids = JSON.parse(localStorage.getItem('comum-wishlist') || '[]');
    const products = Array.isArray(window.COMUM_PRODUCTS) ? window.COMUM_PRODUCTS : [];
    const items = ids.map(id => products.find(p => p.id === id)).filter(Boolean);

    if (countEl) countEl.textContent = items.length;
    document.getElementById('stat-wishlist').textContent = items.length;

    if (items.length === 0) {
        if (emptyEl) emptyEl.style.display = '';
        listEl.style.display = 'none';
        listEl.innerHTML = '';
        return;
    }

    if (emptyEl) emptyEl.style.display = 'none';
    listEl.style.display = '';

    listEl.innerHTML = items.map(p => `
        <div class="wishlist-item" data-product-id="${p.id}">
            <div class="wishlist-item-image">
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="wishlist-item-info">
                <span class="wishlist-item-brand">${p.brand}</span>
                <h4>${p.name}</h4>
                <div class="wishlist-item-price">
                    <strong>${formatRupiah(p.price)}</strong>
                    ${p.originalPrice ? `<span class="wishlist-item-original">${formatRupiah(p.originalPrice)}</span>` : ''}
                </div>
            </div>
            <div class="wishlist-item-actions">
                <button class="btn btn-primary btn-sm wishlist-add-cart" data-id="${p.id}">
                    <i data-lucide="shopping-cart"></i> + Cart
                </button>
                <button class="btn-icon wishlist-remove" data-id="${p.id}" aria-label="Hapus dari wishlist" title="Hapus dari wishlist">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `).join('');

    if (window.lucide) lucide.createIcons();

    // Remove from wishlist
    listEl.querySelectorAll('.wishlist-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const cur = JSON.parse(localStorage.getItem('comum-wishlist') || '[]');
            const next = cur.filter(x => x !== id);
            localStorage.setItem('comum-wishlist', JSON.stringify(next));
            renderWishlist();
            showToast('Dihapus dari wishlist');
        });
    });

    // Add to cart
    listEl.querySelectorAll('.wishlist-add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(btn.dataset.id);
            const p = products.find(x => x.id === id);
            if (!p) return;
            const cart = JSON.parse(localStorage.getItem('comum-cart') || '[]');
            const existing = cart.find(c => c.id === p.id && c.type === 'buy');
            if (existing) {
                existing.quantity += 1;
            } else {
                cart.push({
                    lineId: Date.now(),
                    id: p.id, name: p.name, brand: p.brand, image: p.image,
                    category: p.category, unitPrice: p.price,
                    originalPrice: p.originalPrice || null,
                    quantity: 1, type: 'buy'
                });
            }
            localStorage.setItem('comum-cart', JSON.stringify(cart));
            showToast(`${p.name} ditambahkan ke cart`);
        });
    });

    // Click row → store (mock — no detail page for most products)
    listEl.querySelectorAll('.wishlist-item').forEach(row => {
        row.addEventListener('click', (e) => {
            if (e.target.closest('button')) return;
            window.location.href = 'store.html';
        });
    });
}

// ============================================================
// Rewards — points balance, redeem flow, tier highlight
// ============================================================
function renderRewards() {
    document.getElementById('rewards-points-display').textContent = currentUser.points.toLocaleString();

    // Tier info — rendered from TIERS so it stays in sync with perks
    const tierListEl = document.getElementById('tier-info-list');
    if (tierListEl) {
        const current = calculateTier(currentUser.points);
        tierListEl.innerHTML = ['rookie', 'crew', 'captain'].map(k => {
            const t = TIERS[k];
            const isCurrent = k === current;
            const range = t.max === Infinity
                ? `${t.min.toLocaleString()}+ poin`
                : `${t.min.toLocaleString()} - ${t.max.toLocaleString()} poin`;
            return `
                <div class="tier-info-card tier-${k} ${isCurrent ? 'is-current' : ''}">
                    <div class="tier-info-badge">${t.icon}</div>
                    <div class="tier-info-body">
                        <h4>${t.name}${isCurrent ? ' <span class="tier-info-now">Sekarang</span>' : ''}</h4>
                        <p>${range}</p>
                        <ul>
                            ${t.perks.map(p => `<li>${p.text}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }).join('');
    }

    const listEl = document.getElementById('points-list');
    const history = JSON.parse(localStorage.getItem('comum-points-history') || 'null') || MOCK_POINTS_HISTORY;
    listEl.innerHTML = history.map(p => `
        <div class="points-item">
            <div class="points-item-info">
                <h4>${p.title}</h4>
                <p>${p.date}</p>
            </div>
            <span class="points-amount ${p.type === 'earn' ? 'positive' : 'negative'}">
                ${p.type === 'earn' ? '+' : '-'}${p.amount}
            </span>
        </div>
    `).join('');

    // Claimable rewards — inline list with claim buttons (no modal)
    const claimEl = document.getElementById('rewards-claim-list');
    if (claimEl) {
        claimEl.innerHTML = CLAIMABLE_REWARDS.map(r => {
            const canAfford = currentUser.points >= r.cost;
            return `
                <div class="reward-claim-card reward-tint-${r.tint} ${canAfford ? '' : 'is-locked'}">
                    <div class="reward-claim-icon"><i data-lucide="${r.icon}"></i></div>
                    <div class="reward-claim-info">
                        <h4>${r.title}</h4>
                        <p>${r.desc}</p>
                    </div>
                    <div class="reward-claim-cta">
                        <span class="reward-claim-cost">${r.cost}<small> pts</small></span>
                        <button class="btn btn-sm reward-claim-btn ${canAfford ? 'btn-primary' : 'btn-ghost'}"
                                data-reward-id="${r.id}" ${canAfford ? '' : 'disabled'}>
                            ${canAfford ? 'Klaim' : 'Kurang poin'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        if (window.lucide) lucide.createIcons();

        claimEl.querySelectorAll('.reward-claim-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const r = CLAIMABLE_REWARDS.find(x => x.id === btn.dataset.rewardId);
                if (!r) return;
                confirmDialog({
                    title: `Klaim ${r.cost} poin?`,
                    message: `Kamu akan menukar ${r.cost} poin untuk "${r.title}". Lanjutkan?`,
                    okLabel: 'Ya, klaim',
                    iconName: 'gift',
                    onConfirm: () => claimReward(r)
                });
            });
        });
    }
}

function claimReward(r) {
    if (currentUser.points < r.cost) {
        showToast('Poin tidak cukup');
        return;
    }
    currentUser.points -= r.cost;
    saveUser();

    const history = JSON.parse(localStorage.getItem('comum-points-history') || 'null') || MOCK_POINTS_HISTORY.slice();
    history.unshift({
        title: `Klaim: ${r.title}`,
        date: formatDate(new Date().toISOString()),
        amount: r.cost,
        type: 'redeem'
    });
    localStorage.setItem('comum-points-history', JSON.stringify(history));

    renderProfile();
    renderRewards();
    showToast(`Berhasil klaim ${r.title}`);
}

// ============================================================
// Membership card → tier detail modal
// ============================================================
function initMembershipDetail() {
    const card = document.getElementById('membership-card');
    if (!card) return;
    card.addEventListener('click', () => {
        const current = calculateTier(currentUser.points);
        const tierKeys = ['rookie', 'crew', 'captain'];
        const body = `
            <div class="tier-detail-modal">
                <span class="modal-label">Membership</span>
                <h2 id="modal-title">Tier kamu: <strong>${TIERS[current].name}</strong></h2>
                <p class="modal-subline">Terus main dan belanja biar naik tier — perks makin oke!</p>

                <div class="tier-detail-list">
                    ${tierKeys.map(k => {
                        const t = TIERS[k];
                        const isCurrent = k === current;
                        return `
                            <div class="tier-detail-card tier-${k} ${isCurrent ? 'is-current' : ''}">
                                <div class="tier-detail-head">
                                    <span class="tier-detail-icon">${t.icon}</span>
                                    <div>
                                        <h4>${t.name} ${isCurrent ? '<span class="tier-detail-now">Sekarang</span>' : ''}</h4>
                                        <p>${t.min.toLocaleString()}${t.max === Infinity ? '+' : ' - ' + t.max.toLocaleString()} poin</p>
                                    </div>
                                </div>
                                <ul>
                                    ${t.perks.map(p => `<li><i data-lucide="${p.icon}"></i> ${p.text}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        openModal(body);
    });
}

// ============================================================
// Avatar color picker
// ============================================================
function initAvatarEdit() {
    const btn = document.getElementById('profile-avatar-btn');
    if (!btn) return;
    btn.addEventListener('click', () => {
        const body = `
            <div class="avatar-edit-modal">
                <span class="modal-label">Foto Profil</span>
                <h2 id="modal-title">Pilih gradient avatar</h2>
                <p class="modal-subline">Tap warna yang kamu suka, atau upload foto (coming soon).</p>

                <div class="avatar-gradient-grid">
                    ${AVATAR_GRADIENTS.map(g => `
                        <button class="avatar-swatch ${currentUser.avatarGradient === g.id ? 'selected' : ''}"
                                data-gradient-id="${g.id}"
                                style="background: ${g.bg}"
                                aria-label="Gradient ${g.id}"></button>
                    `).join('')}
                </div>

                <div class="modal-actions">
                    <button class="btn btn-ghost" data-action="upload-photo">
                        <i data-lucide="upload"></i> Upload foto
                    </button>
                    ${currentUser.avatarPhoto ? `<button class="btn btn-ghost btn-danger" data-action="remove-photo">
                        <i data-lucide="trash-2"></i> Hapus foto
                    </button>` : ''}
                </div>
                <input type="file" id="avatar-file-input" accept="image/*" style="display:none">
            </div>
        `;
        openModal(body);

        const modal = document.getElementById('profile-modal');
        modal.querySelectorAll('.avatar-swatch').forEach(s => {
            s.addEventListener('click', () => {
                modal.querySelectorAll('.avatar-swatch').forEach(x => x.classList.remove('selected'));
                s.classList.add('selected');
                currentUser.avatarGradient = s.dataset.gradientId;
                currentUser.avatarPhoto = null; // picking a gradient clears the photo
                saveUser();
                renderProfile();
                showToast('Avatar diupdate');
                setTimeout(closeModal, 600);
            });
        });
        const fileInput = modal.querySelector('#avatar-file-input');
        modal.querySelector('[data-action="upload-photo"]')?.addEventListener('click', () => fileInput?.click());
        fileInput?.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) return showToast('File harus berupa gambar');
            if (file.size > 2 * 1024 * 1024) return showToast('Ukuran max 2MB');
            const reader = new FileReader();
            reader.onload = (ev) => {
                currentUser.avatarPhoto = ev.target.result;
                saveUser();
                renderProfile();
                showToast('Foto profil diupdate');
                setTimeout(closeModal, 600);
            };
            reader.readAsDataURL(file);
        });
        modal.querySelector('[data-action="remove-photo"]')?.addEventListener('click', () => {
            currentUser.avatarPhoto = null;
            saveUser();
            renderProfile();
            showToast('Foto dihapus');
            setTimeout(closeModal, 400);
        });
    });
}

// ============================================================
// Settings — persist toggles, phone edit, password, delete
// ============================================================
function initSettings() {
    const nameInput = document.getElementById('settings-name');
    const phoneInput = document.getElementById('settings-phone');
    const emailInput = document.getElementById('settings-email');
    const hint = document.getElementById('settings-name-hint');

    if (nameInput) nameInput.value = currentUser.name || '';
    if (phoneInput) phoneInput.value = currentUser.phone || '';
    if (emailInput) emailInput.value = currentUser.email || '';

    // Render preferences summary
    const prefSummary = document.getElementById('settings-prefs-summary');
    if (prefSummary) {
        const p = currentUser.preferences;
        if (!p || p.skipped || (!p.sport && !p.level && !p.city)) {
            prefSummary.innerHTML = '<span class="settings-prefs-empty">Belum diisi — bantu kami sesuaikan feed kamu</span>';
        } else {
            const sportLabel = { padel: 'Padel', cycling: 'Cycling', both: 'Padel + Cycling' }[p.sport] || '—';
            const levelLabel = { pemula: 'Pemula', intermediate: 'Intermediate', advanced: 'Advanced' }[p.level] || '—';
            const cityLabel = p.city ? p.city.charAt(0).toUpperCase() + p.city.slice(1) : '—';
            prefSummary.innerHTML = `
                <span class="pref-chip"><i data-lucide="dumbbell"></i> ${sportLabel}</span>
                <span class="pref-chip"><i data-lucide="trending-up"></i> ${levelLabel}</span>
                <span class="pref-chip"><i data-lucide="map-pin"></i> ${cityLabel}</span>
            `;
            if (window.lucide) lucide.createIcons();
        }
    }

    // Live name validation hint
    nameInput?.addEventListener('input', () => {
        const v = nameInput.value.trim();
        if (v.length === 0) { hint.textContent = ''; hint.className = 'settings-field-hint'; }
        else if (v.length < 2) { hint.textContent = 'Nama minimal 2 karakter'; hint.className = 'settings-field-hint is-error'; }
        else { hint.textContent = 'Looks good ✓'; hint.className = 'settings-field-hint is-ok'; }
    });

    // Phone edit enable
    document.getElementById('edit-phone-btn')?.addEventListener('click', () => {
        if (!phoneInput) return;
        phoneInput.disabled = !phoneInput.disabled;
        if (!phoneInput.disabled) {
            phoneInput.focus();
            phoneInput.select();
            showToast('Phone number bisa diedit. Jangan lupa Simpan.');
        }
    });

    // Save profile
    document.getElementById('save-profile')?.addEventListener('click', () => {
        const newName = nameInput?.value.trim();
        const newPhone = phoneInput?.value.trim();
        const newEmail = emailInput?.value.trim();
        if (!newName || newName.length < 2) {
            showToast('Nama terlalu pendek');
            return;
        }
        if (newEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
            showToast('Email nggak valid');
            return;
        }
        currentUser.name = newName;
        currentUser.phone = newPhone || currentUser.phone;
        currentUser.email = newEmail || currentUser.email;
        saveUser();
        renderProfile();
        if (phoneInput) phoneInput.disabled = true;
        showToast('Profil berhasil disimpan');
    });

    // Notification toggles — load & persist
    const storedPrefs = JSON.parse(localStorage.getItem('comum-notif-prefs') || '{}');
    document.querySelectorAll('input[data-pref]').forEach(input => {
        const key = input.dataset.pref;
        if (key in storedPrefs) input.checked = !!storedPrefs[key];
        input.addEventListener('change', () => {
            const prefs = JSON.parse(localStorage.getItem('comum-notif-prefs') || '{}');
            prefs[key] = input.checked;
            localStorage.setItem('comum-notif-prefs', JSON.stringify(prefs));
            showToast(`Notifikasi ${input.checked ? 'aktif' : 'off'}`);
        });
    });

    // Change password — mock
    document.getElementById('change-password-btn')?.addEventListener('click', () => {
        const body = `
            <div class="password-modal">
                <span class="modal-label">Keamanan</span>
                <h2 id="modal-title">Ganti password</h2>
                <p class="modal-subline">Masukkan password lama lalu buat yang baru.</p>
                <div class="settings-form">
                    <div class="settings-field">
                        <label>Password lama</label>
                        <input type="password" id="pw-old" placeholder="••••••••">
                    </div>
                    <div class="settings-field">
                        <label>Password baru</label>
                        <input type="password" id="pw-new" placeholder="Min. 8 karakter">
                    </div>
                    <div class="settings-field">
                        <label>Konfirmasi password baru</label>
                        <input type="password" id="pw-confirm" placeholder="Ulangi password baru">
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-ghost" data-action="pw-cancel">Batal</button>
                    <button class="btn btn-primary" data-action="pw-save">
                        <i data-lucide="save"></i> Simpan password
                    </button>
                </div>
            </div>
        `;
        openModal(body);
        const modal = document.getElementById('profile-modal');
        modal.querySelector('[data-action="pw-cancel"]').addEventListener('click', closeModal);
        modal.querySelector('[data-action="pw-save"]').addEventListener('click', () => {
            const o = modal.querySelector('#pw-old').value.trim();
            const n = modal.querySelector('#pw-new').value.trim();
            const c = modal.querySelector('#pw-confirm').value.trim();
            if (!o || !n || !c) return showToast('Semua field harus diisi');
            if (n.length < 8) return showToast('Password min. 8 karakter');
            if (n !== c) return showToast('Konfirmasi password tidak cocok');
            closeModal();
            showToast('Password berhasil diganti');
        });
    });

    // Manage sessions — persisted revocations
    document.getElementById('manage-sessions-btn')?.addEventListener('click', () => {
        const allDevices = [
            { id: 'win-chrome', name: 'Chrome — Windows', location: 'Jakarta', now: true },
            { id: 'iphone-safari', name: 'Safari — iPhone 15', location: 'Jakarta', now: false },
            { id: 'ipad-chrome', name: 'Chrome — iPad', location: 'Bandung', now: false }
        ];
        const revoked = JSON.parse(localStorage.getItem('comum-revoked-sessions') || '[]');
        const body = `
            <div class="sessions-modal">
                <span class="modal-label">Perangkat aktif</span>
                <h2 id="modal-title">Device yang login</h2>
                <p class="modal-subline">Kalau ada yang nggak kamu kenal, langsung logout.</p>
                <div class="sessions-list">
                    ${allDevices.map(d => {
                        const isRevoked = revoked.includes(d.id);
                        return `
                            <div class="session-item" data-session-id="${d.id}" style="${isRevoked ? 'opacity:0.4' : ''}">
                                <div class="session-icon"><i data-lucide="monitor"></i></div>
                                <div class="session-info">
                                    <h4>${d.name} ${d.now ? '<span class="session-now">Saat ini</span>' : ''}</h4>
                                    <p>${d.location}</p>
                                </div>
                                ${d.now ? '' : `<button class="btn btn-ghost btn-sm session-revoke" data-device-id="${d.id}" ${isRevoked ? 'disabled' : ''}>${isRevoked ? 'Revoked' : 'Revoke'}</button>`}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        openModal(body);
        document.querySelectorAll('.session-revoke').forEach(b => {
            b.addEventListener('click', () => {
                const id = b.dataset.deviceId;
                const cur = JSON.parse(localStorage.getItem('comum-revoked-sessions') || '[]');
                if (!cur.includes(id)) cur.push(id);
                localStorage.setItem('comum-revoked-sessions', JSON.stringify(cur));
                b.closest('.session-item').style.opacity = '0.4';
                b.disabled = true;
                b.textContent = 'Revoked';
                showToast('Session di-revoke');
            });
        });
    });

    // Logout
    document.getElementById('logout-btn')?.addEventListener('click', () => {
        confirmDialog({
            title: 'Logout?',
            message: 'Kamu perlu login lagi buat akses profil.',
            okLabel: 'Ya, logout',
            iconName: 'log-out',
            onConfirm: () => {
                // Full reset for easy re-testing of the signup flow
                ['comum-user', 'comum-users', 'comum-cart', 'comum-bookmarks',
                 'comum-wishlist', 'comum-points-history'].forEach(k => localStorage.removeItem(k));
                window.location.href = 'login.html';
            }
        });
    });

    // Delete account
    document.getElementById('delete-account-btn')?.addEventListener('click', () => {
        confirmDialog({
            title: 'Hapus akun permanen?',
            message: 'Semua data — pesanan, poin, RSVP — akan dihapus dan tidak bisa dikembalikan.',
            okLabel: 'Hapus akun',
            okDanger: true,
            iconName: 'trash-2',
            iconDanger: true,
            onConfirm: () => {
                localStorage.removeItem('comum-user');
                localStorage.removeItem('comum-bookmarks');
                localStorage.removeItem('comum-wishlist');
                localStorage.removeItem('comum-cart');
                localStorage.removeItem('comum-notif-prefs');
                localStorage.removeItem('comum-points-history');
                window.location.href = 'index.html';
            }
        });
    });
}

// ============================================================
// Modal (generic) — openModal / closeModal
// ============================================================
function initModal() {
    const modal = document.getElementById('profile-modal');
    const confirmModal = document.getElementById('confirm-modal');
    if (!modal) return;

    modal.querySelector('.modal-close')?.addEventListener('click', closeModal);
    modal.querySelector('.modal-backdrop')?.addEventListener('click', closeModal);
    confirmModal?.querySelector('.modal-backdrop')?.addEventListener('click', closeConfirm);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
            closeConfirm();
        }
    });
}

function openModal(html) {
    const modal = document.getElementById('profile-modal');
    const body = document.getElementById('modal-body');
    if (!modal || !body) return;
    body.innerHTML = html;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();
}

function closeModal() {
    const modal = document.getElementById('profile-modal');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
}

// ============================================================
// Confirm dialog (destructive actions)
// ============================================================
function confirmDialog({ title, message, okLabel = 'OK', okDanger = false, iconName = 'alert-triangle', iconDanger = false, onConfirm }) {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;

    document.getElementById('confirm-title').textContent = title;
    document.getElementById('confirm-message').textContent = message;
    const okBtn = document.getElementById('confirm-ok');
    const cancelBtn = document.getElementById('confirm-cancel');
    const iconEl = document.getElementById('confirm-icon');

    okBtn.textContent = okLabel;
    okBtn.classList.toggle('btn-danger-solid', !!okDanger);
    okBtn.classList.toggle('btn-primary', !okDanger);
    iconEl.classList.toggle('confirm-icon-danger', !!iconDanger);
    iconEl.innerHTML = `<i data-lucide="${iconName}"></i>`;

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if (window.lucide) lucide.createIcons();

    // Replace listeners by cloning (simple way to avoid stacking)
    const freshOk = okBtn.cloneNode(true);
    const freshCancel = cancelBtn.cloneNode(true);
    okBtn.replaceWith(freshOk);
    cancelBtn.replaceWith(freshCancel);

    freshOk.addEventListener('click', () => {
        closeConfirm();
        if (typeof onConfirm === 'function') onConfirm();
    });
    freshCancel.addEventListener('click', closeConfirm);
}

function closeConfirm() {
    const modal = document.getElementById('confirm-modal');
    if (!modal) return;
    modal.classList.remove('open');
    // Only restore body overflow if the main modal isn't open too
    if (!document.getElementById('profile-modal')?.classList.contains('open')) {
        document.body.style.overflow = '';
    }
}

// ============================================================
// Google Calendar URL builder
// ============================================================
function buildGoogleCalendarUrl(ev) {
    // Build a start Date from event month/day + time (assume current year if not given)
    const year = new Date().getFullYear();
    const monthMap = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MEI: 4, MAY: 4, JUN: 5, JUL: 6, AGU: 7, AUG: 7, SEP: 8, OKT: 9, OCT: 9, NOV: 10, DES: 11, DEC: 11 };
    const m = monthMap[(ev.month || '').toUpperCase()] ?? 3;
    const d = parseInt(ev.day, 10) || 1;
    const [hh = '06', mm = '00'] = (ev.time || '06:00').split(':');
    const start = new Date(year, m, d, parseInt(hh, 10), parseInt(mm, 10));
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const fmt = (dt) => dt.toISOString().replace(/[-:]|\.\d{3}/g, '');
    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: ev.title || 'Comum Event',
        dates: `${fmt(start)}/${fmt(end)}`,
        details: ev.description || '',
        location: ev.location || ''
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ============================================================
// Printable invoice window
// ============================================================
function openInvoiceWindow(order) {
    const itemsRows = (order.items || []).map(it => `
        <tr>
            <td>${it.name}</td>
            <td style="text-align:center">${it.qty}</td>
            <td style="text-align:right">${formatRupiah(it.price)}</td>
            <td style="text-align:right">${formatRupiah(it.price * it.qty)}</td>
        </tr>
    `).join('');

    const html = `
        <!DOCTYPE html>
        <html><head><meta charset="UTF-8"><title>Invoice ${order.id}</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 720px; margin: 40px auto; padding: 40px; color: #0F172A; }
            h1 { margin: 0 0 4px; letter-spacing: -0.02em; }
            .muted { color: #64748B; font-size: 14px; }
            .invoice-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #0F172A; }
            .logo { font-size: 28px; font-weight: 800; }
            table { width: 100%; border-collapse: collapse; margin: 24px 0; }
            th, td { padding: 12px; border-bottom: 1px solid #E2E8F0; font-size: 14px; }
            th { text-align: left; background: #F8FAFC; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #64748B; }
            .total-row td { border-top: 2px solid #0F172A; border-bottom: none; font-weight: 700; font-size: 16px; padding-top: 16px; }
            .points-row { background: #EFF6FF; }
            .points-row td { color: #0066FF; font-weight: 600; }
            .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #E2E8F0; font-size: 12px; color: #64748B; text-align: center; }
            @media print { body { margin: 0; padding: 24px; } }
        </style></head>
        <body>
            <div class="invoice-head">
                <div>
                    <div class="logo">comum.</div>
                    <p class="muted">Jakarta, Indonesia<br>hello@comum.id</p>
                </div>
                <div style="text-align:right">
                    <h1>INVOICE</h1>
                    <p class="muted">${order.id}<br>${order.date}</p>
                </div>
            </div>

            <div>
                <strong>Ditagihkan kepada</strong>
                <p class="muted">${currentUser.name}<br>${currentUser.phone}${currentUser.email ? '<br>' + currentUser.email : ''}</p>
            </div>

            <table>
                <thead><tr>
                    <th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Harga</th><th style="text-align:right">Subtotal</th>
                </tr></thead>
                <tbody>
                    ${itemsRows}
                    <tr class="total-row"><td colspan="3">Total</td><td style="text-align:right">${formatRupiah(order.amount)}</td></tr>
                    <tr class="points-row"><td colspan="3">Poin earned</td><td style="text-align:right">+${order.points} pts</td></tr>
                </tbody>
            </table>

            ${order.tracking ? `<p class="muted">No. Resi: <strong>${order.tracking}</strong></p>` : ''}

            <div class="footer">Terima kasih sudah belanja di Comum. Invoice ini sah tanpa tanda tangan.</div>
            <script>window.onload = () => setTimeout(() => window.print(), 300);<\/script>
        </body></html>
    `;
    const w = window.open('', '_blank', 'width=800,height=900');
    if (!w) return showToast('Pop-up diblokir browser');
    w.document.open();
    w.document.write(html);
    w.document.close();
    closeModal();
}

// ============================================================
// Toast
// ============================================================
let toastTimeout;
function showToast(msg) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}
