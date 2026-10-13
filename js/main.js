(() => {
    'use strict';

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;

    $$('.split').forEach(el => {
        const text = el.textContent;
        el.textContent = '';
        [...text].forEach((ch, i) => {
            const s = document.createElement('span');
            s.className = 'letter';
            s.style.setProperty('--i', i);
            s.setAttribute('aria-hidden', 'true');
            s.textContent = ch === ' ' ? '\u00A0' : ch;
            el.appendChild(s);
        });
    });

    function setupLetterSwell(el) {
        const letters = $$('.letter', el);
        if (!letters.length || reduceMotion || !canHover) return;
        const big = el.classList.contains('about-signature');
        const AMP = big ? 10 : 4.5;
        const GROW = big ? 0.2 : 0.16;
        const sigma = parseFloat(getComputedStyle(el).fontSize) * (big ? 1.5 : 1.7);
        const st = letters.map(() => ({ y: 0, s: 1, ty: 0, ts: 1 }));
        let running = false, mouseX = 0;

        const centers = () => letters.map(l => { const r = l.getBoundingClientRect(); return r.left + r.width / 2; });

        function aim() {
            const cs = centers();
            cs.forEach((cx, i) => {
                const d = (cx - mouseX) / sigma;
                const k = Math.exp(-d * d);
                st[i].ty = -k * AMP;
                st[i].ts = 1 + k * GROW;
            });
            kick();
        }
        function rest() { st.forEach(o => { o.ty = 0; o.ts = 1; }); kick(); }

        function kick() { if (!running) { running = true; requestAnimationFrame(tick); } }
        function tick() {
            let moving = false;
            letters.forEach((l, i) => {
                const o = st[i];
                o.y += (o.ty - o.y) * 0.22;
                o.s += (o.ts - o.s) * 0.22;
                if (Math.abs(o.ty - o.y) > 0.01 || Math.abs(o.ts - o.s) > 0.001) moving = true;
                else { o.y = o.ty; o.s = o.ts; }
                l.style.transform = (o.y === 0 && o.s === 1) ? '' : `translate3d(0, ${o.y.toFixed(2)}px, 0) scale(${o.s.toFixed(3)})`;
            });
            if (moving) requestAnimationFrame(tick); else running = false;
        }

        el.addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { mouseX = e.clientX; aim(); } });
        el.addEventListener('pointerleave', rest);
    }
    $$('.split').forEach(setupLetterSwell);

    const hamburger = $('#hamburger');
    const menu = $('#menu');
    const overlay = $('#blurOverlay');

    function setMenuOpen(open) {
        hamburger.classList.toggle('active', open);
        menu.classList.toggle('active', open);
        overlay.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    }
    hamburger.addEventListener('click', () => setMenuOpen(!menu.classList.contains('active')));
    hamburger.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
    });
    overlay.addEventListener('click', () => setMenuOpen(false));
    document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenuOpen(false); });

    const fadeEls = $$('.fade-in');
    let fadeObserver = null;
    if ('IntersectionObserver' in window) {
        fadeObserver = new IntersectionObserver(entries => {
            entries.forEach(en => {
                if (en.isIntersecting) { en.target.classList.add('visible'); fadeObserver.unobserve(en.target); }
            });
        }, { threshold: 0.12 });
        fadeEls.forEach(el => fadeObserver.observe(el));
    } else {
        fadeEls.forEach(el => el.classList.add('visible'));
    }
    const revealVisible = () => {
        fadeEls.forEach(el => {
            if (el.classList.contains('visible')) return;
            const r = el.getBoundingClientRect();
            if (r.top < innerHeight * 0.92 && r.bottom > 0) {
                el.classList.add('visible');
                if (fadeObserver) fadeObserver.unobserve(el);
            }
        });
    };

    const links = $('.nav-links');
    const indicator = document.createElement('span');
    indicator.className = 'nav-indicator no-anim';
    links.prepend(indicator);

    function placeIndicator(animate = true) {
        const active = $('button.active', links);
        const base = links.getBoundingClientRect();
        if (!active || base.width === 0) { indicator.classList.remove('ready'); return; }
        const r = active.getBoundingClientRect();
        const first = !indicator.classList.contains('ready');
        indicator.classList.toggle('no-anim', !animate || first);
        indicator.style.width = r.width + 'px';
        indicator.style.height = r.height + 'px';
        indicator.style.transform = `translate(${r.left - base.left}px, ${r.top - base.top}px)`;
        indicator.classList.add('ready');
    }
    addEventListener('resize', () => placeIndicator(false));
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => placeIndicator(false));

    const views = $$('.view');
    let coffeeStarted = false;

    let switchToken = 0;
    function showView(target) {
        if (!document.getElementById(target)) target = 'home';
        const token = ++switchToken;
        const current = views.find(v => v.classList.contains('active'));

        $$('.nav-links button, .menu button').forEach(b => b.classList.toggle('active', b.dataset.target === target));
        if (history.replaceState) history.replaceState(null, '', '#' + target);
        placeIndicator(true);

        const swap = () => {
            if (token !== switchToken) return;
            views.forEach(v => { v.classList.remove('leaving'); v.classList.toggle('active', v.id === target); });
            scrollTo({ top: 0 });
            if (target === 'contact') startCoffee();
            requestAnimationFrame(revealVisible);
        };

        if (current && current.id !== target && !reduceMotion) {
            current.classList.add('leaving');
            setTimeout(swap, 160);
        } else swap();
    }

    $$('[data-target]').forEach(btn => btn.addEventListener('click', () => {
        showView(btn.dataset.target);
        setMenuOpen(false);
    }));
    addEventListener('hashchange', () => showView(location.hash.slice(1) || 'home'));

    const navbar = $('.navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', scrollY > 8);
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    function startCoffee() {
        if (coffeeStarted) return;
        coffeeStarted = true;
        const card = $('.coffee-card'), bubble = $('#coffeeBubble');
        const typing = $('#coffeeTyping'), msg = $('#coffeeMessage'), actions = $('#coffeeActions');

        const text = msg.textContent.trim();
        msg.setAttribute('aria-label', text);
        msg.textContent = '';
        text.split(/\s+/).forEach((word, i) => {
            const w = document.createElement('span');
            w.className = 'w'; w.style.setProperty('--i', i); w.setAttribute('aria-hidden', 'true');
            w.textContent = word;
            msg.appendChild(w);
        });
        $$('.coffee-btn', actions).forEach((b, i) => b.style.setProperty('--d', i));

        const measureFinal = () => {
            const cs = getComputedStyle(card);
            const avail = card.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
                        - $('.coffee-avatar', card).offsetWidth - parseFloat(cs.columnGap || cs.gap || 14);
            const probe = document.createElement('div');
            probe.className = 'coffee-bubble';
            probe.style.cssText = `position:absolute;visibility:hidden;left:0;top:0;width:max-content;max-width:${avail}px;height:auto;transition:none;`;
            const m = document.createElement('p');
            m.textContent = text;
            m.style.cssText = 'position:static;display:block;padding:0.6rem 0;font-size:0.95rem;line-height:1.35;';
            probe.appendChild(m);
            card.appendChild(probe);
            const size = { w: Math.ceil(probe.offsetWidth), h: Math.ceil(probe.offsetHeight) };
            probe.remove();
            return size;
        };

        setTimeout(() => {

            bubble.style.width = bubble.offsetWidth + 'px';
            bubble.style.height = bubble.offsetHeight + 'px';
            typing.classList.add('out');

            setTimeout(() => {
                const size = measureFinal();
                void bubble.offsetWidth;
                bubble.style.width = size.w + 'px';
                bubble.style.height = Math.max(size.h, 44) + 'px';
                setTimeout(() => msg.classList.add('show'), 140);
                setTimeout(() => actions.classList.add('show'), 140 + text.split(/\s+/).length * 45 + 250);
            }, 200);
        }, 1500);
    }

    $$('.coffee-btn').forEach(btn => btn.addEventListener('click', () => {
        const toggle = $(`.toggle-option[data-mode="${btn.dataset.coffee}"]`);
        if (toggle) toggle.click();
        const grid = $('.contact-grid');
        grid.classList.add('show');
        grid.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        setTimeout(() => $('#cf-name').focus({ preventScroll: true }), 500);
    }));

    const greetEl = $('#greetingText');
    if (greetEl) {
        const words = ['Namaste 🙏', 'Hello', 'Bonjour', 'Hola', 'こんにちは', '你好', 'Ciao', 'Hallo'];
        const pill = greetEl.closest('.greeting-pill');
        const hand = $('.wave', pill);
        const graphemes = t => ('Segmenter' in Intl)
            ? [...new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(t)].map(x => x.segment)
            : Array.from(t);
        const buildLine = t => {
            const line = document.createElement('span');
            line.className = 'g-line';
            graphemes(t).forEach(ch => {
                const c = document.createElement('span');
                c.className = 'g-ch';
                c.textContent = ch;
                line.appendChild(c);
            });
            return line;
        };

        let gi = 0, line = buildLine(words[0]);
        greetEl.textContent = '';
        greetEl.appendChild(line);

        const swapGreeting = () => {
            gi = (gi + 1) % words.length;
            const next = words[gi];
            if (reduceMotion) { const nl = buildLine(next); line.replaceWith(nl); line = nl; return; }

            const old = line;
            const oldW = greetEl.offsetWidth;
            const nl = buildLine(next);
            nl.classList.add('abs');
            greetEl.appendChild(nl);
            const newW = nl.offsetWidth;
            greetEl.style.width = oldW + 'px';

            $$('.g-ch', old).forEach((c, i) => c.animate(
                [{ transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' },
                 { transform: 'translateY(-125%)', opacity: 0, filter: 'blur(4px)' }],
                { duration: 420, delay: i * 28, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' }));

            $$('.g-ch', nl).forEach((c, i) => c.animate(
                [{ transform: 'translateY(125%)', opacity: 0, filter: 'blur(4px)' },
                 { transform: 'translateY(0)', opacity: 1, filter: 'blur(0)' }],
                { duration: 560, delay: 150 + i * 36, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'both' }));

            const w = greetEl.animate([{ width: oldW + 'px' }, { width: newW + 'px' }],
                { duration: 700, easing: 'cubic-bezier(.34,1.3,.64,1)', fill: 'forwards' });
            w.onfinish = () => {
                old.remove();
                nl.classList.remove('abs');
                greetEl.style.width = '';
                w.cancel();
                line = nl;
            };

            pill.animate(
                [{ transform: 'rotate(-2deg) scale(1)' }, { transform: 'rotate(-2deg) scale(1.06)', offset: .3 }, { transform: 'rotate(-2deg) scale(1)' }],
                { duration: 650, easing: 'cubic-bezier(.34,1.5,.64,1)' });
            if (hand) hand.animate(
                [{ transform: 'rotate(0)' }, { transform: 'rotate(-14deg)', offset: .2 }, { transform: 'rotate(18deg)', offset: .45 },
                 { transform: 'rotate(-8deg)', offset: .7 }, { transform: 'rotate(10deg)', offset: .88 }, { transform: 'rotate(0)' }],
                { duration: 900, easing: 'ease-in-out' });
        };

        const loop = () => {
            if (!document.hidden) swapGreeting();
            setTimeout(loop, 2600);
        };
        setTimeout(loop, 2200);
    }

    if (canHover && !reduceMotion) {
        $$('.photo-slot').forEach(slot => {
            const frame = $('.photo-frame', slot);
            let raf = 0;
            slot.addEventListener('pointerenter', () => frame.classList.add('tracking'));
            slot.addEventListener('pointermove', e => {
                if (e.pointerType !== 'mouse') return;
                cancelAnimationFrame(raf);
                raf = requestAnimationFrame(() => {
                    const r = frame.getBoundingClientRect();
                    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
                    const y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
                    frame.style.transform = `perspective(700px) rotateX(${((0.5 - y) * 12).toFixed(2)}deg) rotateY(${((x - 0.5) * 12).toFixed(2)}deg)`;
                    frame.style.setProperty('--gx', (x * 100) + '%');
                    frame.style.setProperty('--gy', (y * 100) + '%');
                });
            });
            slot.addEventListener('pointerleave', () => {
                cancelAnimationFrame(raf);
                frame.classList.remove('tracking');
                frame.style.transform = '';
            });
        });
    }

    const panel = $('.about-panel');
    if (panel && canHover && !reduceMotion) {
        let raf = 0;
        panel.addEventListener('pointerenter', () => panel.classList.add('lit'));
        panel.addEventListener('pointerleave', () => panel.classList.remove('lit'));
        panel.addEventListener('pointermove', e => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const r = panel.getBoundingClientRect();
                panel.style.setProperty('--sx', (e.clientX - r.left) + 'px');
                panel.style.setProperty('--sy', (e.clientY - r.top) + 'px');
            });
        });
    }

    const sign = $('.about-sign');
    if (sign) {
        const ribbon = $('.sign-ribbon', sign);
        let done = false;
        ribbon.addEventListener('animationend', () => { done = true; });
        const replay = () => {
            if (!done) return;
            done = false;
            sign.classList.add('reset');
            void sign.offsetWidth;
            sign.classList.remove('reset');
        };
        sign.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') replay(); });
        sign.addEventListener('click', replay);
    }

    $$('.project-card').forEach(card => {
        const link = $('a.project-link', card);
        if (link) {
            card.classList.add('has-link');
            card.addEventListener('click', e => {
                if (e.target.closest('a')) return;
                if (String(getSelection()).length) return;
                window.open(link.href, '_blank', 'noopener');
            });
        }
        if (!canHover || reduceMotion) return;
        let frame = 0;
        card.addEventListener('pointermove', e => {
            if (e.pointerType !== 'mouse') return;
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                card.style.setProperty('--mx', x * 100 + '%');
                card.style.setProperty('--my', y * 100 + '%');
                card.style.setProperty('--px', (x - 0.5).toFixed(3));
                card.style.setProperty('--py', (y - 0.5).toFixed(3));
            });
        });
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(frame);
            card.style.setProperty('--px', 0);
            card.style.setProperty('--py', 0);
        });
    });

    const toggleWrap = $('#contactToggle');
    const form = $('#contactForm');
    const status = $('#formStatus');
    const sendBtn = $('#sendBtn');
    let mode = 'hi';

    $$('.toggle-option', toggleWrap).forEach(opt => opt.addEventListener('click', () => {
        $$('.toggle-option', toggleWrap).forEach(o => o.classList.remove('active'));
        opt.classList.add('active');
        mode = opt.dataset.mode;
        status.textContent = '';
    }));

    $$('.form-field input, .form-field textarea').forEach(el =>
        el.addEventListener('input', () => el.closest('.form-field').classList.remove('invalid')));

    const sleep = ms => new Promise(r => setTimeout(r, ms));
    function setStatus(text, error = false) {
        status.style.opacity = '0';
        setTimeout(() => {
            status.textContent = text;
            status.style.opacity = '1';
            if (error) { status.classList.remove('shake'); void status.offsetWidth; status.classList.add('shake'); }
        }, 120);
    }

    function burst(origin) {
        if (reduceMotion) return;
        const r = origin.getBoundingClientRect();
        const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const colors = ['#EF3E3E', '#F6ABA0', '#0F0F1B', '#30b350'];
        for (let i = 0; i < 14; i++) {
            const d = document.createElement('span');
            d.className = 'confetti';
            d.style.background = colors[i % colors.length];
            d.style.left = cx + 'px'; d.style.top = cy + 'px';
            document.body.appendChild(d);
            const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
            const dist = 50 + Math.random() * 50;
            d.animate([
                { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
                { transform: `translate(${Math.cos(ang) * dist - 3}px, ${Math.sin(ang) * dist - 3}px) scale(0.3)`, opacity: 0 }
            ], { duration: 700 + Math.random() * 300, easing: 'cubic-bezier(.2,.8,.2,1)' }).onfinish = () => d.remove();
        }
    }

    form.addEventListener('submit', async e => {
        e.preventDefault();
        if (sendBtn.classList.contains('sending')) return;

        const name = $('#cf-name').value.trim();
        const email = $('#cf-email').value.trim();
        const message = $('#cf-message').value.trim();

        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        $('#cf-email').closest('.form-field').classList.toggle('invalid', !emailOk);
        $('#cf-message').closest('.form-field').classList.toggle('invalid', !message);
        if (!emailOk || !message) {
            setStatus(!message && emailOk ? 'Please write a message.' : 'Please enter a valid email and message.', true);
            return;
        }

        sendBtn.disabled = true;
        sendBtn.classList.remove('done');
        void sendBtn.offsetWidth;
        sendBtn.classList.add('sending');
        setStatus('Sending…');

        const started = Date.now();
        const MIN_MS = 950;
        let ok = false;

        try {
            const res = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: 'bf2a28a5-e9a5-4d0d-9652-2e4ff2d4b8d1',
                    subject: `${mode === 'collaborate' ? 'Collaboration request' : 'Message'} from ${name || 'your site'}`,
                    name: name || 'Website visitor',
                    email, message
                })
            });
            const data = await res.json();
            ok = res.ok && data.success;
        } catch (_) { ok = false; }

        const wait = MIN_MS - (Date.now() - started);
        if (wait > 0) await sleep(wait);

        sendBtn.classList.remove('sending');
        if (ok) {
            sendBtn.classList.add('done');
            burst(sendBtn);
            setStatus('Message sent — thanks for reaching out!');
            form.reset();
            await sleep(2600);
            sendBtn.classList.remove('done');
            status.style.opacity = '0';
            await sleep(300);
            status.textContent = '';
            status.style.opacity = '1';
        } else {
            setStatus('Something went wrong. Please try again.', true);
        }
        sendBtn.disabled = false;
    });

    if (navigator.vibrate && !canHover) {
        $$('[data-target], .coffee-btn, .btn-send').forEach(b =>
            b.addEventListener('click', () => navigator.vibrate(8), { passive: true }));
    }

    showView(location.hash.slice(1) || 'home');
})();
