// Rodino - Advanced Roblox Web UI Editor
(() => {
    // Configuration
    const c = {
        n: 'Rodino',
        v: '2.0.0',
        i: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
        k: 'rodino-storage',
        s: { t: 0.3, e: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' },
        h: 'https://cdn.jsdelivr.net/npm/sweetalert2@11'
    };

    // Check for existing instance
    if (window.r) return console.warn(`${c.n} is already loaded!`);
    window.r = true;

    // Load dependencies
    const l = (u, d) => {
        return new Promise(resolve => {
            if (u.endsWith('.css')) {
                const e = document.createElement('link');
                e.rel = 'stylesheet', e.href = u;
                document.head.appendChild(e);
                e.onload = resolve;
            } else {
                const e = document.createElement('script');
                e.src = u;
                document.head.appendChild(e);
                e.onload = resolve;
            }
        });
    };

    // Main class
    class R {
        constructor() {
            this.u = {}; // UI elements
            this.s = JSON.parse(localStorage.getItem(c.k)) || { // Settings
                p: { x: 20, y: 20 }, // Position
                a: true, // Animations
                t: 0, // Active tab
                th: 'dark', // Theme
                c: [] // Custom CSS rules
            };
            this.a = []; // Animations
            this._();
        }

        // Initialize
        _() {
            Promise.all([
                l(c.i),
                l(c.h)
            ]).then(() => {
                this._c(), this._h(), this._e(), this._l();
                this._a('Rodino loaded successfully!', 'success');
            });
        }

        // Create UI
        _c() {
            // Main container
            const m = document.createElement('div');
            m.id = 'rodino-main';
            m.style = `position:fixed;top:${this.s.p.y}px;left:${this.s.p.x}px;width:380px;
                background:#1e1e2e;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.2);
                z-index:9999;transform:translateY(-20px);opacity:0;
                transition:all ${this.s.a ? c.s.t : 0}s ${c.s.e}`;
            
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
                tn.style = `padding:8px 12px;background:${i===this.s.t?'#313244':'transparent'};
                    border:none;border-radius:6px;color:#cdd6f4;cursor:pointer;font-size:13px`;
                tn.onclick = () => this._t(i);
                tb.appendChild(tn);
            });
            
            // Editor panel
            const ep = document.createElement('div');
            ep.id = 'rodino-editor';
            ep.style = `display:${this.s.t===0?'block':'none'}`;
            ep.innerHTML = `<div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">CSS Selector</span>
                        <i class="fas fa-question-circle" style="color:#7f849c;cursor:pointer"
                            title="Target Roblox elements with CSS selectors"></i>
                    </div>
                    <input id="rodino-selector" type="text" placeholder="e.g. .header, #navbar" 
                        style="width:100%;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px">
                </div>
                <div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">CSS Properties</span>
                        <div style="display:flex;gap:8px">
                            <i class="fas fa-magic" style="color:#7f849c;cursor:pointer" 
                                title="Apply example styling"></i>
                            <i class="fas fa-save" style="color:#7f849c;cursor:pointer" 
                                title="Save this rule"></i>
                        </div>
                    </div>
                    <textarea id="rodino-properties" placeholder="e.g. color: red; background: #000;" 
                        style="width:100%;height:100px;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px;resize:vertical"></textarea>
                </div>
                <div style="display:flex;gap:10px;margin-bottom:15px">
                    <button id="rodino-preview" style="flex:1;padding:10px;background:#585b70;border:none;
                        border-radius:6px;color:#cdd6f4;font-weight:600;cursor:pointer">
                        <i class="fas fa-eye"></i> Preview
                    </button>
                    <button id="rodino-apply" style="flex:1;padding:10px;background:#cba6f7;border:none;
                        border-radius:6px;color:#1e1e1e;font-weight:600;cursor:pointer">
                        <i class="fas fa-check"></i> Apply
                    </button>
                </div>
                <div id="rodino-saved-rules" style="border-top:1px solid #313244;padding-top:15px">
                    <div style="font-size:13px;color:#cdd6f4;margin-bottom:10px">Saved Rules</div>
                    <div id="rodino-rules-list" style="display:flex;flex-direction:column;gap:8px"></div>
                </div>`;
            
            // Themes panel
            const tp = document.createElement('div');
            tp.id = 'rodino-themes';
            tp.style = `display:${this.s.t===1?'block':'none'}`;
            tp.innerHTML = `<div style="color:#cdd6f4;font-size:13px;margin-bottom:15px">
                    Select a theme to apply to the Roblox UI
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
                    ${[
                        { id: 'dark', name: 'Dark', colors: ['#1e1e2e', '#313244', '#cdd6f4'] },
                        { id: 'light', name: 'Light', colors: ['#f5f5f5', '#e0e0e0', '#333333'] },
                        { id: 'oled', name: 'OLED', colors: ['#000000', '#111111', '#ffffff'] },
                        { id: 'midnight', name: 'Midnight', colors: ['#0f0f1a', '#1a1a2e', '#d1d1e0'] },
                        { id: 'sunset', name: 'Sunset', colors: ['#2a1a3d', '#4a2a5a', '#f8d7da'] },
                        { id: 'custom', name: 'Custom', colors: ['#1e1e2e', '#313244', '#cdd6f4'] }
                    ].map(th => `
                        <div id="rodino-theme-${th.id}" class="rodino-theme" 
                            style="background:${th.colors[1]};padding:15px;border-radius:8px;cursor:pointer;
                            border:2px solid ${this.s.th===th.id?'#cba6f7':'transparent'}">
                            <div style="display:flex;justify-content:space-between">
                                <span style="color:${th.colors[2]};font-weight:600">${th.name}</span>
                                ${this.s.th===th.id?`<i class="fas fa-check" style="color:#a6e3a1"></i>`:''}
                            </div>
                            <div style="display:flex;margin-top:8px;height:10px;border-radius:5px;overflow:hidden">
                                <div style="flex:1;background:${th.colors[0]}"></div>
                                <div style="flex:1;background:${th.colors[1]}"></div>
                                <div style="flex:1;background:${th.colors[2]}"></div>
                            </div>
                        </div>
                    `).join('')}
                </div>`;
            
            // Settings panel
            const sp = document.createElement('div');
            sp.id = 'rodino-settings';
            sp.style = `display:${this.s.t===2?'block':'none'}`;
            sp.innerHTML = `<div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">UI Position</span>
                    </div>
                    <select id="rodino-position" style="width:100%;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px">
                        <option value="tr" ${this.s.p.x>window.innerWidth/2&&this.s.p.y<window.innerHeight/2?'selected':''}>Top Right</option>
                        <option value="tl" ${this.s.p.x<window.innerWidth/2&&this.s.p.y<window.innerHeight/2?'selected':''}>Top Left</option>
                        <option value="br" ${this.s.p.x>window.innerWidth/2&&this.s.p.y>window.innerHeight/2?'selected':''}>Bottom Right</option>
                        <option value="bl" ${this.s.p.x<window.innerWidth/2&&this.s.p.y>window.innerHeight/2?'selected':''}>Bottom Left</option>
                    </select>
                </div>
                <div style="margin-bottom:15px">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                        <input id="rodino-animations" type="checkbox" ${this.s.a?'checked':''} style="accent-color:#cba6f7">
                        <span style="font-size:13px;color:#cdd6f4">Enable animations</span>
                    </label>
                </div>
                <div style="margin-bottom:15px">
                    <div style="font-size:13px;color:#cdd6f4;margin-bottom:8px">Reset Options</div>
                    <button id="rodino-reset" style="width:100%;padding:10px;background:#f38ba8;border:none;
                        border-radius:6px;color:#1e1e1e;font-weight:600;cursor:pointer">
                        <i class="fas fa-trash"></i> Reset All Settings
                    </button>
                </div>`;
            
            ct.appendChild(tb), ct.appendChild(ep), ct.appendChild(tp), ct.appendChild(sp);
            m.appendChild(ct);
            
            document.body.appendChild(m);
            this.u = { 
                m, h, b: b.children, tb: tb.children, p: [ep, tp, sp],
                s: m.querySelector('#rodino-selector'),
                pr: m.querySelector('#rodino-properties'),
                rl: m.querySelector('#rodino-rules-list')
            };
            
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
            let p = { x: 0, y: 0, o: false, ox: this.s.p.x, oy: this.s.p.y };
            this.u.h.onmousedown = e => {
                p = { x: e.clientX, y: e.clientY, o: true, ox: parseInt(this.u.m.style.left), oy: parseInt(this.u.m.style.top) };
                this.u.m.style.transition = 'none';
                document.onmousemove = e => {
                    if (!p.o) return;
                    const x = p.ox + (e.clientX - p.x), y = p.oy + (e.clientY - p.y);
                    this.u.m.style.left = `${x}px`;
                    this.u.m.style.top = `${y}px`;
                };
                document.onmouseup = () => {
                    p.o = false;
                    this.s.p = { 
                        x: parseInt(this.u.m.style.left), 
                        y: parseInt(this.u.m.style.top) 
                    };
                    this._sv();
                    this.u.m.style.transition = `all ${this.s.a ? c.s.t : 0}s ${c.s.e}`;
                    document.onmousemove = null;
                };
            };
        }

        // Switch tabs
        _t(i) {
            this.s.t = i;
            this._sv();
            this.u.tb.forEach((x, j) => {
                x.style.background = j === i ? '#313244' : 'transparent';
                this.u.p[j].style.display = j === i ? 'block' : 'none';
            });
        }

        // Close UI
        _x() {
            this.u.m.style.transform = 'translateY(-20px)';
            this.u.m.style.opacity = '0';
            setTimeout(() => {
                this.u.m.remove();
                window.r = false;
            }, this.s.a ? c.s.t * 1000 : 0);
        }

        // Event listeners
        _e() {
            // Editor functionality
            const a = this.u.m.querySelector('#rodino-apply');
            const p = this.u.m.querySelector('#rodino-preview');
            const m = this.u.m.querySelector('.fa-magic');
            const sa = this.u.m.querySelector('.fa-save');
            
            a.onclick = () => this._ap();
            p.onclick = () => this._pr();
            m.onclick = () => this._ex();
            sa.onclick = () => this._sr();
            
            // Themes functionality
            document.querySelectorAll('.rodino-theme').forEach(t => {
                t.onclick = () => {
                    const th = t.id.replace('rodino-theme-', '');
                    this.s.th = th;
                    this._sv();
                    this._th();
                    document.querySelectorAll('.rodino-theme').forEach(x => {
                        x.style.borderColor = x.id === t.id ? '#cba6f7' : 'transparent';
                        const ic = x.querySelector('.fa-check');
                        if (ic) ic.style.display = x.id === t.id ? 'inline-block' : 'none';
                    });
                };
            });
            
            // Settings functionality
            const po = this.u.m.querySelector('#rodino-position');
            const an = this.u.m.querySelector('#rodino-animations');
            const rs = this.u.m.querySelector('#rodino-reset');
            
            po.onchange = () => {
                const v = po.value;
                let x, y;
                switch(v) {
                    case 'tr': x = window.innerWidth - 400; y = 20; break;
                    case 'tl': x = 20; y = 20; break;
                    case 'br': x = window.innerWidth - 400; y = window.innerHeight - 500; break;
                    case 'bl': x = 20; y = window.innerHeight - 500; break;
                }
                this.u.m.style.left = `${x}px`;
                this.u.m.style.top = `${y}px`;
                this.s.p = { x, y };
                this._sv();
            };
            
            an.onchange = () => {
                this.s.a = an.checked;
                this._sv();
                this.u.m.style.transition = `all ${this.s.a ? c.s.t : 0}s ${c.s.e}`;
            };
            
            rs.onclick = () => {
                Swal.fire({
                    title: 'Reset Settings?',
                    text: 'This will reset all Rodino settings to default',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#cba6f7',
                    cancelButtonColor: '#f38ba8',
                    confirmButtonText: 'Reset'
                }).then(r => {
                    if (r.isConfirmed) {
                        localStorage.removeItem(c.k);
                        this.s = {
                            p: { x: 20, y: 20 },
                            a: true,
                            t: 0,
                            th: 'dark',
                            c: []
                        };
                        this._sv();
                        location.reload();
                    }
                });
            };
            
            // Load saved rules
            this._lr();
        }

        // Apply CSS
        _ap() {
            const s = this.u.s.value.trim();
            const p = this.u.pr.value.trim();
            if (!s || !p) return this._a('Please enter both selector and properties', 'error');
            
            try {
                document.querySelectorAll(s).forEach(e => {
                    e.style.cssText += p;
                });
                this._a('CSS applied successfully!', 'success');
            } catch (e) {
                this._a(`Error applying CSS: ${e.message}`, 'error');
            }
        }

        // Preview CSS
        _pr() {
            const s = this.u.s.value.trim();
            const p = this.u.pr.value.trim();
            if (!s || !p) return this._a('Please enter both selector and properties', 'error');
            
            try {
                const id = 'rodino-preview-style';
                let st = document.getElementById(id);
                if (!st) {
                    st = document.createElement('style');
                    st.id = id;
                    document.head.appendChild(st);
                }
                st.textContent = `${s} { ${p} }`;
                this._a('Preview active - click Apply to make permanent', 'info');
            } catch (e) {
                this._a(`Error previewing CSS: ${e.message}`, 'error');
            }
        }

        // Save rule
        _sr() {
            const s = this.u.s.value.trim();
            const p = this.u.pr.value.trim();
            if (!s || !p) return this._a('Please enter both selector and properties', 'error');
            
            this.s.c = this.s.c.filter(r => r.s !== s);
            this.s.c.unshift({ s, p });
            this._sv();
            this._lr();
            this._a('Rule saved successfully!', 'success');
        }

        // Load rules
        _lr() {
            this.u.rl.innerHTML = '';
            if (!this.s.c.length) {
                this.u.rl.innerHTML = `<div style="color:#7f849c;font-size:12px;text-align:center">
                    No saved rules yet</div>`;
                return;
            }
            
            this.s.c.forEach((r, i) => {
                const el = document.createElement('div');
                el.style = 'background:#313244;border-radius:6px;padding:10px;font-size:12px';
                el.innerHTML = `<div style="display:flex;justify-content:space-between;margin-bottom:5px">
                        <span style="color:#cdd6f4;font-weight:600">${r.s}</span>
                        <div style="display:flex;gap:5px">
                            <i class="fas fa-edit" style="color:#7f849c;cursor:pointer" 
                                title="Edit this rule"></i>
                            <i class="fas fa-trash" style="color:#f38ba8;cursor:pointer" 
                                title="Delete this rule"></i>
                        </div>
                    </div>
                    <div style="color:#a6adc8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                        ${r.p.replace(/;/g, '; ')}
                    </div>`;
                
                el.querySelector('.fa-edit').onclick = () => {
                    this.u.s.value = r.s;
                    this.u.pr.value = r.p;
                    this._t(0);
                };
                
                el.querySelector('.fa-trash').onclick = () => {
                    this.s.c.splice(i, 1);
                    this._sv();
                    this._lr();
                    this._a('Rule deleted', 'info');
                };
                
                this.u.rl.appendChild(el);
            });
        }

        // Example CSS
        _ex() {
            const ex = [
                { s: '.game-top-header', p: 'background: linear-gradient(135deg, #cba6f7 0%, #89b4fa 100%) !important; color: #1e1e1e !important;' },
                { s: '.avatar-card', p: 'border: 2px solid #cba6f7 !important; border-radius: 12px !important;' },
                { s: '.item-container', p: 'background: #313244 !important; box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;' }
            ];
            const r = ex[Math.floor(Math.random() * ex.length)];
            this.u.s.value = r.s;
            this.u.pr.value = r.p;
            this._a('Example loaded - edit as needed', 'info');
        }

        // Apply theme
        _th() {
            const st = document.getElementById('rodino-theme-style');
            if (st) st.remove();
            
            if (this.s.th === 'custom') return;
            
            const th = {
                dark: { bg: '#1e1e2e', sec: '#313244', text: '#cdd6f4', pri: '#cba6f7' },
                light: { bg: '#f5f5f5', sec: '#e0e0e0', text: '#333333', pri: '#6c5ce7' },
                oled: { bg: '#000000', sec: '#111111', text: '#ffffff', pri: '#ff4757' },
                midnight: { bg: '#0f0f1a', sec: '#1a1a2e', text: '#d1d1e0', pri: '#6d44dc' },
                sunset: { bg: '#2a1a3d', sec: '#4a2a5a', text: '#f8d7da', pri: '#ff7aa2' }
            }[this.s.th];
            
            const css = `
                body {
                    --rodino-bg: ${th.bg};
                    --rodino-sec: ${th.sec};
                    --rodino-text: ${th.text};
                    --rodino-pri: ${th.pri};
                }
                .game-top-header, .game-header {
                    background: ${th.bg} !important;
                    color: ${th.text} !important;
                }
                .avatar-card, .item-container, .game-card {
                    background: ${th.sec} !important;
                    color: ${th.text} !important;
                }
                .btn-primary, .btn-cta {
                    background: ${th.pri} !important;
                    color: ${th.bg} !important;
                }
            `;
            
            const e = document.createElement('style');
            e.id = 'rodino-theme-style';
            e.textContent = css;
            document.head.appendChild(e);
        }

        // Save settings
        _sv() {
            localStorage.setItem(c.k, JSON.stringify(this.s));
        }

        // Alert helper
        _a(m, t) {
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: t,
                title: m,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e1e2e',
                color: '#cdd6f4'
            });
        }
    }

    // Initialize
    new R();
})();
