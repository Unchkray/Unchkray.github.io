// ==========================================
// BAGIAN 1: DATA & SETUP
// ==========================================

// --- Global State ---
let currentApp = null;
let tetrisGame = null;
let typingInterval = null;
let currentPhotoIndex = 0;
let isPlaying = false; 
let lastCapturedPhoto = null;
let isGalleryOpen = false;
let cameraPhotoTimeout = null;

// --- Data Foto (Pastikan file ada di folder images) ---
const photos = [
    { text: 'Kecantikan yang Gak Pernah Gagal 💕', image: './images/photo1.jpg' },
    { text: 'Imutnya Bikin Lupa Dunia 🧸', image: './images/photo2.jpg' },
    { text: 'Elegan Tanpa Usaha ✨', image: './images/photo3.jpg' },
    { text: 'Senyum yang Jadi Favorit Aku ❤️', image: './images/photo4.jpg' },
    { text: 'Pesona yang Susah Dilupain 🌹', image: './images/photo5.jpg' },
    { text: 'Cantik dari Sudut Mana Pun 📸', image: './images/photo6.jpg' },
    { text: 'Momen Manis Tanpa Kata 🍯', image: './images/photo7.jpg' },
    { text: 'Yang Aku Sayang Selamanya 💖', image: './images/photo8.jpg' }
];

// --- Data Playlist (Pastikan file ada di folder audio) ---
const playlists = {
    'good-vibes': {
        title: 'Good Vibes',
        desc: 'Playlist • Rocki Gaming',
        color: '#7d3c98',
        icon: 'fas fa-smile-beam',
        songs: [
            { title: "Happy Birthday Song", artist: "CoComelon", src: "./audio/happy_birthday.mp3" },
            { title: "Respect", artist: "Songs for School", src: "./audio/respect.mp3" },
            { title: "Selamat Ulang Tahun", artist: "Jamrud", src: "./audio/jamrud.mp3" }
        ]
    },
    'blue': {
        title: 'Blue',
        desc: 'Playlist • Rocki Gaming',
        color: '#2980b9',
        icon: 'fas fa-cloud-rain',
        songs: [
            { title: "Blue Skies", artist: "Birdy", src: "./audio/blue_skies.mp3" },
            { title: "Ocean Eyes", artist: "Billie Eilish", src: "./audio/ocean_eyes.mp3" }
        ]
    },
    'night-chill': {
        title: 'Night Chill',
        desc: 'Playlist • Rocki Gaming',
        color: '#2c3e50',
        icon: 'fas fa-moon',
        songs: [
            { title: "Night Changes", artist: "One Direction", src: "./audio/night_changes.mp3" },
            { title: "Talking to the Moon", artist: "Bruno Mars", src: "./audio/talking_to_the_moon.mp3" }
        ]
    }
};

let currentPlaylist = [];
let currentSongIndex = 0;

// --- Boot & Clock ---
document.addEventListener('DOMContentLoaded', () => {
    // Animasi Loading
    setTimeout(() => { document.getElementById('progress-fill').style.width = '100%'; }, 500);
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    }, 2500);
    
    updateClock();
    setInterval(updateClock, 60000);
    renderLibrary();
});

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2,'0');
    const m = String(now.getMinutes()).padStart(2,'0');
    document.getElementById('clock').textContent = `${h}:${m}`;
}

// --- Navigation System ---
window.openApp = function(appName) {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById(`${appName}-app`).classList.add('active');
    currentApp = appName;
    
    if (appName === 'tetris') { initTetris(); resetTetris(); }
    if (appName === 'camera') initCamera();
};

window.goHome = function() {
    // Reset semua layar
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    // Aktifkan home
    document.getElementById('home-screen').classList.add('active');
    
    // Reset state aplikasi
    if (currentApp === 'whatsapp') closeChatRoom();
    if (currentApp === 'tetris') pauseTetris();
    if (currentApp === 'camera') resetCameraState();
    
    currentApp = null;
};

// ==========================================
// BAGIAN 2: APPS LOGIC
// ==========================================

// --- WhatsApp ---
window.openChatRoom = function() {
    document.getElementById('wa-list-view').classList.remove('active');
    document.getElementById('wa-chat-view').classList.add('active');
    
    const container = document.querySelector('.wa-messages-container');
    container.innerHTML = ''; 
    
    const text = "Hi Mika,\n\nHappy Birthday yang ke-26! 🎉\n\nSemoga semua impianmu tercapai, makin cantik, makin pintar, dan bahagia selalu. Terima kasih sudah jadi bagian terindah di hidupku. I love you! ❤️";
    
    // Simple bubble chat
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble msg-in';
    bubble.style.marginTop = '20px';
    bubble.innerText = text;
    container.appendChild(bubble);
};

window.closeChatRoom = function() {
    document.getElementById('wa-chat-view').classList.remove('active');
    document.getElementById('wa-list-view').classList.add('active');
};

// --- Camera ---
function initCamera() { resetCameraState(); }

function resetCameraState() {
    currentPhotoIndex = 0;
    lastCapturedPhoto = null;
    isGalleryOpen = false;
    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    
    const display = document.getElementById('camera-main-display');
    display.innerHTML = '<div class="initial-text">Tap Shutter to Capture</div>';
    document.getElementById('gallery-thumb').style.opacity = '0';
    
    document.getElementById('shutter-trigger').classList.remove('disabled');
    closeGalleryOverlay();
}

window.takePhoto = function() {
    if(isGalleryOpen) return;
    if(currentPhotoIndex >= photos.length) {
        document.getElementById('camera-main-display').innerHTML = '<div class="initial-text">All Captured! Check Gallery 👈</div>';
        return;
    }

    // Flash
    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 100);

    // Render Foto
    const data = photos[currentPhotoIndex];
    lastCapturedPhoto = data;
    const display = document.getElementById('camera-main-display');
    
    display.innerHTML = `<img src="${data.image}" style="width:100%;height:100%;object-fit:cover;"><div class="photo-caption-overlay">${data.text}</div>`;
    
    // Update Thumb
    document.getElementById('gallery-thumb').src = data.image;
    document.getElementById('gallery-thumb').style.opacity = '1';
    
    // Masukkan ke Gallery Grid
    const grid = document.getElementById('gallery-grid-content');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${data.image}">`;
    grid.appendChild(item);

    // Reset screen after 1.2s
    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    cameraPhotoTimeout = setTimeout(() => { display.innerHTML = ''; }, 1200);

    currentPhotoIndex++;
};

window.openGalleryOverlay = function() {
    if(lastCapturedPhoto) {
        isGalleryOpen = true;
        document.getElementById('shutter-trigger').classList.add('disabled');
        document.getElementById('gallery-full-img').src = lastCapturedPhoto.image;
        document.getElementById('gallery-overlay').classList.add('active');
    }
};

window.closeGalleryOverlay = function() {
    isGalleryOpen = false;
    document.getElementById('shutter-trigger').classList.remove('disabled');
    document.getElementById('gallery-overlay').classList.remove('active');
};

window.openGalleryView = function() { openGalleryOverlay(); };
window.closeGalleryView = function() { closeGalleryOverlay(); };

// --- Spotify ---
function renderLibrary() {
    const list = document.getElementById('spotify-playlist-list');
    list.innerHTML = '';
    Object.keys(playlists).forEach(key => {
        const pl = playlists[key];
        list.innerHTML += `<div class="playlist-item" onclick="openPlaylist('${key}')">
            <div class="playlist-thumb" style="background:${pl.color}"><i class="${pl.icon}" style="color:white"></i></div>
            <div class="playlist-info"><h4>${pl.title}</h4><p>${pl.desc}</p></div>
        </div>`;
    });
}

window.openPlaylist = function(key) {
    const pl = playlists[key];
    currentPlaylist = pl.songs;
    
    document.getElementById('pl-title').textContent = pl.title;
    document.getElementById('pl-cover-art').style.background = pl.color;
    document.getElementById('pl-cover-art').innerHTML = `<i class="${pl.icon}"></i>`;
    
    const songList = document.getElementById('pl-song-list');
    songList.innerHTML = '';
    pl.songs.forEach((song, idx) => {
        songList.innerHTML += `<div class="song-row" onclick="playSong(${idx})">
            <div class="song-left"><div class="s-title">${song.title}</div><div class="s-artist">${song.artist}</div></div>
        </div>`;
    });

    document.getElementById('spotify-library-view').classList.remove('active');
    document.getElementById('spotify-playlist-view').classList.add('active');
};

window.closePlaylist = function() {
    document.getElementById('spotify-playlist-view').classList.remove('active');
    document.getElementById('spotify-library-view').classList.add('active');
};

window.playSong = function(index) {
    const song = currentPlaylist[index];
    const audio = document.getElementById('audio-player');
    audio.src = song.src;
    audio.play().catch(() => alert("Gagal memutar lagu. Cek file audio!"));
    
    document.getElementById('np-title-mini').textContent = song.title;
    document.getElementById('np-play-btn-mini').className = 'fas fa-pause';
    isPlaying = true;
};

window.togglePlay = function() {
    const audio = document.getElementById('audio-player');
    if(isPlaying) { 
        audio.pause(); 
        isPlaying = false; 
        document.getElementById('np-play-btn-mini').className = 'fas fa-play';
    } else if(audio.src) { 
        audio.play(); 
        isPlaying = true; 
        document.getElementById('np-play-btn-mini').className = 'fas fa-pause';
    }
};

// ==========================================
// BAGIAN 3: TETRIS & CONTROLS
// ==========================================

function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    
    // Paksa ukuran agar tidak 0
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 600;
    
    canvas.width = width;
    canvas.height = height;
    
    const rows = 20;
    const blockSize = Math.floor(height / rows);
    const cols = Math.floor(width / blockSize);
    
    if(!tetrisGame) {
        tetrisGame = { ctx: canvas.getContext('2d'), cols, rows, board: [], blockSize, score: 0, level: 1, running: false, current: null, width, height };
    } else {
        tetrisGame.ctx = canvas.getContext('2d');
        tetrisGame.blockSize = blockSize;
    }
}

function resetTetris() {
    if(!tetrisGame) initTetris();
    
    // Reset Board
    for(let r=0; r<tetrisGame.rows; r++) {
        tetrisGame.board[r] = [];
        for(let c=0; c<tetrisGame.cols; c++) tetrisGame.board[r][c] = 0;
    }
    
    tetrisGame.score = 0;
    document.getElementById('score').textContent = '0';
    tetrisGame.running = true;
    tetrisGame.current = newPiece();
    loopTetris();
}

function pauseTetris() { if(tetrisGame) tetrisGame.running = false; }

const PIECES = [
    [[[1,1,0],[0,1,1]], "#FF3B30"], 
    [[[0,1,1],[1,1,0]], "#34C759"], 
    [[[0,1,0],[1,1,1]], "#AF52DE"], 
    [[[1,1],[1,1]], "#FFD60A"], 
    [[[0,0,1],[1,1,1]], "#FF9500"], 
    [[[1,1,1,1]], "#30B0C7"], 
    [[[1,0,0],[1,1,1]], "#007AFF"]
];

function newPiece() {
    const r = Math.floor(Math.random() * PIECES.length);
    const startX = Math.floor(tetrisGame.cols / 2) - 1;
    return { shape: PIECES[r][0], color: PIECES[r][1], x: startX, y: -2 };
}

let lastTime = 0;
function loopTetris(time = 0) {
    if(!tetrisGame.running) return;
    const dt = time - lastTime;
    
    // Speed logic (Makin level naik makin cepat)
    const speed = Math.max(50, 400 - (tetrisGame.level * 30)); 
    
    if(dt > speed) {
        moveDown();
        lastTime = time;
    }
    
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris() {
    const { ctx, width, height, blockSize, cols, rows, board, current } = tetrisGame;
    
    // Clear
    ctx.fillStyle = "#111"; ctx.fillRect(0, 0, width, height);
    
    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
    for(let r=0; r<=rows; r++) { ctx.beginPath(); ctx.moveTo(0, r*blockSize); ctx.lineTo(width, r*blockSize); ctx.stroke(); }
    for(let c=0; c<=cols; c++) { ctx.beginPath(); ctx.moveTo(c*blockSize, 0); ctx.lineTo(c*blockSize, height); ctx.stroke(); }

    // Board
    for(let r=0; r<rows; r++) {
        for(let c=0; c<cols; c++) {
            if(board[r][c]) drawBlock(c, r, board[r][c]);
        }
    }
    
    // Active Piece
    if(current) {
        for(let r=0; r<current.shape.length; r++) {
            for(let c=0; c<current.shape[r].length; c++) {
                if(current.shape[r][c]) drawBlock(current.x + c, current.y + r, current.color);
            }
        }
    }
}

function drawBlock(x, y, color) {
    const s = tetrisGame.blockSize;
    tetrisGame.ctx.fillStyle = color;
    tetrisGame.ctx.fillRect(x*s, y*s, s, s);
    tetrisGame.ctx.strokeRect(x*s, y*s, s, s);
}

function moveDown() {
    if(!checkCollision(0, 1)) {
        tetrisGame.current.y++;
    } else {
        lockPiece();
        tetrisGame.current = newPiece();
        // Game Over Check
        if(checkCollision(0, 0)) {
            tetrisGame.running = false;
            document.getElementById('final-score').textContent = tetrisGame.score;
            window.openModal('game-over-modal');
        }
    }
}

function checkCollision(ox, oy, shape) {
    const p = tetrisGame.current;
    const mat = shape || p.shape;
    for(let r=0; r<mat.length; r++) {
        for(let c=0; c<mat[r].length; c++) {
            if(mat[r][c]) {
                let newX = p.x + c + ox;
                let newY = p.y + r + oy;
                if(newX < 0 || newX >= tetrisGame.cols || newY >= tetrisGame.rows) return true;
                if(newY >= 0 && tetrisGame.board[newY][newX]) return true;
            }
        }
    }
    return false;
}

function lockPiece() {
    const p = tetrisGame.current;
    for(let r=0; r<p.shape.length; r++) {
        for(let c=0; c<p.shape[r].length; c++) {
            if(p.shape[r][c]) {
                if(p.y + r < 0) { // Menembus atas -> Game Over
                    tetrisGame.running = false;
                    window.openModal('game-over-modal');
                    return;
                }
                tetrisGame.board[p.y + r][p.x + c] = p.color;
            }
        }
    }
    // Clear Lines
    for(let r=0; r<tetrisGame.rows; r++) {
        if(tetrisGame.board[r].every(val => val !== 0)) {
            tetrisGame.board.splice(r, 1);
            tetrisGame.board.unshift(new Array(tetrisGame.cols).fill(0));
            tetrisGame.score += 100;
            document.getElementById('score').textContent = tetrisGame.score;
        }
    }
}

// Controls
document.getElementById('left-btn').onclick = () => { if(tetrisGame.running && !checkCollision(-1, 0)) tetrisGame.current.x--; drawTetris(); };
document.getElementById('right-btn').onclick = () => { if(tetrisGame.running && !checkCollision(1, 0)) tetrisGame.current.x++; drawTetris(); };
document.getElementById('down-btn').onclick = () => { if(tetrisGame.running) { moveDown(); drawTetris(); } };
document.getElementById('rotate-btn').onclick = () => {
    if(!tetrisGame.running) return;
    const rotated = tetrisGame.current.shape[0].map((_, i) => tetrisGame.current.shape.map(row => row[i]).reverse());
    if(!checkCollision(0, 0, rotated)) {
        tetrisGame.current.shape = rotated;
        drawTetris();
    }
};

// Modals Helpers
window.openModal = (id) => document.getElementById(id).classList.add('active');
window.closeModal = (id) => document.getElementById(id).classList.remove('active');
