/* =========================================
   Facilities Page JS — Micro-Interactions
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // =============================================
    // 1. HERO PARALLAX — image moves on scroll
    // =============================================
    const heroImg = document.querySelector('.fac-hero-image');
    const heroContent = document.querySelector('.fac-hero-content');
    const hero = document.querySelector('.fac-hero');

    function updateHeroParallax() {
        if (!hero) return;
        const rect = hero.getBoundingClientRect();
        const scrolled = -rect.top;
        const heroH = hero.offsetHeight;
        if (rect.bottom < 0 || rect.top > window.innerHeight) return;

        const progress = Math.max(0, Math.min(1, scrolled / heroH));
        if (heroImg) {
            heroImg.style.transform = `scale(${1 + progress * 0.12}) translateY(${progress * -30}px)`;
        }
        if (heroContent) {
            heroContent.style.transform = `translateY(${progress * 60}px)`;
            heroContent.style.opacity = 1 - progress * 0.8;
        }
    }

    // =============================================
    // 2. SCROLL REVEAL — staggered element entrance
    // =============================================
    const revealEls = [];

    function collectRevealElements() {
        // Service cards
        document.querySelectorAll('.fac-service-card').forEach((el, i) => {
            revealEls.push({ el, delay: i * 100, type: 'rise' });
        });
        // Location cards
        document.querySelectorAll('.fac-location-card').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'rise' });
        });
        // Price sections
        document.querySelectorAll('.fac-price-section, .fac-cafe-section').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'rise' });
        });
        // Price table rows
        document.querySelectorAll('.fac-price-table tbody tr').forEach((el, i) => {
            revealEls.push({ el, delay: i * 60, type: 'slide-right' });
        });
        // Menu categories
        document.querySelectorAll('.fac-menu-category').forEach((el, i) => {
            revealEls.push({ el, delay: i * 120, type: 'rise' });
        });
        // Menu items
        document.querySelectorAll('.fac-menu-item').forEach((el, i) => {
            const catIndex = el.closest('.fac-menu-category') ?
                [...document.querySelectorAll('.fac-menu-category')].indexOf(el.closest('.fac-menu-category')) : 0;
            const localIndex = [...el.closest('.fac-menu-list').children].indexOf(el);
            revealEls.push({ el, delay: catIndex * 120 + localIndex * 50, type: 'slide-right' });
        });
        // CTA cards
        document.querySelectorAll('.fac-cta-card').forEach((el, i) => {
            revealEls.push({ el, delay: i * 150, type: 'rise' });
        });
        // Location headers
        document.querySelectorAll('.fac-location-header').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'slide-right' });
        });
        // Price headers
        document.querySelectorAll('.fac-price-header').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'slide-right' });
        });
        // Section headers
        document.querySelectorAll('.fac-services .section-header').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'rise' });
        });
        // CTA section header
        document.querySelectorAll('.fac-cta .section-header').forEach(el => {
            revealEls.push({ el, delay: 0, type: 'rise' });
        });
        // Feature tags
        document.querySelectorAll('.fac-feature-tag').forEach((el, i) => {
            revealEls.push({ el, delay: i * 80, type: 'pop' });
        });
    }

    function initRevealStyles() {
        revealEls.forEach(({ el, type }) => {
            el.style.transition = 'none'; // prevent flash
            if (type === 'rise') {
                el.style.opacity = '0';
                el.style.transform = 'translateY(40px)';
            } else if (type === 'slide-right') {
                el.style.opacity = '0';
                el.style.transform = 'translateX(-30px)';
            } else if (type === 'pop') {
                el.style.opacity = '0';
                el.style.transform = 'scale(0.7)';
            }
            // Force reflow then enable transitions
            void el.offsetWidth;
            el.style.transition = '';
        });
    }

    function checkReveals() {
        const viewH = window.innerHeight;
        revealEls.forEach(item => {
            if (item.revealed) return;
            const rect = item.el.getBoundingClientRect();
            if (rect.top < viewH * 0.88) {
                item.revealed = true;
                setTimeout(() => {
                    item.el.classList.add('fac-revealed');
                }, item.delay);
            }
        });
    }

    // =============================================
    // 3. HERO ENTRANCE — typewriter / stagger text
    // =============================================
    function animateHeroEntrance() {
        const badge = document.querySelector('.fac-hero-badge');
        const h1 = document.querySelector('.fac-hero-content h1');
        const p = document.querySelector('.fac-hero-content > p');
        const actions = document.querySelector('.fac-hero-actions');

        [badge, h1, p, actions].forEach(el => {
            if (el) {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
            }
        });

        const animate = (el, delay) => {
            if (!el) return;
            setTimeout(() => {
                el.style.transition = 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay);
        };

        animate(badge, 200);
        animate(h1, 500);
        animate(p, 750);
        animate(actions, 1000);
    }

    // =============================================
    // 4. SERVICE CARD TILT — 3D tilt on hover (DISABLED)
    // =============================================
    function initCardTilt() {
        // Disabled to remove floating/moving effect as per user request
    }

    // =============================================
    // 5. CTA CARD GLOW — cursor-following glow
    // =============================================
    function initCtaGlow() {
        document.querySelectorAll('.fac-cta-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                card.style.setProperty('--glow-x', `${x}px`);
                card.style.setProperty('--glow-y', `${y}px`);
            });
        });
    }



    // =============================================
    // 7. TABLE ROW HOVER — slide indicator
    // =============================================
    function initTableInteractions() {
        document.querySelectorAll('.fac-price-table tbody tr').forEach(row => {
            row.addEventListener('mouseenter', () => {
                row.style.transition = 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)';

                const priceCell = row.querySelector('.price-cell');
                if (priceCell) {
                    priceCell.style.transform = 'scale(1.08)';
                    priceCell.style.transition = 'transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }
            });

            row.addEventListener('mouseleave', () => {
                const priceCell = row.querySelector('.price-cell');
                if (priceCell) {
                    priceCell.style.transform = '';
                }
            });
        });
    }

    // =============================================
    // 8. MENU ITEM HOVER — price highlight
    // =============================================
    function initMenuInteractions() {
        document.querySelectorAll('.fac-menu-item').forEach(item => {
            item.addEventListener('mouseenter', () => {
                const price = item.querySelector('.fac-menu-item-price');
                if (price) {
                    price.style.color = 'var(--primary-blue)';
                    price.style.transform = 'scale(1.1)';
                    price.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
                }
                item.style.paddingLeft = '8px';
                item.style.transition = 'padding 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease';
            });

            item.addEventListener('mouseleave', () => {
                const price = item.querySelector('.fac-menu-item-price');
                if (price) {
                    price.style.color = '';
                    price.style.transform = '';
                }
                item.style.paddingLeft = '';
            });
        });
    }

    // =============================================
    // 9. ICON FLOAT — subtle breathing on service icons
    // =============================================
    function initIconFloat() {
        document.querySelectorAll('.fac-service-icon, .fac-price-icon, .fac-cta-card-icon').forEach((icon, i) => {
            icon.style.animation = `facIconFloat 3s ease-in-out ${i * 0.4}s infinite`;
        });
    }

    // =============================================
    // 10. FEATURE TAG RIPPLE — click feedback
    // =============================================
    function initTagInteractions() {
        document.querySelectorAll('.fac-feature-tag').forEach(tag => {
            tag.addEventListener('mouseenter', () => {
                tag.style.transform = 'scale(1.08)';
                tag.style.boxShadow = '0 4px 12px rgba(0, 102, 255, 0.15)';
                tag.style.transition = 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)';
            });
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = '';
                tag.style.boxShadow = '';
            });
        });
    }

    // =============================================
    // 11. SMOOTH SCROLL for hero quick-jump buttons
    // =============================================
    document.querySelectorAll('.fac-hero-actions a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            if (target) {
                const navHeight = document.querySelector('.navbar')?.offsetHeight || 72;
                const y = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // =============================================
    // 13. BADGE SHIMMER — animated gradient on service badges
    // =============================================
    function initBadgeShimmer() {
        document.querySelectorAll('.service-badge').forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.classList.add('service-badge--shimmer');
            });
            badge.addEventListener('animationend', () => {
                badge.classList.remove('service-badge--shimmer');
            });
        });
    }

    // =============================================
    // INIT ALL
    // =============================================
    collectRevealElements();
    initRevealStyles();
    animateHeroEntrance();
    initCardTilt();
    initCtaGlow();

    initTableInteractions();
    initMenuInteractions();
    initIconFloat();
    initTagInteractions();
    initBadgeShimmer();

    // =============================================
    // 14. PHOTO GALLERY & LIGHTBOX
    // =============================================
    const photos = {
        alsut: [
            "./Asset/Alsut/ALSUT_FRONT_result.webp",
            "./Asset/Alsut/Alsut_Lt_1_result.webp",
            "./Asset/Alsut/Alsut_Lantai_2_result.webp",
            "./Asset/Alsut/Alsut_Padel_Sim_result.webp",
            "./Asset/Alsut/Alsut_Padel_Wall_result.webp",
            "./Asset/Alsut/Alsut_WaitRoom_result.webp"
        ],
        pangpol: [
            "./Asset/Pangpol/pangpoll_front_result.webp",
            "./Asset/Pangpol/pangpol_bengkel_result.webp",
            "./Asset/Pangpol/pangpol_cafe_result.webp",
            "./Asset/Pangpol/pangpol_seats_result.webp"
        ]
    };

    let currentGallery = [];
    let currentPhotoIndex = 0;

    const lightbox = document.getElementById('fac-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxThumbs = document.getElementById('lightbox-thumbs');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-nav--prev');
    const nextBtn = lightbox.querySelector('.lightbox-nav--next');

    function openLightbox(location, index) {
        currentGallery = photos[location];
        currentPhotoIndex = index;
        updateLightbox();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scroll
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        if (!currentGallery[currentPhotoIndex]) return;

        // Update main image
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImg.src = currentGallery[currentPhotoIndex];
            lightboxImg.onload = () => {
                lightboxImg.style.opacity = '1';
                lightboxImg.style.transform = 'scale(1)';
            };
        }, 150);

        // Update thumbnails
        lightboxThumbs.innerHTML = '';
        currentGallery.forEach((url, i) => {
            const thumb = document.createElement('div');
            thumb.className = `lightbox-thumb ${i === currentPhotoIndex ? 'active' : ''}`;
            thumb.innerHTML = `<img src="${url}" alt="Thumbnail ${i + 1}">`;
            thumb.onclick = (e) => {
                e.stopPropagation();
                currentPhotoIndex = i;
                updateLightbox();
            };
            lightboxThumbs.appendChild(thumb);
        });

        // Scroll active thumbnail into view
        const activeThumb = lightboxThumbs.children[currentPhotoIndex];
        if (activeThumb) {
            activeThumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function nextPhoto() {
        currentPhotoIndex = (currentPhotoIndex + 1) % currentGallery.length;
        updateLightbox();
    }

    function prevPhoto() {
        currentPhotoIndex = (currentPhotoIndex - 1 + currentGallery.length) % currentGallery.length;
        updateLightbox();
    }

    // Event Listeners for Gallery Items
    document.querySelectorAll('.fac-location-gallery').forEach(gallery => {
        const location = gallery.dataset.location;
        
        gallery.querySelectorAll('.fac-gallery-item, .fac-gallery-more').forEach(item => {
            item.addEventListener('click', (e) => {
                const index = parseInt(item.dataset.photoIndex) || 0;
                openLightbox(location, index);
            });
        });
    });

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextPhoto();
    });
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        prevPhoto();
    });

    // Close on click outside
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-content') || e.target.classList.contains('lightbox-main')) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
    });

    // RAF-powered scroll handler (performance)
    let ticking = false;
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateHeroParallax();
                checkReveals();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // Initial check
    checkReveals();
});
