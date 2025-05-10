// Rodino - Roblox Web UI Editor
(() => {
    // Configuration
    const c = {
        n: 'Rodino',
        v: '1.0.0',
        i: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        k: 'rodino-storage',
        s: { t: 0.3, e: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    };

    // Check for existing instance
    if (window.r) return console.warn(`${c.n} is already loaded!`);
    window.r = true;

    // Load FA
    const l = d => {
        const e = document.createElement('link');
        e.rel = 'stylesheet', e.href = c.i;
        document.head.appendChild(e);
        e.onload = d;
    };

    // Main class
    class R {
        constructor() {
            this.u = {}; // UI elements
            this.s = JSON.parse(localStorage.getItem(c.k)) || {}; // Settings
            this.a = []; // Animations
            this._();
        }

        // Initialize
        _() {
            this._c(), this._h(), this._e(), this._l();
        }

        // Create UI
        _c() {
            // Container
            const m = document.createElement('div');
            m.id = 'rodino-main';
            m.style = `position:fixed;top:20px;right:20px;width:350px;background:#1e1e2e;
                border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);z-index:9999;
                transform:translateY(-20px);opacity:0;transition:all ${c.s.t}s ${c.s.e}`;
            
            // Header
            const h = document.createElement('div');
            h.style = `padding:15px;display:flex;justify-content:space-between;
                align-items:center;border-bottom:1px solid #313244;cursor:move`;
            
            const t = document.createElement('div');
            t.style = 'display:flex;align-items:center;gap:10px';
            t.innerHTML = `<i class="fas fa-paint-brush" style="color:#cba6f7"></i>
                <span style="font-weight:600;color:#cdd6f4">${c.n}</span>
                <span style="font-size:12px;color:#7f849c">v${c.v}</span>`;
            
            const b = document.createElement('div');
            b.style = 'display:flex;gap:8px';
            b.innerHTML = `<i class="fas fa-window-minimize" style="color:#7f849c;cursor:pointer"></i>
                <i class="fas fa-times" style="color:#7f849c;cursor:pointer"></i>`;
            
            h.appendChild(t), h.appendChild(b), m.appendChild(h);
            
            // Content
            const ct = document.createElement('div');
            ct.id = 'rodino-content';
            ct.style = 'padding:15px;max-height:500px;overflow-y:auto';
            
            // Tabs
            const tb = document.createElement('div');
            tb.style = 'display:flex;gap:5px;margin-bottom:15px';
            ['Editor', 'Themes', 'Settings'].forEach((x, i) => {
                const tn = document.createElement('button');
                tn.textContent = x;
                tn.style = `padding:8px 12px;background:${i===0?'#313244':'transparent'};
                    border:none;border-radius:6px;color:#cdd6f4;cursor:pointer;font-size:13px`;
                tn.onclick = () => this._t(i);
                tb.appendChild(tn);
            });
            
            // Editor panel
            const ep = document.createElement('div');
            ep.id = 'rodino-editor';
            ep.style = 'display:block';
            ep.innerHTML = `<div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">CSS Selector</span>
                        <i class="fas fa-question-circle" style="color:#7f849c;cursor:help"></i>
                    </div>
                    <input type="text" placeholder="e.g. .header, #navbar" 
                        style="width:100%;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px">
                </div>
                <div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">CSS Properties</span>
                        <i class="fas fa-magic" style="color:#7f849c;cursor:pointer"></i>
                    </div>
                    <textarea placeholder="e.g. color: red; background: #000;" 
                        style="width:100%;height:100px;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px;resize:vertical"></textarea>
                </div>
                <button style="width:100%;padding:10px;background:#cba6f7;border:none;
                    border-radius:6px;color:#1e1e1e;font-weight:600;cursor:pointer">
                    <i class="fas fa-check"></i> Apply Changes
                </button>`;
            
            // Other panels (hidden by default)
            const tp = document.createElement('div');
            tp.id = 'rodino-themes';
            tp.style = 'display:none';
            tp.innerHTML = `<div style="color:#cdd6f4;font-size:13px;margin-bottom:15px">
                    Select a theme to apply to the Roblox UI
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
                    ${['Dark', 'Light', 'OLED', 'Midnight', 'Sunset'].map(x => `
                        <div style="background:#313244;padding:15px;border-radius:8px;cursor:pointer">
                            <div style="display:flex;justify-content:space-between">
                                <span style="color:#cdd6f4;font-weight:600">${x}</span>
                                <i class="fas fa-check" style="color:#a6e3a1;display:none"></i>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            
            const sp = document.createElement('div');
            sp.id = 'rodino-settings';
            sp.style = 'display:none';
            sp.innerHTML = `<div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">UI Position</span>
                    </div>
                    <select style="width:100%;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px">
                        <option>Top Right</option>
                        <option>Top Left</option>
                        <option>Bottom Right</option>
                        <option>Bottom Left</option>
                    </select>
                </div>
                <div style="margin-bottom:15px">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                        <input type="checkbox" style="accent-color:#cba6f7">
                        <span style="font-size:13px;color:#cdd6f4">Enable animations</span>
                    </label>
                </div>`;
            
            ct.appendChild(tb), ct.appendChild(ep), ct.appendChild(tp), ct.appendChild(sp);
            m.appendChild(ct);
            
            document.body.appendChild(m);
            this.u = { m, h, b: b.children, tb: tb.children, p: [ep, tp, sp] };
            
            // Animate in
            setTimeout(() => {
                m.style.transform = 'translateY(0)';
                m.style.opacity = '1';
            }, 100);
        }

        // Handle UI interactions
        _h() {
            // Close button
            this.u.b[1].onclick = () => this._x();
            
            // Minimize button
            this.u.b[0].onclick = () => {
                const ct = this.u.m.querySelector('#rodino-content');
                ct.style.maxHeight = ct.style.maxHeight === '0px' ? '500px' : '0px';
                this.u.b[0].classList.toggle('fa-window-minimize');
                this.u.b[0].classList.toggle('fa-window-restore');
            };
            
            // Make draggable
            let p = { x: 0, y: 0, o: false };
            this.u.h.onmousedown = e => {
                p = { x: e.clientX, y: e.clientY, o: true };
                this.u.m.style.transition = 'none';
                document.onmousemove = e => {
                    if (!p.o) return;
                    const x = e.clientX - p.x, y = e.clientY - p.y;
                    this.u.m.style.transform = `translate(${x}px, ${y}px)`;
                };
                document.onmouseup = () => {
                    p.o = false;
                    this.u.m.style.transition = `all ${c.s.t}s ${c.s.e}`;
                    document.onmousemove = null;
                };
            };
        }

        // Switch tabs
        _t(i) {
            this.u.tb.forEach((x, j) => {
                x.style.background = j === i ? '#313244' : 'transparent';
                this.u.p[j].style.display = j === i ? 'block' : 'none';
            });
        }

        // Close UI
        _x() {
            this.u.m.style.transform = 'translateY(-20px)';
            this.u.m.style.opacity = '0';
            setTimeout(() => this.u.m.remove(), c.s.t * 1000);
            window.r = false;
        }

        // Event listeners
        _e() {
            // customizable
        }

        // Load settings
        _l() {
            // Load any saved settings
        }
    }

    // Initialize after FA loads
    l(() => new R());
})();
