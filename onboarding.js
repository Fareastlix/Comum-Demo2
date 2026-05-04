// ============================================================
// Comum Onboarding — captures sport / level / city after signup
// ============================================================

const answers = { sport: null, level: null, city: null };

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    if (!user) {
        // Nothing to attach preferences to — bounce to login
        window.location.href = 'login.html';
        return;
    }

    // Personal greeting
    const greet = document.getElementById('onboarding-greeting');
    if (greet) greet.textContent = `Hai ${user.name.split(' ')[0]}!`;

    // Pre-fill if user already has preferences (re-edit flow)
    if (user.preferences && !user.preferences.skipped) {
        ['sport', 'level'].forEach(q => {
            if (user.preferences[q]) selectChip(q, user.preferences[q]);
        });
        if (user.preferences.city) {
            const sel = document.getElementById('onboarding-city');
            if (sel) { sel.value = user.preferences.city; answers.city = user.preferences.city; }
        }
        updateSubmitState();
    }

    // Chip handlers
    document.querySelectorAll('.chip-card').forEach(btn => {
        btn.addEventListener('click', () => {
            selectChip(btn.dataset.q, btn.dataset.value);
            updateSubmitState();
        });
    });

    // City select
    document.getElementById('onboarding-city')?.addEventListener('change', (e) => {
        answers.city = e.target.value || null;
        updateSubmitState();
    });

    // Submit
    document.getElementById('onboarding-submit')?.addEventListener('click', savePreferences);

    // Skip
    document.getElementById('onboarding-skip')?.addEventListener('click', () => {
        savePreferences({ skipped: true });
    });
});

function selectChip(question, value) {
    document.querySelectorAll(`.chip-card[data-q="${question}"]`).forEach(c => {
        c.classList.toggle('selected', c.dataset.value === value);
    });
    answers[question] = value;
}

function updateSubmitState() {
    const btn = document.getElementById('onboarding-submit');
    if (!btn) return;
    btn.disabled = !(answers.sport && answers.level && answers.city);
}

function savePreferences(opts) {
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    if (!user) { window.location.href = 'login.html'; return; }

    const skipped = opts && opts.skipped === true;
    user.preferences = skipped
        ? { skipped: true, completedAt: new Date().toISOString().slice(0, 10) }
        : { ...answers, completedAt: new Date().toISOString().slice(0, 10) };

    localStorage.setItem('comum-user', JSON.stringify(user));

    // Mirror to users registry so it survives across logins
    const users = JSON.parse(localStorage.getItem('comum-users') || '{}');
    if (users[user.phone]) {
        users[user.phone].preferences = user.preferences;
        localStorage.setItem('comum-users', JSON.stringify(users));
    }

    // Honor a return URL if onboarding was opened mid-session (e.g. edit flow)
    const params = new URLSearchParams(location.search);
    const next = params.get('next');
    window.location.href = next || 'index.html';
}
