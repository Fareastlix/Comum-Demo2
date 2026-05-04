// ============================================================
// Comum Event-Join Module — shared across pages
// ------------------------------------------------------------
// Persists which events the user has joined into localStorage
// under `comum-joined-events` (array of event IDs).
//
// Flow:
//  - getJoinedEvents()     → array of IDs
//  - hasJoinedEvent(id)    → boolean
//  - joinEvent(id, opts)   → if not logged in, redirect to login
//  - leaveEvent(id)        → remove from joined list
//
// WhatsApp deep-link configured via COMUM_WHATSAPP below.
// Replace this number with the real Comum admin WhatsApp.
// ============================================================

window.COMUM_WHATSAPP = '6281234567890'; // ← change to real number (no +, no dashes)

(function () {
    'use strict';

    const KEY = 'comum-joined-events';

    function read() {
        try {
            const arr = JSON.parse(localStorage.getItem(KEY) || '[]');
            return Array.isArray(arr) ? arr : [];
        } catch (_) { return []; }
    }

    function write(arr) {
        localStorage.setItem(KEY, JSON.stringify(arr));
    }

    function getCurrentUser() {
        try { return JSON.parse(localStorage.getItem('comum-user') || 'null'); }
        catch (_) { return null; }
    }

    /* ---------- Public API ---------- */

    function getJoinedEvents() {
        return read();
    }

    function hasJoinedEvent(id) {
        return read().includes(Number(id));
    }

    /**
     * Joins an event. If user is not logged in, redirects to login
     * with a `next` param so they bounce back to where they were.
     *
     * @param {number} id — event ID
     * @param {object} [opts]
     * @param {string} [opts.nextUrl] — where to return after login (defaults to current location)
     * @returns {boolean} — true if joined now, false if redirected to login
     */
    function joinEvent(id, opts) {
        const user = getCurrentUser();
        if (!user) {
            const next = (opts && opts.nextUrl) || (location.pathname + location.search + location.hash);
            location.href = 'login.html?next=' + encodeURIComponent(next);
            return false;
        }
        const list = read();
        const numId = Number(id);
        if (!list.includes(numId)) list.push(numId);
        write(list);
        return true;
    }

    function leaveEvent(id) {
        const numId = Number(id);
        write(read().filter(x => x !== numId));
    }

    /**
     * Build a WhatsApp deep-link with a pre-filled message about joining
     * a specific event. Falls back to a plain wa.me link if the event
     * data isn't available.
     */
    function buildWhatsAppLink(ev) {
        const phone = window.COMUM_WHATSAPP || '6281234567890';
        let text = 'Halo, saya mau ikutan event Comum';
        if (ev) {
            text = `Halo, saya mau ikutan event "${ev.title}"`;
            if (ev.day && ev.date) text += ` (${ev.day}, ${ev.date}`;
            if (ev.time) text += ` ${ev.time}`;
            if (ev.day && ev.date) text += ')';
            if (ev.location) text += ` di ${ev.location}`;
            text += '. Bisa info lebih lanjut?';
        }
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    }

    // Expose
    window.ComumJoin = {
        getJoinedEvents,
        hasJoinedEvent,
        joinEvent,
        leaveEvent,
        buildWhatsAppLink,
    };
})();
