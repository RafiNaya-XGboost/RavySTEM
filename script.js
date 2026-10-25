document.addEventListener('DOMContentLoaded', () => {
    /* ==================== STATE MANAGEMENT ==================== */
   const state = {
    theme: 'dark',
    soundEnabled: true,
    dailyActivity: [],              // BARU
    math: {
        // ...isi tetap sama
    },
    periodic: {
        score: 0,
        correct: 0,
        wrong: 0,
        remaining: 10,
        isPlaying: false,
        currentQuestion: null,
        currentAnswer: null,
        currentMode: 'symbol-to-name',  // BARU
        skipTimeout: null,              // BARU
        mode: 'symbol-to-name',
        categories: ['common'],
        elementsUsed: []
    }
};

    /* ==================== ELEMENT DATA ==================== */
    const elements = [
        { symbol: 'H', name: 'Hidrogen', category: 'common' },
        { symbol: 'He', name: 'Helium', category: 'noble' },
        { symbol: 'Li', name: 'Litium', category: 'alkali' },
        { symbol: 'Be', name: 'Berilium', category: 'alkali' },
        { symbol: 'B', name: 'Boron', category: 'common' },
        { symbol: 'C', name: 'Karbon', category: 'common' },
        { symbol: 'N', name: 'Nitrogen', category: 'common' },
        { symbol: 'O', name: 'Oksigen', category: 'common' },
        { symbol: 'F', name: 'Fluorin', category: 'common' },
        { symbol: 'Ne', name: 'Neon', category: 'noble' },
        { symbol: 'Na', name: 'Natrium', category: 'alkali' },
        { symbol: 'Mg', name: 'Magnesium', category: 'alkali' },
        { symbol: 'Al', name: 'Aluminium', category: 'common' },
        { symbol: 'Si', name: 'Silikon', category: 'common' },
        { symbol: 'P', name: 'Fosfor', category: 'common' },
        { symbol: 'S', name: 'Belerang', category: 'common' },
        { symbol: 'Cl', name: 'Klorin', category: 'common' },
        { symbol: 'Ar', name: 'Argon', category: 'noble' },
        { symbol: 'K', name: 'Kalium', category: 'alkali' },
        { symbol: 'Ca', name: 'Kalsium', category: 'alkali' },
        { symbol: 'Fe', name: 'Besi', category: 'transition' },
        { symbol: 'Cu', name: 'Tembaga', category: 'transition' },
        { symbol: 'Zn', name: 'Seng', category: 'transition' },
        { symbol: 'Ag', name: 'Perak', category: 'transition' },
        { symbol: 'Au', name: 'Emas', category: 'transition' },
        { symbol: 'Hg', name: 'Raksa', category: 'transition' },
        { symbol: 'Pb', name: 'Timbal', category: 'common' },
        { symbol: 'Sn', name: 'Timah', category: 'common' },
        { symbol: 'I', name: 'Iodin', category: 'common' },
        { symbol: 'Xe', name: 'Xenon', category: 'noble' }
    ];

    /* ==================== SELECTORS ==================== */
    // General
    const tabBtns = document.querySelectorAll('.tab-btn');
    const gameSections = document.querySelectorAll('.game-section');
    const toggleDarkMode = document.getElementById('toggle-dark-mode');
    const toggleSound = document.getElementById('toggle-sound');

    // Math Game
    const mathQuestionEl = document.getElementById('math-question');
    const mathAnswerInput = document.getElementById('math-answer');
    const submitMathBtn = document.getElementById('submit-answer');
    const mathScoreEl = document.getElementById('score');
    const mathCorrectEl = document.getElementById('correct');
    const mathWrongEl = document.getElementById('wrong');
    const mathTimerEl = document.getElementById('timer');
    const startMathBtn = document.getElementById('start-math-game');
    const resetMathBtn = document.getElementById('reset-math-game');
    const mathHintBtn = document.getElementById('hint-btn');
    const mathFeedbackEl = document.getElementById('feedback');
    const mathHintTextEl = document.getElementById('hint-text');
    const operationRadios = document.querySelectorAll('input[name="operation"]');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');

    // Periodic Game
    const periodicQuestionEl = document.getElementById('periodic-question');
    const periodicAnswerInput = document.getElementById('periodic-answer');
    const submitPeriodicBtn = document.getElementById('submit-periodic-answer');
    const periodicScoreEl = document.getElementById('periodic-score');
    const periodicCorrectEl = document.getElementById('periodic-correct');
    const periodicWrongEl = document.getElementById('periodic-wrong');
    const remainingEl = document.getElementById('remaining');
    const startPeriodicBtn = document.getElementById('start-periodic-game');
    const resetPeriodicBtn = document.getElementById('reset-periodic-game');
    const periodicHintBtn = document.getElementById('periodic-hint-btn');
    const skipBtn = document.getElementById('skip-btn');
    const periodicFeedbackEl = document.getElementById('periodic-feedback');
    const periodicHintTextEl = document.getElementById('periodic-hint-text');
    const modeRadios = document.querySelectorAll('input[name="mode"]');
    const categoryChecks = document.querySelectorAll('input[name="category"]');
    const elementsListEl = document.getElementById('elements-list');

     // Dashboard
    const currentDateEl = document.getElementById('current-date');
    const todayGamesCountEl = document.getElementById('today-games-count');
    const totalCumulativeScoreEl = document.getElementById('total-cumulative-score');
    const dashMathScoreEl = document.getElementById('dash-math-score');
    const dashMathRatioEl = document.getElementById('dash-math-ratio');
    const dashPeriodicScoreEl = document.getElementById('dash-periodic-score');
    const dashPeriodicRatioEl = document.getElementById('dash-periodic-ratio');
    const activityLogList = document.getElementById('activity-log-list');

    // Formula tabs
    const formulaTabBtns = document.querySelectorAll('.formula-tab-btn');
    const formulaCategoryContents = document.querySelectorAll('.formula-category-content');

    /* ==================== INITIALIZATION ==================== */
function init() {
// Set initial theme
 document.body.setAttribute('data-theme', state.theme);

    // Populate elements list
    elements.forEach(el => {
        if (el.category === 'common' && elementsListEl) {
            const badge = document.createElement('div');
            badge.className = 'element-badge';
            badge.textContent = `${el.symbol}: ${el.name}`;
            elementsListEl.appendChild(badge);
        }
    });

    // Load daily activity from localStorage
    loadDailyActivity();

    // Update dashboard
    updateDashboard();

    // Add event listeners
    setupEventListeners();
    setupGeoEvents();   // <-- tambahkan baris ini
}

function setupEventListeners() {
    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');

            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            gameSections.forEach(sec => {
                sec.classList.toggle('active', sec.id === tabId);
            });

            if (tabId === 'dashboard') updateDashboard();
        });
    });

    // Dark mode toggle
    toggleDarkMode.addEventListener('click', (e) => {
        e.preventDefault();
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.body.setAttribute('data-theme', state.theme);
        toggleDarkMode.innerHTML = state.theme === 'dark'
            ? '<i class="fas fa-moon"></i> Mode Gelap'
            : '<i class="fas fa-sun"></i> Mode Terang';
    });

    // Sound toggle
    toggleSound.addEventListener('click', (e) => {
        e.preventDefault();
        state.soundEnabled = !state.soundEnabled;
        toggleSound.innerHTML = state.soundEnabled
            ? '<i class="fas fa-volume-up"></i> Suara: ON'
            : '<i class="fas fa-volume-mute"></i> Suara: OFF';
    });

    /* Math Game Events */
    startMathBtn.addEventListener('click', startMathGame);
    resetMathBtn.addEventListener('click', resetMathGame);
    submitMathBtn.addEventListener('click', checkMathAnswer);
    mathAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkMathAnswer();
    });
    mathHintBtn.addEventListener('click', showMathHint);

    operationRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            state.math.operation = radio.value;
            if (state.math.isPlaying) resetMathGame();
        });
    });

    difficultyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            difficultyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.math.difficulty = btn.getAttribute('data-level');
            if (state.math.isPlaying) resetMathGame();
        });
    });

    /* Periodic Game Events */
    startPeriodicBtn.addEventListener('click', startPeriodicGame);
    resetPeriodicBtn.addEventListener('click', resetPeriodicGame);
    submitPeriodicBtn.addEventListener('click', checkPeriodicAnswer);
    periodicAnswerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkPeriodicAnswer();
    });
    periodicHintBtn.addEventListener('click', showPeriodicHint);
    skipBtn.addEventListener('click', skipPeriodicQuestion);

    modeRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            state.periodic.mode = radio.value;
            if (state.periodic.isPlaying) resetPeriodicGame();
        });
    });

    categoryChecks.forEach(check => {
        check.addEventListener('change', () => {
            const selected = Array.from(categoryChecks)
                .filter(c => c.checked)
                .map(c => c.value);
            state.periodic.categories = selected.length > 0 ? selected : ['common'];
            if (state.periodic.isPlaying) resetPeriodicGame();
        });
    });

    /* Formula Tab Events */
    formulaTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.getAttribute('data-category');

            formulaTabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            formulaCategoryContents.forEach(content => {
                content.classList.toggle('active', content.id === `formula-${category}`);
            });
        });
    });
}

    /* ==================== MATH GAME LOGIC ==================== */
    function startMathGame() {
        if (state.math.isPlaying) return;

        state.math.isPlaying = true;
        state.math.score = 0;
        state.math.correct = 0;
        state.math.wrong = 0;
        state.math.timer = 60;
        
        updateMathStats();
        startMathTimer();
        generateMathQuestion();
        
        startMathBtn.disabled = true;
        startMathBtn.style.opacity = '0.5';
        mathFeedbackEl.textContent = 'Game dimulai! Berikan jawaban terbaik Anda.';
        mathFeedbackEl.className = 'feedback-message info';
        mathAnswerInput.focus();
    }

    function resetMathGame() {
        state.math.isPlaying = false;
        clearInterval(state.math.interval);
        
        state.math.score = 0;
        state.math.correct = 0;
        state.math.wrong = 0;
        state.math.timer = 60;
        
        updateMathStats();
        mathQuestionEl.textContent = 'Klik "Mulai Game" untuk memulai';
        mathAnswerInput.value = '';
        mathFeedbackEl.textContent = 'Game direset.';
        mathFeedbackEl.className = 'feedback-message';
        mathHintTextEl.classList.remove('show');
        
        startMathBtn.disabled = false;
        startMathBtn.style.opacity = '1';
    }

    function startMathTimer() {
        state.math.interval = setInterval(() => {
            state.math.timer--;
            mathTimerEl.textContent = `${state.math.timer}s`;
            
            if (state.math.timer <= 0) {
                endMathGame();
            }
        }, 1000);
    }

    function endMathGame() {
        state.math.isPlaying = false;
        clearInterval(state.math.interval);
        
        mathQuestionEl.textContent = 'Waktu Habis!';
        mathFeedbackEl.innerHTML = `Game Selesai!<br>Skor Akhir: ${state.math.score}<br>Benar: ${state.math.correct}, Salah: ${state.math.wrong}`;
        mathFeedbackEl.className = 'feedback-message info';
        
        // Add to activity log
        addActivity('Mental Math', state.math.operation, state.math.score, state.math.correct, state.math.wrong);
        
        startMathBtn.disabled = false;
        startMathBtn.style.opacity = '1';
    }

    function generateMathQuestion() {
        const { operation, difficulty } = state.math;
        let num1, num2, question, answer;

        let range;
        switch (difficulty) {
            case 'easy': range = 10; break;
            case 'medium': range = 25; break;
            case 'hard': range = 50; break;
            default: range = 25;
        }

        switch (operation) {
            case 'addition':
                num1 = Math.floor(Math.random() * range) + 1;
                num2 = Math.floor(Math.random() * range) + 1;
                question = `${num1} + ${num2}`;
                answer = num1 + num2;
                break;
            case 'subtraction':
                num1 = Math.floor(Math.random() * range) + (difficulty === 'hard' ? 20 : 1);
                num2 = Math.floor(Math.random() * num1) + 1;
                question = `${num1} - ${num2}`;
                answer = num1 - num2;
                break;
            case 'multiplication':
                const mRange = difficulty === 'easy' ? 10 : (difficulty === 'medium' ? 15 : 20);
                num1 = Math.floor(Math.random() * mRange) + 1;
                num2 = Math.floor(Math.random() * 10) + 1;
                question = `${num1} × ${num2}`;
                answer = num1 * num2;
                break;
            case 'division':
                num2 = Math.floor(Math.random() * 10) + 1;
                const tempNum = Math.floor(Math.random() * 10) + 1;
                num1 = num2 * tempNum;
                question = `${num1} ÷ ${num2}`;
                answer = num1 / num2;
                break;
            case 'power2':
                num1 = Math.floor(Math.random() * (difficulty === 'easy' ? 12 : 25)) + 1;
                question = `${num1}²`;
                answer = Math.pow(num1, 2);
                break;
            case 'power3':
                num1 = Math.floor(Math.random() * (difficulty === 'easy' ? 5 : 12)) + 1;
                question = `${num1}³`;
                answer = Math.pow(num1, 3);
                break;
            case 'square-root':
                const rootBase = Math.floor(Math.random() * (difficulty === 'easy' ? 12 : 20)) + 1;
                num1 = Math.pow(rootBase, 2);
                question = `√${num1}`;
                answer = rootBase;
                break;
        }

        state.math.currentQuestion = question;
        state.math.currentAnswer = answer;
        mathQuestionEl.textContent = question;
        mathAnswerInput.value = '';
        mathHintTextEl.classList.remove('show');
    }

    function checkMathAnswer() {
        if (!state.math.isPlaying) return;
        
        const userAnswer = parseInt(mathAnswerInput.value);
        if (isNaN(userAnswer)) return;

        if (userAnswer === state.math.currentAnswer) {
            state.math.score += (state.math.difficulty === 'easy' ? 10 : (state.math.difficulty === 'medium' ? 20 : 30));
            state.math.correct++;
            mathFeedbackEl.textContent = 'Benar! Bagus sekali.';
            mathFeedbackEl.className = 'feedback-message correct';
            
            // Animation
            mathQuestionEl.classList.add('pulse');
            setTimeout(() => mathQuestionEl.classList.remove('pulse'), 500);
            
            generateMathQuestion();
        } else {
            state.math.wrong++;
            state.math.score = Math.max(0, state.math.score - 5);
            mathFeedbackEl.textContent = 'Salah! Coba lagi.';
            mathFeedbackEl.className = 'feedback-message wrong';
            
            // Animation
            mathQuestionEl.classList.add('shake');
            setTimeout(() => mathQuestionEl.classList.remove('shake'), 300);
            
            mathAnswerInput.value = '';
        }
        
        updateMathStats();
        mathAnswerInput.focus();
    }

    function updateMathStats() {
        mathScoreEl.textContent = state.math.score;
        mathCorrectEl.textContent = state.math.correct;
        mathWrongEl.textContent = state.math.wrong;
        mathTimerEl.textContent = `${state.math.timer}s`;
    }

    function showMathHint() {
        if (!state.math.isPlaying) return;
        
        const ans = state.math.currentAnswer.toString();
        const hint = `Jawabannya memiliki ${ans.length} digit dan berakhir dengan angka ${ans[ans.length - 1]}.`;
        
        mathHintTextEl.textContent = hint;
        mathHintTextEl.classList.add('show');
        state.math.score = Math.max(0, state.math.score - 2);
        updateMathStats();
    }

    /* ==================== PERIODIC GAME LOGIC ==================== */
    function startPeriodicGame() {
        if (state.periodic.isPlaying) return;

        state.periodic.isPlaying = true;
        state.periodic.score = 0;
        state.periodic.correct = 0;
        state.periodic.wrong = 0;
        state.periodic.remaining = 10;
        state.periodic.elementsUsed = [];
        
        updatePeriodicStats();
        generatePeriodicQuestion();
        
        startPeriodicBtn.disabled = true;
        startPeriodicBtn.style.opacity = '0.5';
        periodicFeedbackEl.textContent = 'Game dimulai! Hafalkan elemennya.';
        periodicFeedbackEl.className = 'feedback-message info';
        periodicAnswerInput.focus();
    }

    function resetPeriodicGame() {
        state.periodic.isPlaying = false;
            clearTimeout(state.periodic.skipTimeout);
            state.periodic.skipTimeout = null;
        
        state.periodic.score = 0;
        state.periodic.correct = 0;
        state.periodic.wrong = 0;
        state.periodic.remaining = 10;
        
        updatePeriodicStats();
        periodicQuestionEl.textContent = 'Klik "Mulai Game" untuk memulai';
        periodicAnswerInput.value = '';
        periodicFeedbackEl.textContent = 'Game direset.';
        periodicFeedbackEl.className = 'feedback-message';
        periodicHintTextEl.classList.remove('show');
        
        startPeriodicBtn.disabled = false;
        startPeriodicBtn.style.opacity = '1';
    }

    function generatePeriodicQuestion() {
        let pool = elements;
        if (!state.periodic.categories.includes('all')) {
            pool = elements.filter(el => state.periodic.categories.includes(el.category));
        }

        if (pool.length === 0) pool = elements;

        // Filter out used elements if possible
        let available = pool.filter(el => !state.periodic.elementsUsed.includes(el.symbol));
        if (available.length === 0) {
            state.periodic.elementsUsed = [];
            available = pool;
        }

        const selected = available[Math.floor(Math.random() * available.length)];
        state.periodic.elementsUsed.push(selected.symbol);

        let mode = state.periodic.mode;
        if (mode === 'mixed') {
            mode = Math.random() > 0.5 ? 'symbol-to-name' : 'name-to-symbol';
        }

        state.periodic.currentMode = mode;

        if (mode === 'symbol-to-name') {
            state.periodic.currentQuestion = selected.symbol;
            state.periodic.currentAnswer = selected.name;
            periodicQuestionEl.textContent = `Apa nama elemen dari simbol: ${selected.symbol}?`;
        } else {
            state.periodic.currentQuestion = selected.name;
            state.periodic.currentAnswer = selected.symbol;
            periodicQuestionEl.textContent = `Apa simbol kimia untuk: ${selected.name}?`;
        }

        periodicAnswerInput.value = '';
        periodicHintTextEl.classList.remove('show');
    }

    function checkPeriodicAnswer() {
        if (!state.periodic.isPlaying || state.periodic.skipTimeout) return;
        
        const userAnswer = periodicAnswerInput.value.trim().toLowerCase();
        const correctAnswer = state.periodic.currentAnswer.toLowerCase();

        if (userAnswer === correctAnswer) {
            state.periodic.score += 50;
            state.periodic.correct++;
            state.periodic.remaining--;
            periodicFeedbackEl.textContent = 'Benar! Luar biasa.';
            periodicFeedbackEl.className = 'feedback-message correct';
            
            periodicQuestionEl.classList.add('pulse');
            setTimeout(() => periodicQuestionEl.classList.remove('pulse'), 500);

            if (state.periodic.remaining <= 0) {
                endPeriodicGame();
            } else {
                generatePeriodicQuestion();
            }
        } else {
            state.periodic.wrong++;
            state.periodic.score = Math.max(0, state.periodic.score - 10);
            periodicFeedbackEl.textContent = 'Kurang tepat. Coba lagi!';
            periodicFeedbackEl.className = 'feedback-message wrong';
            
            periodicQuestionEl.classList.add('shake');
            setTimeout(() => periodicQuestionEl.classList.remove('shake'), 300);
            
            periodicAnswerInput.value = '';
        }
        
        updatePeriodicStats();
        periodicAnswerInput.focus();
    }

    function endPeriodicGame() {
        state.periodic.isPlaying = false;
            clearTimeout(state.periodic.skipTimeout);
            state.periodic.skipTimeout = null;
        periodicQuestionEl.textContent = 'Sesi Selesai!';
        periodicFeedbackEl.innerHTML = `Selamat!<br>Skor Akhir: ${state.periodic.score}<br>Benar: ${state.periodic.correct}, Salah: ${state.periodic.wrong}`;
        periodicFeedbackEl.className = 'feedback-message info';
        
        // Add to activity log
        addActivity('Tabel Periodik', state.periodic.mode, state.periodic.score, state.periodic.correct, state.periodic.wrong);

        startPeriodicBtn.disabled = false;
        startPeriodicBtn.style.opacity = '1';
    }

    function updatePeriodicStats() {
        periodicScoreEl.textContent = state.periodic.score;
        periodicCorrectEl.textContent = state.periodic.correct;
        periodicWrongEl.textContent = state.periodic.wrong;
        remainingEl.textContent = state.periodic.remaining;
    }

    function showPeriodicHint() {
    if (!state.periodic.isPlaying || state.periodic.skipTimeout) return;

    const ans = state.periodic.currentAnswer;
    const hint = state.periodic.currentMode === 'symbol-to-name'
        ? `Dimulai dengan huruf "${ans[0]}" dan terdiri dari ${ans.length} huruf.`
        : `Simbol ini terdiri dari ${ans.length} karakter.`;

    periodicHintTextEl.textContent = hint;
    periodicHintTextEl.classList.add('show');
    state.periodic.score = Math.max(0, state.periodic.score - 5);
    updatePeriodicStats();
}

    function skipPeriodicQuestion() {
    if (!state.periodic.isPlaying || state.periodic.skipTimeout) return;

    state.periodic.score = Math.max(0, state.periodic.score - 20);
    state.periodic.remaining--;
    periodicFeedbackEl.textContent = `Dilewati. Jawaban benarnya adalah: ${state.periodic.currentAnswer}`;
    periodicFeedbackEl.className = 'feedback-message info';
    updatePeriodicStats();

    if (state.periodic.remaining <= 0) {
        endPeriodicGame();
    } else {
        state.periodic.skipTimeout = setTimeout(() => {
            state.periodic.skipTimeout = null;
            if (state.periodic.isPlaying) generatePeriodicQuestion();
        }, 1500);
    }
}

  /* ==================== DASHBOARD & ACTIVITY ==================== */
    function addActivity(gameType, subType, score, correct, wrong) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        const activity = {
            game: gameType,
            subType: subType,
            score: score,
            correct: correct,
            wrong: wrong,
            time: timeString,
            date: now.toDateString()
        };

        state.dailyActivity.push(activity);
        saveDailyActivity();
        updateDashboard();
    }

    function updateActivityLog() {
        const today = new Date().toDateString();
        const todayActivities = state.dailyActivity.filter(a => a.date === today);

        activityLogList.innerHTML = '';

        if (todayActivities.length === 0) {
            const li = document.createElement('li');
            li.className = 'no-activity';
            li.textContent = 'Belum ada aktivitas hari ini. Mulai bermain sekarang!';
            activityLogList.appendChild(li);
        } else {
            todayActivities.forEach(activity => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>
                        <strong>${activity.game}</strong> - ${activity.subType}
                        <br>
                        <small>Benar: ${activity.correct} | Salah: ${activity.wrong} | Skor: ${activity.score}</small>
                    </span>
                    <span style="opacity: 0.6; font-size: 0.85rem;">${activity.time}</span>
                `;
                activityLogList.appendChild(li);
            });
        }
    }

function updateDashboard() {
    const now = new Date();
    const todayString = now.toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    currentDateEl.textContent = todayString;

    const today = now.toDateString();
    const todayActivities = state.dailyActivity.filter(a => a.date === today);

    todayGamesCountEl.textContent = `${todayActivities.length} Sesi`;

    let totalScore = 0;
    let mathScore = 0, mathCorrect = 0, mathWrong = 0;
    let periodicScore = 0, periodicCorrect = 0, periodicWrong = 0;
    let geoScore = 0, geoCorrect = 0, geoWrong = 0;
    let bioScore = 0, bioCorrect = 0, bioWrong = 0; 

    todayActivities.forEach(activity => {
        totalScore += activity.score;

        if (activity.game === 'Mental Math') {
            mathScore += activity.score;
            mathCorrect += activity.correct;
            mathWrong += activity.wrong;
        } else if (activity.game === 'Tabel Periodik') {
            periodicScore += activity.score;
            periodicCorrect += activity.correct;
            periodicWrong += activity.wrong;
        } else if (activity.game === 'Geografi & Astronomi') {
            geoScore += activity.score;
            geoCorrect += activity.correct;
            geoWrong += activity.wrong;
         } else if (activity.game === 'Biologi') {   
            bioScore += activity.score;
            bioCorrect += activity.correct;
            bioWrong += activity.wrong;
        }
    });

    totalCumulativeScoreEl.textContent = `${totalScore} Poin`;
    dashMathScoreEl.textContent = mathScore;
    dashMathRatioEl.textContent = `${mathCorrect} / ${mathWrong}`;
    dashPeriodicScoreEl.textContent = periodicScore;
    dashPeriodicRatioEl.textContent = `${periodicCorrect} / ${periodicWrong}`;
    document.getElementById('dash-geo-score').textContent = geoScore;
    document.getElementById('dash-geo-ratio').textContent = `${geoCorrect} / ${geoWrong}`;
    document.getElementById('dash-bio-score').textContent = bioScore;
    document.getElementById('dash-bio-ratio').textContent = `${bioCorrect} / ${bioWrong}`;

    updateActivityLog();
}

    function saveDailyActivity() {
        localStorage.setItem('gameActivity', JSON.stringify(state.dailyActivity));
    }

    function loadDailyActivity() {
        const saved = localStorage.getItem('gameActivity');
        if (saved) {
            state.dailyActivity = JSON.parse(saved);
        }
    }

/* ==================== GEOGRAFI & ASTRONOMI ==================== */
const geoQuestions = [
    // ---- Geografi ----
    { cat: 'geografi', q: 'Apa ibu kota Australia?', options: ['Sydney', 'Canberra', 'Melbourne', 'Perth'], answer: 'Canberra', fact: 'Canberra dipilih sebagai kompromi antara dua kota rival, Sydney dan Melbourne.' },
    { cat: 'geografi', q: 'Gunung apa yang paling tinggi di atas permukaan laut?', options: ['K2', 'Kilimanjaro', 'Everest', 'Elbrus'], answer: 'Everest', fact: 'Puncak Everest setinggi sekitar 8.849 meter di atas permukaan laut.' },
    { cat: 'geografi', q: 'Benua mana yang paling luas?', options: ['Afrika', 'Asia', 'Amerika Utara', 'Eropa'], answer: 'Asia', fact: 'Asia mencakup sekitar 30% daratan Bumi dan dihuni lebih dari separuh penduduk dunia.' },
    { cat: 'geografi', q: 'Negara mana yang memiliki wilayah terluas di dunia?', options: ['Kanada', 'Tiongkok', 'Rusia', 'Amerika Serikat'], answer: 'Rusia', fact: 'Wilayah Rusia membentang melintasi 11 zona waktu.' },
    { cat: 'geografi', q: 'Samudra mana yang paling luas?', options: ['Atlantik', 'Hindia', 'Arktik', 'Pasifik'], answer: 'Pasifik', fact: 'Samudra Pasifik meliputi sekitar sepertiga permukaan Bumi.' },
    { cat: 'geografi', q: 'Apa ibu kota Jepang?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], answer: 'Tokyo', fact: 'Kyoto adalah ibu kota Jepang selama lebih dari seribu tahun sebelum dipindah ke Tokyo.' },
    { cat: 'geografi', q: 'Gurun panas terbesar di dunia adalah...', options: ['Gobi', 'Sahara', 'Kalahari', 'Arab'], answer: 'Sahara', fact: 'Gurun Sahara luasnya hampir sebesar benua Amerika Serikat.' },
    { cat: 'geografi', q: 'Danau terdalam di dunia adalah...', options: ['Danau Baikal', 'Danau Victoria', 'Danau Toba', 'Danau Superior'], answer: 'Danau Baikal', fact: 'Danau Baikal di Rusia memiliki kedalaman lebih dari 1.600 meter.' },
    { cat: 'geografi', q: 'Apa ibu kota Kanada?', options: ['Toronto', 'Vancouver', 'Montreal', 'Ottawa'], answer: 'Ottawa', fact: 'Toronto kota terbesar di Kanada, tetapi ibu kotanya adalah Ottawa.' },
    { cat: 'geografi', q: 'Gunung tertinggi di Indonesia adalah...', options: ['Puncak Jaya', 'Gunung Kerinci', 'Gunung Rinjani', 'Gunung Semeru'], answer: 'Puncak Jaya', fact: 'Puncak Jaya di Papua tingginya sekitar 4.884 meter dan masih memiliki sisa es.' },
    { cat: 'geografi', q: 'Selat apa yang memisahkan Pulau Sumatra dan Semenanjung Malaya?', options: ['Selat Sunda', 'Selat Malaka', 'Selat Bali', 'Selat Makassar'], answer: 'Selat Malaka', fact: 'Selat Malaka adalah salah satu jalur pelayaran tersibuk di dunia.' },
    { cat: 'geografi', q: 'Negara mana yang kini berpenduduk terbanyak di dunia?', options: ['Tiongkok', 'India', 'Amerika Serikat', 'Indonesia'], answer: 'India', fact: 'India melampaui Tiongkok sebagai negara berpenduduk terbanyak sejak 2023.' },

    // ---- Astronomi ----
    { cat: 'astronomi', q: 'Planet mana yang paling dekat dengan Matahari?', options: ['Venus', 'Merkurius', 'Mars', 'Bumi'], answer: 'Merkurius', fact: 'Merkurius mengorbit Matahari hanya dalam sekitar 88 hari Bumi.' },
    { cat: 'astronomi', q: 'Planet mana yang paling besar di tata surya?', options: ['Saturnus', 'Neptunus', 'Jupiter', 'Uranus'], answer: 'Jupiter', fact: 'Bumi bisa muat lebih dari 1.000 kali di dalam volume Jupiter.' },
    { cat: 'astronomi', q: 'Planet mana yang dijuluki Planet Merah?', options: ['Mars', 'Merkurius', 'Jupiter', 'Venus'], answer: 'Mars', fact: 'Warna merah Mars berasal dari karat (besi oksida) di permukaannya.' },
    { cat: 'astronomi', q: 'Tata surya kita berada di galaksi yang bernama...', options: ['Andromeda', 'Bima Sakti', 'Triangulum', 'Whirlpool'], answer: 'Bima Sakti', fact: 'Galaksi Bima Sakti berisi ratusan miliar bintang.' },
    { cat: 'astronomi', q: 'Bintang terdekat dari Bumi adalah...', options: ['Sirius', 'Proxima Centauri', 'Matahari', 'Polaris'], answer: 'Matahari', fact: 'Bintang terdekat berikutnya adalah Proxima Centauri, sekitar 4,2 tahun cahaya jauhnya.' },
    { cat: 'astronomi', q: 'Planet mana yang terkenal dengan cincinnya yang paling menonjol?', options: ['Saturnus', 'Mars', 'Merkurius', 'Venus'], answer: 'Saturnus', fact: 'Cincin Saturnus sebagian besar tersusun dari es dan bongkahan batu.' },
    { cat: 'astronomi', q: 'Planet mana yang paling panas permukaannya?', options: ['Merkurius', 'Mars', 'Venus', 'Jupiter'], answer: 'Venus', fact: 'Atmosfer Venus yang tebal memerangkap panas hingga suhunya sekitar 465°C.' },
    { cat: 'astronomi', q: 'Planet mana yang paling jauh dari Matahari?', options: ['Uranus', 'Neptunus', 'Saturnus', 'Jupiter'], answer: 'Neptunus', fact: 'Satu tahun di Neptunus sama dengan sekitar 165 tahun Bumi.' },
    { cat: 'astronomi', q: 'Cahaya Matahari sampai ke Bumi dalam waktu sekitar...', options: ['8 detik', '8 menit', '8 jam', '8 hari'], answer: '8 menit', fact: 'Jarak Bumi-Matahari sekitar 150 juta kilometer.' },
    { cat: 'astronomi', q: 'Siapa manusia pertama yang menginjakkan kaki di Bulan?', options: ['Yuri Gagarin', 'Buzz Aldrin', 'Neil Armstrong', 'John Glenn'], answer: 'Neil Armstrong', fact: 'Neil Armstrong mendarat di Bulan pada misi Apollo 11 tahun 1969.' },
    { cat: 'astronomi', q: 'Tahun cahaya adalah satuan untuk mengukur...', options: ['Waktu', 'Kecepatan', 'Jarak', 'Massa'], answer: 'Jarak', fact: 'Satu tahun cahaya adalah jarak tempuh cahaya dalam setahun, sekitar 9,46 triliun km.' },
    { cat: 'astronomi', q: 'Apa nama satelit alami Bumi?', options: ['Titan', 'Bulan', 'Phobos', 'Europa'], answer: 'Bulan', fact: 'Gravitasi Bulan adalah penyebab utama pasang surut air laut.' }
];

state.geo = {
    score: 0,
    correct: 0,
    wrong: 0,
    remaining: 10,
    isPlaying: false,
    answered: false,
    hintUsed: false,
    current: null,
    category: 'mixed',
    used: [],
    nextTimeout: null
};

const geoQuestionEl = document.getElementById('geo-question');
const geoOptionsEl = document.getElementById('geo-options');
const geoScoreEl = document.getElementById('geo-score');
const geoCorrectEl = document.getElementById('geo-correct');
const geoWrongEl = document.getElementById('geo-wrong');
const geoRemainingEl = document.getElementById('geo-remaining');
const startGeoBtn = document.getElementById('start-geo-game');
const resetGeoBtn = document.getElementById('reset-geo-game');
const geoHintBtn = document.getElementById('geo-hint-btn');
const geoFeedbackEl = document.getElementById('geo-feedback');
const geoHintTextEl = document.getElementById('geo-hint-text');
const geoFactEl = document.getElementById('geo-fact');
const geoRadios = document.querySelectorAll('input[name="geo-category"]');

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function setupGeoEvents() {
    startGeoBtn.addEventListener('click', startGeoGame);
    resetGeoBtn.addEventListener('click', resetGeoGame);
    geoHintBtn.addEventListener('click', showGeoHint);

    geoRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            state.geo.category = radio.value;
            if (state.geo.isPlaying) resetGeoGame();
        });
    });
}

function startGeoGame() {
    const g = state.geo;
    if (g.isPlaying) return;

    g.isPlaying = true;
    g.score = 0;
    g.correct = 0;
    g.wrong = 0;
    g.remaining = 10;
    g.used = [];

    updateGeoStats();
    generateGeoQuestion();

    startGeoBtn.disabled = true;
    startGeoBtn.style.opacity = '0.5';
    geoFeedbackEl.textContent = 'Game dimulai! Pilih jawaban yang benar.';
    geoFeedbackEl.className = 'feedback-message info';
}

function resetGeoGame() {
    const g = state.geo;
    g.isPlaying = false;
    clearTimeout(g.nextTimeout);
    g.nextTimeout = null;

    g.score = 0;
    g.correct = 0;
    g.wrong = 0;
    g.remaining = 10;

    updateGeoStats();
    geoQuestionEl.textContent = 'Klik "Mulai Game" untuk memulai';
    geoOptionsEl.innerHTML = '';
    geoFeedbackEl.textContent = 'Game direset.';
    geoFeedbackEl.className = 'feedback-message';
    geoHintTextEl.classList.remove('show');
    geoFactEl.classList.remove('show');

    startGeoBtn.disabled = false;
    startGeoBtn.style.opacity = '1';
}

function generateGeoQuestion() {
    const g = state.geo;
    const pool = geoQuestions.filter(q => g.category === 'mixed' || q.cat === g.category);

    let available = pool.filter(q => !g.used.includes(q.q));
    if (available.length === 0) {
        g.used = [];
        available = pool;
    }

    const selected = available[Math.floor(Math.random() * available.length)];
    g.used.push(selected.q);
    g.current = selected;
    g.answered = false;
    g.hintUsed = false;

    geoQuestionEl.textContent = selected.q;
    geoHintTextEl.classList.remove('show');
    geoFactEl.classList.remove('show');
    geoOptionsEl.innerHTML = '';

    shuffleArray(selected.options).forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'geo-option-btn';
        btn.textContent = opt;
        btn.addEventListener('click', () => checkGeoAnswer(btn, opt));
        geoOptionsEl.appendChild(btn);
    });
}

function checkGeoAnswer(btn, chosen) {
    const g = state.geo;
    if (!g.isPlaying || g.answered) return;

    g.answered = true;
    g.remaining--;

    const isCorrect = chosen === g.current.answer;

    if (isCorrect) {
        g.score += 50;
        g.correct++;
        geoFeedbackEl.textContent = 'Benar! Luar biasa.';
        geoFeedbackEl.className = 'feedback-message correct';
        geoQuestionEl.classList.add('pulse');
        setTimeout(() => geoQuestionEl.classList.remove('pulse'), 500);
    } else {
        g.wrong++;
        g.score = Math.max(0, g.score - 10);
        geoFeedbackEl.textContent = `Salah! Jawaban benar: ${g.current.answer}`;
        geoFeedbackEl.className = 'feedback-message wrong';
        geoQuestionEl.classList.add('shake');
        setTimeout(() => geoQuestionEl.classList.remove('shake'), 300);
        btn.classList.add('wrong');
    }

    geoOptionsEl.querySelectorAll('.geo-option-btn').forEach(b => {
        b.disabled = true;
        if (b.textContent === g.current.answer) b.classList.add('correct');
    });

    geoFactEl.textContent = '💡 ' + g.current.fact;
    geoFactEl.classList.add('show');
    updateGeoStats();

    g.nextTimeout = setTimeout(() => {
        g.nextTimeout = null;
        if (!g.isPlaying) return;
        if (g.remaining <= 0) {
            endGeoGame();
        } else {
            generateGeoQuestion();
        }
    }, 2500);
}

function showGeoHint() {
    const g = state.geo;
    if (!g.isPlaying || g.answered || g.hintUsed) return;

    g.hintUsed = true;
    const wrongBtns = Array.from(geoOptionsEl.querySelectorAll('.geo-option-btn'))
        .filter(b => b.textContent !== g.current.answer);

    shuffleArray(wrongBtns).slice(0, 2).forEach(b => {
        b.disabled = true;
        b.classList.add('eliminated');
    });

    geoHintTextEl.textContent = '2 pilihan yang salah sudah dihapus. (-5 poin)';
    geoHintTextEl.classList.add('show');
    g.score = Math.max(0, g.score - 5);
    updateGeoStats();
}

function endGeoGame() {
    const g = state.geo;
    g.isPlaying = false;
    clearTimeout(g.nextTimeout);
    g.nextTimeout = null;

    geoQuestionEl.textContent = 'Sesi Selesai!';
    geoOptionsEl.innerHTML = '';
    geoFactEl.classList.remove('show');
    geoHintTextEl.classList.remove('show');
    geoFeedbackEl.innerHTML = `Selamat!<br>Skor Akhir: ${g.score}<br>Benar: ${g.correct}, Salah: ${g.wrong}`;
    geoFeedbackEl.className = 'feedback-message info';

    const labels = { mixed: 'campuran', geografi: 'geografi', astronomi: 'astronomi' };
    addActivity('Geografi & Astronomi', labels[g.category], g.score, g.correct, g.wrong);

    startGeoBtn.disabled = false;
    startGeoBtn.style.opacity = '1';
}

function updateGeoStats() {
    geoScoreEl.textContent = state.geo.score;
    geoCorrectEl.textContent = state.geo.correct;
    geoWrongEl.textContent = state.geo.wrong;
    geoRemainingEl.textContent = state.geo.remaining;
}

/* ==================== BIOLOGI ==================== */
const bioQuestions = [
    // ---- Tubuh Manusia ----
    { cat: 'manusia', q: 'Organ apa yang berfungsi memompa darah ke seluruh tubuh?', options: ['Paru-paru', 'Jantung', 'Ginjal', 'Hati'], answer: 'Jantung', fact: 'Jantung manusia berdetak sekitar 100.000 kali setiap hari.' },
    { cat: 'manusia', q: 'Berapa jumlah tulang pada orang dewasa?', options: ['106', '206', '306', '406'], answer: '206', fact: 'Bayi lahir dengan jumlah tulang lebih banyak, lalu sebagian menyatu seiring pertumbuhan.' },
    { cat: 'manusia', q: 'Organ terbesar pada tubuh manusia adalah...', options: ['Hati', 'Usus', 'Kulit', 'Paru-paru'], answer: 'Kulit', fact: 'Kulit melindungi tubuh, mengatur suhu, dan menjadi indra peraba.' },
    { cat: 'manusia', q: 'Sel darah merah bertugas mengangkut...', options: ['Oksigen', 'Hormon', 'Antibodi', 'Vitamin'], answer: 'Oksigen', fact: 'Sel darah merah mengandung hemoglobin yang mengikat oksigen.' },
    { cat: 'manusia', q: 'Vitamin apa yang dibentuk tubuh dengan bantuan sinar matahari?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D', 'Vitamin K'], answer: 'Vitamin D', fact: 'Vitamin D penting untuk penyerapan kalsium dan kesehatan tulang.' },
    { cat: 'manusia', q: 'Pertukaran oksigen dan karbon dioksida terjadi di bagian paru-paru yang disebut...', options: ['Bronkus', 'Alveolus', 'Trakea', 'Diafragma'], answer: 'Alveolus', fact: 'Alveolus berdinding sangat tipis dan dikelilingi pembuluh darah kapiler.' },
    { cat: 'manusia', q: 'Organ yang menyaring darah dan membentuk urine adalah...', options: ['Ginjal', 'Lambung', 'Pankreas', 'Limpa'], answer: 'Ginjal', fact: 'Setiap ginjal mengandung sekitar satu juta unit penyaring yang disebut nefron.' },

    // ---- Tumbuhan & Hewan ----
    { cat: 'makhluk', q: 'Proses tumbuhan hijau membuat makanan dengan bantuan cahaya matahari disebut...', options: ['Respirasi', 'Fotosintesis', 'Transpirasi', 'Fermentasi'], answer: 'Fotosintesis', fact: 'Fotosintesis menghasilkan glukosa dan melepaskan oksigen.' },
    { cat: 'makhluk', q: 'Gas apa yang diserap tumbuhan untuk fotosintesis?', options: ['Oksigen', 'Nitrogen', 'Karbon dioksida', 'Hidrogen'], answer: 'Karbon dioksida', fact: 'Gas ini masuk melalui stomata, yaitu pori kecil pada daun.' },
    { cat: 'makhluk', q: 'Hewan yang hanya memakan tumbuhan disebut...', options: ['Karnivora', 'Herbivora', 'Omnivora', 'Insektivora'], answer: 'Herbivora', fact: 'Sapi, kambing, dan kelinci adalah contoh herbivora.' },
    { cat: 'makhluk', q: 'Katak termasuk kelompok hewan...', options: ['Reptil', 'Mamalia', 'Amfibi', 'Aves'], answer: 'Amfibi', fact: 'Katak hidup di dua alam: berudu di air, dewasa di darat dan air.' },
    { cat: 'makhluk', q: 'Zat hijau daun yang berperan menangkap cahaya matahari disebut...', options: ['Klorofil', 'Hemoglobin', 'Melanin', 'Keratin'], answer: 'Klorofil', fact: 'Klorofil terdapat di dalam kloroplas.' },
    { cat: 'makhluk', q: 'Hewan terbesar yang pernah hidup di Bumi adalah...', options: ['Gajah afrika', 'Hiu paus', 'Paus biru', 'Dinosaurus'], answer: 'Paus biru', fact: 'Paus biru bisa mencapai panjang sekitar 30 meter.' },
    { cat: 'makhluk', q: 'Serangga memiliki berapa pasang kaki?', options: ['2 pasang', '3 pasang', '4 pasang', '5 pasang'], answer: '3 pasang', fact: 'Serangga memiliki tubuh yang terbagi atas kepala, dada, dan perut.' },

    // ---- Sel & Genetika ----
    { cat: 'sel', q: 'Bagian sel yang mengendalikan seluruh aktivitas sel adalah...', options: ['Mitokondria', 'Inti sel', 'Ribosom', 'Vakuola'], answer: 'Inti sel', fact: 'Inti sel menyimpan materi genetik berupa DNA.' },
    { cat: 'sel', q: 'Organel yang menghasilkan energi (ATP) bagi sel disebut...', options: ['Lisosom', 'Badan Golgi', 'Mitokondria', 'Kloroplas'], answer: 'Mitokondria', fact: 'Mitokondria sering dijuluki "pembangkit tenaga" sel.' },
    { cat: 'sel', q: 'Molekul pembawa informasi genetik adalah...', options: ['DNA', 'ATP', 'Glukosa', 'Lemak'], answer: 'DNA', fact: 'DNA berbentuk heliks ganda dan tersusun dari empat basa: A, T, G, dan C.' },
    { cat: 'sel', q: 'Siapa yang pertama kali menemukan dan menamai sel?', options: ['Robert Hooke', 'Louis Pasteur', 'Charles Darwin', 'Gregor Mendel'], answer: 'Robert Hooke', fact: 'Robert Hooke mengamati sel pada irisan gabus dengan mikroskop pada tahun 1665.' },
    { cat: 'sel', q: 'Bagian yang hanya dimiliki sel tumbuhan, tidak dimiliki sel hewan, adalah...', options: ['Membran sel', 'Dinding sel', 'Sitoplasma', 'Inti sel'], answer: 'Dinding sel', fact: 'Dinding sel tersusun dari selulosa dan memberi bentuk yang kokoh.' },
    { cat: 'sel', q: 'Siapa yang dijuluki Bapak Genetika?', options: ['Gregor Mendel', 'Isaac Newton', 'Alexander Fleming', 'Carl Linnaeus'], answer: 'Gregor Mendel', fact: 'Mendel meneliti pewarisan sifat melalui percobaan pada tanaman kacang ercis.' },
    { cat: 'sel', q: 'Pembelahan sel yang menghasilkan sel kelamin (gamet) disebut...', options: ['Mitosis', 'Meiosis', 'Amitosis', 'Fusi'], answer: 'Meiosis', fact: 'Meiosis menghasilkan sel dengan jumlah kromosom setengah dari sel induk.' }
];

createQuizGame({
    prefix: 'bio',
    activityName: 'Biologi',
    questions: bioQuestions,
    labels: { mixed: 'campuran', manusia: 'tubuh manusia', makhluk: 'tumbuhan & hewan', sel: 'sel & genetika' }
});

function createQuizGame({ prefix, activityName, questions, labels }) {
    const $ = id => document.getElementById(id);
    const el = {
        question: $(`${prefix}-question`),
        options: $(`${prefix}-options`),
        score: $(`${prefix}-score`),
        correct: $(`${prefix}-correct`),
        wrong: $(`${prefix}-wrong`),
        remaining: $(`${prefix}-remaining`),
        start: $(`start-${prefix}-game`),
        reset: $(`reset-${prefix}-game`),
        hint: $(`${prefix}-hint-btn`),
        feedback: $(`${prefix}-feedback`),
        hintText: $(`${prefix}-hint-text`),
        fact: $(`${prefix}-fact`)
    };
    const radios = document.querySelectorAll(`input[name="${prefix}-category"]`);

    const g = {
        score: 0, correct: 0, wrong: 0, remaining: 10,
        isPlaying: false, answered: false, hintUsed: false,
        current: null, category: 'mixed', used: [], nextTimeout: null
    };

    function updateStats() {
        el.score.textContent = g.score;
        el.correct.textContent = g.correct;
        el.wrong.textContent = g.wrong;
        el.remaining.textContent = g.remaining;
    }

    function start() {
        if (g.isPlaying) return;
        g.isPlaying = true;
        g.score = 0; g.correct = 0; g.wrong = 0; g.remaining = 10; g.used = [];
        updateStats();
        nextQuestion();
        el.start.disabled = true;
        el.start.style.opacity = '0.5';
        el.feedback.textContent = 'Game dimulai! Pilih jawaban yang benar.';
        el.feedback.className = 'feedback-message info';
    }

    function reset() {
        g.isPlaying = false;
        clearTimeout(g.nextTimeout);
        g.nextTimeout = null;
        g.score = 0; g.correct = 0; g.wrong = 0; g.remaining = 10;
        updateStats();
        el.question.textContent = 'Klik "Mulai Game" untuk memulai';
        el.options.innerHTML = '';
        el.feedback.textContent = 'Game direset.';
        el.feedback.className = 'feedback-message';
        el.hintText.classList.remove('show');
        el.fact.classList.remove('show');
        el.start.disabled = false;
        el.start.style.opacity = '1';
    }

    function nextQuestion() {
        const pool = questions.filter(q => g.category === 'mixed' || q.cat === g.category);
        let available = pool.filter(q => !g.used.includes(q.q));
        if (available.length === 0) {
            g.used = [];
            available = pool;
        }

        const selected = available[Math.floor(Math.random() * available.length)];
        g.used.push(selected.q);
        g.current = selected;
        g.answered = false;
        g.hintUsed = false;

        el.question.textContent = selected.q;
        el.hintText.classList.remove('show');
        el.fact.classList.remove('show');
        el.options.innerHTML = '';

        shuffleArray(selected.options).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'geo-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => answer(btn, opt));
            el.options.appendChild(btn);
        });
    }

    function answer(btn, chosen) {
        if (!g.isPlaying || g.answered) return;
        g.answered = true;
        g.remaining--;

        if (chosen === g.current.answer) {
            g.score += 50;
            g.correct++;
            el.feedback.textContent = 'Benar! Luar biasa.';
            el.feedback.className = 'feedback-message correct';
            el.question.classList.add('pulse');
            setTimeout(() => el.question.classList.remove('pulse'), 500);
        } else {
            g.wrong++;
            g.score = Math.max(0, g.score - 10);
            el.feedback.textContent = `Salah! Jawaban benar: ${g.current.answer}`;
            el.feedback.className = 'feedback-message wrong';
            el.question.classList.add('shake');
            setTimeout(() => el.question.classList.remove('shake'), 300);
            btn.classList.add('wrong');
        }

        el.options.querySelectorAll('.geo-option-btn').forEach(b => {
            b.disabled = true;
            if (b.textContent === g.current.answer) b.classList.add('correct');
        });

        el.fact.textContent = '💡 ' + g.current.fact;
        el.fact.classList.add('show');
        updateStats();

        g.nextTimeout = setTimeout(() => {
            g.nextTimeout = null;
            if (!g.isPlaying) return;
            if (g.remaining <= 0) end();
            else nextQuestion();
        }, 2500);
    }

    function showHint() {
        if (!g.isPlaying || g.answered || g.hintUsed) return;
        g.hintUsed = true;

        const wrongBtns = Array.from(el.options.querySelectorAll('.geo-option-btn'))
            .filter(b => b.textContent !== g.current.answer);
        shuffleArray(wrongBtns).slice(0, 2).forEach(b => {
            b.disabled = true;
            b.classList.add('eliminated');
        });

        el.hintText.textContent = '2 pilihan yang salah sudah dihapus. (-5 poin)';
        el.hintText.classList.add('show');
        g.score = Math.max(0, g.score - 5);
        updateStats();
    }

    function end() {
        g.isPlaying = false;
        clearTimeout(g.nextTimeout);
        g.nextTimeout = null;

        el.question.textContent = 'Sesi Selesai!';
        el.options.innerHTML = '';
        el.fact.classList.remove('show');
        el.hintText.classList.remove('show');
        el.feedback.innerHTML = `Selamat!<br>Skor Akhir: ${g.score}<br>Benar: ${g.correct}, Salah: ${g.wrong}`;
        el.feedback.className = 'feedback-message info';

        addActivity(activityName, labels[g.category], g.score, g.correct, g.wrong);

        el.start.disabled = false;
        el.start.style.opacity = '1';
    }

    el.start.addEventListener('click', start);
    el.reset.addEventListener('click', reset);
    el.hint.addEventListener('click', showHint);
    radios.forEach(radio => {
        radio.addEventListener('change', () => {
            g.category = radio.value;
            if (g.isPlaying) reset();
        });
    });
}
    // Run init
    init();
});