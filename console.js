// Rodino - Self-Contained Roblox UI Editor
(() => {
    // Configuration
    const c = {
        n: 'Rodino',
        v: '2.1.0',
        k: 'rodino-storage',
        s: { t: 0.3, e: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' }
    };

    // Check for existing instance
    if (window.rodinoLoaded) return console.warn(`${c.n} is already loaded!`);
    window.rodinoLoaded = true;

    // Self-contained FA icons (minimal set)
    const faCSS = `
    @font-face {
        font-family: 'Font Awesome';
        font-style: normal;
        font-weight: 900;
        src: url("data:font/woff2;charset=utf-8;base64,d09GMgABAAAAA...") format('woff2');
    }
    .fas {
        font-family: 'Font Awesome';
        font-weight: 900;
        -moz-osx-font-smoothing: grayscale;
        -webkit-font-smoothing: antialiased;
        display: inline-block;
        font-style: normal;
        font-variant: normal;
        text-rendering: auto;
        line-height: 1;
    }
    .fa-paint-brush:before { content: "\\f1fc" }
    .fa-window-minimize:before { content: "\\f2d1" }
    .fa-window-restore:before { content: "\\f2d2" }
    .fa-times:before { content: "\\f00d" }
    .fa-question-circle:before { content: "\\f059" }
    .fa-magic:before { content: "\\f0d0" }
    .fa-save:before { content: "\\f0c7" }
    .fa-eye:before { content: "\\f06e" }
    .fa-check:before { content: "\\f00c" }
    .fa-edit:before { content: "\\f044" }
    .fa-trash:before { content: "\\f1f8" }`;

    // Self-contained alert system
    class RodinoAlert {
        static show(m, t) {
            const a = document.createElement('div');
            a.id = 'rodino-alert';
            a.style = `position:fixed;top:20px;right:20px;padding:15px;background:#1e1e2e;
                color:#cdd6f4;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.15);
                z-index:10000;display:flex;align-items:center;gap:10px;
                border-left:4px solid ${t === 'error' ? '#f38ba8' : t === 'success' ? '#a6e3a1' : '#cba6f7'}`;
            
            const i = document.createElement('div');
            i.style = `width:20px;height:20px;border-radius:50%;display:flex;
                align-items:center;justify-content:center;background:${t === 'error' ? '#f38ba8' : t === 'success' ? '#a6e3a1' : '#cba6f7'};
                color:#1e1e1e;font-weight:bold;font-size:12px`;
            i.textContent = t === 'error' ? '!' : t === 'success' ? '✓' : 'i';
            
            const txt = document.createElement('div');
            txt.textContent = m;
            
            a.appendChild(i), a.appendChild(txt);
            document.body.appendChild(a);
            
            setTimeout(() => {
                a.style.opacity = '0';
                setTimeout(() => a.remove(), 300);
            }, 3000);
        }
    }

    // Main class
    class Rodino {
        constructor() {
            this.ui = {};
            this.settings = JSON.parse(localStorage.getItem(c.k)) || {
                position: { x: 20, y: 20 },
                animations: true,
                activeTab: 0,
                theme: 'dark',
                customRules: []
            };
            this._injectStyles();
            this._createUI();
            this._setupEventHandlers();
            this._loadSavedRules();
            this._applyTheme();
            RodinoAlert.show('Rodino loaded successfully!', 'success');
        }

        _injectStyles() {
            const style = document.createElement('style');
            style.textContent = faCSS + `
                #rodino-main {
                    position: fixed;
                    top: ${this.settings.position.y}px;
                    left: ${this.settings.position.x}px;
                    width: 380px;
                    background: #1e1e2e;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.2);
                    z-index: 9999;
                    transform: translateY(-20px);
                    opacity: 0;
                    transition: all ${this.settings.animations ? c.s.t : 0}s ${c.s.e};
                }
                #rodino-header {
                    padding: 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #313244;
                    cursor: move;
                }
                /* Additional styles for the rest of the UI... */
            `;
            document.head.appendChild(style);
        }

        _createUI() {
            const main = document.createElement('div');
            main.id = 'rodino-main';
            
            // Header
            const header = document.createElement('div');
            header.id = 'rodino-header';
            header.innerHTML = `
                <div style="display:flex;align-items:center;gap:10px">
                    <i class="fas fa-paint-brush" style="color:#cba6f7"></i>
                    <span style="font-weight:600;color:#cdd6f4">${c.n}</span>
                    <span style="font-size:12px;color:#7f849c">v${c.v}</span>
                </div>
                <div style="display:flex;gap:8px">
                    <i class="fas fa-window-minimize" style="color:#7f849c;cursor:pointer"></i>
                    <i class="fas fa-times" style="color:#7f849c;cursor:pointer"></i>
                </div>
            `;
            
            // Content
            const content = document.createElement('div');
            content.id = 'rodino-content';
            content.style = 'padding:15px;max-height:500px;overflow-y:auto';
            
            // Tabs
            const tabs = document.createElement('div');
            tabs.style = 'display:flex;gap:5px;margin-bottom:15px';
            ['Editor', 'Themes', 'Settings'].forEach((tabName, index) => {
                const tab = document.createElement('button');
                tab.textContent = tabName;
                tab.style = `padding:8px 12px;background:${
                    index === this.settings.activeTab ? '#313244' : 'transparent'
                };border:none;border-radius:6px;color:#cdd6f4;cursor:pointer;font-size:13px`;
                tab.onclick = () => this._switchTab(index);
                tabs.appendChild(tab);
            });
            
            // Editor panel
            const editorPanel = this._createEditorPanel();
            const themesPanel = this._createThemesPanel();
            const settingsPanel = this._createSettingsPanel();
            
            content.appendChild(tabs);
            content.appendChild(editorPanel);
            content.appendChild(themesPanel);
            content.appendChild(settingsPanel);
            
            main.appendChild(header);
            main.appendChild(content);
            
            document.body.appendChild(main);
            
            this.ui = {
                main,
                header,
                minimizeBtn: header.querySelector('.fa-window-minimize'),
                closeBtn: header.querySelector('.fa-times'),
                tabs: Array.from(tabs.children),
                panels: [editorPanel, themesPanel, settingsPanel],
                selectorInput: editorPanel.querySelector('#rodino-selector'),
                propertiesInput: editorPanel.querySelector('#rodino-properties'),
                rulesList: editorPanel.querySelector('#rodino-rules-list')
            };
            
            // Animate in
            setTimeout(() => {
                main.style.transform = 'translateY(0)';
                main.style.opacity = '1';
            }, 100);
        }

        _createEditorPanel() {
            const panel = document.createElement('div');
            panel.id = 'rodino-editor';
            panel.style = `display:${
                this.settings.activeTab === 0 ? 'block' : 'none'
            }`;
            panel.innerHTML = `
                <div style="margin-bottom:15px">
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
                </div>
            `;
            return panel;
        }

        _createThemesPanel() {
            const panel = document.createElement('div');
            panel.id = 'rodino-themes';
            panel.style = `display:${
                this.settings.activeTab === 1 ? 'block' : 'none'
            }`;
            
            const themes = [
                { id: 'dark', name: 'Dark', colors: ['#1e1e2e', '#313244', '#cdd6f4'] },
                { id: 'light', name: 'Light', colors: ['#f5f5f5', '#e0e0e0', '#333333'] },
                { id: 'oled', name: 'OLED', colors: ['#000000', '#111111', '#ffffff'] },
                { id: 'midnight', name: 'Midnight', colors: ['#0f0f1a', '#1a1a2e', '#d1d1e0'] },
                { id: 'sunset', name: 'Sunset', colors: ['#2a1a3d', '#4a2a5a', '#f8d7da'] }
            ];
            
            let themesHTML = `
                <div style="color:#cdd6f4;font-size:13px;margin-bottom:15px">
                    Select a theme to apply to the Roblox UI
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
            `;
            
            themes.forEach(theme => {
                themesHTML += `
                    <div id="rodino-theme-${theme.id}" class="rodino-theme" 
                        style="background:${theme.colors[1]};padding:15px;border-radius:8px;cursor:pointer;
                        border:2px solid ${
                            this.settings.theme === theme.id ? '#cba6f7' : 'transparent'
                        }">
                        <div style="display:flex;justify-content:space-between">
                            <span style="color:${theme.colors[2]};font-weight:600">${theme.name}</span>
                            ${
                                this.settings.theme === theme.id ? 
                                `<i class="fas fa-check" style="color:#a6e3a1"></i>` : 
                                ''
                            }
                        </div>
                        <div style="display:flex;margin-top:8px;height:10px;border-radius:5px;overflow:hidden">
                            <div style="flex:1;background:${theme.colors[0]}"></div>
                            <div style="flex:1;background:${theme.colors[1]}"></div>
                            <div style="flex:1;background:${theme.colors[2]}"></div>
                        </div>
                    </div>
                `;
            });
            
            themesHTML += `</div>`;
            panel.innerHTML = themesHTML;
            return panel;
        }

        _createSettingsPanel() {
            const panel = document.createElement('div');
            panel.id = 'rodino-settings';
            panel.style = `display:${
                this.settings.activeTab === 2 ? 'block' : 'none'
            }`;
            panel.innerHTML = `
                <div style="margin-bottom:15px">
                    <div style="display:flex;justify-content:space-between;margin-bottom:8px">
                        <span style="font-size:13px;color:#cdd6f4">UI Position</span>
                    </div>
                    <select id="rodino-position" style="width:100%;padding:10px;background:#313244;border:none;
                        border-radius:6px;color:#cdd6f4;font-size:13px">
                        <option value="tr" ${
                            this.settings.position.x > window.innerWidth/2 && 
                            this.settings.position.y < window.innerHeight/2 ? 'selected' : ''
                        }>Top Right</option>
                        <option value="tl" ${
                            this.settings.position.x < window.innerWidth/2 && 
                            this.settings.position.y < window.innerHeight/2 ? 'selected' : ''
                        }>Top Left</option>
                        <option value="br" ${
                            this.settings.position.x > window.innerWidth/2 && 
                            this.settings.position.y > window.innerHeight/2 ? 'selected' : ''
                        }>Bottom Right</option>
                        <option value="bl" ${
                            this.settings.position.x < window.innerWidth/2 && 
                            this.settings.position.y > window.innerHeight/2 ? 'selected' : ''
                        }>Bottom Left</option>
                    </select>
                </div>
                <div style="margin-bottom:15px">
                    <label style="display:flex;align-items:center;gap:8px;cursor:pointer">
                        <input id="rodino-animations" type="checkbox" ${
                            this.settings.animations ? 'checked' : ''
                        } style="accent-color:#cba6f7">
                        <span style="font-size:13px;color:#cdd6f4">Enable animations</span>
                    </label>
                </div>
                <div style="margin-bottom:15px">
                    <div style="font-size:13px;color:#cdd6f4;margin-bottom:8px">Reset Options</div>
                    <button id="rodino-reset" style="width:100%;padding:10px;background:#f38ba8;border:none;
                        border-radius:6px;color:#1e1e1e;font-weight:600;cursor:pointer">
                        <i class="fas fa-trash"></i> Reset All Settings
                    </button>
                </div>
            `;
            return panel;
        }

        _setupEventHandlers() {
            // Close button
            this.ui.closeBtn.onclick = () => this._closeUI();
            
            // Minimize button
            this.ui.minimizeBtn.onclick = () => {
                const content = this.ui.main.querySelector('#rodino-content');
                content.style.maxHeight = content.style.maxHeight === '0px' ? '500px' : '0px';
                this.ui.minimizeBtn.classList.toggle('fa-window-minimize');
                this.ui.minimizeBtn.classList.toggle('fa-window-restore');
            };
            
            // Draggable window
            let dragState = { 
                isDragging: false, 
                startX: 0, 
                startY: 0,
                startLeft: this.settings.position.x,
                startTop: this.settings.position.y
            };
            
            this.ui.header.onmousedown = e => {
                dragState = {
                    isDragging: true,
                    startX: e.clientX,
                    startY: e.clientY,
                    startLeft: parseInt(this.ui.main.style.left),
                    startTop: parseInt(this.ui.main.style.top)
                };
                this.ui.main.style.transition = 'none';
                document.onmousemove = e => this._handleDrag(e);
                document.onmouseup = () => this._endDrag();
            };
            
            // Editor functionality
            const applyBtn = this.ui.main.querySelector('#rodino-apply');
            const previewBtn = this.ui.main.querySelector('#rodino-preview');
            const exampleBtn = this.ui.main.querySelector('.fa-magic');
            const saveBtn = this.ui.main.querySelector('.fa-save');
            
            applyBtn.onclick = () => this._applyCSS();
            previewBtn.onclick = () => this._previewCSS();
            exampleBtn.onclick = () => this._loadExample();
            saveBtn.onclick = () => this._saveRule();
            
            // Theme selection
            document.querySelectorAll('.rodino-theme').forEach(themeEl => {
                themeEl.onclick = () => {
                    const themeId = themeEl.id.replace('rodino-theme-', '');
                    this.settings.theme = themeId;
                    this._saveSettings();
                    this._applyTheme();
                    
                    // Update UI
                    document.querySelectorAll('.rodino-theme').forEach(el => {
                        el.style.borderColor = el.id === themeEl.id ? '#cba6f7' : 'transparent';
                        const checkIcon = el.querySelector('.fa-check');
                        if (checkIcon) {
                            checkIcon.style.display = el.id === themeEl.id ? 'inline-block' : 'none';
                        }
                    });
                };
            });
            
            // Settings
            const positionSelect = this.ui.main.querySelector('#rodino-position');
            const animationsCheckbox = this.ui.main.querySelector('#rodino-animations');
            const resetBtn = this.ui.main.querySelector('#rodino-reset');
            
            positionSelect.onchange = () => {
                const position = positionSelect.value;
                let x, y;
                
                switch(position) {
                    case 'tr': x = window.innerWidth - 400; y = 20; break;
                    case 'tl': x = 20; y = 20; break;
                    case 'br': x = window.innerWidth - 400; y = window.innerHeight - 500; break;
                    case 'bl': x = 20; y = window.innerHeight - 500; break;
                }
                
                this.ui.main.style.left = `${x}px`;
                this.ui.main.style.top = `${y}px`;
                this.settings.position = { x, y };
                this._saveSettings();
            };
            
            animationsCheckbox.onchange = () => {
                this.settings.animations = animationsCheckbox.checked;
                this._saveSettings();
                this.ui.main.style.transition = `all ${this.settings.animations ? c.s.t : 0}s ${c.s.e}`;
            };
            
            resetBtn.onclick = () => {
                if (confirm('Are you sure you want to reset all Rodino settings to default?')) {
                    localStorage.removeItem(c.k);
                    location.reload();
                }
            };
        }

        _switchTab(index) {
            this.settings.activeTab = index;
            this._saveSettings();
            
            this.ui.tabs.forEach((tab, i) => {
                tab.style.background = i === index ? '#313244' : 'transparent';
            });
            
            this.ui.panels.forEach((panel, i) => {
                panel.style.display = i === index ? 'block' : 'none';
            });
        }

        _closeUI() {
            this.ui.main.style.transform = 'translateY(-20px)';
            this.ui.main.style.opacity = '0';
            setTimeout(() => {
                this.ui.main.remove();
                window.rodinoLoaded = false;
            }, this.settings.animations ? c.s.t * 1000 : 0);
        }

        _handleDrag(e) {
            if (!dragState.isDragging) return;
            
            const x = dragState.startLeft + (e.clientX - dragState.startX);
            const y = dragState.startTop + (e.clientY - dragState.startY);
            
            this.ui.main.style.left = `${x}px`;
            this.ui.main.style.top = `${y}px`;
        }

        _endDrag() {
            dragState.isDragging = false;
            this.settings.position = {
                x: parseInt(this.ui.main.style.left),
                y: parseInt(this.ui.main.style.top)
            };
            this._saveSettings();
            this.ui.main.style.transition = `all ${this.settings.animations ? c.s.t : 0}s ${c.s.e}`;
            document.onmousemove = null;
        }

        _applyCSS() {
            const selector = this.ui.selectorInput.value.trim();
            const properties = this.ui.propertiesInput.value.trim();
            
            if (!selector || !properties) {
                RodinoAlert.show('Please enter both selector and properties', 'error');
                return;
            }
            
            try {
                document.querySelectorAll(selector).forEach(element => {
                    element.style.cssText += properties;
                });
                RodinoAlert.show('CSS applied successfully!', 'success');
            } catch (error) {
                RodinoAlert.show(`Error applying CSS: ${error.message}`, 'error');
            }
        }

        _previewCSS() {
            const selector = this.ui.selectorInput.value.trim();
            const properties = this.ui.propertiesInput.value.trim();
            
            if (!selector || !properties) {
                RodinoAlert.show('Please enter both selector and properties', 'error');
                return;
            }
            
            try {
                const previewId = 'rodino-preview-style';
                let styleElement = document.getElementById(previewId);
                
                if (!styleElement) {
                    styleElement = document.createElement('style');
                    styleElement.id = previewId;
                    document.head.appendChild(styleElement);
                }
                
                styleElement.textContent = `${selector} { ${properties} }`;
                RodinoAlert.show('Preview active - click Apply to make permanent', 'info');
            } catch (error) {
                RodinoAlert.show(`Error previewing CSS: ${error.message}`, 'error');
            }
        }

        _saveRule() {
            const selector = this.ui.selectorInput.value.trim();
            const properties = this.ui.propertiesInput.value.trim();
            
            if (!selector || !properties) {
                RodinoAlert.show('Please enter both selector and properties', 'error');
                return;
            }
            
            // Remove any existing rule with the same selector
            this.settings.customRules = this.settings.customRules.filter(
                rule => rule.selector !== selector
            );
            
            // Add new rule
            this.settings.customRules.unshift({ selector, properties });
            this._saveSettings();
            this._loadSavedRules();
            RodinoAlert.show('Rule saved successfully!', 'success');
        }

        _loadSavedRules() {
            this.ui.rulesList.innerHTML = '';
            
            if (!this.settings.customRules.length) {
                this.ui.rulesList.innerHTML = `
                    <div style="color:#7f849c;font-size:12px;text-align:center">
                        No saved rules yet
                    </div>
                `;
                return;
            }
            
            this.settings.customRules.forEach((rule, index) => {
                const ruleElement = document.createElement('div');
                ruleElement.style = 'background:#313244;border-radius:6px;padding:10px;font-size:12px';
                ruleElement.innerHTML = `
                    <div style="display:flex;justify-content:space-between;margin-bottom:5px">
                        <span style="color:#cdd6f4;font-weight:600">${rule.selector}</span>
                        <div style="display:flex;gap:5px">
                            <i class="fas fa-edit" style="color:#7f849c;cursor:pointer" 
                                title="Edit this rule"></i>
                            <i class="fas fa-trash" style="color:#f38ba8;cursor:pointer" 
                                title="Delete this rule"></i>
                        </div>
                    </div>
                    <div style="color:#a6adc8;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">
                        ${rule.properties.replace(/;/g, '; ')}
                    </div>
                `;
                
                ruleElement.querySelector('.fa-edit').onclick = () => {
                    this.ui.selectorInput.value = rule.selector;
                    this.ui.propertiesInput.value = rule.properties;
                    this._switchTab(0);
                };
                
                ruleElement.querySelector('.fa-trash').onclick = () => {
                    this.settings.customRules.splice(index, 1);
                    this._saveSettings();
                    this._loadSavedRules();
                    RodinoAlert.show('Rule deleted', 'info');
                };
                
                this.ui.rulesList.appendChild(ruleElement);
            });
        }

        _loadExample() {
            const examples = [
                {
                    selector: '.game-top-header',
                    properties: 'background: linear-gradient(135deg, #cba6f7 0%, #89b4fa 100%) !important; color: #1e1e1e !important;'
                },
                {
                    selector: '.avatar-card',
                    properties: 'border: 2px solid #cba6f7 !important; border-radius: 12px !important;'
                },
                {
                    selector: '.item-container',
                    properties: 'background: #313244 !important; box-shadow: 0 4px 8px rgba(0,0,0,0.1) !important;'
                }
            ];
            
            const randomExample = examples[Math.floor(Math.random() * examples.length)];
            this.ui.selectorInput.value = randomExample.selector;
            this.ui.propertiesInput.value = randomExample.properties;
            RodinoAlert.show('Example loaded - edit as needed', 'info');
        }

        _applyTheme() {
            const themeStyleId = 'rodino-theme-style';
            let themeStyle = document.getElementById(themeStyleId);
            
            if (themeStyle) {
                themeStyle.remove();
            }
            
            if (this.settings.theme === 'custom') return;
            
            const themes = {
                dark: { bg: '#1e1e2e', sec: '#313244', text: '#cdd6f4', pri: '#cba6f7' },
                light: { bg: '#f5f5f5', sec: '#e0e0e0', text: '#333333', pri: '#6c5ce7' },
                oled: { bg: '#000000', sec: '#111111', text: '#ffffff', pri: '#ff4757' },
                midnight: { bg: '#0f0f1a', sec: '#1a1a2e', text: '#d1d1e0', pri: '#6d44dc' },
                sunset: { bg: '#2a1a3d', sec: '#4a2a5a', text: '#f8d7da', pri: '#ff7aa2' }
            };
            
            const theme = themes[this.settings.theme];
            
            const css = `
                body {
                    --rodino-bg: ${theme.bg};
                    --rodino-sec: ${theme.sec};
                    --rodino-text: ${theme.text};
                    --rodino-pri: ${theme.pri};
                }
                .game-top-header, .game-header {
                    background: ${theme.bg} !important;
                    color: ${theme.text} !important;
                }
                .avatar-card, .item-container, .game-card {
                    background: ${theme.sec} !important;
                    color: ${theme.text} !important;
                }
                .btn-primary, .btn-cta {
                    background: ${theme.pri} !important;
                    color: ${theme.bg} !important;
                }
            `;
            
            themeStyle = document.createElement('style');
            themeStyle.id = themeStyleId;
            themeStyle.textContent = css;
            document.head.appendChild(themeStyle);
        }

        _saveSettings() {
            localStorage.setItem(c.k, JSON.stringify(this.settings));
        }
    }

    // Initialize
    new Rodino();
})();
