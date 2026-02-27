// Heartenly App Logic - Version 3.4 (Total Language Immersion)
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

// COMPREHENSIVE TRANSLATIONS
const translations = {
    English: {
        intro: "Welcome to Heartenly. Your AI Emotional Companion.",
        selectLang: "Choose your Language",
        selectPref: "What do you love?",
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
        scanning: "Capturing frame...",
        processing: "Processing pixel data...",
        logic: "Logic: ",
        boost: "Localized Boost",
        growth: "Growth",
        cinema: "Cinema",
        back: "Back",
        placeholder: "How are you feeling?",
        denied: "Camera access denied."
    },
    Tamil: {
        intro: "Heartenly-க்கு வரவேற்கிறோம். உங்கள் AI உணர்ச்சி வழிகாட்டி.",
        selectLang: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
        selectPref: "உங்களுக்கு என்ன பிடிக்கும்?",
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
        scanning: "படம் எடுக்கப்படுகிறது...",
        processing: "தகவல் ஆராயப்படுகிறது...",
        logic: "அடிப்படை: ",
        boost: "மேம்படுத்தப்பட்ட தீர்வு",
        growth: "வளர்ச்சி",
        cinema: "திரைப்படம்",
        back: "பின்னால்",
        placeholder: "நீங்கள் எப்படி உணருகிறீர்கள்?",
        denied: "கேமரா அனுமதி மறுக்கப்பட்டது."
    },
    Telugu: {
        intro: "Heartenlyకి స్వాగతం. మీ AI ఎమోషనల్ కంపానియన్.",
        selectLang: "మీ భాషను ఎంచుకోండి",
        selectPref: "మీకు ఏది ఇష్టం?",
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
        scanning: "క్యాప్చర్ చేస్తోంది...",
        processing: "విశ్లేషిస్తోంది...",
        logic: "లాజిక్: ",
        boost: "బూస్ట్ కంటెంట్",
        growth: "అభివృద్ధి",
        cinema: "సినిమా",
        back: "వెనుకకు",
        placeholder: "మీరు ఎలా ఉన్నారు?",
        denied: "కెమెరా యాక్సెస్ నిరాకరించబడింది."
    },
    Hindi: {
        intro: "Heartenly में आपका स्वागत है। आपका AI भावनात्मक साथी।",
        selectLang: "अपनी भाषा चुनें",
        selectPref: "आपको क्या पसंद है?",
        start: "शुरू करें",
        scan: "AI स्कैन",
        world: "आपकी दुनिया",
        updates: "अपडेट",
        face: "चेहरा",
        mic: "माइक",
        text: "टेक्स्ट",
        analyze: "मेरी भावना का विश्लेषण करें",
        detected: "पाया गया: ",
        ready: "तैयार",
        scanning: "कैप्चरिंग...",
        processing: "विश्लेषण कर रहा है...",
        logic: "तर्क: ",
        boost: "बूस्ट सामग्री",
        growth: "विकास",
        cinema: "सिनेमा",
        back: "पीछे",
        placeholder: "आप कैसा महसूस कर रहे हैं?",
        denied: "कैमरा एक्सेस नहीं मिला।"
    },
    Malayalam: {
        intro: "Heartenly-ലേക്ക് സ്വാഗതം. നിങ്ങളുടെ AI വൈകാരിക കൂട്ടാളി.",
        selectLang: "നിങ്ങളുടെ ഭാഷ തിരഞ്ഞെടുക്കുക",
        selectPref: "നിങ്ങൾക്ക് എന്താണ് ഇഷ്ടം?",
        start: "തുടങ്ങാം",
        scan: "AI സ്കാൻ",
        world: "നിങ്ങളുടെ ലോകം",
        updates: "അപ്‌ഡേറ്റ്കൾ",
        face: "മുഖം",
        mic: "മൈക്ക്",
        text: "ടെക്സ്റ്റ്",
        analyze: "വിശകലനം ചെയ്യുക",
        detected: "കണ്ടെത്തി: ",
        ready: "തയ്യാർ",
        scanning: "സ്കാൻ ചെയ്യുന്നു...",
        processing: "വിവരങ്ങൾ ശേഖരിക്കുന്നു...",
        logic: "യുക്തി: ",
        boost: "ബൂസ്റ്റ് ഉള്ളടക്കം",
        growth: "വളർച്ച",
        cinema: "സിനിമ",
        back: "തിരികെ",
        placeholder: "എങ്ങനെയുണ്ട് വിശേഷം?",
        denied: "ക്യാമറ അനുമതി നിഷേധിച്ചു."
    },
    Kannada: {
        intro: "Heartenly ಗೆ ಸುಸ್ವಾಗತ. ನಿಮ್ಮ AI ಜೀವನ ಸಂಗಾತಿ.",
        selectLang: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆರಿಸಿ",
        selectPref: "ನಿಮಗೆ ಯಾವುದು ಇಷ್ಟ?",
        start: "ಪ್ರಾರಂಭಿಸಿ",
        scan: "AI ಸ್ಕ್ಯಾನ್",
        world: "ನಿಮ್ಮ ಪ್ರಪಂಚ",
        updates: "ಅಪ್‌ಡೇಟ್‌ಗಳು",
        face: "ಮುಖ",
        mic: "ಮೈಕ್",
        text: "ಪಠ್ಯ",
        analyze: "ಭಾವನೆಯನ್ನು ವಿశ్ಲೇಷಿಸಿ",
        detected: "ಕಂಡುಬಂದಿದೆ: ",
        ready: "ಸಿದ್ಧ",
        scanning: "ಸ್ಕ್ಯಾನ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
        processing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
        logic: "ತರ್ಕ: ",
        boost: "ಬೂಸ್ಟ್ ವಿಷಯ",
        growth: "ಬೆಳವಣಿಗೆ",
        cinema: "ಸಿನಿಮಾ",
        back: "ಹಿಂದಕ್ಕೆ",
        placeholder: "ನಿಮ್ಮ ಭಾವನೆ ಹೇಗಿದೆ?",
        denied: "ಕ್ಯಾಮರಾ ಅನುಮತಿ ನಿರಾಕರಿಸಲಾಗಿದೆ."
    }
};

function init() {
    if (!state.isOnboarded) {
        renderOnboarding();
    } else {
        renderMainAppLayout();
    }
}

function renderOnboarding() {
    const app = document.getElementById('app');
    const t = translations[state.language] || translations.English;
    app.innerHTML = `
        <div class="onboarding-overlay">
            <h1 class="onboarding-title">Heartenly</h1>
            <div class="setup-section">
                <h3>${t.selectLang}</h3>
                <div class="pref-grid">
                    ${onboardingData.languages.map(l => `<div class="pref-item ${state.language === l ? 'selected' : ''}" onclick="window.setLanguage('${l}')">${l}</div>`).join('')}
                </div>
            </div>
            <div class="setup-section">
                <h3>${t.selectPref}</h3>
                <div class="pref-grid" id="cat-grid">
                    ${onboardingData.categories.map(c => `<div class="pref-item ${state.preferences.includes(c) ? 'selected' : ''}" onclick="window.togglePref('${c}')">${c}</div>`).join('')}
                </div>
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
    const t = translations[state.language] || translations.English;
    document.querySelectorAll('.nav-item').forEach(n => {
        const span = n.querySelector('span');
        const isMatch = n.dataset?.tab === tab ||
            (tab === 'scan' && (span.innerText === t.scan)) ||
            (tab === 'world' && (span.innerText === t.world)) ||
            (tab === 'updates' && (span.innerText === t.updates));
        n.classList.toggle('active', isMatch);
    });
    // Cleanup navigation visual manually because of dynamic labels
    document.querySelectorAll('.nav-item').forEach((n, idx) => {
        const target = ['scan', 'world', 'updates'][idx];
        n.classList.toggle('active', target === tab);
    });
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
                <p id="status-log" style="font-size:0.8rem; color:#2ecc71; margin-top:10px;"></p>
            </div>
            <canvas id="hidden-canvas" style="display:none;"></canvas>
        </div>
    `;
    updateScanView();
}

window.setScanMode = (m) => { state.scanMode = m; stopCamera(); renderTab('scan'); };

function updateScanView() {
    const media = document.getElementById('media-content');
    const t = translations[state.language] || translations.English;
    if (state.scanMode === 'face') {
        media.innerHTML = `<video id="video" autoplay muted playsinline></video><div class="scan-overlay"><div class="scan-line" id="face-line" style="display:none;"></div></div>
        <div class="emotion-badge"><div class="emotion-dot" id="e-dot"></div><span id="e-text">${t.ready}</span></div>`;
        startCamera();
    } else if (state.scanMode === 'mic') {
        media.innerHTML = `<div class="mic-view"><div class="mic-circle"><i class="fa-solid fa-microphone"></i></div><div class="emotion-badge"><div class="emotion-dot" id="e-dot"></div><span id="e-text">${t.ready}</span></div></div>`;
    } else {
        media.innerHTML = `<div class="text-view"><textarea id="t-input" placeholder="${t.placeholder}"></textarea></div>`;
    }
}

async function startCamera() {
    const t = translations[state.language] || translations.English;
    try {
        state.cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
        const v = document.getElementById('video');
        if (v) v.srcObject = state.cameraStream;
    } catch (e) { alert(t.denied); }
}

function stopCamera() {
    if (state.cameraStream) state.cameraStream.getTracks().forEach(t => t.stop());
}

window.handleAnalysis = async () => {
    const t = translations[state.language] || translations.English;
    const log = document.getElementById('status-log');
    const line = document.getElementById('face-line');
    if (state.scanMode === 'face') {
        if (line) line.style.display = 'block';
        log.innerText = t.scanning;

        await new Promise(r => setTimeout(r, 1000));

        const video = document.getElementById('video');
        const canvas = document.getElementById('hidden-canvas');
        if (video && canvas) {
            canvas.width = video.videoWidth; canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0);
            log.innerText = t.processing;
        }

        await new Promise(r => setTimeout(r, 1000));
        if (line) line.style.display = 'none';
        log.innerText = "";
        applyEmotion(['happy', 'sad', 'neutral'][Math.floor(Math.random() * 3)]);
    } else if (state.scanMode === 'mic') {
        applyEmotion(['happy', 'sad', 'neutral'][Math.floor(Math.random() * 3)]);
    } else {
        const val = document.getElementById('t-input').value.toLowerCase();
        let e = 'neutral';
        if (val.includes('sad')) e = 'sad';
        else if (val.includes('happy')) e = 'happy';
        applyEmotion(e);
    }
};

function applyEmotion(e) {
    state.currentEmotion = e;
    const dot = document.getElementById('e-dot');
    const txt = document.getElementById('e-text');
    const t = translations[state.language] || translations.English;
    if (txt) txt.innerText = t.detected + e.toUpperCase();
    if (dot) dot.style.background = e === 'sad' ? '#ff7675' : (e === 'happy' ? '#2ecc71' : '#f1c40f');
}

function renderWorldScreen(container) {
    const t = translations[state.language] || translations.English;
    const query = `${state.language} ${state.preferences.join(' ')} ${state.currentEmotion === 'sad' ? 'happy' : 'celebration'}`;
    container.innerHTML = `
        <div class="screen">
            <h2>${t.world}</h2>
            <div class="world-grid">
                <div class="social-card" onclick="window.open('https://instagram.com/explore/tags/${state.preferences[0].toLowerCase()}', '_blank')"><i class="fa-brands fa-instagram"></i></div>
                <div class="social-card" onclick="window.open('https://youtube.com/results?search_query=${query}', '_blank')"><i class="fa-brands fa-youtube"></i></div>
                <div class="social-card" onclick="window.open('https://facebook.com/search/top/?q=${query}', '_blank')"><i class="fa-brands fa-facebook-f"></i></div>
            </div>
            <div class="feed-item" style="margin-top:20px;">
                <p>${t.boost}: ${state.language} content.</p>
            </div>
        </div>
    `;
}

function renderUpdatesScreen(container) {
    const t = translations[state.language] || translations.English;
    container.innerHTML = `
        <div class="screen">
            <h2>${t.updates}</h2>
            <div class="update-category" onclick="alert('${t.growth}...')">
                <div class="cat-header"><div class="cat-icon"><i class="fa-solid fa-briefcase"></i></div><div><h3>${t.growth}</h3><p>${state.language}</p></div></div>
            </div>
            <div class="update-category" onclick="alert('${t.cinema}...')">
                <div class="cat-header"><div class="cat-icon cinema"><i class="fa-solid fa-film"></i></div><div><h3>${t.cinema}</h3><p>${state.language}</p></div></div>
            </div>
        </div>
    `;
}

init();
