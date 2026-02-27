// Heartenly App Logic - Version 3.5 (Restored Growth Modules + Multi-Lang)
const state = {
    currentTab: 'scan',
    scanMode: 'face',
    currentEmotion: 'neutral',
    isAnalyzing: false,
    cameraStream: null,
    language: 'English',
    preferences: [],
    isOnboarded: false
};

// --- DATASETS ---
const onboardingData = {
    languages: ["Tamil", "English", "Hindi", "Telugu", "Malayalam", "Kannada"],
    categories: ["Memes", "Music", "Cinema", "Books", "Tech", "Cooking", "Fitness", "Nature", "Art", "Sports", "Gaming"]
};

const updateLinksData = {
    physical: [
        { label: "15 Min HIIT Home Workout", url: "https://youtube.com/results?search_query=15+min+hiit" },
        { label: "Daily Hydration Tracker", url: "https://water-tracker.com" },
        { label: "Posture Correction Plan", url: "https://healthline.com" }
    ],
    mental: [
        { label: "Journaling for Clarity", url: "https://dayoneapp.com" },
        { label: "Stoic Philosophy Basics", url: "https://dailystoic.com" },
        { label: "Digital Detox Checklist", url: "https://freedom.to" }
    ],
    career: [
        { label: "Mastering AI in Workflow", url: "https://coursera.org" },
        { label: "Communication for Leaders", url: "https://ted.com" },
        { label: "Personal Branding LinkedIn", url: "https://linkedin.com" }
    ]
};

const translations = {
    English: {
        intro: "Welcome to Heartenly. Your AI Emotional Companion.",
        start: "Let's Begin",
        scan: "AI Scan",
        world: "Your World",
        updates: "My Updates",
        face: "Face",
        mic: "Mic",
        text: "Text",
        analyze: "Analyze My Emotion",
        detected: "Detected: ",
        ready: "Ready",
        growthTitle: "Personal Growth Tracks",
        fetching: "Explore Resources"
    },
    Tamil: {
        intro: "Heartenly-க்கு வரவேற்கிறோம். உங்கள் AI உணர்ச்சி வழிகாட்டி.",
        start: "தொடங்கலாம்",
        scan: "AI ஸ்கேன்",
        world: "உங்கள் உலகம்",
        updates: "பதிவுகள்",
        face: "முகம்",
        mic: "ஒலி",
        text: "உரை",
        analyze: "என் உணர்ச்சியை ஆராய்",
        detected: "கண்டறியப்பட்டது: ",
        ready: "தயார்",
        growthTitle: "தனிப்பட்ட வளர்ச்சி வழிகள்",
        fetching: "வளங்களை ஆராயுங்கள்"
    },
    Telugu: {
        intro: "Heartenlyకి స్వాగతం. మీ AI ఎమోషనల్ కంపానియన్.",
        start: "ప్రారంభించండి",
        scan: "AI స్కాన్",
        world: "మీ ప్రపంచం",
        updates: "అప్‌డేట్స్",
        face: "ముఖం",
        mic: "మైక్",
        text: "టెక్స్ట్",
        analyze: "నా భావోద్వేగాన్ని విశ్లేషించు",
        detected: "కనుగొనబడింది: ",
        ready: "సిద్ధం",
        growthTitle: "వ్యక్తిగత ఎదుగుదల",
        fetching: "వనరులను అన్వేషించండి"
    }
    // Hindi, Malayalam, Kannada will default to English if not fully mapped, but keeping core logic consistent
};

function init() {
    if (!state.isOnboarded) renderOnboarding();
    else renderMainAppLayout();
}

function renderOnboarding() {
    const app = document.getElementById('app');
    const t = translations[state.language] || translations.English;
    app.innerHTML = `
        <div class="onboarding-overlay">
            <h1 class="onboarding-title">Heartenly</h1>
            <div class="setup-section"><h3>Choose Language / மொழி</h3>
                <div class="pref-grid">${onboardingData.languages.map(l => `<div class="pref-item ${state.language === l ? 'selected' : ''}" onclick="window.setLanguage('${l}')">${l}</div>`).join('')}</div>
            </div>
            <div class="setup-section"><h3>Interests</h3>
                <div class="pref-grid">${onboardingData.categories.map(c => `<div class="pref-item ${state.preferences.includes(c) ? 'selected' : ''}" onclick="window.togglePref('${c}')">${c}</div>`).join('')}</div>
            </div>
            <button class="start-btn" onclick="window.completeOnboarding()">${t.start}</button>
        </div>
    `;
}

window.setLanguage = (l) => { state.language = l; renderOnboarding(); };
window.togglePref = (p) => {
    if (state.preferences.includes(p)) state.preferences = state.preferences.filter(x => x !== p);
    else state.preferences.push(p);
    renderOnboarding();
};
window.completeOnboarding = () => {
    if (state.preferences.length === 0) return alert("Select interest!");
    state.isOnboarded = true;
    renderMainAppLayout();
};

function renderMainAppLayout() {
    const app = document.getElementById('app');
    const t = translations[state.language] || translations.English;
    app.innerHTML = `
        <div class="blob blob-1"></div><div class="blob blob-2"></div>
        <header><h1>Heartenly</h1><p id="app-subtitle">${t.intro}</p></header>
        <main id="active-screen"></main>
        <nav class="bottom-nav">
            <button class="nav-item active" onclick="window.goToTab('scan')"><i class="fa-solid fa-face-smile"></i><span>${t.scan}</span></button>
            <button class="nav-item" onclick="window.goToTab('world')"><i class="fa-solid fa-earth-americas"></i><span>${t.world}</span></button>
            <button class="nav-item" onclick="window.goToTab('updates')"><i class="fa-solid fa-arrow-trend-up"></i><span>${t.updates}</span></button>
        </nav>
    `;
    renderTab('scan');
}

window.goToTab = (tab) => {
    state.currentTab = tab;
    document.querySelectorAll('.nav-item').forEach((n, idx) => n.classList.toggle('active', ['scan', 'world', 'updates'][idx] === tab));
    renderTab(tab);
};

function renderTab(tab) {
    const main = document.getElementById('active-screen');
    if (tab !== 'scan') stopCamera();
    if (tab === 'scan') renderScanScreen(main);
    else if (tab === 'world') renderWorldScreen(main);
    else renderUpdatesScreen(main);
}

function renderScanScreen(container) {
    const t = translations[state.language] || translations.English;
    container.innerHTML = `
        <div class="screen">
            <div class="mode-switcher">
                <button class="mode-btn ${state.scanMode === 'face' ? 'active' : ''}" onclick="window.setScanMode('face')">${t.face}</button>
                <button class="mode-btn ${state.scanMode === 'mic' ? 'active' : ''}" onclick="window.setScanMode('mic')">${t.mic}</button>
                <button class="mode-btn ${state.scanMode === 'text' ? 'active' : ''}" onclick="window.setScanMode('text')">${t.text}</button>
            </div>
            <div class="media-container" id="media-content"></div>
            <div style="text-align:center; margin-top:20px;">
                <button class="analyze-btn" id="analyze-trigger" style="width:80%;" onclick="window.handleAnalysis()">${t.analyze}</button>
            </div>
            <canvas id="hidden-canvas" style="display:none;"></canvas>
        </div>
    `;
    updateScanView();
}

window.setScanMode = (m) => { state.scanMode = m; stopCamera(); renderTab('scan'); };

function updateScanView() {
    const media = document.getElementById('media-content');
    if (state.scanMode === 'face') {
        media.innerHTML = `<video id="video" autoplay muted playsinline></video><div class="scan-overlay"><div class="scan-line" id="face-line" style="display:none;"></div></div>
        <div class="emotion-badge"><div class="emotion-dot" id="e-dot"></div><span id="e-text">Ready</span></div>`;
        startCamera();
    } else if (state.scanMode === 'mic') {
        media.innerHTML = `<div class="mic-view"><div class="mic-circle"><i class="fa-solid fa-microphone"></i></div><div class="emotion-badge"><div class="emotion-dot" id="e-dot"></div><span id="e-text">Listening</span></div></div>`;
    } else {
        media.innerHTML = `<div class="text-view"><textarea id="t-input" placeholder="How's your day?"></textarea></div>`;
    }
}

async function startCamera() {
    try {
        state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const v = document.getElementById('video');
        if (v) v.srcObject = state.cameraStream;
    } catch (e) { console.error(e); }
}

function stopCamera() {
    if (state.cameraStream) state.cameraStream.getTracks().forEach(t => t.stop());
}

window.handleAnalysis = async () => {
    const line = document.getElementById('face-line');
    if (state.scanMode === 'face') {
        if (line) line.style.display = 'block';
        await new Promise(r => setTimeout(r, 2000));
        if (line) line.style.display = 'none';
        applyEmotion(['happy', 'sad', 'neutral'][Math.floor(Math.random() * 3)]);
    } else {
        applyEmotion(['happy', 'sad', 'neutral'][Math.floor(Math.random() * 3)]);
    }
};

function applyEmotion(e) {
    state.currentEmotion = e;
    const dot = document.getElementById('e-dot');
    const txt = document.getElementById('e-text');
    const t = translations[state.language] || translations.English;
    if (txt) txt.innerText = t.detected + e.toUpperCase();
    if (dot) {
        dot.style.background = e === 'sad' ? '#ff7675' : (e === 'happy' ? '#2ecc71' : '#f1c40f');
        dot.style.boxShadow = `0 0 15px ${dot.style.background}`;
    }
}

function renderWorldScreen(container) {
    const t = translations[state.language] || translations.English;
    const q = `${state.language} ${state.preferences.join(' ')} ${state.currentEmotion === 'sad' ? 'happy' : 'celebration'}`;
    container.innerHTML = `
        <div class="screen">
            <h2>${t.world}</h2>
            <div class="world-grid">
                <div class="social-card" onclick="window.open('https://instagram.com/explore/tags/${state.preferences[0].toLowerCase()}', '_blank')"><i class="fa-brands fa-instagram"></i></div>
                <div class="social-card" onclick="window.open('https://youtube.com/results?search_query=${q}', '_blank')"><i class="fa-brands fa-youtube"></i></div>
                <div class="social-card" onclick="window.open('https://facebook.com/search/top/?q=${q}', '_blank')"><i class="fa-brands fa-facebook-f"></i></div>
            </div>
            <div class="feed-item" style="margin-top:20px;"><h3>Boost Logic</h3><p>Filters: ${state.language} + ${state.preferences[0]}</p></div>
        </div>
    `;
}

function renderUpdatesScreen(container) {
    const t = translations[state.language] || translations.English;
    const cats = [
        { id: 'physical', label: 'Physical Build', icon: 'fa-person-running', color: '' },
        { id: 'mental', label: 'Mental Wellness', icon: 'fa-brain', color: '' },
        { id: 'career', label: 'Career Build', icon: 'fa-briefcase', color: '' },
        { id: 'cinema', label: 'Cinema', icon: 'fa-film', color: 'cinema' },
        { id: 'books', label: 'Books', icon: 'fa-book-open', color: 'books' },
        { id: 'memes', label: 'Memes', icon: 'fa-face-laugh-squint', color: '' }
    ];

    container.innerHTML = `
        <div class="screen">
            <h2>${t.updates}</h2>
            <div class="updates-list">
                ${cats.map(c => `
                    <div class="update-category" onclick="window.toggleLinks('${c.id}')">
                        <div class="cat-header">
                            <div class="cat-icon ${c.color}"><i class="fa-solid ${c.icon}"></i></div>
                            <div class="cat-info"><h3>${c.label}</h3><p>${t.ready}</p></div>
                        </div>
                        <div class="links-container" id="links-${c.id}" style="display:none; padding-top:10px;"></div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

window.toggleLinks = (cat) => {
    const box = document.getElementById(`links-${cat}`);
    const t = translations[state.language] || translations.English;
    if (box.style.display === 'block') { box.style.display = 'none'; return; }

    document.querySelectorAll('.links-container').forEach(c => c.style.display = 'none');

    // Core 3 Logic
    let html = '';
    if (updateLinksData[cat]) {
        html = updateLinksData[cat].map(l => `<a href="${l.url}" target="_blank" class="resource-link">${l.label}</a>`).join('');
    } else {
        const query = `${cat} ${state.language} ${state.preferences.join(' ')}`;
        html = `<a href="https://youtube.com/results?search_query=${query}" target="_blank" class="resource-link">Masterclass</a>`;
    }

    // Shorts Logic
    const moodTag = state.currentEmotion === 'sad' ? 'happy' : 'success';
    html += `
        <div style="display:flex; gap:10px; margin-top:10px;">
            <a href="https://www.instagram.com/explore/tags/${moodTag}${cat}/" target="_blank" class="shorts-btn"><i class="fa-brands fa-instagram"></i> Reels</a>
            <a href="https://www.youtube.com/results?search_query=${cat}+shorts+${state.language}" target="_blank" class="shorts-btn"><i class="fa-brands fa-youtube"></i> Shorts</a>
        </div>
    `;

    box.innerHTML = html;
    box.style.display = 'block';
};

init();
