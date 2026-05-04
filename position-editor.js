/**
 * 3D Model Position Editor v2
 * ────────────────────────────
 * Features: Drag to reposition, resize slider, delete models,
 *           duplicate models, rotation control, full HTML export.
 *
 * Usage:  startEditor()  /  stopEditor()   in browser console
 */

(function () {
    let editorActive = false;
    let panel = null;
    let styleOverride = null;
    let modelIndex = 0;

    /* All available GLB sources */
    const GLB_CATALOG = [
        { name: 'Roadbike Wheel', src: './Asset/3D_Asset/Roadbike_Wheel.glb' },
        { name: 'Padel Racket',   src: './Asset/3D_Asset/Padel.glb' },
        { name: 'Cycling Helmet', src: './Asset/3D_Asset/cycling_helmet.glb' },
        { name: 'Cycling Jersey', src: './Asset/3D_Asset/cycling_jersey.glb' },
        { name: 'Stem',           src: './Asset/3D_Asset/stem.glb' },
        { name: 'Supplement',     src: './Asset/3D_Asset/suplemen.glb' },
        { name: 'Ball',           src: './Asset/3D_Asset/ball.glb' },
        { name: 'Frame',          src: './Asset/3D_Asset/frame.glb' },
    ];

    function getModelName(src) {
        return src.split('/').pop().replace('.glb', '');
    }

    function makeLabel(m, idx) {
        const label = document.createElement('div');
        label.className = '__pos-label';
        label.style.cssText = `
            position:absolute; top:-32px; left:50%; transform:translateX(-50%);
            z-index:99999; background:rgba(0,0,0,0.9); color:#0f0;
            font:bold 11px/1.3 monospace; padding:3px 8px; border-radius:4px;
            pointer-events:none; white-space:nowrap; text-shadow:0 1px 2px #000;
        `;
        updateLabel(label, m, idx);
        m.appendChild(label);
        return label;
    }

    function updateLabel(label, m, idx) {
        const name = getModelName(m.querySelector('model-viewer')?.getAttribute('src') || '');
        const x = m.dataset.x;
        const y = m.dataset.y;
        const sz = parseInt(m.style.getPropertyValue('--size')) || 140;
        label.textContent = `#${idx} ${name}  ${x},${y}  ${sz}px`;
    }

    function makeControls(m, idx, onDelete) {
        const bar = document.createElement('div');
        bar.className = '__model-controls';
        bar.style.cssText = `
            position:absolute; bottom:-36px; left:50%; transform:translateX(-50%);
            z-index:99999; display:flex; align-items:center; gap:5px;
            background:rgba(0,0,0,0.9); padding:4px 8px; border-radius:6px;
            pointer-events:auto; white-space:nowrap; flex-wrap:wrap; justify-content:center;
        `;

        /* Size slider */
        const sz = parseInt(m.style.getPropertyValue('--size')) || 140;
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = 40;
        slider.max = 400;
        slider.value = sz;
        slider.style.cssText = 'width:80px; cursor:pointer; accent-color:#2563eb;';
        slider.title = 'Resize';
        slider.addEventListener('input', (e) => {
            e.stopPropagation();
            const v = e.target.value + 'px';
            m.style.setProperty('--size', v);
            sizeNum.textContent = e.target.value;
            updateLabel(m.__label, m, m.__idx);
        });

        const sizeNum = document.createElement('span');
        sizeNum.style.cssText = 'color:#aaa; font:10px monospace; min-width:28px;';
        sizeNum.textContent = sz;

        /* Rotation input */
        const rotVal = parseInt(m.style.getPropertyValue('--rotate')) || 0;
        const rotInput = document.createElement('input');
        rotInput.type = 'number';
        rotInput.value = rotVal;
        rotInput.min = -180;
        rotInput.max = 180;
        rotInput.step = 5;
        rotInput.style.cssText = `
            width:44px; background:#333; color:#fff; border:1px solid #555;
            border-radius:3px; font:10px monospace; padding:2px 4px; text-align:center;
        `;
        rotInput.title = 'Rotation (deg)';
        rotInput.addEventListener('input', (e) => {
            e.stopPropagation();
            m.style.setProperty('--rotate', e.target.value + 'deg');
        });
        rotInput.addEventListener('pointerdown', e => e.stopPropagation());

        const rotLabel = document.createElement('span');
        rotLabel.style.cssText = 'color:#888; font:10px monospace;';
        rotLabel.textContent = 'rot';

        /* Delete button */
        const del = document.createElement('button');
        del.textContent = '✕';
        del.title = 'Delete this model';
        del.style.cssText = `
            background:#dc2626; color:#fff; border:none; width:20px; height:20px;
            border-radius:50%; font:bold 11px sans-serif; cursor:pointer;
            display:flex; align-items:center; justify-content:center; padding:0;
            flex-shrink:0;
        `;
        del.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            e.preventDefault();
        });
        del.addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm(`Delete #${m.__idx} ${getModelName(m.querySelector('model-viewer')?.getAttribute('src') || '')}?`)) {
                onDelete(m);
            }
        });
        /* Blur slider (depth of field) */
        const blurVal = parseFloat(m.style.getPropertyValue('--blur')) || 0;

        const blurLabel = document.createElement('span');
        blurLabel.style.cssText = 'color:#888; font:10px monospace;';
        blurLabel.textContent = 'blur';

        const blurSlider = document.createElement('input');
        blurSlider.type = 'range';
        blurSlider.min = 0;
        blurSlider.max = 20;
        blurSlider.step = 0.5;
        blurSlider.value = blurVal;
        blurSlider.style.cssText = 'width:55px; cursor:pointer; accent-color:#06b6d4;';
        blurSlider.title = 'Blur (depth of field)';
        blurSlider.addEventListener('input', (e) => {
            e.stopPropagation();
            const v = parseFloat(e.target.value);
            m.style.setProperty('--blur', v);
            m.style.filter = v > 0 ? `blur(${v}px)` : 'none';
            blurNum.textContent = v;
        });
        blurSlider.addEventListener('pointerdown', e => e.stopPropagation());

        const blurNum = document.createElement('span');
        blurNum.style.cssText = 'color:#06b6d4; font:10px monospace; min-width:20px;';
        blurNum.textContent = blurVal;

        // Apply initial blur if set
        if (blurVal > 0) m.style.filter = `blur(${blurVal}px)`;

        bar.appendChild(slider);
        bar.appendChild(sizeNum);
        bar.appendChild(rotLabel);
        bar.appendChild(rotInput);
        bar.appendChild(blurLabel);
        bar.appendChild(blurSlider);
        bar.appendChild(blurNum);
        bar.appendChild(del);
        m.appendChild(bar);
        return bar;
    }

    function setupDrag(m) {
        let dragging = false, startMX, startMY, startDX, startDY;

        const onDown = (e) => {
            if (!editorActive || e.target.closest('.__model-controls')) return;
            e.preventDefault();
            e.stopPropagation();
            dragging = true;
            m.classList.add('__dragging');
            m.setPointerCapture(e.pointerId);
            startMX = e.clientX;
            startMY = e.clientY;
            startDX = parseFloat(m.dataset.x) || 0;
            startDY = parseFloat(m.dataset.y) || 0;
        };
        const onMove = (e) => {
            if (!dragging) return;
            e.preventDefault();
            const nx = Math.round(startDX + (e.clientX - startMX));
            const ny = Math.round(startDY + (e.clientY - startMY));
            m.dataset.x = nx;
            m.dataset.y = ny;
            m.style.setProperty('--dx', nx + 'px');
            m.style.setProperty('--dy', ny + 'px');
            updateLabel(m.__label, m, m.__idx);
        };
        const onUp = (e) => {
            if (!dragging) return;
            dragging = false;
            m.classList.remove('__dragging');
            m.releasePointerCapture(e.pointerId);
        };

        m.addEventListener('pointerdown', onDown);
        m.addEventListener('pointermove', onMove);
        m.addEventListener('pointerup', onUp);
        m.__editorCleanup = () => {
            m.removeEventListener('pointerdown', onDown);
            m.removeEventListener('pointermove', onMove);
            m.removeEventListener('pointerup', onUp);
        };
    }

    function initModel(m, deleteCallback) {
        const idx = modelIndex++;
        m.__idx = idx;

        const dx = parseFloat(m.dataset.x) || 0;
        const dy = parseFloat(m.dataset.y) || 0;
        m.style.setProperty('--dx', dx + 'px');
        m.style.setProperty('--dy', dy + 'px');
        m.style.setProperty('--orbit-opacity', '1');
        m.style.zIndex = String(100 + idx);

        const label = makeLabel(m, idx);
        m.__label = label;

        const controls = makeControls(m, idx, deleteCallback);
        m.__controls = controls;

        setupDrag(m);
    }

    function addModel(glbSrc, stage, deleteCallback, x, y, size, rotate) {
        const div = document.createElement('div');
        div.className = 'orbit-model';
        div.dataset.x = x || 0;
        div.dataset.y = y || 0;
        div.style.cssText = `--size:${size || 140}px; --rotate:${rotate || 0}deg; --bob-dur:6s; --bob-delay:0s;`;

        const mv = document.createElement('model-viewer');
        mv.setAttribute('src', glbSrc);
        mv.setAttribute('auto-rotate', '');
        mv.setAttribute('auto-rotate-delay', '0');
        mv.setAttribute('rotation-per-second', '5deg');
        mv.setAttribute('camera-orbit', '0deg 75deg 105%');
        mv.setAttribute('interaction-prompt', 'none');
        mv.setAttribute('loading', 'lazy');
        mv.setAttribute('disable-zoom', '');
        mv.setAttribute('disable-pan', '');
        mv.setAttribute('disable-tap', '');
        mv.style.cssText = 'width:100%;height:100%';
        div.appendChild(mv);

        // Insert before the mobile fallback images
        const firstFallback = stage.querySelector('.orbit-fallback');
        if (firstFallback) {
            stage.insertBefore(div, firstFallback);
        } else {
            stage.appendChild(div);
        }

        initModel(div, deleteCallback);
        return div;
    }

    function generateHTML(models, lensState) {
        const perspective = lensState?.perspective || 3000;
        const depth       = lensState?.depth       || 0;
        const distort     = lensState?.distort      || 0;

        let html = '';

        // Stage lens settings header comment
        if (perspective !== 3000 || depth > 0 || distort > 0) {
            html += `                <!-- ═══ Lens settings from editor ═══\n`;
            html += `                     Stage perspective : ${perspective}px\n`;
            if (depth   > 0) html += `                     Z-Depth (max)    : ${depth}px\n`;
            if (distort > 0) html += `                     Distort          : ${distort}% (visual-only, baked into x/y above)\n`;
            html += `                ═══════════════════════════════════ -->\n`;
        }

        models.forEach((m, i) => {
            const mv = m.querySelector('model-viewer');
            if (!mv) return;
            const src      = mv.getAttribute('src');
            const name     = getModelName(src);
            const x        = m.dataset.x;
            const y        = m.dataset.y;
            const sz       = parseInt(m.style.getPropertyValue('--size')) || 140;
            const rot      = parseInt(m.style.getPropertyValue('--rotate')) || 0;
            const bobDur   = m.style.getPropertyValue('--bob-dur')   || '6s';
            const bobDelay = m.style.getPropertyValue('--bob-delay') || '0s';
            const camOrbit = mv.getAttribute('camera-orbit')         || '0deg 75deg 105%';
            const rotSpeed = mv.getAttribute('rotation-per-second')  || '5deg';
            const fov      = mv.getAttribute('field-of-view')        || '';
            const fovAttr  = fov ? ` field-of-view="${fov}"` : '';

            // Blur (depth of field)
            const blur      = parseFloat(m.style.getPropertyValue('--blur')) || 0;
            const blurStyle = blur > 0 ? ` --blur:${blur}px;` : '';

            // Z-depth: bake the computed translateZ into a CSS var --tz
            // so it can be restored in the live page if needed
            let tzStyle = '';
            if (depth > 0) {
                const ox   = parseFloat(x) || 0;
                const oy   = parseFloat(y) || 0;
                const dist = Math.sqrt(ox * ox + oy * oy);
                const normalizedDist = Math.min(dist / 500, 1);
                const tz   = Math.round(-(normalizedDist * depth));
                if (tz !== 0) tzStyle = ` --tz:${tz}px;`;
            }

            html += `                <!-- ${name} -->\n`;
            html += `                <div class="orbit-model" data-x="${x}" data-y="${y}" style="--size:${sz}px; --rotate:${rot}deg; --bob-dur:${bobDur}; --bob-delay:${bobDelay};${blurStyle}${tzStyle}">\n`;
            html += `                    <model-viewer src="${src}" auto-rotate auto-rotate-delay="0" rotation-per-second="${rotSpeed}" camera-orbit="${camOrbit}"${fovAttr} interaction-prompt="none" loading="lazy" disable-zoom disable-pan disable-tap style="width:100%;height:100%"></model-viewer>\n`;
            html += `                </div>\n`;
        });
        return html;
    }

    window.startEditor = function () {
        if (editorActive) { console.log('Already running'); return; }
        editorActive = true;
        modelIndex = 0;

        const stage = document.querySelector('.store-explode-stage');
        const section = document.querySelector('.store-explode-section');
        if (!stage) { console.error('Stage not found'); return; }

        /* ── Pause scroll animation ── */
        window.__editorOverride = true;

        /* ── Style overrides ── */
        styleOverride = document.createElement('style');
        styleOverride.id = '__editor-styles';
        styleOverride.textContent = `
            .store-explode-section {
                height: 100vh !important;
                min-height: 100vh !important;
                position: relative !important;
            }
            .store-explode-sticky {
                height: 100vh !important;
                position: relative !important;
            }
            .store-explode-stage {
                max-width: 100vw !important;
                width: 100vw !important;
                height: 100vh !important;
                border-radius: 0 !important;
                overflow: visible !important;
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                z-index: 9990 !important;
            }
            .orbit-model {
                opacity: 1 !important;
                pointer-events: auto !important;
                cursor: grab !important;
                animation: none !important;
            }
            .orbit-model.__dragging {
                cursor: grabbing !important;
                z-index: 10000 !important;
            }
            .store-explode-stage .store-cta-content {
                pointer-events: none !important;
                z-index: 1 !important;
            }
            .orbit-fallback { display: none !important; }
            /* Toggle UI visibility */
            .__ui-hidden .__pos-label,
            .__ui-hidden .__model-controls { display: none !important; }
        `;
        document.head.appendChild(styleOverride);

        /* ── Delete handler ── */
        const deleteModel = (m) => {
            if (m.__editorCleanup) m.__editorCleanup();
            m.remove();
            refreshList();
        };

        /* ── Init existing models ── */
        const existingModels = stage.querySelectorAll('.orbit-model');
        existingModels.forEach(m => initModel(m, deleteModel));

        /* ── Control Panel ── */
        panel = document.createElement('div');
        panel.id = '__editor-panel';
        panel.style.cssText = `
            position:fixed; top:12px; right:12px; z-index:99999;
            background:#111; color:#fff; font:13px/1.6 monospace;
            padding:14px 18px; border-radius:12px; max-height:90vh;
            overflow-y:auto; box-shadow:0 8px 32px rgba(0,0,0,.6);
            width:380px;
        `;

        panel.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:2px;">
                <div style="font-size:15px;font-weight:bold;">🎯 Position Editor v2</div>
                <button id="__toggle-ui-btn" style="
                    background:#555; color:#fff; border:none; padding:4px 10px;
                    border-radius:6px; font:bold 11px monospace; cursor:pointer;
                ">👁 Hide UI</button>
            </div>
            <div style="font-size:11px;color:#aaa;margin-bottom:10px;">
                Drag to move · Slider to resize · Number to rotate · ✕ to delete
            </div>

            <div style="display:flex;gap:6px;margin-bottom:10px;">
                <select id="__add-select" style="
                    flex:1; background:#222; color:#fff; border:1px solid #444;
                    border-radius:6px; padding:6px 8px; font:12px monospace;
                ">
                    ${GLB_CATALOG.map(g => `<option value="${g.src}">${g.name}</option>`).join('')}
                </select>
                <button id="__add-btn" style="
                    background:#16a34a; color:#fff; border:none; padding:6px 14px;
                    border-radius:6px; font:bold 12px monospace; cursor:pointer;
                    white-space:nowrap;
                ">+ Add</button>
            </div>

            <div style="background:#1a1a1a;border:1px solid #333;border-radius:8px;padding:8px 10px;margin-bottom:10px;">
                <div style="font-size:11px;color:#f59e0b;font-weight:bold;margin-bottom:6px;">📷 Camera Lens</div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
                    <span style="color:#f59e0b;font:10px monospace;min-width:55px;">Perspect</span>
                    <input id="__perspective-slider" type="range" min="50" max="3000" value="3000" style="flex:1;cursor:pointer;accent-color:#f59e0b;">
                    <span id="__perspective-val" style="color:#f59e0b;font:bold 11px monospace;min-width:50px;text-align:right;">3000px</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;">
                    <span style="color:#a855f7;font:10px monospace;min-width:55px;">Z-Depth</span>
                    <input id="__depth-slider" type="range" min="0" max="1500" value="0" style="flex:1;cursor:pointer;accent-color:#a855f7;">
                    <span id="__depth-val" style="color:#a855f7;font:bold 11px monospace;min-width:50px;text-align:right;">0px</span>
                </div>
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:3px;">
                    <span style="color:#ef4444;font:10px monospace;min-width:55px;">Distort</span>
                    <input id="__distort-slider" type="range" min="0" max="100" value="0" style="flex:1;cursor:pointer;accent-color:#ef4444;">
                    <span id="__distort-val" style="color:#ef4444;font:bold 11px monospace;min-width:50px;text-align:right;">0%</span>
                </div>
                <div style="font-size:9px;color:#666;margin-top:4px;">Perspect = Z foreshortening · Distort = barrel fisheye push + scale</div>
            </div>

            <button id="__copy-html-btn" style="
                background:#2563eb; color:#fff; border:none; padding:10px 16px;
                border-radius:8px; font:bold 13px monospace; cursor:pointer;
                width:100%; margin-bottom:6px;
            ">📋 Copy Full HTML</button>

            <button id="__copy-pos-btn" style="
                background:#1e40af; color:#fff; border:none; padding:8px 16px;
                border-radius:8px; font:12px monospace; cursor:pointer;
                width:100%; margin-bottom:10px;
            ">📊 Copy Positions Only</button>

            <div id="__model-count" style="font-size:11px;color:#888;margin-bottom:6px;"></div>

            <pre id="__pos-output" style="
                background:#1a1a1a; padding:10px; border-radius:8px;
                font-size:10px; color:#0f0; max-height:300px;
                overflow-y:auto; white-space:pre-wrap; margin:0;
                border:1px solid #333;
            ">(click Copy to see output)</pre>
        `;
        document.body.appendChild(panel);

        function getActiveModels() {
            return [...stage.querySelectorAll('.orbit-model')];
        }

        function refreshList() {
            const count = getActiveModels().length;
            document.getElementById('__model-count').textContent = `${count} models active`;
        }
        refreshList();

        /* ── Toggle UI visibility ── */
        let uiHidden = false;
        const miniToggle = document.createElement('button');
        miniToggle.id = '__mini-toggle';
        miniToggle.textContent = '👁';
        miniToggle.title = 'Show editor UI';
        miniToggle.style.cssText = `
            position:fixed; top:12px; right:12px; z-index:99999;
            background:#111; color:#fff; border:none; width:40px; height:40px;
            border-radius:10px; font-size:18px; cursor:pointer;
            box-shadow:0 4px 16px rgba(0,0,0,.5); display:none;
        `;
        document.body.appendChild(miniToggle);

        function toggleUI() {
            uiHidden = !uiHidden;
            stage.classList.toggle('__ui-hidden', uiHidden);
            panel.style.display = uiHidden ? 'none' : '';
            miniToggle.style.display = uiHidden ? 'block' : 'none';
            const btn = document.getElementById('__toggle-ui-btn');
            if (btn) btn.textContent = uiHidden ? '👁 Show UI' : '👁 Hide UI';
        }

        document.getElementById('__toggle-ui-btn').onclick = toggleUI;
        miniToggle.onclick = toggleUI;

        /* Add button */
        document.getElementById('__add-btn').onclick = () => {
            const src = document.getElementById('__add-select').value;
            const offsetX = Math.round((Math.random() - 0.5) * 200);
            const offsetY = Math.round((Math.random() - 0.5) * 200);
            addModel(src, stage, deleteModel, offsetX, offsetY, 140, 0);
            refreshList();
        };

        /* ── Camera Lens: Perspective + Depth + Barrel Distortion ── */
        stage.style.transformStyle = 'preserve-3d';
        stage.style.perspective = '3000px';

        let currentDepth = 0;
        let currentDistort = 0;

        // Store original positions for distortion math
        function storeOriginals() {
            getActiveModels().forEach(m => {
                if (m.__origX === undefined) {
                    m.__origX = parseFloat(m.dataset.x) || 0;
                    m.__origY = parseFloat(m.dataset.y) || 0;
                }
            });
        }

        function applyLensEffect() {
            const models = getActiveModels();
            models.forEach(m => {
                const ox = parseFloat(m.dataset.x) || 0;
                const oy = parseFloat(m.dataset.y) || 0;
                const dist = Math.sqrt(ox * ox + oy * oy);
                const maxDist = 500; // normalization radius
                const normalizedDist = Math.min(dist / maxDist, 1);

                // Barrel distortion: push outward radially, proportional to distance squared
                let pushX = 0, pushY = 0, scaleBoost = 1;
                if (currentDistort > 0 && dist > 0) {
                    const strength = currentDistort / 100;
                    const radialPush = normalizedDist * normalizedDist * strength * 250;
                    const angle = Math.atan2(oy, ox);
                    pushX = Math.cos(angle) * radialPush;
                    pushY = Math.sin(angle) * radialPush;
                    // Edge objects get bigger (barrel magnification)
                    scaleBoost = 1 + (normalizedDist * normalizedDist * strength * 0.6);
                }

                const finalX = ox + pushX;
                const finalY = oy + pushY;

                // Z depth
                const z = currentDepth > 0 ? -(normalizedDist * currentDepth) : 0;

                m.style.setProperty('--dx', finalX + 'px');
                m.style.setProperty('--dy', finalY + 'px');
                m.style.transform = `translate(var(--dx), var(--dy)) translateZ(${z}px) scale(${scaleBoost.toFixed(3)})`;
            });
        }

        document.getElementById('__perspective-slider').oninput = (e) => {
            const v = e.target.value;
            stage.style.perspective = v + 'px';
            document.getElementById('__perspective-val').textContent = v + 'px';
        };

        document.getElementById('__depth-slider').oninput = (e) => {
            currentDepth = parseInt(e.target.value);
            document.getElementById('__depth-val').textContent = currentDepth + 'px';
            applyLensEffect();
        };

        document.getElementById('__distort-slider').oninput = (e) => {
            currentDistort = parseInt(e.target.value);
            document.getElementById('__distort-val').textContent = currentDistort + '%';
            applyLensEffect();
        };

        /* ── Helper: read current lens state ── */
        function getLensState() {
            return {
                perspective : parseInt(document.getElementById('__perspective-slider')?.value) || 3000,
                depth       : parseInt(document.getElementById('__depth-slider')?.value)       || 0,
                distort     : parseInt(document.getElementById('__distort-slider')?.value)     || 0,
            };
        }

        /* Copy full HTML */
        document.getElementById('__copy-html-btn').onclick = () => {
            const models = getActiveModels();
            const lens   = getLensState();
            const html   = generateHTML(models, lens);
            navigator.clipboard.writeText(html).then(() => {
                const btn = document.getElementById('__copy-html-btn');
                btn.textContent = '✅ HTML Copied!';
                setTimeout(() => { btn.textContent = '📋 Copy Full HTML'; }, 2000);
            });
            document.getElementById('__pos-output').textContent = html;
        };

        /* Copy positions only */
        document.getElementById('__copy-pos-btn').onclick = () => {
            const models = getActiveModels();
            const lens   = getLensState();
            let out = '';

            // Header: lens settings
            out += `═══ Lens Settings ═══════════════════\n`;
            out += `  Perspective : ${lens.perspective}px\n`;
            out += `  Z-Depth     : ${lens.depth}px\n`;
            out += `  Distort     : ${lens.distort}%\n`;
            out += `═════════════════════════════════════\n\n`;

            // Per-model table
            out += `#   ${'Model'.padEnd(22)} ${'x'.padStart(5)} ${'y'.padStart(5)}  size  rot  blur  tz\n`;
            out += `─── ${'─'.repeat(22)} ──────────────────────────────────\n`;
            models.forEach((m, i) => {
                const name  = getModelName(m.querySelector('model-viewer')?.getAttribute('src') || '');
                const sz    = parseInt(m.style.getPropertyValue('--size'))   || 140;
                const rot   = parseInt(m.style.getPropertyValue('--rotate')) || 0;
                const blur  = parseFloat(m.style.getPropertyValue('--blur')) || 0;

                // Compute baked Z for this model
                let tz = 0;
                if (lens.depth > 0) {
                    const ox = parseFloat(m.dataset.x) || 0;
                    const oy = parseFloat(m.dataset.y) || 0;
                    const dist = Math.sqrt(ox * ox + oy * oy);
                    tz = Math.round(-(Math.min(dist / 500, 1) * lens.depth));
                }

                out += `${String(i).padStart(3)}  ${name.slice(0,22).padEnd(22)} ${m.dataset.x.toString().padStart(5)} ${m.dataset.y.toString().padStart(5)}  ${String(sz).padStart(4)}  ${String(rot).padStart(3)}  ${String(blur).padStart(4)}  ${String(tz).padStart(5)}\n`;
            });

            navigator.clipboard.writeText(out).then(() => {
                const btn = document.getElementById('__copy-pos-btn');
                btn.textContent = '✅ Copied!';
                setTimeout(() => { btn.textContent = '📊 Copy Positions Only'; }, 2000);
            });
            document.getElementById('__pos-output').textContent = out;
        };

        console.log('%c✅ Editor v2 active — drag, resize, rotate, delete, add models!', 'color:lime;font-size:14px');
    };

    window.stopEditor = function () {
        if (!editorActive) return;
        editorActive = false;
        window.__editorOverride = false;

        if (panel) { panel.remove(); panel = null; }
        if (styleOverride) { styleOverride.remove(); styleOverride = null; }
        const mini = document.getElementById('__mini-toggle');
        if (mini) mini.remove();

        const stage = document.querySelector('.store-explode-stage');
        if (stage) {
            stage.querySelectorAll('.orbit-model').forEach(m => {
                if (m.__editorCleanup) { m.__editorCleanup(); delete m.__editorCleanup; }
                m.style.zIndex = '';
                m.classList.remove('__dragging');
                // Remove editor UI elements
                m.querySelectorAll('.__pos-label, .__model-controls').forEach(el => el.remove());
            });
        }

        console.log('%c🛑 Editor stopped. Refresh to restore scroll animation.', 'color:red;font-size:14px');
    };
})();
