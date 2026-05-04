// ============================================================
// Padel Simulator Booking Page
// ============================================================

const PS_CONFIG = {
    name: 'Padel Simulator',
    location: 'Comum Alam Sutera',
    durationMinutes: 60,
    priceOriginal: 155000,
    priceDiscount: 99000,
    image: './Asset/WebP_Fasilitas_3D/padelsim_result.webp',
    slots: [
        '10:00', '11:00', '12:00', '13:00',
        '14:00', '15:00', '16:00', '17:00', '18:00'
    ],
    daysAhead: 14
};

const RACKET_OPTIONS = [
    // Page 1
    { id: 'bullpadel-hack',  name: 'Bullpadel Hack 04',       level: 'All-round · Intermediate', img: './Asset/Store_Items/Padel_Rackets/Bullpadel-Hack-04-Padel-Racket.webp',        unavailable: false },
    { id: 'babolat-viper',   name: 'Babolat Technical Viper', level: 'Power · Intermediate',     img: './Asset/Store_Items/Padel_Rackets/Babolat-Technical-Viper-Padel-Racket.webp', unavailable: false },
    { id: 'head-speed',      name: 'Head Speed',               level: 'Control · Advanced',       img: './Asset/Store_Items/Padel_Rackets/Head-Speed-Padel-Racket.webp',              unavailable: false },
    // Page 2
    { id: 'nox-at10',        name: 'Nox AT10 Genius',          level: 'Power · Advanced',         img: './Asset/Store_Items/Padel_Rackets/Nox-AT10-Genius-Padel-Racket-White.webp',  unavailable: true  },
    { id: 'adidas-metalbone',name: 'Adidas Metalbone HRD',     level: 'Power · Advanced',         img: './Asset/Store_Items/Padel_Rackets/Adidas-Metalbone-HRD-Padel-Racket.webp',   unavailable: true  },
    { id: 'bullpadel-vertex',name: 'Bullpadel Vertex 04',      level: 'Defense · Intermediate',   img: './Asset/Store_Items/Padel_Rackets/Bullpadel-Vertex-04-Padel-Racket.webp',    unavailable: false },
];
const RACKETS_PER_PAGE = 6;   // 2 rows × 3 cols

const DAY_NAMES   = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTH_NAMES = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];
const MONTH_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'];

// ---- state ----
let psState = {
    selectedDateISO: null,
    selectedSlots: [],    // multi-select — array of time strings e.g. ['10:00','11:00']
    dateOffset: 0,
    addonChoice: 'own',   // 'own' | 'rent'
    racketOption: null,   // null | { id, name, durationHours, price, label }
    calendarVisible: false,
    calendarYear: null,
    calendarMonth: null,
    // modal state
    modalRacketId: null,
    modalDurHours: 1,
    modalDurPrice: 60000,
    racketPage: 0,        // current pagination page
};

// ---- helpers ----
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function dateToISO(d) {
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function isoToDate(iso) {
    const [y, m, d] = iso.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function todayISO() { return dateToISO(new Date()); }

function formatDateHuman(iso) {
    if (!iso) return '—';
    const d = isoToDate(iso);
    return `${DAY_NAMES[d.getDay()]}, ${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function getSlotEnd(slot) {
    return (parseInt(slot) + 1).toString().padStart(2, '0') + ':00';
}

function buildTimeLabel(slots) {
    if (!slots || slots.length === 0) return 'Belum dipilih';
    const sorted = [...slots].sort();
    if (sorted.length === 1) return `${sorted[0]} – ${getSlotEnd(sorted[0])}`;
    // Consecutive check
    const isConsec = sorted.every((s, i) => i === 0 || parseInt(s) - parseInt(sorted[i - 1]) === 1);
    if (isConsec) return `${sorted[0]} – ${getSlotEnd(sorted[sorted.length - 1])} (${sorted.length} jam)`;
    return sorted.join(', ') + ` (${sorted.length} sesi)`;
}

function buildDates(offset) {
    const out = [];
    const today = new Date(); today.setHours(0,0,0,0);
    for (let i = 0; i < PS_CONFIG.daysAhead; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + offset + i);
        out.push(d);
    }
    return out;
}

// ---- Cart helpers ----
function getCart() { return JSON.parse(localStorage.getItem('comum-cart') || '[]'); }
function saveCart(c) { localStorage.setItem('comum-cart', JSON.stringify(c)); syncCartBadge(); }
function syncCartBadge() {
    const n = getCart().reduce((s,i) => s + i.quantity, 0);
    document.querySelectorAll('.cart-count, #cart-count').forEach(el => el.textContent = n);
}
function getCurrentUser() {
    try { return JSON.parse(localStorage.getItem('comum-user') || 'null'); }
    catch(_) { return null; }
}

// ---- Toast ----
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

// ============================================================
// Date strip + slide animation
// ============================================================
function renderDateStrip() {
    const strip = document.getElementById('ps-date-strip');
    if (!strip) return;
    const today = todayISO();
    strip.innerHTML = buildDates(psState.dateOffset).map(d => {
        const iso = dateToISO(d);
        const isActive = iso === psState.selectedDateISO;
        const isToday  = iso === today;
        return `<button class="ps-date-pill ${isActive ? 'is-active' : ''}" data-iso="${iso}" type="button">
            <span class="ps-date-day">${DAY_NAMES[d.getDay()]}</span>
            <span class="ps-date-num">${d.getDate()}</span>
            <span class="ps-date-mon">${MONTH_SHORT[d.getMonth()]}</span>
            ${isToday && !isActive ? '<span class="ps-date-today-dot"></span>' : ''}
        </button>`;
    }).join('');

    strip.querySelectorAll('.ps-date-pill').forEach(btn => {
        btn.addEventListener('click', () => {
            psState.selectedDateISO = btn.dataset.iso;
            psState.selectedSlots = [];
            renderDateStrip();
            renderSlots();
            updateSummary();
            // sync calendar selection without toggling visibility
            if (psState.calendarVisible) renderCalendarGrid();
        });
    });
}

function animateDateStrip(direction) {
    const strip  = document.getElementById('ps-date-strip');
    if (!strip) return;

    const out = direction === 'next' ? '-48px' : '48px';
    const inX = direction === 'next' ? '48px'  : '-48px';

    strip.style.transition = 'transform 220ms var(--ease-out-expo), opacity 180ms ease';
    strip.style.transform  = `translateX(${out})`;
    strip.style.opacity    = '0';

    setTimeout(() => {
        psState.dateOffset = Math.max(0, psState.dateOffset + (direction === 'next' ? 7 : -7));
        renderDateStrip();
        strip.style.transition = 'none';
        strip.style.transform  = `translateX(${inX})`;
        strip.style.opacity    = '0';

        requestAnimationFrame(() => requestAnimationFrame(() => {
            strip.style.transition = 'transform 260ms var(--ease-out-expo), opacity 200ms ease';
            strip.style.transform  = 'translateX(0)';
            strip.style.opacity    = '1';
        }));
    }, 190);
}

// ============================================================
// Slot grid
// ============================================================
function renderSlots() {
    const grid    = document.getElementById('ps-slot-grid');
    const countEl = document.getElementById('ps-slot-count');
    if (!grid) return;

    const now = new Date();
    const todayStr = todayISO();
    const isToday  = psState.selectedDateISO === todayStr;
    const nowMin   = now.getHours() * 60 + now.getMinutes();

    const slots = PS_CONFIG.slots.map(t => {
        const [h] = t.split(':').map(Number);
        return { time: t, past: isToday && (h * 60) <= nowMin };
    });

    const available = slots.filter(s => !s.past).length;
    if (countEl) countEl.textContent = available;

    grid.innerHTML = slots.map(s => {
        const endH = getSlotEnd(s.time);
        const sel  = psState.selectedSlots.includes(s.time);
        return `<button class="ps-slot-card ${sel ? 'is-selected' : ''} ${s.past ? 'is-disabled' : ''}"
                        data-slot="${s.time}" type="button" ${s.past ? 'disabled' : ''}>
            <span class="ps-slot-duration">${PS_CONFIG.durationMinutes} Menit</span>
            <span class="ps-slot-time">${s.time} – ${endH}</span>
            <span class="ps-slot-original">${formatRupiah(PS_CONFIG.priceOriginal)}</span>
            <span class="ps-slot-price">${formatRupiah(PS_CONFIG.priceDiscount)}</span>
        </button>`;
    }).join('');

    grid.querySelectorAll('.ps-slot-card:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => {
            const slot = btn.dataset.slot;
            const idx  = psState.selectedSlots.indexOf(slot);
            if (idx === -1) psState.selectedSlots.push(slot);
            else            psState.selectedSlots.splice(idx, 1);
            renderSlots();
            updateSummary();
        });
    });
}

// ============================================================
// Calendar
// ============================================================
function renderCalendarGrid() {
    const grid  = document.getElementById('ps-cal-grid');
    const title = document.getElementById('ps-cal-title');
    if (!grid || !title) return;

    const y = psState.calendarYear;
    const m = psState.calendarMonth;
    title.textContent = `${MONTH_NAMES[m]} ${y}`;

    const today = new Date(); today.setHours(0,0,0,0);
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const dows = ['Min','Sen','Sel','Rab','Kam','Jum','Sab'];
    let html = dows.map(d => `<span class="ps-cal-dow">${d}</span>`).join('');

    // empty cells before the 1st
    for (let i = 0; i < firstDay; i++) {
        html += `<span class="ps-cal-day is-empty"></span>`;
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(y, m, d);
        const iso  = dateToISO(date);
        const past = date < today;
        const isActive = iso === psState.selectedDateISO;
        const isToday  = iso === todayISO();
        const cls = [
            'ps-cal-day',
            isActive ? 'is-active' : '',
            isToday && !isActive ? 'is-today' : '',
        ].filter(Boolean).join(' ');

        if (past) {
            html += `<button class="ps-cal-day" disabled>${d}</button>`;
        } else {
            html += `<button class="${cls}" data-iso="${iso}" type="button">${d}</button>`;
        }
    }

    grid.innerHTML = html;
    if (window.lucide) lucide.createIcons();

    grid.querySelectorAll('.ps-cal-day[data-iso]').forEach(btn => {
        btn.addEventListener('click', () => {
            psState.selectedDateISO = btn.dataset.iso;
            psState.selectedSlots = [];
            renderDateStrip();
            renderCalendarGrid();
            renderSlots();
            updateSummary();
            // auto-close after pick
            toggleCalendar(false);
        });
    });
}

function toggleCalendar(forceState) {
    const cal = document.getElementById('ps-calendar');
    if (!cal) return;
    psState.calendarVisible = forceState !== undefined ? forceState : !psState.calendarVisible;

    if (psState.calendarVisible) {
        const sel = psState.selectedDateISO ? isoToDate(psState.selectedDateISO) : new Date();
        psState.calendarYear  = sel.getFullYear();
        psState.calendarMonth = sel.getMonth();
        cal.hidden = false;
        renderCalendarGrid();
    } else {
        cal.hidden = true;
    }
}

// ============================================================
// Addon two-card toggle
// ============================================================
function setAddonChoice(choice) {
    psState.addonChoice = choice;
    const ownBtn  = document.getElementById('ps-addon-own');
    const rentBtn = document.getElementById('ps-addon-rent-btn');
    ownBtn?.classList.toggle('is-selected', choice === 'own');
    rentBtn?.classList.toggle('is-selected', choice === 'rent');

    if (choice === 'own') {
        psState.racketOption = null;
        updateRentCardLabel();
    }
    updateSummary();
}

function updateRentCardLabel() {
    const descEl  = document.getElementById('ps-addon-rent-desc');
    const priceEl = document.getElementById('ps-addon-rent-price');
    if (!descEl || !priceEl) return;
    if (psState.racketOption) {
        descEl.textContent   = `${psState.racketOption.name} · ${psState.racketOption.durationHours} jam`;
        priceEl.innerHTML    = formatRupiah(psState.racketOption.price);
    } else {
        descEl.textContent   = 'Pilih raket yang tersedia →';
        priceEl.innerHTML    = '+Rp 60.000<small>/jam</small>';
    }
    if (window.lucide) lucide.createIcons();
}

// ============================================================
// Racket modal
// ============================================================
function openRacketModal() {
    document.getElementById('ps-racket-overlay').hidden = false;
    document.getElementById('ps-racket-modal').hidden   = false;

    // restore prior selection
    if (psState.racketOption) {
        psState.modalRacketId = psState.racketOption.id;
        setModalDur(psState.racketOption.durationHours, psState.racketOption.price);
    } else {
        psState.modalRacketId = null;
        setModalDur(1, 60000);
    }
    // jump to page containing pre-selected racket
    if (psState.modalRacketId) {
        const idx = RACKET_OPTIONS.findIndex(r => r.id === psState.modalRacketId);
        psState.racketPage = idx >= 0 ? Math.floor(idx / RACKETS_PER_PAGE) : 0;
    } else {
        psState.racketPage = 0;
    }

    renderRacketGrid();
    if (window.lucide) lucide.createIcons();
}

function closeRacketModal() {
    document.getElementById('ps-racket-overlay').hidden = true;
    document.getElementById('ps-racket-modal').hidden   = true;
}

function renderRacketGrid() {
    const grid    = document.getElementById('ps-racket-grid');
    const pagNav  = document.getElementById('ps-racket-pagination');
    if (!grid || !pagNav) return;

    const totalPages = Math.ceil(RACKET_OPTIONS.length / RACKETS_PER_PAGE);
    const pageRackets = RACKET_OPTIONS.slice(
        psState.racketPage * RACKETS_PER_PAGE,
        (psState.racketPage + 1) * RACKETS_PER_PAGE
    );

    // Racket cards
    grid.innerHTML = pageRackets.map(r => `
        <button type="button"
            class="ps-racket-opt ${r.unavailable ? 'is-unavailable' : ''} ${psState.modalRacketId === r.id ? 'is-selected' : ''}"
            data-racket-id="${r.id}" ${r.unavailable ? 'disabled' : ''}>
            <div class="ps-racket-img-wrap">
                <img src="${r.img}" alt="${r.name}" loading="lazy">
            </div>
            <div class="ps-racket-info">
                <strong>${r.name}</strong>
                <span>${r.level}</span>
                ${r.unavailable ? '<span class="ps-racket-unavail-badge">Sedang disewa</span>' : ''}
            </div>
        </button>
    `).join('');

    // Arrow pagination — only shown when there are multiple pages
    if (totalPages <= 1) {
        pagNav.innerHTML = '';
    } else {
        pagNav.innerHTML = `
            <button type="button" class="ps-racket-arrow-btn" data-pag-dir="prev"
                    ${psState.racketPage === 0 ? 'disabled' : ''} aria-label="Sebelumnya">
                <i data-lucide="chevron-left"></i>
            </button>
            <span class="ps-racket-page-indicator">${psState.racketPage + 1} / ${totalPages}</span>
            <button type="button" class="ps-racket-arrow-btn" data-pag-dir="next"
                    ${psState.racketPage >= totalPages - 1 ? 'disabled' : ''} aria-label="Berikutnya">
                <i data-lucide="chevron-right"></i>
            </button>
        `;
        pagNav.querySelectorAll('.ps-racket-arrow-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (btn.dataset.pagDir === 'prev') psState.racketPage = Math.max(0, psState.racketPage - 1);
                else psState.racketPage = Math.min(totalPages - 1, psState.racketPage + 1);
                renderRacketGrid();
            });
        });
    }

    // Bind racket card clicks
    grid.querySelectorAll('.ps-racket-opt:not([disabled])').forEach(btn => {
        btn.addEventListener('click', () => setModalRacket(btn.dataset.racketId));
    });

    if (window.lucide) lucide.createIcons();
}

function setModalRacket(id) {
    psState.modalRacketId = id;
    document.getElementById('ps-racket-ok').disabled = !id;
    // re-render to update selected highlight
    renderRacketGrid();
}

function setModalDur(hours, price) {
    psState.modalDurHours = hours;
    psState.modalDurPrice = price;
    document.querySelectorAll('.ps-dur-opt').forEach(btn => {
        btn.classList.toggle('is-selected', parseInt(btn.dataset.dur) === hours);
    });
}

function confirmRacket() {
    if (!psState.modalRacketId) return;
    const racket = RACKET_OPTIONS.find(r => r.id === psState.modalRacketId);
    if (!racket) return;
    psState.racketOption = {
        id:            racket.id,
        name:          racket.name,
        durationHours: psState.modalDurHours,
        price:         psState.modalDurPrice,
        label:         `${racket.name} · ${psState.modalDurHours} jam · ${formatRupiah(psState.modalDurPrice)}`
    };
    psState.addonChoice = 'rent';
    closeRacketModal();
    setAddonChoice('rent');   // syncs card highlight
    updateRentCardLabel();
    updateSummary();
}

// ============================================================
// Summary
// ============================================================
function getRacketCost() {
    return psState.racketOption ? psState.racketOption.price : 0;
}
function getSlotCount() {
    return Math.max(1, psState.selectedSlots.length);  // at least 1 for preview price
}
function getTotalPrice() {
    return PS_CONFIG.priceDiscount * getSlotCount() + getRacketCost();
}

function updateSummary() {
    const sumDate   = document.getElementById('ps-sum-date');
    const sumTime   = document.getElementById('ps-sum-time');
    const sumRacket = document.getElementById('ps-sum-racket');
    const sumOrig   = document.getElementById('ps-sum-original');
    const sumTotal  = document.getElementById('ps-sum-total');
    const racketRow = document.getElementById('ps-sum-line-racket-row');
    const racketLine= document.getElementById('ps-sum-line-racket');
    const cta       = document.getElementById('ps-book-cta');
    const note      = document.querySelector('.ps-summary-note');

    // slot selected badge in the toggle header
    const badge      = document.getElementById('ps-slot-selected-badge');
    const badgeCount = document.getElementById('ps-slot-selected-count');
    if (badge && badgeCount) {
        const n = psState.selectedSlots.length;
        badge.hidden       = n === 0;
        badgeCount.textContent = n;
    }
    const stickyLabel = document.getElementById('ps-sticky-label');
    const stickyPrice = document.getElementById('ps-sticky-price');
    const stickyBtn   = document.getElementById('ps-sticky-btn');

    if (sumDate) sumDate.textContent = formatDateHuman(psState.selectedDateISO);

    if (sumRacket) {
        sumRacket.textContent = psState.racketOption
            ? `${psState.racketOption.name} (${psState.racketOption.durationHours} jam)`
            : 'Pakai sendiri';
    }

    if (racketRow && racketLine) {
        if (psState.racketOption) {
            racketRow.style.display = '';
            racketLine.textContent = formatRupiah(psState.racketOption.price);
        } else {
            racketRow.style.display = 'none';
        }
    }

    const slotCount    = psState.selectedSlots.length;
    const total        = PS_CONFIG.priceDiscount * slotCount + getRacketCost();
    const origTotal    = PS_CONFIG.priceOriginal  * slotCount + getRacketCost();
    const previewTotal = PS_CONFIG.priceDiscount  + getRacketCost();   // 1-slot preview

    if (sumOrig)  sumOrig.textContent  = formatRupiah(slotCount > 0 ? origTotal : PS_CONFIG.priceOriginal + getRacketCost());
    if (sumTotal) sumTotal.textContent = formatRupiah(slotCount > 0 ? total : previewTotal);

    const timeLabel = buildTimeLabel(psState.selectedSlots);
    if (sumTime) sumTime.textContent = timeLabel;

    if (slotCount > 0) {
        if (cta)  cta.disabled  = false;
        if (note) note.style.display = 'none';
        const shortDate = formatDateHuman(psState.selectedDateISO);
        if (stickyLabel) stickyLabel.textContent = slotCount === 1
            ? `${shortDate} · ${psState.selectedSlots[0]}`
            : `${shortDate} · ${slotCount} sesi`;
        if (stickyPrice) stickyPrice.textContent = formatRupiah(total);
        if (stickyBtn)   stickyBtn.disabled = false;
    } else {
        if (cta)  cta.disabled  = true;
        if (note) note.style.display = '';
        if (stickyLabel) stickyLabel.textContent = psState.selectedDateISO
            ? `${formatDateHuman(psState.selectedDateISO)} · pilih waktu`
            : 'Pilih jadwal';
        if (stickyPrice) stickyPrice.textContent = `Mulai ${formatRupiah(previewTotal)}`;
        if (stickyBtn)   stickyBtn.disabled = true;
    }

    if (window.lucide) lucide.createIcons();
}

// ============================================================
// Book handler
// ============================================================
function handleBook() {
    if (!psState.selectedDateISO || psState.selectedSlots.length === 0) return;

    const user = getCurrentUser();
    if (!user) {
        location.href = 'login.html?next=' + encodeURIComponent(location.pathname + location.search);
        return;
    }

    const slotCount  = psState.selectedSlots.length;
    const racketCost = getRacketCost();
    const total      = PS_CONFIG.priceDiscount * slotCount + racketCost;
    const origTotal  = PS_CONFIG.priceOriginal  * slotCount + racketCost;
    const bookingTime = buildTimeLabel(psState.selectedSlots);

    const racketLabel = psState.racketOption
        ? `Sewa raket: ${psState.racketOption.name} (${psState.racketOption.durationHours} jam)`
        : 'Pakai raket sendiri';

    const itemName = psState.racketOption
        ? `${PS_CONFIG.name} + Sewa Raket`
        : PS_CONFIG.name;

    const bookingItem = {
        lineId:           Date.now(),
        id:               `padel-sim-${psState.selectedDateISO}-${psState.selectedSlots.join('_')}-${psState.racketOption?.id || 'own'}`,
        name:             itemName,
        brand:            'Comum',
        image:            PS_CONFIG.image,
        category:         'booking',
        unitPrice:        total,
        originalPrice:    origTotal,
        quantity:         1,
        type:             'booking',
        bookingDate:      psState.selectedDateISO,
        bookingDateLabel: formatDateHuman(psState.selectedDateISO),
        bookingTime:      bookingTime,
        bookingDuration:  `${slotCount * PS_CONFIG.durationMinutes} menit (${slotCount} sesi)`,
        bookingLocation:  PS_CONFIG.location,
        racketLabel:      racketLabel,
        racketOption:     psState.racketOption ? psState.racketOption.id : null,
    };

    const cart = getCart();
    cart.push(bookingItem);
    saveCart(cart);

    localStorage.setItem('comum-checkout-data', JSON.stringify({
        items:    [bookingItem],
        subtotal: total,
        shipping: 0,
        discount: 0,
        promoCode:null,
        total:    total,
    }));

    showToast('Booking ditambahkan — lanjut checkout');
    setTimeout(() => { location.href = 'checkout.html'; }, 600);
}

// ============================================================
// Init
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    syncCartBadge();

    psState.selectedDateISO = todayISO();

    renderDateStrip();
    renderSlots();
    updateSummary();
    setAddonChoice('own');   // initialise card highlight

    // Date nav arrows with slide
    document.getElementById('ps-date-prev')?.addEventListener('click', () => {
        if (psState.dateOffset === 0) return;
        animateDateStrip('prev');
    });
    document.getElementById('ps-date-next')?.addEventListener('click', () => {
        animateDateStrip('next');
    });

    // Calendar toggle
    document.getElementById('ps-cal-toggle')?.addEventListener('click', () => toggleCalendar());
    document.getElementById('ps-cal-prev')?.addEventListener('click', () => {
        if (psState.calendarMonth === 0) { psState.calendarYear--; psState.calendarMonth = 11; }
        else psState.calendarMonth--;
        renderCalendarGrid();
    });
    document.getElementById('ps-cal-next')?.addEventListener('click', () => {
        if (psState.calendarMonth === 11) { psState.calendarYear++; psState.calendarMonth = 0; }
        else psState.calendarMonth++;
        renderCalendarGrid();
    });

    // Slot expand toggle
    const slotToggle = document.getElementById('ps-slot-toggle');
    const slotGrid   = document.getElementById('ps-slot-grid');
    slotToggle?.addEventListener('click', () => {
        const expanded = slotToggle.getAttribute('aria-expanded') === 'true';
        slotToggle.setAttribute('aria-expanded', String(!expanded));
        slotGrid?.classList.toggle('is-collapsed', expanded);
    });

    // Addon two-card buttons
    document.getElementById('ps-addon-own')?.addEventListener('click', () => setAddonChoice('own'));
    document.getElementById('ps-addon-rent-btn')?.addEventListener('click', openRacketModal);

    // Racket modal controls
    document.getElementById('ps-racket-close')?.addEventListener('click', closeRacketModal);
    document.getElementById('ps-racket-overlay')?.addEventListener('click', closeRacketModal);

    // Duration options (static buttons inside the modal)
    document.querySelectorAll('.ps-dur-opt').forEach(btn => {
        btn.addEventListener('click', () => setModalDur(parseInt(btn.dataset.dur), parseInt(btn.dataset.price)));
    });

    document.getElementById('ps-racket-ok')?.addEventListener('click', confirmRacket);
    // Skip = revert to "own" and close modal
    document.getElementById('ps-racket-skip')?.addEventListener('click', () => {
        setAddonChoice('own');
        closeRacketModal();
    });

    // Book CTAs
    document.getElementById('ps-book-cta')?.addEventListener('click', handleBook);
    document.getElementById('ps-sticky-btn')?.addEventListener('click', handleBook);

    if (window.lucide) lucide.createIcons();
});
