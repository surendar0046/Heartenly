// Heartenly App Logic - Version 3.6 (Trending Multi-Hashtag Update)
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
        { label: "Trending Fitness Workouts", url: "https://youtube.com/results?search_query=trending+fitness+workouts+2024" },
        { label: "Body Transformation Guide", url: "https://www.menshealth.com" },
        { label: "Daily Gym Motivation", url: "https://www.instagram.com/explore/tags/gymmotivation/" }
    ],
    mental: [
        { label: "Mindfulness & Peace", url: "https://headspace.com" },
        { label: "Anxiety Relief Journaling", url: "https://dayoneapp.com" }
    ],
    career: [
        { label: "Industry Success Roadmap", url: "https://linkedin.com" },
        { label: "AI & Tech Skills 2024", url: "https://coursera.org" }
    ]
};

const translations = {
    English: { intro: "Welcome. Your AI Emotional Companion.", start: "Let's Begin", scan: "AI Scan", world: "Your World", updates: "My Updates", face: "Face", mic: "Mic", text: "Text", analyze: "Analyze My Emotion", detected: "Detected: ", ready: "Ready" },
    Tamil: { intro: "Heartenly-க்கு வரவேற்கிறோம். உங்கள் AI வழிிகாட்டி.", start: "தொடங்கலாம்", scan: "AI ஸ்கேன்", world: "உங்கள் உலகம்", updates: "பதிவுகள்", face: "முகம்", mic: "ஒலி", text: "உரை", analyze: "என் உணர்ச்சியை ஆராய்", detected: "கண்டறியப்பட்டது: ", ready: "தயார்" }
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
            <div class="setup-section"><h3>Select Language</h3>
                <div class="pref-grid">${onboardingData.languages.map(l => `<div class="pref-item ${state.language === l ? 'selected' : ''}" onclick="window.setLanguage('${l}')">${l}</div>`).join('')}</div>
            </div>
            <div class="setup-section"><h3>Your Loves</h3>
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
        media.innerHTML = `<div class="text-view"><textarea id="t-input" placeholder="Type here..."></textarea></div>`;
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
    if (line) line.style.display = 'block';
    await new Promise(r => setTimeout(r, 2000));
    if (line) line.style.display = 'none';
    applyEmotion(['happy', 'sad', 'neutral'][Math.floor(Math.random() * 3)]);
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
    // MULTIPLE HASHTAG LOGIC
    const mood = state.currentEmotion === 'sad' ? 'happy' : 'celebration';
    const lang = state.language;
    const userPrefs = state.preferences.slice(0, 3).map(p => p.toLowerCase());

    // User suggestion based trending tags
    const trendingTags = ["tamilmemes", "trendingsongs", "cinema", "wholesome", "viral"];
    const combinedTags = [...userPrefs, ...trendingTags].slice(0, 5).map(tag => `#${tag}`).join(' ');
    const query = `${lang} ${mood} ${userPrefs.join(' ')} ${trendingTags.join(' ')}`;

    container.innerHTML = `
        <div class="screen">
            <h2>${t.world}</h2>
            <div class="world-grid">
                <div class="social-card" onclick="window.open('https://instagram.com/explore/tags/${userPrefs[0] || 'trending'}/', '_blank')"><i class="fa-brands fa-instagram"></i></div>
                <div class="social-card" onclick="window.open('https://youtube.com/results?search_query=${query}', '_blank')"><i class="fa-brands fa-youtube"></i></div>
                <div class="social-card" onclick="window.open('https://facebook.com/search/top/?q=${query}', '_blank')"><i class="fa-brands fa-facebook-f"></i></div>
            </div>
            <div class="feed-item" style="margin-top:20px;">
                <h3>Trending Boost</h3>
                <p style="font-size:0.8rem; opacity:0.7;">Tags: ${combinedTags}</p>
            </div>
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
    if (box.style.display === 'block') { box.style.display = 'none'; return; }
    document.querySelectorAll('.links-container').forEach(c => c.style.display = 'none');

    let html = '';
    if (updateLinksData[cat]) {
        html = updateLinksData[cat].map(l => `<a href="${l.url}" target="_blank" class="resource-link">${l.label}</a>`).join('');
    }

    // MULTIPLE HASHTAGS FOR SHORTS
    let hashtags = ["trending"];
    if (cat === 'physical') hashtags = ["fitnessmotivation", "bodybuilding", "workout", "viralreels"];
    else if (cat === 'cinema') hashtags = ["cinema", "moviereview", "blockbuster"];
    else if (cat === 'memes') hashtags = ["tamilmemes", "funny", "laugh", "trendingsongs"];

    const mood = state.currentEmotion === 'sad' ? 'happy' : 'success';
    const tagQuery = hashtags.map(t => `#${t}`).join(' ');
    const instaSearch = hashtags[0];

    html += `
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:10px;">
            <p style="font-size:0.75rem; color:var(--primary-light);">Trending: ${tagQuery}</p>
            <div style="display:flex; gap:10px;">
                <a href="https://www.instagram.com/explore/tags/${instaSearch}/" target="_blank" class="shorts-btn"><i class="fa-brands fa-instagram"></i> Reels</a>
                <a href="https://www.youtube.com/results?search_query=${cat}+${mood}+${hashtags.join('+')}" target="_blank" class="shorts-btn"><i class="fa-brands fa-youtube"></i> Shorts</a>
            </div>
        </div>
    `;

    box.innerHTML = html;
    box.style.display = 'block';
};

init();
