/* =============================================================
   GRID DEBUG HELPER
   -------------------------------------------------------------
   Toggle the overlay:
     · Add  class="grid-debug"  to <body>, OR
     · Press Ctrl+G (Cmd+G on Mac) to toggle it on/off, OR
     · Run in console:  toggleGrid()

   When on, a pink chip in the top-right shows the LIVE values
   (columns / gutter / margin) so you can verify breakpoint changes.
   ============================================================= */
(function () {
    const chipId = 'grid-debug-chip';

    function updateChip() {
        if (!document.body.classList.contains('grid-debug')) return;

        // Read global tokens from :root
        const rootCS = getComputedStyle(document.documentElement);
        const cols   = rootCS.getPropertyValue('--grid-cols').trim()   || '?';
        const gutter = rootCS.getPropertyValue('--grid-gutter').trim() || '?';
        const margin = rootCS.getPropertyValue('--grid-margin').trim() || '?';

        // Read store-specific tokens if .store-main exists on this page
        let storeLine = '';
        const storeMain = document.querySelector('.store-main');
        if (storeMain) {
            const cs = getComputedStyle(storeMain);
            const sidebar = cs.getPropertyValue('--sidebar-span').trim()     || '?';
            const content = cs.getPropertyValue('--content-span').trim()     || '?';
            const perRow  = cs.getPropertyValue('--products-per-row').trim() || '?';
            storeLine =
                `<br>sidebar <b>${sidebar}</b> · ` +
                `content <b>${content}</b> · ` +
                `<b>${perRow}</b> per row`;
        }

        let chip = document.getElementById(chipId);
        if (!chip) {
            chip = document.createElement('div');
            chip.id = chipId;
            document.body.appendChild(chip);
        }
        chip.innerHTML =
            `<b>${cols}</b> cols · ` +
            `<b>${gutter}</b> gutter · ` +
            `<b>${margin}</b> margin` +
            storeLine;
    }

    function removeChip() {
        const chip = document.getElementById(chipId);
        if (chip) chip.remove();
    }

    // Public toggle — available from console
    window.toggleGrid = function () {
        const on = document.body.classList.toggle('grid-debug');
        if (on) updateChip();
        else removeChip();
        return on ? 'grid debug ON' : 'grid debug OFF';
    };

    // Keep the chip in sync on resize (breakpoint changes update it)
    window.addEventListener('resize', () => {
        if (document.body.classList.contains('grid-debug')) updateChip();
    });

    // Keyboard shortcut: Ctrl+G (or Cmd+G)
    window.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'g') {
            e.preventDefault();
            window.toggleGrid();
        }
    });

    // If body already has .grid-debug on load (e.g. added in HTML), show chip
    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.classList.contains('grid-debug')) updateChip();
    });
})();
