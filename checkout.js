// ============================================================
// Comum Checkout Page
// ============================================================

let selectedPayment = 'bca';

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    syncCartBadge();
    loadCheckoutData();
    initPaymentMethods();
    initPlaceOrder();
});

// ============================================================
// Cart Helpers (shared)
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
// Load Checkout Data
// ============================================================
function loadCheckoutData() {
    const data = JSON.parse(localStorage.getItem('comum-checkout-data') || 'null');

    if (!data || !data.items || data.items.length === 0) {
        // No items — redirect back to cart
        window.location.href = 'cart.html';
        return;
    }

    // Render items
    const container = document.getElementById('checkout-items');
    container.innerHTML = data.items.map(item => {
        const isRent = item.type === 'rent';
        const isBooking = item.type === 'booking';
        let detail;
        if (isRent) {
            const unit = item.durationUnit || 'hari';
            detail = `Sewa ${item.rentDays} ${unit}`;
        }
        else if (isBooking) detail = `${item.bookingDateLabel} · ${item.bookingTime} · ${item.bookingLocation}${item.racketLabel ? ' · ' + item.racketLabel : ''}`;
        else detail = `${item.quantity}x`;
        return `
            <div class="checkout-item">
                <div class="checkout-item-img">
                    <img src="${item.image}" alt="${item.name}" loading="lazy">
                </div>
                <div class="checkout-item-detail">
                    <h4>${item.name}</h4>
                    <p>${detail}</p>
                </div>
                <span class="checkout-item-price">${formatRupiah(item.unitPrice * item.quantity)}</span>
            </div>
        `;
    }).join('');

    // Fill summary
    document.getElementById('co-subtotal').textContent = formatRupiah(data.subtotal);

    const shippingEl = document.getElementById('co-shipping');
    shippingEl.textContent = data.shipping === 0 ? 'Gratis' : formatRupiah(data.shipping);
    shippingEl.className = data.shipping === 0 ? 'shipping-free' : '';

    const discountRow = document.getElementById('co-discount-row');
    if (data.discount > 0) {
        discountRow.style.display = '';
        document.getElementById('co-discount').textContent = `-${formatRupiah(data.discount)}`;
    }

    document.getElementById('co-total').textContent = formatRupiah(data.total);

    if (window.lucide) lucide.createIcons();
}

// ============================================================
// Payment Methods
// ============================================================
function initPaymentMethods() {
    document.querySelectorAll('.payment-option').forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');
            selectedPayment = opt.dataset.method;
        });
    });
}

// ============================================================
// Place Order
// ============================================================
function initPlaceOrder() {
    const btn = document.getElementById('place-order-btn');

    btn?.addEventListener('click', () => {
        // Validate form
        const name = document.getElementById('ship-name')?.value.trim();
        const email = document.getElementById('ship-email')?.value.trim();
        const phone = document.getElementById('ship-phone')?.value.trim();
        const address = document.getElementById('ship-address')?.value.trim();

        if (!name || !email || !phone || !address) {
            // Highlight missing fields
            const fields = [
                { el: document.getElementById('ship-name'), val: name },
                { el: document.getElementById('ship-email'), val: email },
                { el: document.getElementById('ship-phone'), val: phone },
                { el: document.getElementById('ship-address'), val: address }
            ];
            fields.forEach(f => {
                if (!f.val) {
                    f.el.style.borderColor = '#EF4444';
                    f.el.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.1)';
                    setTimeout(() => {
                        f.el.style.borderColor = '';
                        f.el.style.boxShadow = '';
                    }, 3000);
                }
            });

            // Scroll to first empty field
            const firstEmpty = fields.find(f => !f.val);
            if (firstEmpty) firstEmpty.el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Generate order number
        const orderNum = 'COM-' + Date.now().toString().slice(-6);
        document.getElementById('order-number').textContent = orderNum;

        // Clear cart of purchased items
        const checkoutData = JSON.parse(localStorage.getItem('comum-checkout-data') || '{}');
        const purchasedLineIds = new Set((checkoutData.items || []).map(i => i.lineId));
        let cart = getCart();
        cart = cart.filter(i => !purchasedLineIds.has(i.lineId));
        saveCart(cart);

        // Clear checkout data
        localStorage.removeItem('comum-checkout-data');

        // Show success modal
        const modal = document.getElementById('success-modal');
        modal.classList.add('active');
        if (window.lucide) lucide.createIcons();
    });
}
