// --- Global State ---
let currentApp = null;
let tetrisGame = null;
let typingInterval = null;
let currentPhotoIndex = 0;
let isPlaying = false;
let lastCapturedPhoto = null;
let isGalleryOpen = false;
let cameraPhotoTimeout = null;

// --- Data Foto ---
const photos = [
    { text: 'Cantik yang Gak Pernah Gagal 💕', image: './images/photo1.jpg' },
    { text: 'Imutnya Bikin Lupa Dunia 🧸', image: './images/photo2.jpg' },
    { text: 'Elegan ✨', image: './images/photo3.jpg' },
    { text: 'Senyum yang Jadi Favorit Aku ❤️', image: './images/photo4.jpg' },
    { text: 'Pesona yang Susah Dilupain 🌹', image: './images/photo5.jpg' },
    { text: 'Cantik dari Sudut Mana Pun 📸', image: './images/photo6.jpg' },
    { text: 'Manis Bikin Diabetes 🍯', image: './images/photo7.jpg' },
    { text: 'Yang Aku Sayang Selamanya 💖', image: './images/photo8.jpg' }
];

// --- Data Playlist ---
const playlists = {
    'good-vibes': { title: 'Good Vibes', desc: 'Playlist • Rocki Gaming', color: '#7d3c98', icon: 'fas fa-smile-beam', songs: [{ title: "Happy Birthday Song", artist: "CoComelon", src: "./audio/happy_birthday.mp3" }] },
    'blue': { title: 'Blue', desc: 'Playlist • Rocki Gaming', color: '#2980b9', icon: 'fas fa-cloud-rain', songs: [{ title: "Blue Skies", artist: "Birdy", src: "./audio/blue_skies.mp3" }] },
    'night-chill': { title: 'Night Chill', desc: 'Playlist • Rocki Gaming', color: '#2c3e50', icon: 'fas fa-moon', songs: [{ title: "Night Changes", artist: "One Direction", src: "./audio/night_changes.mp3" }] }
};
let currentPlaylist = [];

// --- SYSTEM BOOT ---
document.addEventListener('DOMContentLoaded', () => {
    // Animasi Loading
    setTimeout(() => { document.getElementById('progress-fill').style.width = '100%'; }, 500);
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    }, 2000);
    
    updateClock();
    setInterval(updateClock, 60000);
    renderLibrary();
});

function updateClock() {
    const now = new Date();
    document.getElementById('clock').textContent = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
}

// --- NAVIGATION ---
window.openApp = function(appName) {
    document.getElementById('home-screen').classList.remove('active');
    document.getElementById(appName + '-app').classList.add('active');
    currentApp = appName;
    if (appName === 'tetris') { initTetris(); resetTetris(); }
    if (appName === 'camera') resetCameraState();
};

window.goHome = function() {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('home-screen').classList.add('active');
    
    // Reset specific apps
    if(currentApp === 'camera') resetCameraState();
    if(currentApp === 'tetris') tetrisGame.running = false;
    
    currentApp = null;
};

// --- CAMERA LOGIC ---
window.takePhoto = function() {
    if(isGalleryOpen) return;
    if(currentPhotoIndex >= photos.length) return;

    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => flash.style.opacity = '0', 100);

    const data = photos[currentPhotoIndex];
    lastCapturedPhoto = data;
    
    // Show Preview
    const display = document.getElementById('camera-main-display');
    display.innerHTML = `<img src="${data.image}" style="width:100%;height:100%;object-fit:cover;"><div class="photo-caption-overlay">${data.text}</div>`;
    
    // Update Thumb
    document.getElementById('gallery-thumb').src = data.image;
    document.getElementById('gallery-thumb').style.opacity = '1';
    
    // Add to Gallery Grid
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${data.image}">`;
    document.getElementById('gallery-grid-content').appendChild(item);

    // Reset Preview after 1.5s
    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    cameraPhotoTimeout = setTimeout(() => { display.innerHTML = ''; }, 1500);

    currentPhotoIndex++;
};

window.openGalleryOverlay = function() {
    if(lastCapturedPhoto) {
        isGalleryOpen = true;
        document.getElementById('gallery-full-img').src = lastCapturedPhoto.image;
        document.getElementById('gallery-overlay').classList.add('active');
    }
};

window.closeGalleryOverlay = function() {
    isGalleryOpen = false;
    document.getElementById('gallery-overlay').classList.remove('active');
};

function resetCameraState() {
    const display = document.getElementById('camera-main-display');
    display.innerHTML = '<div class="initial-text">Tap Shutter to Capture</div>';
    isGalleryOpen = false;
}

// --- WHATSAPP ---
window.openChatRoom = function() {
    document.getElementById('wa-list-view').classList.remove('active');
    document.getElementById('wa-chat-view').classList.add('active');
    // Simple typewriter logic
    const container = document.querySelector('.wa-messages-container');
    if(container.children.length === 0) {
        container.innerHTML = '<div class="msg-bubble msg-in" style="margin-top:20px">Hi Mika! Happy Birthday ❤️</div>';
    }
};

window.closeChatRoom = function() {
    document.getElementById('wa-chat-view').classList.remove('active');
    document.getElementById('wa-list-view').classList.add('active');
};

// --- SPOTIFY ---
function renderLibrary() {
    const list = document.getElementById('spotify-playlist-list');
    list.innerHTML = '';
    Object.keys(playlists).forEach(key => {
        list.innerHTML += `<div class="playlist-item" onclick="openPlaylist('${key}')">
            <div class="playlist-thumb" style="background:${playlists[key].color}"><i class="${playlists[key].icon}" style="color:white"></i></div>
            <div class="playlist-info"><h4>${playlists[key].title}</h4><p>${playlists[key].desc}</p></div>
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
    audio.play().catch(e => alert("File lagu tidak ditemukan di folder ./audio/"));
    document.getElementById('np-title-mini').textContent = song.title;
    document.getElementById('np-play-btn-mini').className = 'fas fa-pause';
    isPlaying = true;
};

window.togglePlay = function() {
    const audio = document.getElementById('audio-player');
    if(isPlaying) { audio.pause(); document.getElementById('np-play-btn-mini').className = 'fas fa-play'; isPlaying = false; }
    else if(audio.src) { audio.play(); document.getElementById('np-play-btn-mini').className = 'fas fa-pause'; isPlaying = true; }
};

// --- TETRIS ---
function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    canvas.width = container.clientWidth || 300;
    canvas.height = container.clientHeight || 600;
    if(!tetrisGame) {
        tetrisGame = { ctx: canvas.getContext('2d'), cols: 10, rows: 20, board: [], blockSize: canvas.height/20, score: 0, running: false, current: null };
    }
}

function resetTetris() {
    for(let r=0;r<20;r++){ tetrisGame.board[r]=[]; for(let c=0;c<10;c++) tetrisGame.board[r][c]=0; }
    tetrisGame.score = 0; 
    document.getElementById('score').textContent = '0';
    tetrisGame.running = true;
    tetrisGame.current = newPiece();
    loopTetris();
}

const PIECES=[[[[1,1,0],[0,1,1]],"#FF3B30"],[[[0,1,1],[1,1,0]],"#34C759"],[[[0,1,0],[1,1,1]],"#AF52DE"],[[[1,1],[1,1]],"#FFD60A"],[[[0,0,1],[1,1,1]],"#FF9500"],[[[1,1,1,1]],"#30B0C7"],[[[1,0,0],[1,1,1]],"#007AFF"]];
function newPiece(){ const r=Math.floor(Math.random()*PIECES.length); return { shape:PIECES[r][0], color:PIECES[r][1], x:3, y:-2 }; }

let lastTime = 0;
function loopTetris(time = 0) {
    if(!tetrisGame.running) return;
    const dt = time - lastTime;
    if(dt > 1000) { lastTime = time; /* Skip large delta */ }
    
    // Speed Logic
    if(time - lastTime > 300) { // 300ms speed
        moveDown();
        lastTime = time;
    }
    
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris() {
    const ctx = tetrisGame.ctx;
    ctx.fillStyle = "#111"; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    
    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.1)"; ctx.lineWidth = 1;
    for(let r=0; r<=20; r++) { ctx.beginPath(); ctx.moveTo(0, r*tetrisGame.blockSize); ctx.lineTo(ctx.canvas.width, r*tetrisGame.blockSize); ctx.stroke(); }
    for(let c=0; c<=10; c++) { ctx.beginPath(); ctx.moveTo(c*tetrisGame.blockSize, 0); ctx.lineTo(c*tetrisGame.blockSize, ctx.canvas.height); ctx.stroke(); }

    // Board
    for(let r=0;r<20;r++) for(let c=0;c<10;c++) if(tetrisGame.board[r][c]) drawBlock(c,r,tetrisGame.board[r][c]);
    
    // Current Piece
    if(tetrisGame.current) {
        const p = tetrisGame.current;
        for(let r=0;r<p.shape.length;r++) for(let c=0;c<p.shape[r].length;c++) if(p.shape[r][c]) drawBlock(p.x+c, p.y+r, p.color);
    }
}

function drawBlock(x,y,color) {
    const s = tetrisGame.blockSize;
    tetrisGame.ctx.fillStyle = color; 
    tetrisGame.ctx.fillRect(x*s, y*s, s, s);
    tetrisGame.ctx.strokeRect(x*s, y*s, s, s);
}

function moveDown() {
    if(!isValid(0,1)) {
        lock();
        tetrisGame.current = newPiece();
        if(!isValid(0,0)) {
            tetrisGame.running = false;
            window.openModal('game-over-modal');
        }
    } else {
        tetrisGame.current.y++;
    }
}

function isValid(ox, oy, newShape) {
    const p = tetrisGame.current;
    const shape = newShape || p.shape;
    for(let r=0; r<shape.length; r++) {
        for(let c=0; c<shape[r].length; c++) {
            if(shape[r][c]) {
                let newX = p.x + c + ox;
                let newY = p.y + r + oy;
                if(newX < 0 || newX >= 10 || newY >= 20) return false;
                if(newY >= 0 && tetrisGame.board[newY][newX]) return false;
            }
        }
    }
    return true;
}

function lock() {
    const p = tetrisGame.current;
    for(let r=0; r<p.shape.length; r++) {
        for(let c=0; c<p.shape[r].length; c++) {
            if(p.shape[r][c]) {
                if(p.y+r < 0) { tetrisGame.running=false; window.openModal('game-over-modal'); return; }
                tetrisGame.board[p.y+r][p.x+c] = p.color;
            }
        }
    }
    // Clear Lines
    for(let r=0; r<20; r++) {
        if(tetrisGame.board[r].every(val => val !== 0)) {
            tetrisGame.board.splice(r, 1);
            tetrisGame.board.unshift(Array(10).fill(0));
            tetrisGame.score += 100;
            document.getElementById('score').textContent = tetrisGame.score;
        }
    }
}

// Controls
document.getElementById('left-btn').onclick = () => { if(isValid(-1,0)) tetrisGame.current.x--; drawTetris(); };
document.getElementById('right-btn').onclick = () => { if(isValid(1,0)) tetrisGame.current.x++; drawTetris(); };
document.getElementById('down-btn').onclick = () => { moveDown(); drawTetris(); };
document.getElementById('rotate-btn').onclick = () => { 
    const rotated = tetrisGame.current.shape[0].map((val, index) => tetrisGame.current.shape.map(row => row[index]).reverse());
    if(isValid(0,0, rotated)) tetrisGame.current.shape = rotated;
    drawTetris();
};

// Modals
window.openModal = (id) => document.getElementById(id).classList.add('active');
window.closeModal = (id) => document.getElementById(id).classList.remove('active');
