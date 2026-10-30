/**
 * تطبيق إياد زيد التعليمي للأطفال | Ayad Zaid Kids App
 * المنطق التفاعلي، الأصوات، ميكي ماوس، القرآن الكريم، الحساب، والإنجليزية
 */

// ==========================================================
// 1. STATE & CONSTANTS
// ==========================================================
const APP_STORAGE_KEY = 'ayad_zaid_app_profile_v1';
const TIMER_STORAGE_KEY = 'ayad_zaid_timer_settings_v1';

let kidProfile = {
  name: 'إياد زيد',
  school: 'روضة ومدرسة الأبطال',
  age: 6,
  password: '1234',
  parentPin: '4321',
  stars: 45,
  mathScore: 10,
  avatar: 'assets/images/ayad_avatar.jpg'
};

let timerConfig = {
  enabled: true,
  limitMinutes: 30,
  remainingSeconds: 30 * 60,
  isLocked: false
};

let timerInterval = null;
let currentScreen = 'screen-intro';
let currentArabicLetter = null;
let currentArabicMode = 'all'; // 'all', 'animals', 'plants'
let currentArabicAlt = false;

// Audio context for sound effects
let audioCtx = null;

// ==========================================================
// 2. DATA: ARABIC ALPHABET (الحيوانات والنباتات)
// ==========================================================
const ARABIC_ALPHABET = [
  { char: 'أ', name: 'أَلِفْ', animal: 'أَسَدٌ 🦁', animalWord: 'أَسَدْ', plant: 'أَنَانَاسٌ 🍍', plantWord: 'أَنَانَاسْ' },
  { char: 'ب', name: 'بَاءْ', animal: 'بَطَّةٌ 🦆', animalWord: 'بَطَّة', plant: 'بُرْتُقَالٌ 🍊', plantWord: 'بُرْتُقَالْ' },
  { char: 'ت', name: 'تَاءْ', animal: 'تِمْسَاحٌ 🐊', animalWord: 'تِمْسَاحْ', plant: 'تُفَّاحَةٌ 🍎', plantWord: 'تُفَّاحَة' },
  { char: 'ث', name: 'ثَاءْ', animal: 'ثَعْلَبٌ 🦊', animalWord: 'ثَعْلَبْ', plant: 'ثَوْمٌ 🧄', plantWord: 'ثَوْمْ' },
  { char: 'ج', name: 'جِيمْ', animal: 'جَمَلٌ 🐪', animalWord: 'جَمَلْ', plant: 'جَزَرٌ 🥕', plantWord: 'جَزَرْ' },
  { char: 'ح', name: 'حَاءْ', animal: 'حِصَانٌ 🐴', animalWord: 'حِصَانْ', plant: 'حَبَقٌ (رَيْحَان) 🌿', plantWord: 'رَيْحَانْ' },
  { char: 'خ', name: 'خَاءْ', animal: 'خَرُوفٌ 🐑', animalWord: 'خَرُوفْ', plant: 'خَوْخٌ 🍑', plantWord: 'خَوْخْ' },
  { char: 'د', name: 'دَالْ', animal: 'دُبٌّ 🐻', animalWord: 'دُبّ', plant: 'دُرَّاقٌ 🍑', plantWord: 'دُرَّاقْ' },
  { char: 'ذ', name: 'ذَالْ', animal: 'ذِئْبٌ 🐺', animalWord: 'ذِئْبْ', plant: 'ذُرَةٌ 🌽', plantWord: 'ذُرَة' },
  { char: 'ر', name: 'رَاءْ', animal: 'رِيمٌ (غَزَال) 🦌', animalWord: 'غَزَالْ', plant: 'رُمَّانٌ 🍓', plantWord: 'رُمَّانْ' },
  { char: 'ز', name: 'زَايْ', animal: 'زَرَافَةٌ 🦒', animalWord: 'زَرَافَة', plant: 'زَيْتُونٌ 🫒', plantWord: 'زَيْتُونْ' },
  { char: 'س', name: 'سِينْ', animal: 'سَمَكَةٌ 🐟', animalWord: 'سَمَكَة', plant: 'سَلَقٌ وَسَفَرْجَل 🍏', plantWord: 'سَفَرْجَلْ' },
  { char: 'ش', name: 'شِينْ', animal: 'شِبْلٌ (ابْن الأَسَد) 🦁', animalWord: 'شِبْلْ', plant: 'شَجَرَةٌ 🌳', plantWord: 'شَجَرَة' },
  { char: 'ص', name: 'صَادْ', animal: 'صَقْرٌ 🦅', animalWord: 'صَقْرْ', plant: 'صَنَوْبَرٌ 🌲', plantWord: 'صَنَوْبَرْ' },
  { char: 'ض', name: 'ضَادْ', animal: 'ضِفْدَعٌ 🐸', animalWord: 'ضِفْدَعْ', plant: 'ضِرْوٌ (شَجَرَة بَرِّيَّة) 🌿', plantWord: 'ضِرْو' },
  { char: 'ط', name: 'طَاءْ', animal: 'طَاوُوسٌ 🦚', animalWord: 'طَاوُوسْ', plant: 'طَمَاطِمٌ 🍅', plantWord: 'طَمَاطِمْ' },
  { char: 'ظ', name: 'ظَاءْ', animal: 'ظَبْيٌ 🦌', animalWord: 'ظَبْي', plant: 'ظِلِّ الشَّجَرَةِ 🌿', plantWord: 'ظِلّ' },
  { char: 'ع', name: 'عَيْنْ', animal: 'عُصْفُورٌ 🐦', animalWord: 'عُصْفُورْ', plant: 'عِنَبٌ 🍇', plantWord: 'عِنَبْ' },
  { char: 'غ', name: 'غَيْنْ', animal: 'غَزَالٌ 🦌', animalWord: 'غَزَالْ', plant: 'غَارٌ (وَرَق الغَار) 🍃', plantWord: 'غَارْ' },
  { char: 'ف', name: 'فَاءْ', animal: 'فِيلٌ 🐘', animalWord: 'فِيلْ', plant: 'فَرَاوْلَةٌ 🍓', plantWord: 'فَرَاوْلَة' },
  { char: 'ق', name: 'قَافْ', animal: 'قِرْدٌ 🐒', animalWord: 'قِرْدْ', plant: 'قَمْحٌ 🌾', plantWord: 'قَمْحْ' },
  { char: 'ك', name: 'كَافْ', animal: 'كَلْبٌ 🐶', animalWord: 'كَلْبْ', plant: 'كُمَّثْرَى 🍐', plantWord: 'كُمَّثْرَى' },
  { char: 'ل', name: 'لاَمْ', animal: 'لاَمَا 🦙', animalWord: 'لاَمَا', plant: 'لَيْمُونٌ 🍋', plantWord: 'لَيْمُونْ' },
  { char: 'م', name: 'مِيمْ', animal: 'مُهْرٌ (حِصَانٌ صَغِير) 🐎', animalWord: 'مُهْرْ', plant: 'مَوْزٌ 🍌', plantWord: 'مَوْزْ' },
  { char: 'ن', name: 'نُونْ', animal: 'نَحْلَةٌ 🐝', animalWord: 'نَحْلَة', plant: 'نَخْلَةٌ 🌴', plantWord: 'نَخْلَة' },
  { char: 'هـ', name: 'هَاءْ', animal: 'هُدْهُدٌ 🐦', animalWord: 'هُدْهُدْ', plant: 'هِنْدَبَاءٌ 🌼', plantWord: 'هِنْدَبَاءْ' },
  { char: 'و', name: 'وَاوْ', animal: 'وَرْشَانٌ (حَمَامٌ بَرِّي) 🕊️', animalWord: 'وَرْشَانْ', plant: 'وَرْدَةٌ 🌹', plantWord: 'وَرْدَة' },
  { char: 'ي', name: 'يَاءْ', animal: 'يَعْسُوبٌ 🪰', animalWord: 'يَعْسُوبْ', plant: 'يَاسَمِينٌ 🌸', plantWord: 'يَاسَمِينْ' }
];

// ==========================================================
// 3. DATA: MATHEMATICS (1 to 20)
// ==========================================================
const NUMBERS_1_TO_10 = [
  { num: 1, ar: '١', word: 'وَاحِدْ', items: '🍎', itemWord: 'تفاحة واحدة' },
  { num: 2, ar: '٢', word: 'اِثْنَانْ', items: '🍎🍎', itemWord: 'تفاحتان' },
  { num: 3, ar: '٣', word: 'ثَلاَثَة', items: '🚗🚗🚗', itemWord: '3 سيارات' },
  { num: 4, ar: '٤', word: 'أَرْبَعَة', items: '🎈🎈🎈🎈', itemWord: '4 بالونات' },
  { num: 5, ar: '٥', word: 'خَمْسَة', items: '⭐⭐⭐⭐⭐', itemWord: '5 نجوم' },
  { num: 6, ar: '٦', word: 'سِتَّة', items: '🍓🍓🍓🍓🍓🍓', itemWord: '6 فراولات' },
  { num: 7, ar: '٧', word: 'سَبْعَة', items: '🦋🦋🦋🦋🦋🦋🦋', itemWord: '7 فراشات' },
  { num: 8, ar: '٨', word: 'ثَمَانِيَة', items: '🌸🌸🌸🌸🌸🌸🌸🌸', itemWord: '8 زهرات' },
  { num: 9, ar: '٩', word: 'تِسْعَة', items: '⚽⚽⚽⚽⚽⚽⚽⚽⚽', itemWord: '9 كرات' },
  { num: 10, ar: '١٠', word: 'عَشَرَة', items: '☀️☀️☀️☀️☀️☀️☀️☀️☀️☀️', itemWord: '10 شموس' }
];

const NUMBERS_10_TO_20 = [
  { num: 11, ar: '١١', word: 'أَحَدَ عَشَرْ', items: '🚀' },
  { num: 12, ar: '١٢', word: 'اِثْنَا عَشَرْ', items: '🎨' },
  { num: 13, ar: '١٣', word: 'ثَلاَثَةَ عَشَرْ', items: '🌟' },
  { num: 14, ar: '١٤', word: 'أَرْبَعَةَ عَشَرْ', items: '🍭' },
  { num: 15, ar: '١٥', word: 'خَمْسَةَ عَشَرْ', items: '🍩' },
  { num: 16, ar: '١٦', word: 'سِتَّةَ عَشَرْ', items: '🎪' },
  { num: 17, ar: '١٧', word: 'سَبْعَةَ عَشَرْ', items: '🦁' },
  { num: 18, ar: '١٨', word: 'ثَمَانِيَةَ عَشَرْ', items: '🌈' },
  { num: 19, ar: '١٩', word: 'تِسْعَةَ عَشَرْ', items: '🚲' },
  { num: 20, ar: '٢٠', word: 'عِشْرُونَ', items: '🏆' }
];

// ==========================================================
// 4. DATA: HOLY QURAN (الفاتحة، الكوثر، الإخلاص)
// ==========================================================
const QURAN_DATA = {
  fatiha: {
    title: 'سُورَةُ الفَاتِحَة (الحَمْد)',
    info: 'مَكِّيَّة - 7 آيَاتٍ كَرِيمَة',
    surahNum: 1,
    verses: [
      { num: 1, text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', audioAyah: '001001' },
      { num: 2, text: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', audioAyah: '001002' },
      { num: 3, text: 'الرَّحْمَٰنِ الرَّحِيمِ', audioAyah: '001003' },
      { num: 4, text: 'مَالِكِ يَوْمِ الدِّينِ', audioAyah: '001004' },
      { num: 5, text: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', audioAyah: '001005' },
      { num: 6, text: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', audioAyah: '001006' },
      { num: 7, text: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', audioAyah: '001007' }
    ]
  },
  kawthar: {
    title: 'سُورَةُ الكَوْثَر',
    info: 'مَكِّيَّة - 3 آيَاتٍ كَرِيمَة',
    surahNum: 108,
    verses: [
      { num: 1, text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', audioAyah: '108001' },
      { num: 2, text: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', audioAyah: '108002' },
      { num: 3, text: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', audioAyah: '108003' }
    ]
  },
  ikhlas: {
    title: 'سُورَةُ الإِخْلاَص (قُلْ هُوَ اللَّهُ أَحَد)',
    info: 'مَكِّيَّة - 4 آيَاتٍ كَرِيمَة',
    surahNum: 112,
    verses: [
      { num: 1, text: 'قُلْ هُوَ اللَّهُ أَحَدٌ', audioAyah: '112001' },
      { num: 2, text: 'اللَّهُ الصَّمَدُ', audioAyah: '112002' },
      { num: 3, text: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', audioAyah: '112003' },
      { num: 4, text: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', audioAyah: '112004' }
    ]
  }
};

let currentSurahKey = 'fatiha';
let currentAyahIndex = 0;
let isQuranPlaying = false;
let isAyahRepeat = false;

// ==========================================================
// 5. DATA: ENGLISH ALPHABET & NUMBERS
// ==========================================================
const ENGLISH_ALPHABET = [
  { letter: 'A', word: 'Apple', emoji: '🍎', phonics: 'A is for Apple' },
  { letter: 'B', word: 'Ball', emoji: '⚽', phonics: 'B is for Ball' },
  { letter: 'C', word: 'Cat', emoji: '🐱', phonics: 'C is for Cat' },
  { letter: 'D', word: 'Duck', emoji: '🦆', phonics: 'D is for Duck' },
  { letter: 'E', word: 'Elephant', emoji: '🐘', phonics: 'E is for Elephant' },
  { letter: 'F', word: 'Fish', emoji: '🐟', phonics: 'F is for Fish' },
  { letter: 'G', word: 'Giraffe', emoji: '🦒', phonics: 'G is for Giraffe' },
  { letter: 'H', word: 'Horse', emoji: '🐴', phonics: 'H is for Horse' },
  { letter: 'I', word: 'Ice Cream', emoji: '🍦', phonics: 'I is for Ice Cream' },
  { letter: 'J', word: 'Juice', emoji: '🧃', phonics: 'J is for Juice' },
  { letter: 'K', word: 'Kite', emoji: '🪁', phonics: 'K is for Kite' },
  { letter: 'L', word: 'Lion', emoji: '🦁', phonics: 'L is for Lion' },
  { letter: 'M', word: 'Monkey', emoji: '🐒', phonics: 'M is for Monkey' },
  { letter: 'N', word: 'Nest', emoji: '🪺', phonics: 'N is for Nest' },
  { letter: 'O', word: 'Orange', emoji: '🍊', phonics: 'O is for Orange' },
  { letter: 'P', word: 'Pencil', emoji: '✏️', phonics: 'P is for Pencil' },
  { letter: 'Q', word: 'Queen', emoji: '👑', phonics: 'Q is for Queen' },
  { letter: 'R', word: 'Rainbow', emoji: '🌈', phonics: 'R is for Rainbow' },
  { letter: 'S', word: 'Star', emoji: '⭐', phonics: 'S is for Star' },
  { letter: 'T', word: 'Train', emoji: '🚂', phonics: 'T is for Train' },
  { letter: 'U', word: 'Umbrella', emoji: '☂️', phonics: 'U is for Umbrella' },
  { letter: 'V', word: 'Van', emoji: '🚐', phonics: 'V is for Van' },
  { letter: 'W', word: 'Watch', emoji: '⌚', phonics: 'W is for Watch' },
  { letter: 'X', word: 'Xylophone', emoji: '🎵', phonics: 'X is for Xylophone' },
  { letter: 'Y', word: 'Yo-Yo', emoji: '🪀', phonics: 'Y is for Yo-Yo' },
  { letter: 'Z', word: 'Zebra', emoji: '🦓', phonics: 'Z is for Zebra' }
];

let bubbleScore = 0;
let bubbleSpawnTimer = null;

// ==========================================================
// 6. INITIALIZATION & SOUND SYSTEM
// ==========================================================
window.addEventListener('DOMContentLoaded', () => {
  loadStoredProfile();
  loadTimerSettings();
  createBgSparkles();
  renderArabicLetters();
  renderMathNumbers();
  renderQuranSurah('fatiha');
  renderEnglishCards();
  startMathCountingGame();
  startMathAdditionGame();
  initAutoTimer();
  
  // Setup Mickey speech click
  const btnSpeakGreeting = document.getElementById('btnSpeakGreeting');
  if (btnSpeakGreeting) {
    btnSpeakGreeting.addEventListener('click', () => {
      speakMickeyGreeting();
    });
  }

  const btnMickeyCompanion = document.getElementById('btnMickeyCompanion');
  if (btnMickeyCompanion) {
    btnMickeyCompanion.addEventListener('click', () => {
      openMickeyDialog();
    });
  }

  const introMickey = document.getElementById('introMickey');
  if (introMickey) {
    introMickey.addEventListener('click', () => {
      speakMickeyGreeting();
      playSparkleSound();
    });
  }

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});

// Playful sound synthesis via Web Audio API
function initAudio() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
}

// Audio playback system with real audio assets
function playAudioFile(file) {
  try {
    const a = new Audio('assets/audio/' + file);
    a.play().catch(() => {
      // Fallback to synthesized audio if needed
      if (file === 'pop.wav') synthPop();
      else if (file === 'star.wav') synthSparkle();
    });
  } catch (e) {
    if (file === 'pop.wav') synthPop();
  }
}

function synthPop() {
  initAudio();
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(450 + Math.random() * 200, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

function synthSparkle() {
  initAudio();
  if (!audioCtx) return;
  const notes = [523.25, 659.25, 783.99, 1046.50];
  notes.forEach((freq, idx) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.value = freq;
    const start = audioCtx.currentTime + idx * 0.08;
    gain.gain.setValueAtTime(0.2, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.3);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.35);
  });
}

function playPopSound() {
  playAudioFile('pop.wav');
}

function playSparkleSound() {
  playAudioFile('star.wav');
}

function playCheerSound() {
  playAudioFile('cheer.wav');
  launchConfetti();
}

function playCorrectSound() {
  playAudioFile('correct.wav');
}

function playWrongSound() {
  playAudioFile('wrong.wav');
}

// Web Speech API for Arabic and English Voice
function speakText(text, lang = 'ar-SA') {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1.25; // cheerful friendly tone for kids!
  
  // Try to find native voice
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find(v => v.lang.startsWith(lang.substring(0, 2)));
  if (targetVoice) utterance.voice = targetVoice;
  
  window.speechSynthesis.speak(utterance);
}

function speakMickeyGreeting() {
  playAudioFile('mickey_welcome.mp3');
}

// Background animated star particles
function createBgSparkles() {
  const container = document.getElementById('bgStars');
  if (!container) return;
  const icons = ['⭐', '✨', '🎈', '🌟', '💫', '🎨'];
  for (let i = 0; i < 20; i++) {
    const span = document.createElement('span');
    span.className = 'star-particle';
    span.textContent = icons[Math.floor(Math.random() * icons.length)];
    span.style.left = Math.random() * 100 + '%';
    span.style.top = Math.random() * 100 + '%';
    span.style.fontSize = (14 + Math.random() * 20) + 'px';
    span.style.animationDelay = (Math.random() * 5) + 's';
    span.style.animationDuration = (4 + Math.random() * 5) + 's';
    container.appendChild(span);
  }
}

// ==========================================================
// 7. USER PROFILE & LOGIN
// ==========================================================
function loadStoredProfile() {
  try {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    if (saved) {
      kidProfile = { ...kidProfile, ...JSON.parse(saved) };
    }
  } catch (e) {}

  updateProfileUI();
}

function updateProfileUI() {
  // Intro Inputs
  const inputName = document.getElementById('inputName');
  const inputAge = document.getElementById('inputAge');
  const inputSchool = document.getElementById('inputSchool');
  const inputPassword = document.getElementById('inputPassword');

  if (inputName) inputName.value = kidProfile.name;
  if (inputAge) inputAge.value = kidProfile.age;
  if (inputSchool) inputSchool.value = kidProfile.school;
  if (inputPassword) inputPassword.value = kidProfile.password;

  // Header & Banner Readouts
  const displayKidName = document.getElementById('displayKidName');
  const displayKidSchool = document.getElementById('displayKidSchool');
  const displayKidAge = document.getElementById('displayKidAge');
  const bannerKidName = document.getElementById('bannerKidName');
  const starsCount = document.getElementById('starsCount');
  const statStarsCount = document.getElementById('statStarsCount');

  if (displayKidName) displayKidName.textContent = kidProfile.name;
  if (displayKidSchool) displayKidSchool.textContent = kidProfile.school;
  if (displayKidAge) displayKidAge.textContent = `${kidProfile.age} سنين`;
  if (bannerKidName) bannerKidName.textContent = kidProfile.name;
  if (starsCount) starsCount.textContent = kidProfile.stars;
  if (statStarsCount) statStarsCount.textContent = kidProfile.stars;

  // Parent Edit Fields
  const parentEditName = document.getElementById('parentEditName');
  const parentEditSchool = document.getElementById('parentEditSchool');
  const parentEditAge = document.getElementById('parentEditAge');
  const parentEditPass = document.getElementById('parentEditPass');

  if (parentEditName) parentEditName.value = kidProfile.name;
  if (parentEditSchool) parentEditSchool.value = kidProfile.school;
  if (parentEditAge) parentEditAge.value = kidProfile.age;
  if (parentEditPass) parentEditPass.value = kidProfile.password;
}

function handleKidLogin() {
  const name = document.getElementById('inputName').value.trim() || 'إياد زيد';
  const age = document.getElementById('inputAge').value;
  const school = document.getElementById('inputSchool').value.trim() || 'روضة ومدرسة الأبطال';
  const pass = document.getElementById('inputPassword').value.trim() || '1234';

  kidProfile.name = name;
  kidProfile.age = parseInt(age, 10);
  kidProfile.school = school;
  kidProfile.password = pass;

  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(kidProfile));
  } catch (e) {}

  updateProfileUI();
  playCheerSound();
  speakText(`أهلاً بك يا بطلنا ${kidProfile.name}! ميكي ماوس ينتظرك في الداخل!`, 'ar-SA');
  
  // Transition to Dashboard
  goToDashboard();
}

function saveParentProfileChanges() {
  const name = document.getElementById('parentEditName').value.trim() || 'إياد زيد';
  const school = document.getElementById('parentEditSchool').value.trim() || 'المدرسة';
  const age = parseInt(document.getElementById('parentEditAge').value, 10) || 6;
  const pass = document.getElementById('parentEditPass').value.trim() || '1234';

  kidProfile.name = name;
  kidProfile.school = school;
  kidProfile.age = age;
  kidProfile.password = pass;

  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(kidProfile));
  } catch (e) {}

  updateProfileUI();
  alert('تم حفظ بيانات الحساب بنجاح! ⭐');
}

function addKidStars(amount = 1) {
  kidProfile.stars += amount;
  try {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(kidProfile));
  } catch (e) {}
  updateProfileUI();
  playSparkleSound();
}

// ==========================================================
// 8. SCREEN NAVIGATION
// ==========================================================
function switchScreen(screenId) {
  document.querySelectorAll('.screen').forEach(scr => scr.classList.remove('active'));
  const target = document.getElementById(screenId);
  if (target) {
    target.classList.add('active');
    currentScreen = screenId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Cleanup bubbles if leaving english section
  if (screenId !== 'screen-english' && bubbleSpawnTimer) {
    clearInterval(bubbleSpawnTimer);
    bubbleSpawnTimer = null;
  }
}

function goToDashboard() {
  switchScreen('screen-dashboard');
}

function openSection(sec) {
  playPopSound();
  if (sec === 'math') {
    switchScreen('screen-math');
  } else if (sec === 'arabic') {
    switchScreen('screen-arabic');
  } else if (sec === 'quran') {
    switchScreen('screen-quran');
  } else if (sec === 'english') {
    switchScreen('screen-english');
    startBubbleSpawner();
  }
}

// ==========================================================
// 9. MATHEMATICS LOGIC
// ==========================================================
function renderMathNumbers() {
  const grid1to10 = document.getElementById('gridNumbers1to10');
  const grid10to20 = document.getElementById('gridNumbers10to20');

  if (grid1to10) {
    grid1to10.innerHTML = NUMBERS_1_TO_10.map(item => `
      <div class="number-card" onclick="speakMathNumber(${item.num}, '${item.word}', '${item.itemWord}')">
        <div class="num-big" style="color: ${getRainbowColor(item.num)}">${item.ar} (${item.num})</div>
        <div class="num-word">${item.word}</div>
        <div class="num-items">${item.items}</div>
      </div>
    `).join('');
  }

  if (grid10to20) {
    grid10to20.innerHTML = NUMBERS_10_TO_20.map(item => `
      <div class="number-card" onclick="speakMathNumber(${item.num}, '${item.word}')">
        <div class="num-big" style="color: ${getRainbowColor(item.num)}">${item.ar} (${item.num})</div>
        <div class="num-word">${item.word}</div>
        <div class="num-items">${item.items}</div>
      </div>
    `).join('');
  }
}

function getRainbowColor(idx) {
  const colors = ['#E53935', '#FB8C00', '#FDD835', '#43A047', '#00ACC1', '#1E88E5', '#5E35B1', '#D81B60', '#8E24AA', '#00897B'];
  return colors[idx % colors.length];
}

function speakMathNumber(num, word, itemWord = '') {
  playPopSound();
  playAudioFile(`ar_num_${num}.mp3`);
}

function switchMathTab(tabId) {
  playPopSound();
  document.querySelectorAll('#screen-math .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#screen-math .math-tab').forEach(t => t.classList.remove('active'));
  
  event.target.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}

// Counting Game
let currentCountAnswer = 0;
function startMathCountingGame() {
  const stage = document.getElementById('countingStage');
  const options = document.getElementById('countingOptions');
  const feedback = document.getElementById('countingFeedback');
  if (!stage || !options) return;

  feedback.textContent = '';
  currentCountAnswer = Math.floor(Math.random() * 8) + 2; // 2 to 9
  const emojis = ['⭐', '🍎', '🚗', '🦁', '🎈', '🍓', '🧸'];
  const chosenEmoji = emojis[Math.floor(Math.random() * emojis.length)];

  let html = '';
  for (let i = 0; i < currentCountAnswer; i++) {
    html += `<span>${chosenEmoji}</span>`;
  }
  stage.innerHTML = html;

  // Options
  let opts = [currentCountAnswer];
  while (opts.length < 4) {
    let r = Math.floor(Math.random() * 9) + 1;
    if (!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => Math.random() - 0.5);

  options.innerHTML = opts.map(val => `
    <button class="btn-option-num" onclick="checkCountAnswer(${val})">${val}</button>
  `).join('');
}

function checkCountAnswer(selected) {
  const feedback = document.getElementById('countingFeedback');
  if (selected === currentCountAnswer) {
    feedback.innerHTML = `<span style="color: #2E7D32;">🎉 رَائِـع يَا إِيَادْ! إِجَابَةٌ صَحِيحَة! (+1 ⭐)</span>`;
    playCheerSound();
    playAudioFile('mickey_correct.mp3');
    addKidStars(1);
    setTimeout(startMathCountingGame, 2000);
  } else {
    feedback.innerHTML = `<span style="color: #D32F2F;">حَاوِلْ مَرَّةً أُخْرَى يَا بَطَل! عُدَّ بِهُدُوء 🎈</span>`;
    playPopSound();
    playAudioFile('mickey_try.mp3');
  }
}

// Addition Challenge
let currentAdditionAnswer = 0;
function startMathAdditionGame() {
  const stage = document.getElementById('additionStage');
  const options = document.getElementById('additionOptions');
  const feedback = document.getElementById('additionFeedback');
  if (!stage || !options) return;

  feedback.textContent = '';
  const num1 = Math.floor(Math.random() * 5) + 1;
  const num2 = Math.floor(Math.random() * 5) + 1;
  currentAdditionAnswer = num1 + num2;

  stage.innerHTML = `
    <div style="display: flex; align-items: center; gap: 14px; font-weight: 900; color: #E65100;">
      <span>${'🍎'.repeat(num1)} (${num1})</span>
      <span>➕</span>
      <span>${'🍎'.repeat(num2)} (${num2})</span>
      <span>=</span>
      <span>❓</span>
    </div>
  `;

  let opts = [currentAdditionAnswer];
  while (opts.length < 4) {
    let r = Math.floor(Math.random() * 10) + 1;
    if (!opts.includes(r)) opts.push(r);
  }
  opts.sort(() => Math.random() - 0.5);

  options.innerHTML = opts.map(val => `
    <button class="btn-option-num" onclick="checkAdditionAnswer(${val})">${val}</button>
  `).join('');
}

function checkAdditionAnswer(selected) {
  const feedback = document.getElementById('additionFeedback');
  if (selected === currentAdditionAnswer) {
    feedback.innerHTML = `<span style="color: #2E7D32;">🌟 عَبْقَرِي يَا إِيَادْ! ${selected} هُوَ النَّاتِج! (+2 ⭐)</span>`;
    playCheerSound();
    playAudioFile('mickey_correct.mp3');
    addKidStars(2);
    setTimeout(startMathAdditionGame, 2200);
  } else {
    feedback.innerHTML = `<span style="color: #D32F2F;">ركّز يا ذكي، اجمع التفاحات معاً 🍎</span>`;
    playPopSound();
    playAudioFile('mickey_try.mp3');
  }
}

// ==========================================================
// 10. ARABIC ALPHABET LOGIC
// ==========================================================
function renderArabicLetters() {
  const grid = document.getElementById('arabicLettersGrid');
  if (!grid) return;

  grid.innerHTML = ARABIC_ALPHABET.map((item, index) => {
    let displayEmoji = item.animal.split(' ')[1] || '🐾';
    let displayName = item.animalWord;

    if (currentArabicMode === 'plants') {
      displayEmoji = item.plant.split(' ')[1] || '🌿';
      displayName = item.plantWord;
    }

    return `
      <div class="arabic-letter-card" onclick="openArabicLetterModal(${index})">
        <div class="letter-char">${item.char}</div>
        <div class="letter-emoji">${displayEmoji}</div>
        <div class="letter-word">${displayName}</div>
      </div>
    `;
  }).join('');
}

function filterArabic(mode) {
  playPopSound();
  currentArabicMode = mode;
  document.querySelectorAll('.alphabet-filter .filter-chip').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderArabicLetters();
}

function openArabicLetterModal(index) {
  playSparkleSound();
  currentArabicLetter = ARABIC_ALPHABET[index];
  currentArabicAlt = false;

  const modal = document.getElementById('letterModal');
  const modalLetterChar = document.getElementById('modalLetterChar');
  const modalItemEmoji = document.getElementById('modalItemEmoji');
  const modalItemWord = document.getElementById('modalItemWord');
  const modalItemType = document.getElementById('modalItemType');
  const btnModalAltText = document.getElementById('btnModalAltText');

  modalLetterChar.textContent = currentArabicLetter.char;
  
  // Default animal view
  const animalParts = currentArabicLetter.animal.split(' ');
  modalItemEmoji.textContent = animalParts[1] || '🐾';
  modalItemWord.textContent = currentArabicLetter.animalWord;
  modalItemType.textContent = 'حيوان لطيف';
  btnModalAltText.textContent = `🌱 اعرض النبات: ${currentArabicLetter.plantWord}`;

  modal.classList.add('active');
  pronounceCurrentArabicLetter();
}

function toggleLetterAlt() {
  playPopSound();
  if (!currentArabicLetter) return;
  currentArabicAlt = !currentArabicAlt;

  const modalItemEmoji = document.getElementById('modalItemEmoji');
  const modalItemWord = document.getElementById('modalItemWord');
  const modalItemType = document.getElementById('modalItemType');
  const btnModalAltText = document.getElementById('btnModalAltText');

  if (currentArabicAlt) {
    // Show Plant
    const plantParts = currentArabicLetter.plant.split(' ');
    modalItemEmoji.textContent = plantParts[1] || '🌿';
    modalItemWord.textContent = currentArabicLetter.plantWord;
    modalItemType.textContent = 'نبات أو فاكهة لذيذة';
    btnModalAltText.textContent = `🐾 اعرض الحيوان: ${currentArabicLetter.animalWord}`;
  } else {
    // Show Animal
    const animalParts = currentArabicLetter.animal.split(' ');
    modalItemEmoji.textContent = animalParts[1] || '🐾';
    modalItemWord.textContent = currentArabicLetter.animalWord;
    modalItemType.textContent = 'حيوان لطيف';
    btnModalAltText.textContent = `🌱 اعرض النبات: ${currentArabicLetter.plantWord}`;
  }

  pronounceCurrentArabicLetter();
}

function pronounceCurrentArabicLetter() {
  if (!currentArabicLetter) return;
  const index = ARABIC_ALPHABET.findIndex(item => item.char === currentArabicLetter.char);
  if (index >= 0) {
    playAudioFile(`ar_letter_${index}.mp3`);
  } else {
    speakText(`حرف ${currentArabicLetter.name}`, 'ar-SA');
  }
}

function closeLetterModal(e) {
  const modal = document.getElementById('letterModal');
  if (modal) modal.classList.remove('active');
}

// ==========================================================
// 11. HOLY QURAN LOGIC & AUDIO
// ==========================================================
function renderQuranSurah(surahKey) {
  currentSurahKey = surahKey;
  currentAyahIndex = 0;
  stopQuranAudio();

  const data = QURAN_DATA[surahKey];
  if (!data) return;

  const titleEl = document.getElementById('surahTitleDisplay');
  const infoEl = document.getElementById('surahInfoBadge');
  const container = document.getElementById('versesListContainer');

  if (titleEl) titleEl.textContent = data.title;
  if (infoEl) infoEl.textContent = data.info;

  if (container) {
    container.innerHTML = data.verses.map((ayah, idx) => `
      <div class="ayah-box" id="ayah-${idx}" onclick="playSingleAyah(${idx})">
        <span class="ayah-num-badge">(${ayah.num})</span>
        <div class="ayah-text">${ayah.text}</div>
        <button class="btn-ayah-audio" title="استمع للآية">🔊</button>
      </div>
    `).join('');
  }
}

function switchSurah(surahKey) {
  playPopSound();
  document.querySelectorAll('.surah-tab-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  renderQuranSurah(surahKey);
}

function playSingleAyah(idx) {
  currentAyahIndex = idx;
  playCurrentAyah();
}

function playCurrentAyah() {
  const surah = QURAN_DATA[currentSurahKey];
  if (!surah || !surah.verses[currentAyahIndex]) return;

  const ayah = surah.verses[currentAyahIndex];
  
  // Highlight active ayah in UI
  document.querySelectorAll('.ayah-box').forEach(b => b.classList.remove('active-playing'));
  const activeBox = document.getElementById(`ayah-${currentAyahIndex}`);
  if (activeBox) {
    activeBox.classList.add('active-playing');
    activeBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Audio stream from EveryAyah (Mishary Alafasy high quality recitation)
  const audio = document.getElementById('quranAudioPlayer');
  const audioUrl = `https://everyayah.com/data/Alafasy_128kbps/${ayah.audioAyah}.mp3`;
  
  audio.src = audioUrl;
  audio.play().then(() => {
    isQuranPlaying = true;
    updateQuranPlayButtonUI(true);
  }).catch(() => {
    // Fallback: If network audio fails or is offline, use clear speech synthesis!
    speakText(ayah.text, 'ar-SA');
  });

  audio.onended = () => {
    if (isAyahRepeat) {
      playCurrentAyah();
    } else if (currentAyahIndex < surah.verses.length - 1) {
      currentAyahIndex++;
      playCurrentAyah();
    } else {
      isQuranPlaying = false;
      updateQuranPlayButtonUI(false);
      playCheerSound();
      speakText('صدق الله العظيم. بارك الله فيك يا إياد!', 'ar-SA');
      addKidStars(3);
    }
  };
}

function toggleQuranPlayback() {
  const audio = document.getElementById('quranAudioPlayer');
  if (isQuranPlaying) {
    stopQuranAudio();
  } else {
    // Play full surah audio from local MP3 asset
    const surahFiles = {
      fatiha: 'assets/audio/fatiha.mp3',
      kawthar: 'assets/audio/kawthar.mp3',
      ikhlas: 'assets/audio/ikhlas.mp3'
    };

    const targetSrc = surahFiles[currentSurahKey] || 'assets/audio/fatiha.mp3';
    audio.src = targetSrc;
    audio.play().then(() => {
      isQuranPlaying = true;
      updateQuranPlayButtonUI(true);
      // Highlight all verses softly
      document.querySelectorAll('.ayah-box').forEach(b => b.classList.add('active-playing'));
    }).catch(() => {
      // Fallback: Play ayah by ayah
      currentAyahIndex = 0;
      playCurrentAyah();
    });

    audio.onended = () => {
      isQuranPlaying = false;
      updateQuranPlayButtonUI(false);
      playCheerSound();
      speakText('صدق الله العظيم. بارك الله فيك يا إياد!', 'ar-SA');
      addKidStars(3);
    };
  }
}

function stopQuranAudio() {
  const audio = document.getElementById('quranAudioPlayer');
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  isQuranPlaying = false;
  updateQuranPlayButtonUI(false);
  document.querySelectorAll('.ayah-box').forEach(b => b.classList.remove('active-playing'));
}

function updateQuranPlayButtonUI(playing) {
  const icon = document.getElementById('quranPlayIcon');
  const text = document.getElementById('quranPlayText');
  const wave = document.getElementById('audioWaveAnim');
  if (icon && text) {
    if (playing) {
      icon.textContent = '⏸️';
      text.textContent = 'إيقاف مؤقت للتلاوة';
      if (wave) wave.style.opacity = '1';
    } else {
      icon.textContent = '▶️';
      text.textContent = 'تشغيل السورة كاملة';
      if (wave) wave.style.opacity = '0';
    }
  }
}

function playNextAyah() {
  const surah = QURAN_DATA[currentSurahKey];
  if (currentAyahIndex < surah.verses.length - 1) {
    currentAyahIndex++;
    playCurrentAyah();
  }
}

function playPrevAyah() {
  if (currentAyahIndex > 0) {
    currentAyahIndex--;
    playCurrentAyah();
  }
}

function toggleAyahRepeat() {
  isAyahRepeat = !isAyahRepeat;
  const btn = document.getElementById('btnRepeatAyah');
  if (btn) {
    if (isAyahRepeat) {
      btn.style.background = '#FFD54F';
      btn.textContent = '🔁 التكرار مفعّل';
    } else {
      btn.style.background = '#FFF';
      btn.textContent = '🔁 تكرار';
    }
  }
}

// ==========================================================
// 12. ENGLISH SECTION & BUBBLES GAME
// ==========================================================
function renderEnglishCards() {
  const gridAbc = document.getElementById('englishLettersGrid');
  const grid123 = document.getElementById('englishNumbersGrid');

  if (gridAbc) {
    gridAbc.innerHTML = ENGLISH_ALPHABET.map(item => `
      <div class="arabic-letter-card en-letter-card" onclick="speakEnglishLetter('${item.letter}', '${item.word}', '${item.phonics}')">
        <div class="letter-char en-char">${item.letter}</div>
        <div class="letter-emoji">${item.emoji}</div>
        <div class="letter-word">${item.word}</div>
      </div>
    `).join('');
  }

  if (grid123) {
    let numsHtml = '';
    for (let i = 1; i <= 20; i++) {
      numsHtml += `
        <div class="number-card" onclick="speakEnglishNumber(${i})">
          <div class="num-big en-char">${i}</div>
          <div class="num-word">Number ${i}</div>
        </div>
      `;
    }
    grid123.innerHTML = numsHtml;
  }
}

function speakEnglishLetter(letter, word, phonics) {
  playPopSound();
  const lower = letter.toLowerCase();
  playAudioFile(`en_letter_${lower}.mp3`);
}

function speakEnglishNumber(num) {
  playPopSound();
  playAudioFile(`en_num_${num}.mp3`);
}

function switchEnglishTab(tabId) {
  playPopSound();
  document.querySelectorAll('#screen-english .tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('#screen-english .english-tab').forEach(t => t.classList.remove('active'));

  event.target.classList.add('active');
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
}

// Interactive Physics Bubbles Pop Mini-Game
function startBubbleSpawner() {
  const arena = document.getElementById('bubbleArena');
  if (!arena) return;

  if (bubbleSpawnTimer) clearInterval(bubbleSpawnTimer);
  bubbleSpawnTimer = setInterval(() => {
    spawnOneBubble();
  }, 1200);

  // Spawn initial set
  for (let i = 0; i < 5; i++) {
    spawnOneBubble(true);
  }
}

function spawnOneBubble(initial = false) {
  const arena = document.getElementById('bubbleArena');
  if (!arena) return;

  // Max 14 bubbles at once
  if (arena.children.length > 14) return;

  const bubble = document.createElement('div');
  bubble.className = 'bubble-float';

  const size = 65 + Math.floor(Math.random() * 40);
  bubble.style.width = size + 'px';
  bubble.style.height = size + 'px';

  const left = Math.floor(Math.random() * (arena.clientWidth - size - 20)) + 10;
  bubble.style.left = left + 'px';

  if (initial) {
    bubble.style.top = Math.floor(Math.random() * (arena.clientHeight - size)) + 'px';
  }

  // Random color gradient
  const gradients = [
    'linear-gradient(135deg, rgba(255, 64, 129, 0.8), rgba(224, 64, 251, 0.8))',
    'linear-gradient(135deg, rgba(0, 229, 255, 0.8), rgba(41, 182, 246, 0.8))',
    'linear-gradient(135deg, rgba(118, 255, 3, 0.8), rgba(0, 230, 118, 0.8))',
    'linear-gradient(135deg, rgba(255, 215, 64, 0.8), rgba(255, 145, 0, 0.8))',
    'linear-gradient(135deg, rgba(224, 64, 251, 0.8), rgba(124, 77, 255, 0.8))'
  ];
  bubble.style.background = gradients[Math.floor(Math.random() * gradients.length)];

  // Content: English letter, number, or star
  const contentTypes = ['letter', 'number', 'star'];
  const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
  let label = '⭐';
  let speech = 'Great!';

  if (type === 'letter') {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    label = letters[Math.floor(Math.random() * letters.length)];
    speech = label;
  } else if (type === 'number') {
    const n = Math.floor(Math.random() * 20) + 1;
    label = n.toString();
    speech = n.toString();
  }

  bubble.innerHTML = `
    <span class="bubble-sparkle-shine"></span>
    <span class="bubble-content-char">${label}</span>
  `;

  // On Tap / Click: POP!
  bubble.addEventListener('pointerdown', (e) => {
    e.stopPropagation();
    popBubble(bubble, speech, type, label);
  });

  arena.appendChild(bubble);

  // Auto remove after animation finishes
  setTimeout(() => {
    if (bubble.parentNode === arena) arena.removeChild(bubble);
  }, 9000);
}

function popBubble(bubbleEl, speech, type, val) {
  playPopSound();
  bubbleScore += 10;
  const scoreEl = document.getElementById('bubbleScore');
  if (scoreEl) scoreEl.textContent = bubbleScore;

  if (type === 'letter') {
    playAudioFile(`en_letter_${val.toLowerCase()}.mp3`);
  } else if (type === 'number') {
    playAudioFile(`en_num_${val}.mp3`);
  } else {
    playSparkleSound();
  }

  // Trigger explode animation
  bubbleEl.style.animation = 'popExplode 0.25s forwards';
  setTimeout(() => {
    if (bubbleEl.parentNode) bubbleEl.parentNode.removeChild(bubbleEl);
  }, 250);

  // Milestone bonus
  if (bubbleScore % 100 === 0) {
    playCheerSound();
    addKidStars(2);
  }
}

function spawnBonusBubbles() {
  playSparkleSound();
  for (let i = 0; i < 8; i++) {
    setTimeout(spawnOneBubble, i * 150);
  }
}

// ==========================================================
// 13. PARENTAL CONTROLS & AUTO-SHUTDOWN TIMER
// ==========================================================
let gateNum1 = 7;
let gateNum2 = 5;

document.getElementById('btnOpenParentalControl').addEventListener('click', () => {
  openParentalGate();
});

function openParentalGate() {
  switchScreen('screen-parental');
  const gateBox = document.getElementById('parentalGateBox');
  const parentDash = document.getElementById('parentalDashboard');

  gateNum1 = Math.floor(Math.random() * 9) + 3;
  gateNum2 = Math.floor(Math.random() * 9) + 2;

  document.getElementById('gateNum1').textContent = gateNum1;
  document.getElementById('gateNum2').textContent = gateNum2;
  document.getElementById('gateAnswerInput').value = '';

  gateBox.style.display = 'block';
  parentDash.style.display = 'none';
}

function verifyParentalGate() {
  const ans = parseInt(document.getElementById('gateAnswerInput').value, 10);
  const correct = gateNum1 + gateNum2;
  const pass = document.getElementById('gateAnswerInput').value.trim();

  if (ans === correct || pass === kidProfile.parentPin || pass === '4321') {
    playSparkleSound();
    document.getElementById('parentalGateBox').style.display = 'none';
    document.getElementById('parentalDashboard').style.display = 'block';
  } else {
    alert('إجابة غير صحيحة، يرجى المحاولة مرة أخرى.');
  }
}

function loadTimerSettings() {
  try {
    const saved = localStorage.getItem(TIMER_STORAGE_KEY);
    if (saved) {
      timerConfig = { ...timerConfig, ...JSON.parse(saved) };
    }
  } catch (e) {}

  updateTimerUI();
}

function initAutoTimer() {
  if (timerInterval) clearInterval(timerInterval);

  timerInterval = setInterval(() => {
    if (timerConfig.enabled && timerConfig.limitMinutes > 0 && !timerConfig.isLocked) {
      if (timerConfig.remainingSeconds > 0) {
        timerConfig.remainingSeconds--;
        updateTimerCountdownDisplays();
      } else {
        // TIME EXPIRED! AUTO LOCK!
        triggerSleepScreenLock();
      }
    }
  }, 1000);
}

function updateTimerCountdownDisplays() {
  const m = Math.floor(timerConfig.remainingSeconds / 60);
  const s = timerConfig.remainingSeconds % 60;
  const formatted = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;

  const topBadge = document.getElementById('timerCountdown');
  const liveClock = document.getElementById('parentLiveCountdown');

  if (topBadge) topBadge.textContent = formatted;
  if (liveClock) liveClock.textContent = `${formatted} دقيقة`;
}

function setTimeLimit(mins) {
  playPopSound();
  timerConfig.limitMinutes = mins;
  timerConfig.remainingSeconds = mins * 60;
  
  document.querySelectorAll('.time-chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');

  saveTimerSettings();
  updateTimerUI();
}

function toggleAutoTimerSwitch() {
  const chk = document.getElementById('timerToggleSwitch');
  timerConfig.enabled = chk.checked;
  saveTimerSettings();
  updateTimerUI();
}

function resetCurrentSessionTimer() {
  timerConfig.remainingSeconds = timerConfig.limitMinutes * 60;
  saveTimerSettings();
  updateTimerUI();
  alert('تمت إعادة ضبط الوقت بنجاح! ⏱️');
}

function saveTimerSettings() {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, JSON.stringify(timerConfig));
  } catch (e) {}
}

function updateTimerUI() {
  const statusLabel = document.getElementById('timerStatusLabel');
  const toggle = document.getElementById('timerToggleSwitch');

  if (toggle) toggle.checked = timerConfig.enabled;
  if (statusLabel) {
    statusLabel.textContent = timerConfig.enabled ? 'المؤقت مفعّل حالياً 🟢' : 'المؤقت معطّل ⚪';
  }

  updateTimerCountdownDisplays();
}

function triggerSleepScreenLock() {
  timerConfig.isLocked = true;
  stopQuranAudio();
  const overlay = document.getElementById('sleepLockOverlay');
  if (overlay) overlay.style.display = 'flex';

  speakText('انتهى وقت اللعب يا بطل إياد! حان وقت النوم والراحة، نراك غداً في مغامرة جديدة!', 'ar-SA');
}

function unlockSleepScreen() {
  const code = document.getElementById('sleepUnlockCode').value.trim();
  const err = document.getElementById('unlockErrorMsg');

  if (code === kidProfile.parentPin || code === '4321' || code === kidProfile.password) {
    timerConfig.isLocked = false;
    timerConfig.remainingSeconds = timerConfig.limitMinutes * 60; // reset
    document.getElementById('sleepLockOverlay').style.display = 'none';
    document.getElementById('sleepUnlockCode').value = '';
    err.textContent = '';
    playSparkleSound();
    goToDashboard();
  } else {
    err.textContent = '❌ رمز غير صحيح! الرمز الافتراضي: 4321';
  }
}

// ==========================================================
// 14. MICKEY MOUSE INTERACTIVE COMPANION
// ==========================================================
const MICKEY_ENCOURAGEMENTS = [
  "أنت بطل ذكي جداً يا إياد! أنا وميكي فخوران بك! ⭐",
  "ما شاء الله عليك يا إياد، خطك وصوتك رائعان! 🎨",
  "استمر في جمع النجوم، ستكون المركز الأول في مدرستك يا بطل! 🚀",
  "هل تعلم أن الابتسامة تجعلك أجمل ولد في العالم يا إياد؟ 😄"
];

const MICKEY_JOKES = [
  "مرة واحد نملة لبست كعب عالي.. ليه؟ علشان توصل للمربى! هههههه 🐜",
  "مرة سمكة صغيرة قالت لأمها: ليه إحنا بنعيش في المية؟ قالت لها: علشان لو طلعنا برة هناكل شيبسي ونتخن! هههه 🐟",
  "مرة فيل وفأر بيلعبوا استغماية.. الفأر استخبى ورا ودن الفيل! هههههه 🐘"
];

function openMickeyDialog() {
  playPopSound();
  const modal = document.getElementById('mickeyDialogModal');
  if (modal) modal.classList.add('active');
  mickeyTellEncouragement();
}

function closeMickeyDialog() {
  const modal = document.getElementById('mickeyDialogModal');
  if (modal) modal.classList.remove('active');
}

function mickeyTellEncouragement() {
  const speech = document.getElementById('mickeyDynamicSpeech');
  const quote = MICKEY_ENCOURAGEMENTS[Math.floor(Math.random() * MICKEY_ENCOURAGEMENTS.length)];
  speech.textContent = `"${quote}"`;
  speakText(quote, 'ar-SA');
}

function mickeyTellJoke() {
  const speech = document.getElementById('mickeyDynamicSpeech');
  const joke = MICKEY_JOKES[Math.floor(Math.random() * MICKEY_JOKES.length)];
  speech.textContent = `"${joke}"`;
  speakText(joke, 'ar-SA');
}

function mickeyClap() {
  playCheerSound();
  const speech = document.getElementById('mickeyDynamicSpeech');
  speech.textContent = `"ألف مبروك يا بطل إياد زيد! ميكي يصفق لك بحرارة! 👏👏👏"`;
  speakText('ألف مبروك يا بطل إياد زيد! ميكي يصفق لك بحرارة!', 'ar-SA');
  addKidStars(2);
}

// ==========================================================
// 15. CONFETTI CELEBRATIONS CANNON
// ==========================================================
function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = [];
  const colors = ['#FF1744', '#FF9100', '#FFEA00', '#00E676', '#00B0FF', '#D500F9', '#FF4081'];

  for (let i = 0; i < 90; i++) {
    pieces.push({
      x: canvas.width / 2,
      y: canvas.height / 2,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 16,
      size: 8 + Math.random() * 8,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 10
    });
  }

  let frames = 0;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.vRot;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    });

    frames++;
    if (frames < 90) {
      requestAnimationFrame(update);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  update();
}

