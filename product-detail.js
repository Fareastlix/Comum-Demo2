/* =========================================
   Product Detail Page – Shared JS
   ========================================= */

// ---- Cart helpers (same as store) ----
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

// ---- Toast ----
let toastTimeout;
function showToast(message) {
    const toast = document.getElementById('toast');
    const msgEl = document.getElementById('toast-message');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ---- Quantity ----
let quantity = 1;

function initQuantity() {
    const minusBtn = document.getElementById('qty-minus');
    const plusBtn = document.getElementById('qty-plus');
    const valEl = document.getElementById('qty-val');

    minusBtn?.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            valEl.value = quantity;
            minusBtn.disabled = quantity <= 1;
        }
    });

    plusBtn?.addEventListener('click', () => {
        quantity++;
        valEl.value = quantity;
        minusBtn.disabled = false;
    });
}

// ---- Add to cart ----
function addProductToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id && item.type === 'buy');
    if (existing) {
        existing.quantity += quantity;
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
            quantity: quantity,
            type: 'buy'
        });
    }
    saveCart(cart);
    showToast(`${product.name} ditambahkan ke keranjang`);
}

// ---- Rent ----
let selectedRentDays = 1;

function initRentOptions() {
    const options = document.querySelectorAll('.pd-rent-opt');
    options.forEach(opt => {
        opt.addEventListener('click', () => {
            options.forEach(o => o.classList.remove('active'));
            opt.classList.add('active');
            selectedRentDays = parseInt(opt.dataset.days);
        });
    });
}

function addRentToCart(product) {
    const cart = getCart();
    let totalPrice;
    
    // Check if product has specific rent options (e.g. for hourly rentals)
    if (product.rentOptions && product.rentOptions[selectedRentDays]) {
        totalPrice = product.rentOptions[selectedRentDays];
    } else {
        const discounts = { 1: 1, 3: 0.9, 7: 0.8 };
        totalPrice = Math.round(product.rentPrice * selectedRentDays * (discounts[selectedRentDays] || 1));
    }

    const durationUnit = (selectedRentDays === 1 || selectedRentDays === 3) && product.rentOptions ? 'jam' : 'hari';

    cart.push({
        lineId: Date.now(),
        id: product.id,
        name: product.name,
        brand: product.brand,
        image: product.image,
        category: product.category,
        unitPrice: totalPrice,
        quantity: 1,
        type: 'rent',
        rentDays: selectedRentDays,
        rentPricePerDay: product.rentPrice || 0,
        rentUnit: durationUnit
    });

    saveCart(cart);
    showToast(`Disewa ${selectedRentDays} ${durationUnit} – ${formatRupiah(totalPrice)}`);
}

// ---- Wishlist ----
function initWishlistButton() {
    const btn = document.getElementById('btn-wishlist');
    if (!btn) return;
    const id = parseInt(btn.dataset.productId);
    const list = JSON.parse(localStorage.getItem('comum-wishlist') || '[]');
    if (list.includes(id)) btn.classList.add('active');

    btn.addEventListener('click', () => {
        const cur = JSON.parse(localStorage.getItem('comum-wishlist') || '[]');
        if (cur.includes(id)) {
            const next = cur.filter(x => x !== id);
            localStorage.setItem('comum-wishlist', JSON.stringify(next));
            btn.classList.remove('active');
            showToast('Dihapus dari wishlist');
        } else {
            cur.push(id);
            localStorage.setItem('comum-wishlist', JSON.stringify(cur));
            btn.classList.add('active');
            showToast('Ditambahkan ke wishlist');
        }
    });
}

// ---- Init common ----
document.addEventListener('DOMContentLoaded', () => {
    syncCartBadge();
    initQuantity();
    initRentOptions();
    initWishlistButton();
    if (window.lucide) lucide.createIcons();
});
