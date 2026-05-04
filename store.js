/* =========================================
   Product Data
   ========================================= */
const PRODUCTS = [
    // Padel products (can be rented)
    {
        id: 1, category: 'padel', name: 'Royal Padel R-Ace M27 Light', brand: 'Royal Padel',
        image: './Asset/Store_Items/Padel_Rackets/Royal-Padel-R-Ace-M27-Light.webp',
        price: 4500000, originalPrice: 5500000, discount: 18,
        sold: 128, stock: 'in',
        rentable: true, rentPrice: 60000,
        badges: ['discount'], isNew: false
    },
    {
        id: 2, category: 'padel', name: 'Babolat Technical Viper', brand: 'Babolat',
        image: './Asset/Store_Items/Padel_Rackets/Babolat-Technical-Viper-Padel-Racket.webp',
        price: 3800000, originalPrice: null, discount: 0,
        sold: 92, stock: 'in',
        rentable: true, rentPrice: 60000,
        badges: ['new'], isNew: true
    },
    {
        id: 3, category: 'padel', name: 'Bullpadel Next Pro Premium Balls', brand: 'Bullpadel',
        image: './Asset/Store_Items/Padel_Balls/Bullpadel-Next-Pro-Premium-Padel-Balls.webp',
        price: 150000, originalPrice: 180000, discount: 17,
        sold: 340, stock: 'in',
        rentable: false, rentPrice: null,
        badges: ['discount']
    },
    {
        id: 4, category: 'padel', name: 'Bullpadel Hack 04 Padel Racket', brand: 'Bullpadel',
        image: './Asset/Store_Items/Padel_Rackets/Bullpadel-Hack-04-Padel-Racket.webp',
        price: 850000, originalPrice: null, discount: 0,
        sold: 56, stock: 'low',
        rentable: true, rentPrice: 60000,
        badges: []
    },
    {
        id: 5, category: 'padel', name: 'Bullpadel Comfort Overgrip', brand: 'Bullpadel',
        image: './Asset/Store_Items/Padel_Accessories/Bullpadel-Comfort-Overgrip-50pcs.webp',
        price: 95000, originalPrice: null, discount: 0,
        sold: 520, stock: 'in',
        rentable: false,
        badges: []
    },
    {
        id: 6, category: 'padel', name: 'Head Speed Padel Racket', brand: 'Head',
        image: './Asset/Store_Items/Padel_Rackets/Head-Speed-Padel-Racket.webp',
        price: 3200000, originalPrice: 4000000, discount: 20,
        sold: 78, stock: 'in',
        rentable: true, rentPrice: 60000,
        badges: ['discount']
    },

    // Cycling products (buy only)
    {
        id: 7, category: 'cycling', name: 'Bont Vaypor S Red Shoes', brand: 'BONT',
        image: './Asset/Store_Items/Cycling_Apparel/Bont-Vaypor-S-Cycling-Shoes-Red.webp',
        price: 6500000, originalPrice: 8500000, discount: 24,
        sold: 89, stock: 'in',
        rentable: false,
        badges: ['discount']
    },
    {
        id: 8, category: 'cycling', name: 'MET Trenta 3K Carbon Helmet', brand: 'MET',
        image: './Asset/Store_Items/Cycling_Apparel/MET-Trenta-3K-Carbon-White-Helmet.webp',
        price: 28000000, originalPrice: null, discount: 0,
        sold: 24, stock: 'low',
        rentable: false,
        badges: ['new'], isNew: true
    },
    {
        id: 9, category: 'cycling', name: 'Santini Paris Roubaix Jersey', brand: 'Santini',
        image: './Asset/Store_Items/Cycling_Apparel/Santini-Paris-Roubaix-Cycling-Jersey.webp',
        price: 1850000, originalPrice: 2200000, discount: 16,
        sold: 156, stock: 'in',
        rentable: false,
        badges: ['discount']
    },
    {
        id: 10, category: 'cycling', name: 'MET Estro Mips Helmet', brand: 'MET',
        image: './Asset/Store_Items/Cycling_Apparel/MET-Estro-Mips-Helmet.webp',
        price: 2200000, originalPrice: null, discount: 0,
        sold: 98, stock: 'in',
        rentable: false,
        badges: []
    },
    {
        id: 11, category: 'cycling', name: 'Garmin Edge 530 Computer', brand: 'Garmin',
        image: './Asset/Store_Items/Cycling_Components/Garmin-Edge-530-Bike-Computer.webp',
        price: 1650000, originalPrice: 2000000, discount: 18,
        sold: 210, stock: 'in',
        rentable: false,
        badges: ['discount']
    },
    {
        id: 12, category: 'cycling', name: 'Ergon GA2 Bike Grips', brand: 'Ergon',
        image: './Asset/Store_Items/Cycling_Components/Ergon-GA2-Bike-Grips-Colors.webp',
        price: 450000, originalPrice: null, discount: 0,
        sold: 320, stock: 'in',
        rentable: false,
        badges: []
    },
    {
        id: 13, category: 'cycling', name: 'Rhinowalk Handlebar Bag', brand: 'Rhinowalk',
        image: './Asset/Store_Items/Cycling_Components/Rhinowalk-Handlebar-Bag.webp',
        price: 45000000, originalPrice: null, discount: 0,
        sold: 12, stock: 'low',
        rentable: false,
        badges: ['new'], isNew: true
    },
    {
        id: 14, category: 'cycling', name: 'Pirelli P Zero Race Tire', brand: 'Pirelli',
        image: './Asset/Store_Items/Cycling_Components/Pirelli-P-Zero-Race-Tire-Box.webp',
        price: 180000, originalPrice: 220000, discount: 18,
        sold: 450, stock: 'in',
        rentable: false,
        badges: ['discount']
    },
    {
        id: 15, category: 'cycling', name: 'MET Manta Cycling Helmet', brand: 'MET',
        image: './Asset/Store_Items/Cycling_Apparel/MET-Manta-Cycling-Helmet.webp',
        price: 2800000, originalPrice: 3500000, discount: 20,
        sold: 67, stock: 'in',
        rentable: false,
        badges: ['bundle']
    },
    {
        id: 16, category: 'cycling', name: 'Garmin Edge 830 Computer', brand: 'Garmin',
        image: './Asset/Store_Items/Cycling_Components/Garmin-Edge-830-Bike-Computer.webp',
        price: 320000, originalPrice: null, discount: 0,
        sold: 180, stock: 'in',
        rentable: false,
        badges: []
    }
];

// Expose products globally so other pages (e.g. profile) can look them up by id
window.COMUM_PRODUCTS = PRODUCTS;

/* =========================================
   State
   ========================================= */
const state = {
    activeCategory: 'all',
    activeSubcategory: null,
    cart: [],
    wishlist: new Set(JSON.parse(localStorage.getItem('comum-wishlist') || '[]')),
    filters: {
        search: '',
        priceMin: 0,
        priceMax: Infinity,
        brands: new Set(),
        conditions: new Set(),
        availability: new Set()
    }
};

/* =========================================
   Init
   ========================================= */
function applyUserPreferences() {
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    const prefs = user && user.preferences;
    if (!prefs || prefs.skipped || !prefs.sport) return;

    const map = { padel: 'padel', cycling: 'cycling', both: 'all' };
    const cat = map[prefs.sport];
    if (!cat || cat === 'all') return;

    state.activeCategory = cat;

    document.querySelectorAll('.store-cat-btn').forEach(t => {
        t.classList.toggle('active', t.dataset.category === cat);
    });

    const grid = document.getElementById('products-grid');
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

        document.getElementById('prefs-banner-reset').addEventListener('click', () => {
            const allTab = document.querySelector('.store-cat-btn[data-category="all"]');
            if (allTab) allTab.click();
            banner.remove();
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Only run store-page init when we're actually on the store
    if (!document.getElementById('products-grid')) return;

    applyUserPreferences();
    renderProducts();
    initCategoryTabs();
    initCarousel();
    initCountdown();
    initFilters();
    initSort();
    initMobileFilter();
    syncCartBadge();
    lucide.createIcons();
});

/* =========================================
   Product Rendering
   ========================================= */
function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

function getFilteredProducts() {
    return PRODUCTS.filter(p => {
        // Subcategory filter (more specific than category)
        if (state.activeSubcategory) {
            const sub = state.activeSubcategory;
            // Products store subcategory in p.subcategory (optional); fall back to parent category match
            if (p.subcategory) {
                if (p.subcategory !== sub) return false;
            } else {
                // No explicit subcategory on product — just match parent category
                if (p.category !== state.activeCategory) return false;
            }
        } else {
            // Regular category filter
            if (state.activeCategory !== 'all' && p.category !== state.activeCategory) return false;
        }

        // Search
        if (state.filters.search) {
            const q = state.filters.search.toLowerCase();
            if (!p.name.toLowerCase().includes(q) && !p.brand.toLowerCase().includes(q)) return false;
        }

        // Price
        if (p.price < state.filters.priceMin || p.price > state.filters.priceMax) return false;

        // Brands
        if (state.filters.brands.size > 0 && !state.filters.brands.has(p.brand)) return false;

        // Availability
        if (state.filters.availability.has('rent') && !p.rentable) return false;

        return true;
    });
}

function sortProducts(products, sortBy) {
    const sorted = [...products];
    switch (sortBy) {
        case 'price-low': sorted.sort((a, b) => a.price - b.price); break;
        case 'price-high': sorted.sort((a, b) => b.price - a.price); break;
        case 'popular': sorted.sort((a, b) => b.sold - a.sold); break;
        case 'newest': sorted.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)); break;
    }
    return sorted;
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    const countEl = document.getElementById('results-count');
    const sortBy = document.getElementById('sort-select')?.value || 'relevance';

    let products = getFilteredProducts();
    products = sortProducts(products, sortBy);

    countEl.innerHTML = `<strong>${products.length}</strong> produk ditemukan`;

    if (products.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--text-muted);">
                <i data-lucide="search-x" style="width: 48px; height: 48px; margin-bottom: 16px; color: var(--text-faint);"></i>
                <h3 style="color: var(--text-dark); margin-bottom: 8px;">Produk tidak ditemukan</h3>
                <p>Coba ubah filter atau kata kunci pencarian.</p>
            </div>`;
        lucide.createIcons();
        return;
    }

    grid.innerHTML = products.map(p => productCardHTML(p)).join('');
    lucide.createIcons();
    bindProductCardEvents();
}

function productCardHTML(p) {
    const badgesHTML = p.badges.map(b => {
        const labels = { discount: `-${p.discount}%`, new: 'BARU', bundle: 'BUNDLE' };
        return `<span class="product-badge badge-${b}">${labels[b]}</span>`;
    }).join('');

    // "+ SEWA" signals rent is an ADDITIONAL option (not rent-only)
    const rentableBadge = p.rentable ? `<span class="product-badge badge-rent">+ SEWA</span>` : '';

    const priceHTML = `
        <div class="product-price-row">
            <span class="product-price">${formatRupiah(p.price)}</span>
            ${p.originalPrice ? `<span class="product-price-original">${formatRupiah(p.originalPrice)}</span>` : ''}
        </div>
        ${p.rentable ? `
            <span class="product-rent-note">
                <i data-lucide="tag"></i>
                Juga bisa disewa · ${formatRupiah(p.rentPrice)}/jam
            </span>` : ''}
    `;

    const stockLabel = p.stock === 'in' ? 'Stok tersedia' : p.stock === 'low' ? 'Stok terbatas' : 'Habis';
    const stockClass = p.stock === 'low' ? 'low' : p.stock === 'out' ? 'out' : '';

    const isWishlisted = state.wishlist.has(p.id);

    return `
        <article class="product-card" data-id="${p.id}" data-action="open-detail">
            <div class="product-image-wrap">
                <div class="product-badges">${badgesHTML}${rentableBadge}</div>
                <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" data-action="wishlist" data-id="${p.id}">
                    <i data-lucide="heart"></i>
                </button>
                <img src="${p.image}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-content">
                <span class="product-brand">${p.brand}</span>
                <h3 class="product-name">${p.name}</h3>
                <div class="product-sold">
                    <span>${p.sold} terjual</span>
                </div>
                <div class="product-pricing">${priceHTML}</div>
                <div class="product-stock ${stockClass}">${stockLabel}</div>
            </div>
        </article>
    `;
}

// Map product IDs to their detail pages
const DETAIL_PAGES = {
    1: 'product-padel.html',
    11: 'product-helmet.html'
};

function bindProductCardEvents() {
    // Navigate to product detail page on card click
    document.querySelectorAll('[data-action="open-detail"]').forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('[data-action="wishlist"]')) return;
            const id = parseInt(card.dataset.id);
            if (DETAIL_PAGES[id]) {
                window.location.href = DETAIL_PAGES[id];
            } else {
                showToast('Halaman detail produk belum tersedia');
            }
        });
    });

    document.querySelectorAll('[data-action="wishlist"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(e.currentTarget.dataset.id);
            toggleWishlist(id, e.currentTarget);
        });
    });
}

/* =========================================
   Category Bar (Unified) + Sub-Dropdowns
   ========================================= */
function initCategoryTabs() {
    const buttons = document.querySelectorAll('.store-cat-btn');
    if (!buttons.length) return;

    // Read ?cat= URL param for deep-linking from navbar dropdown
    const urlCat = new URLSearchParams(window.location.search).get('cat');
    if (urlCat) {
        const matched = [...buttons].find(b => b.dataset.category === urlCat);
        if (matched) {
            buttons.forEach(b => b.classList.remove('active'));
            matched.classList.add('active');
            state.activeCategory = urlCat;
        }
    }

    // Main category buttons
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            buttons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.activeCategory = btn.dataset.category;
            state.activeSubcategory = null;
            // Clear sub-item active states
            document.querySelectorAll('.cat-sub-item.active').forEach(el => el.classList.remove('active'));
            renderProducts();
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
    });

    // Sub-dropdown panels — hover-driven, fixed-positioned to escape overflow
    const subDropdowns = document.querySelectorAll('.cat-sub-dropdown');

    function positionPanel(wrap) {
        const trigger = wrap.querySelector('.cat-sub-trigger');
        const panel = wrap.querySelector('.cat-sub-panel');
        if (!trigger || !panel) return;
        const rect = trigger.getBoundingClientRect();
        panel.style.top  = (rect.bottom + 8) + 'px';
        panel.style.left = rect.left + 'px';
        // Clamp to viewport right edge
        requestAnimationFrame(() => {
            const pr = panel.getBoundingClientRect();
            if (pr.right > window.innerWidth - 8) {
                panel.style.left = (window.innerWidth - pr.width - 8) + 'px';
            }
        });
    }

    subDropdowns.forEach(wrap => {
        let closeTimer;

        wrap.addEventListener('mouseenter', () => {
            clearTimeout(closeTimer);
            subDropdowns.forEach(d => { if (d !== wrap) d.classList.remove('open'); });
            positionPanel(wrap);
            wrap.classList.add('open');
        });

        wrap.addEventListener('mouseleave', () => {
            closeTimer = setTimeout(() => wrap.classList.remove('open'), 350);
        });

        // Also keep panel open when hovering over the panel itself
        const panel = wrap.querySelector('.cat-sub-panel');
        panel?.addEventListener('mouseenter', () => clearTimeout(closeTimer));
        panel?.addEventListener('mouseleave', () => {
            closeTimer = setTimeout(() => wrap.classList.remove('open'), 350);
        });

        // Sub-item clicks
        wrap.querySelectorAll('.cat-sub-item').forEach(item => {
            item.addEventListener('click', () => {
                const trigger = wrap.querySelector('.cat-sub-trigger');
                buttons.forEach(b => b.classList.remove('active'));
                trigger.classList.add('active');
                state.activeCategory = trigger.dataset.category;
                document.querySelectorAll('.cat-sub-item.active').forEach(el => el.classList.remove('active'));
                item.classList.add('active');
                state.activeSubcategory = item.dataset.sub;
                wrap.classList.remove('open');
                renderProducts();
            });
        });
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.cat-sub-dropdown')) {
            subDropdowns.forEach(d => d.classList.remove('open'));
        }
    });
}

/* =========================================
   Carousel
   ========================================= */
function initCarousel() {
    const slides = document.querySelectorAll('.promo-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    let currentSlide = 0;
    let autoplayInterval;

    function goToSlide(index) {
        slides.forEach((s, i) => s.classList.toggle('active', i === index));
        dots.forEach((d, i) => d.classList.toggle('active', i === index));
        currentSlide = index;
    }

    function nextSlide() {
        goToSlide((currentSlide + 1) % slides.length);
    }

    function prevSlide() {
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
    }

    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    prevBtn?.addEventListener('click', () => { prevSlide(); stopAutoplay(); startAutoplay(); });
    nextBtn?.addEventListener('click', () => { nextSlide(); stopAutoplay(); startAutoplay(); });
    dots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); stopAutoplay(); startAutoplay(); }));

    const carousel = document.getElementById('promo-carousel');
    carousel?.addEventListener('mouseenter', stopAutoplay);
    carousel?.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
}

/* =========================================
   Countdown Timer
   ========================================= */
function initCountdown() {
    const el = document.getElementById('countdown');
    if (!el) return;

    // End of day
    function updateCountdown() {
        const now = new Date();
        const end = new Date(now);
        end.setHours(23, 59, 59);
        const diff = end - now;

        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);

        el.textContent = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

/* =========================================
   Filters
   ========================================= */
function initFilters() {
    // Search
    const searchInput = document.getElementById('search-input');
    let searchTimeout;
    searchInput?.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            state.filters.search = e.target.value;
            renderProducts();
        }, 250);
    });

    // Price
    const priceMin = document.getElementById('price-min');
    const priceMax = document.getElementById('price-max');
    const applyPrice = () => {
        state.filters.priceMin = parseInt(priceMin.value) || 0;
        state.filters.priceMax = parseInt(priceMax.value) || Infinity;
        renderProducts();
    };
    priceMin?.addEventListener('change', applyPrice);
    priceMax?.addEventListener('change', applyPrice);

    // Price presets
    document.querySelectorAll('.price-presets button').forEach(btn => {
        btn.addEventListener('click', () => {
            priceMin.value = btn.dataset.min;
            priceMax.value = btn.dataset.max;
            applyPrice();
        });
    });

    // Brand checkboxes
    const brandInputs = document.querySelectorAll('.filter-group:nth-of-type(3) input[type="checkbox"]');
    brandInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) state.filters.brands.add(input.value);
            else state.filters.brands.delete(input.value);
            renderProducts();
        });
    });

    // Availability
    document.querySelectorAll('.filter-check input[value="buy"], .filter-check input[value="rent"]').forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) state.filters.availability.add(input.value);
            else state.filters.availability.delete(input.value);
            renderProducts();
        });
    });

    // Reset
    document.getElementById('filter-reset')?.addEventListener('click', () => {
        state.filters = {
            search: '', priceMin: 0, priceMax: Infinity,
            brands: new Set(), conditions: new Set(),
            availability: new Set()
        };
        document.querySelectorAll('.store-sidebar input').forEach(i => {
            if (i.type === 'checkbox') i.checked = false;
            else i.value = '';
        });
        renderProducts();
    });
}

/* =========================================
   Sort
   ========================================= */
function initSort() {
    document.getElementById('sort-select')?.addEventListener('change', renderProducts);
}

/* Rent modal removed — rent functionality lives on product detail pages */

/* =========================================
   Cart & Wishlist (localStorage-based)
   ========================================= */
function getCart() {
    return JSON.parse(localStorage.getItem('comum-cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('comum-cart', JSON.stringify(cart));
    syncCartBadge();
}

function addToCart(product, customMessage) {
    const cart = getCart();

    if (product.isRent) {
        // Rent items always added as new line
        cart.push({
            lineId: Date.now(),
            id: product.id,
            name: product.name,
            brand: product.brand,
            image: product.image,
            category: product.category,
            unitPrice: product.price,
            quantity: 1,
            type: 'rent',
            rentDays: product.rentDays,
            rentPricePerDay: product.rentPrice || 0
        });
    } else {
        // Check if already in cart (buy)
        const existing = cart.find(item => item.id === product.id && item.type === 'buy');
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({
                lineId: Date.now(),
                id: product.id,
                name: product.name,
                brand: product.brand,
                image: product.image,
                category: product.category,
                unitPrice: product.price,
                originalPrice: product.originalPrice || null,
                quantity: 1,
                type: 'buy'
            });
        }
    }

    saveCart(cart);
    showToast(customMessage || `${product.name} ditambahkan ke keranjang`);
}

function syncCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count, #cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function saveWishlist() {
    localStorage.setItem('comum-wishlist', JSON.stringify([...state.wishlist]));
}

function toggleWishlist(id, btn) {
    if (state.wishlist.has(id)) {
        state.wishlist.delete(id);
        btn?.classList.remove('active');
        showToast('Dihapus dari wishlist');
    } else {
        state.wishlist.add(id);
        btn?.classList.add('active');
        showToast('Ditambahkan ke wishlist');
    }
    saveWishlist();
}

/* =========================================
   Toast
   ========================================= */
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    msgEl.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

/* =========================================
   Mobile Filter Drawer
   ========================================= */
function initMobileFilter() {
    const sidebar = document.getElementById('store-sidebar');
    const btn = document.getElementById('filter-mobile-btn');

    // Create backdrop dynamically
    const backdrop = document.createElement('div');
    backdrop.className = 'sidebar-backdrop';
    document.body.appendChild(backdrop);

    btn?.addEventListener('click', () => {
        sidebar.classList.add('open');
        backdrop.classList.add('open');
    });

    backdrop.addEventListener('click', () => {
        sidebar.classList.remove('open');
        backdrop.classList.remove('open');
    });
}
