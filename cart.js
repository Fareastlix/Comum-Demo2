// ============================================================
// Comum Cart Page
// ============================================================

const PROMO_CODES = {
    'COMUM10': { type: 'percent', value: 10, max: 200000, label: '10% off (max Rp 200K)' },
    'NEWCOMER': { type: 'flat', value: 50000, label: 'Rp 50K off' },
    'KOMUNITAS': { type: 'percent', value: 15, max: 300000, label: '15% off (max Rp 300K)' }
};

let appliedPromo = null;

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    renderCart();
    initSelectAll();
    initRemoveSelected();
    initPromoCode();
    syncCartBadge();
});

// ============================================================
// Cart Helpers
// ============================================================
function getCart() {
    return JSON.parse(localStorage.getItem('comum-cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('comum-cart', JSON.stringify(cart));
    syncCartBadge();
}

function syncCartBadge() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count, #cart-count').forEach(el => {
        el.textContent = totalItems;
    });
}

function formatRupiah(num) {
    return 'Rp ' + num.toLocaleString('id-ID');
}

// ============================================================
// Render Cart
// ============================================================
function renderCart() {
    const cart = getCart();
    const emptyEl = document.getElementById('cart-empty');
    const contentEl = document.getElementById('cart-content');
    const countEl = document.getElementById('cart-title-count');

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countEl) countEl.textContent = `(${totalItems})`;

    if (cart.length === 0) {
        emptyEl.style.display = '';
        contentEl.style.display = 'none';
        return;
    }

    emptyEl.style.display = 'none';
    contentEl.style.display = '';

    // Split into buy / rent / booking
    const buyItems = cart.filter(i => i.type === 'buy');
    const rentItems = cart.filter(i => i.type === 'rent');
    const bookingItems = cart.filter(i => i.type === 'booking');

    // Buy group
    const buyGroup = document.getElementById('cart-group-buy');
    const buyContainer = document.getElementById('cart-items-buy');
    if (buyItems.length > 0) {
        buyGroup.style.display = '';
        buyContainer.innerHTML = buyItems.map(cartItemHTML).join('');
    } else {
        buyGroup.style.display = 'none';
    }

    // Rent group
    const rentGroup = document.getElementById('cart-group-rent');
    const rentContainer = document.getElementById('cart-items-rent');
    if (rentItems.length > 0) {
        rentGroup.style.display = '';
        rentContainer.innerHTML = rentItems.map(cartItemHTML).join('');
    } else {
        rentGroup.style.display = 'none';
    }

    // Booking group
    const bookingGroup = document.getElementById('cart-group-booking');
    const bookingContainer = document.getElementById('cart-items-booking');
    if (bookingGroup && bookingItems.length > 0) {
        bookingGroup.style.display = '';
        bookingContainer.innerHTML = bookingItems.map(cartItemHTML).join('');
    } else if (bookingGroup) {
        bookingGroup.style.display = 'none';
    }

    if (window.lucide) lucide.createIcons();
    bindCartEvents();
    updateSummary();
    updateSelectAll();
}

function cartItemHTML(item) {
    const lineTotal = item.unitPrice * item.quantity;
    const isRent = item.type === 'rent';
    const isBooking = item.type === 'booking';
    const qtyLocked = isRent || isBooking;

    let badge = '';
    if (isRent) {
        const unit = item.durationUnit || 'hari';
        badge = `<span class="cart-item-badge"><i data-lucide="calendar-clock"></i> Sewa ${item.rentDays} ${unit}</span>`;
    } else if (isBooking) {
        const racketBit = item.racketLabel ? ` · ${item.racketLabel}` : '';
        badge = `<span class="cart-item-badge"><i data-lucide="calendar-check"></i> ${item.bookingDateLabel} · ${item.bookingTime}${racketBit}</span>`;
    }

    return `
        <div class="cart-item" data-line-id="${item.lineId}">
            <label class="cart-item-check">
                <input type="checkbox" checked data-line-id="${item.lineId}">
            </label>
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-info">
                <span class="cart-item-brand">${item.brand}</span>
                <h4 class="cart-item-name">${item.name}</h4>
                ${badge}
            </div>
            <div class="qty-control">
                <button data-action="qty-minus" data-line-id="${item.lineId}" ${item.quantity <= 1 || qtyLocked ? 'disabled' : ''}>−</button>
                <span>${item.quantity}</span>
                <button data-action="qty-plus" data-line-id="${item.lineId}" ${qtyLocked ? 'disabled' : ''}>+</button>
            </div>
            <div class="cart-item-price">
                <div class="price-current">${formatRupiah(lineTotal)}</div>
                ${item.originalPrice && !isRent ? `<div class="price-original">${formatRupiah(item.originalPrice * item.quantity)}</div>` : ''}
            </div>
            <button class="cart-item-remove" data-action="remove" data-line-id="${item.lineId}" aria-label="Remove">
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `;
}

// ============================================================
// Cart Events
// ============================================================
function bindCartEvents() {
    // Quantity
    document.querySelectorAll('[data-action="qty-minus"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lineId = parseInt(btn.dataset.lineId);
            updateQuantity(lineId, -1);
        });
    });

    document.querySelectorAll('[data-action="qty-plus"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lineId = parseInt(btn.dataset.lineId);
            updateQuantity(lineId, 1);
        });
    });

    // Remove
    document.querySelectorAll('[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', () => {
            const lineId = parseInt(btn.dataset.lineId);
            removeItem(lineId);
        });
    });

    // Checkbox changes -> update summary
    document.querySelectorAll('.cart-item-check input').forEach(cb => {
        cb.addEventListener('change', () => {
            updateSummary();
            updateSelectAll();
        });
    });
}

function updateQuantity(lineId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.lineId === lineId);
    if (!item) return;

    item.quantity = Math.max(1, item.quantity + delta);
    saveCart(cart);
    renderCart();
}

function removeItem(lineId) {
    let cart = getCart();
    const item = cart.find(i => i.lineId === lineId);
    cart = cart.filter(i => i.lineId !== lineId);
    saveCart(cart);
    renderCart();
    if (item) showToast(`${item.name} dihapus dari keranjang`);
}

// ============================================================
// Select All / Remove Selected
// ============================================================
function initSelectAll() {
    document.getElementById('select-all')?.addEventListener('change', (e) => {
        const checked = e.target.checked;
        document.querySelectorAll('.cart-item-check input').forEach(cb => {
            cb.checked = checked;
        });
        updateSummary();
    });
}

function updateSelectAll() {
    const all = document.querySelectorAll('.cart-item-check input');
    const checked = document.querySelectorAll('.cart-item-check input:checked');
    const selectAll = document.getElementById('select-all');
    const selectCount = document.getElementById('select-count');

    if (selectAll) selectAll.checked = all.length > 0 && all.length === checked.length;
    if (selectCount) selectCount.textContent = checked.length;
}

function initRemoveSelected() {
    document.getElementById('remove-selected')?.addEventListener('click', () => {
        const checked = document.querySelectorAll('.cart-item-check input:checked');
        if (checked.length === 0) return;

        const lineIds = new Set();
        checked.forEach(cb => lineIds.add(parseInt(cb.dataset.lineId)));

        let cart = getCart();
        cart = cart.filter(i => !lineIds.has(i.lineId));
        saveCart(cart);
        renderCart();
        showToast(`${lineIds.size} item dihapus`);
    });
}

// ============================================================
// Summary Calculation
// ============================================================
function updateSummary() {
    const cart = getCart();
    const checkedIds = new Set();
    document.querySelectorAll('.cart-item-check input:checked').forEach(cb => {
        checkedIds.add(parseInt(cb.dataset.lineId));
    });

    const selectedItems = cart.filter(i => checkedIds.has(i.lineId));
    const buyItems = selectedItems.filter(i => i.type === 'buy');
    const rentItems = selectedItems.filter(i => i.type === 'rent');
    const bookingItems = selectedItems.filter(i => i.type === 'booking');

    const buySubtotal = buyItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const rentSubtotal = rentItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const bookingSubtotal = bookingItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
    const subtotal = buySubtotal + rentSubtotal + bookingSubtotal;
    const itemCount = selectedItems.reduce((sum, i) => sum + i.quantity, 0);

    // Shipping: free over 500k for buy items, rent always free
    const shipping = buySubtotal >= 500000 || buyItems.length === 0 ? 0 : 25000;
    const shippingEl = document.getElementById('summary-shipping');
    if (shippingEl) {
        shippingEl.textContent = shipping === 0 ? 'Gratis' : formatRupiah(shipping);
        shippingEl.className = shipping === 0 ? 'shipping-free' : '';
    }

    // Rent row
    const rentRow = document.getElementById('summary-rent-row');
    const rentTotalEl = document.getElementById('summary-rent-total');
    if (rentItems.length > 0) {
        rentRow.style.display = '';
        rentTotalEl.textContent = formatRupiah(rentSubtotal);
    } else {
        rentRow.style.display = 'none';
    }

    // Promo discount
    let discount = 0;
    const discountRow = document.getElementById('summary-discount-row');
    const discountEl = document.getElementById('summary-discount');
    if (appliedPromo) {
        if (appliedPromo.type === 'percent') {
            discount = Math.min(subtotal * appliedPromo.value / 100, appliedPromo.max);
        } else {
            discount = Math.min(appliedPromo.value, subtotal);
        }
        discountRow.style.display = '';
        discountEl.textContent = `-${formatRupiah(Math.round(discount))}`;
    } else {
        discountRow.style.display = 'none';
    }

    const total = Math.max(0, subtotal + shipping - discount);

    document.getElementById('summary-count').textContent = itemCount;
    document.getElementById('summary-subtotal').textContent = formatRupiah(subtotal);
    document.getElementById('summary-total').textContent = formatRupiah(Math.round(total));

    // Store checkout data for checkout page
    localStorage.setItem('comum-checkout-data', JSON.stringify({
        items: selectedItems,
        subtotal,
        shipping,
        discount: Math.round(discount),
        promoCode: appliedPromo ? Object.keys(PROMO_CODES).find(k => PROMO_CODES[k] === appliedPromo) : null,
        total: Math.round(total)
    }));

    // Disable checkout if nothing selected
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        if (selectedItems.length === 0) {
            checkoutBtn.style.opacity = '0.5';
            checkoutBtn.style.pointerEvents = 'none';
        } else {
            checkoutBtn.style.opacity = '';
            checkoutBtn.style.pointerEvents = '';
        }
    }
}

// ============================================================
// Promo Code
// ============================================================
function initPromoCode() {
    const input = document.getElementById('promo-input');
    const applyBtn = document.getElementById('promo-apply');
    const feedback = document.getElementById('promo-feedback');

    applyBtn?.addEventListener('click', () => {
        const code = input.value.trim().toUpperCase();
        if (!code) return;

        if (PROMO_CODES[code]) {
            appliedPromo = PROMO_CODES[code];
            feedback.textContent = `Promo "${code}" diterapkan! ${appliedPromo.label}`;
            feedback.className = 'promo-feedback success';
            input.disabled = true;
            applyBtn.textContent = 'Hapus';
            applyBtn.onclick = () => {
                appliedPromo = null;
                feedback.textContent = '';
                feedback.className = 'promo-feedback';
                input.disabled = false;
                input.value = '';
                applyBtn.textContent = 'Pakai';
                applyBtn.onclick = null;
                initPromoCode();
                updateSummary();
            };
        } else {
            feedback.textContent = 'Kode promo tidak valid';
            feedback.className = 'promo-feedback error';
        }

        updateSummary();
    });

    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            applyBtn?.click();
        }
    });
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
