// ============================================================
// Comum Login / Register — Phone + OTP
// ============================================================

const CORRECT_OTP = '123456';
let currentPhone = '';
let otpTimerInterval = null;

/* Read ?next= from the URL so we can bounce the user back to where
   they came from (e.g. an event detail page they tried to join). */
function getNextUrl(fallback) {
    const next = new URLSearchParams(window.location.search).get('next');
    if (!next) return fallback;
    // Reject absolute URLs to other origins for safety — only allow same-origin paths
    try {
        const decoded = decodeURIComponent(next);
        if (/^https?:/i.test(decoded)) return fallback;
        return decoded;
    } catch (_) { return fallback; }
}

document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();

    // If already logged in, go straight to profile (or `next` if set)
    const user = JSON.parse(localStorage.getItem('comum-user') || 'null');
    if (user) {
        window.location.href = getNextUrl('profile.html');
        return;
    }

    initPhoneStep();
    initOtpStep();
    initNameStep();
});

// ============================================================
// Step 1: Phone Number
// ============================================================
function initPhoneStep() {
    const input = document.getElementById('phone-input');
    const btn = document.getElementById('phone-submit');

    // Enable button when phone has enough digits
    input.addEventListener('input', () => {
        const digits = input.value.replace(/\D/g, '');
        btn.disabled = digits.length < 9;
    });

    // Auto-format: add spaces (8xx xxxx xxxx)
    input.addEventListener('input', () => {
        let raw = input.value.replace(/\D/g, '');
        if (raw.length > 12) raw = raw.slice(0, 12);

        // Format: xxx xxxx xxxx
        let formatted = '';
        for (let i = 0; i < raw.length; i++) {
            if (i === 3 || i === 7) formatted += ' ';
            formatted += raw[i];
        }
        input.value = formatted;
    });

    // Submit
    btn.addEventListener('click', () => submitPhone());
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btn.disabled) submitPhone();
    });
}

function submitPhone() {
    const input = document.getElementById('phone-input');
    const btn = document.getElementById('phone-submit');
    const digits = input.value.replace(/\D/g, '');
    currentPhone = '+62' + digits;

    // Show loading
    btn.classList.add('loading');
    btn.innerHTML = 'Mengirim OTP...';

    // Simulate OTP send delay
    setTimeout(() => {
        btn.classList.remove('loading');

        // Hide phone step
        document.getElementById('step-phone').style.display = 'none';
        document.getElementById('login-social-proof').style.display = 'none';

        // Update header
        const header = document.querySelector('.login-header');
        header.querySelector('h1').textContent = 'Masukkan kode OTP';
        header.querySelector('p').textContent = 'Kami kirim 6 digit kode ke nomor kamu.';

        // Show OTP phone display
        const display = document.getElementById('otp-phone-display');
        display.textContent = '+62 ' + input.value;

        // Show OTP step with animation
        showStep('step-otp');

        // Focus first OTP box
        document.querySelector('.otp-box[data-index="0"]').focus();

        // Start resend timer
        startResendTimer();
    }, 800);
}

// ============================================================
// Step 2: OTP Verification
// ============================================================
function initOtpStep() {
    const boxes = document.querySelectorAll('.otp-box');

    boxes.forEach((box, i) => {
        // Only allow digits
        box.addEventListener('input', (e) => {
            const val = e.target.value.replace(/\D/g, '');
            e.target.value = val.slice(0, 1);

            if (val) {
                box.classList.add('filled');
                // Auto-advance to next
                if (i < 5) boxes[i + 1].focus();
            } else {
                box.classList.remove('filled');
            }

            // Clear error state on any input
            clearOtpError();

            // Auto-verify when all 6 filled
            const fullCode = getOtpCode();
            if (fullCode.length === 6) {
                setTimeout(() => verifyOtp(fullCode), 150);
            }
        });

        // Handle backspace
        box.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !box.value && i > 0) {
                boxes[i - 1].focus();
                boxes[i - 1].value = '';
                boxes[i - 1].classList.remove('filled');
            }
        });

        // Handle paste
        box.addEventListener('paste', (e) => {
            e.preventDefault();
            const pasted = (e.clipboardData.getData('text') || '').replace(/\D/g, '').slice(0, 6);
            pasted.split('').forEach((digit, j) => {
                if (boxes[j]) {
                    boxes[j].value = digit;
                    boxes[j].classList.add('filled');
                }
            });
            if (pasted.length === 6) {
                boxes[5].focus();
                setTimeout(() => verifyOtp(pasted), 150);
            } else {
                boxes[Math.min(pasted.length, 5)].focus();
            }
        });
    });

    // Change phone button
    document.getElementById('otp-change-phone')?.addEventListener('click', () => {
        // Reset and go back to phone step
        document.getElementById('step-otp').classList.remove('visible', 'animate-in');
        document.getElementById('step-otp').style.display = 'none';
        document.getElementById('step-phone').style.display = '';
        document.getElementById('login-social-proof').style.display = '';

        const header = document.querySelector('.login-header');
        header.querySelector('h1').textContent = 'Masuk atau daftar';
        header.querySelector('p').textContent = 'Pakai nomor HP aja. Belum punya akun? Otomatis dibuatkan.';

        clearOtpBoxes();
        clearOtpError();
        clearInterval(otpTimerInterval);
        document.getElementById('phone-input').focus();
    });

    // Resend button
    document.getElementById('otp-resend')?.addEventListener('click', () => {
        const btn = document.getElementById('otp-resend');
        if (btn.disabled) return;
        clearOtpBoxes();
        clearOtpError();
        startResendTimer();
        document.querySelector('.otp-box[data-index="0"]').focus();
    });
}

function getOtpCode() {
    return [...document.querySelectorAll('.otp-box')].map(b => b.value).join('');
}

function verifyOtp(code) {
    if (code === CORRECT_OTP) {
        // Success! Check if new or returning user
        const users = JSON.parse(localStorage.getItem('comum-users') || '{}');
        const existingUser = users[currentPhone];

        if (existingUser) {
            // Returning user — log in directly
            localStorage.setItem('comum-user', JSON.stringify(existingUser));
            // Brief success flash then redirect
            document.querySelectorAll('.otp-box').forEach(b => {
                b.style.borderColor = '#22C55E';
                b.style.background = '#DCFCE7';
            });
            setTimeout(() => {
                window.location.href = getNextUrl('profile.html');
            }, 500);
        } else {
            // New user — show name step
            document.querySelectorAll('.otp-box').forEach(b => {
                b.style.borderColor = '#22C55E';
                b.style.background = '#DCFCE7';
            });
            setTimeout(() => {
                document.getElementById('step-otp').classList.remove('visible', 'animate-in');
                document.getElementById('step-otp').style.display = 'none';
                document.querySelector('.login-header').style.display = 'none';
                showStep('step-name');
                document.getElementById('name-input').focus();
            }, 600);
        }
    } else {
        // Wrong OTP — wiggle + red
        document.querySelectorAll('.otp-box').forEach(b => {
            b.classList.add('error');
            b.classList.remove('filled');
        });
        document.getElementById('otp-error').classList.add('visible');

        // Remove wiggle after animation completes (but keep red)
        setTimeout(() => {
            document.querySelectorAll('.otp-box').forEach(b => {
                b.classList.remove('error');
            });
        }, 600);

        // Clear boxes for retry
        setTimeout(() => {
            clearOtpBoxes();
            document.querySelector('.otp-box[data-index="0"]').focus();
        }, 900);
    }
}

function clearOtpBoxes() {
    document.querySelectorAll('.otp-box').forEach(b => {
        b.value = '';
        b.classList.remove('filled', 'error');
        b.style.borderColor = '';
        b.style.background = '';
    });
}

function clearOtpError() {
    document.getElementById('otp-error').classList.remove('visible');
    document.querySelectorAll('.otp-box').forEach(b => {
        b.classList.remove('error');
        if (!b.value) {
            b.style.borderColor = '';
            b.style.background = '';
        }
    });
}

function startResendTimer() {
    const btn = document.getElementById('otp-resend');
    const timerSpan = document.getElementById('otp-timer');
    let seconds = 60;

    btn.disabled = true;
    timerSpan.textContent = `(${seconds}s)`;

    clearInterval(otpTimerInterval);
    otpTimerInterval = setInterval(() => {
        seconds--;
        timerSpan.textContent = `(${seconds}s)`;
        if (seconds <= 0) {
            clearInterval(otpTimerInterval);
            btn.disabled = false;
            timerSpan.textContent = '';
        }
    }, 1000);
}

// ============================================================
// Step 3: Name Input (New Users)
// ============================================================
function initNameStep() {
    const input = document.getElementById('name-input');
    const btn = document.getElementById('name-submit');

    input?.addEventListener('input', () => {
        btn.disabled = input.value.trim().length < 2;
    });

    btn?.addEventListener('click', () => completeRegistration());
    input?.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !btn.disabled) completeRegistration();
    });
}

function completeRegistration() {
    const name = document.getElementById('name-input').value.trim();
    const btn = document.getElementById('name-submit');

    btn.classList.add('loading');
    btn.innerHTML = 'Membuat akun...';

    // Create new user
    const newUser = {
        phone: currentPhone,
        name: name,
        tier: 'rookie',
        points: 0,
        totalSpent: 0,
        joinDate: new Date().toISOString().slice(0, 10),
        orders: [],
        eventsAttended: 0,
        avatar: null
    };

    // Save to users registry
    const users = JSON.parse(localStorage.getItem('comum-users') || '{}');
    users[currentPhone] = newUser;
    localStorage.setItem('comum-users', JSON.stringify(users));

    // Set as current user
    localStorage.setItem('comum-user', JSON.stringify(newUser));

    setTimeout(() => {
        // New users → onboarding first; preserve the ?next= so they
        // bounce back to where they originally came from after onboarding.
        const next = new URLSearchParams(window.location.search).get('next');
        window.location.href = next
            ? `onboarding.html?next=${encodeURIComponent(next)}`
            : 'onboarding.html';
    }, 600);
}

// ============================================================
// Helpers
// ============================================================
function showStep(stepId) {
    const step = document.getElementById(stepId);
    step.classList.add('visible');
    // Trigger reflow for animation
    step.offsetHeight;
    requestAnimationFrame(() => {
        step.classList.add('animate-in');
    });
}
