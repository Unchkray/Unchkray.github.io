// --- Global State ---
let currentApp = null;
let tetrisGame = null;
let typingInterval = null;
let currentPhotoIndex = 0;
let isPlaying = false; 
let lastCapturedPhoto = null;
let isGalleryOpen = false;
let cameraPhotoTimeout = null;

// --- Setup Data Foto ---
// Pastikan file foto ada di folder 'images' dengan nama yang sesuai
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

// --- Setup Data Playlist & Lagu (LOKAL) ---
// Pastikan file mp3 ada di folder 'audio' dengan nama yang sesuai
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

// --- SYSTEM BOOT & CLOCK ---
document.addEventListener('DOMContentLoaded', () => {
    simulateBoot();
    updateClock();
    setInterval(updateClock, 60000);
    renderLibrary(); 
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

function simulateBoot() {
    const bar = document.getElementById('progress-fill');
    setTimeout(() => { bar.style.width = '30%'; }, 500);
    setTimeout(() => { bar.style.width = '70%'; }, 1500);
    setTimeout(() => { bar.style.width = '100%'; }, 2500);
    setTimeout(() => {
        document.getElementById('loading-screen').classList.remove('active');
        document.getElementById('home-screen').classList.add('active');
    }, 3000);
}

// --- NAVIGATION SYSTEM ---
function openApp(appName) {
    const homeScreen = document.getElementById('home-screen');
    const targetApp = document.getElementById(`${appName}-app`);
    
    if (targetApp) {
        homeScreen.classList.remove('active');
        targetApp.classList.add('active');
        currentApp = appName;
        
        if (appName === 'tetris') {
            initTetris();
            resetTetris(); // Auto reset game saat dibuka
        }
        if (appName === 'camera') {
            initCamera();
        }
    }
}

function goHome() {
    // Sembunyikan semua aplikasi
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Tampilkan Home Screen
    document.getElementById('home-screen').classList.add('active');

    // Reset Logic per App saat keluar
    if (currentApp === 'whatsapp') closeChatRoom();
    if (currentApp === 'tetris') pauseTetris();
    if (currentApp === 'camera') resetCameraState();
    
    currentApp = null;
}

// --- WHATSAPP LOGIC ---
function openChatRoom() {
    document.getElementById('wa-list-view').classList.remove('active');
    document.getElementById('wa-chat-view').classList.add('active');
    startChatTypewriter();
}

function closeChatRoom() {
    document.getElementById('wa-chat-view').classList.remove('active');
    document.getElementById('wa-list-view').classList.add('active');
    if (typingInterval) clearInterval(typingInterval);
}

function startChatTypewriter() {
    const container = document.querySelector('.wa-messages-container');
    container.innerHTML = ''; 
    
    const fullMessage = `Hi Mika,\n\nHappy Birthday yang ke-26!\n\nHari ini, aku cuma ingin kamu merasakan segala hal indah yang semesta simpan khusus buat kamu. Semua hal baik, semua keajaiban kecil, semua ketenangan yang cuma muncul karena kamu ada di dunia ini.\n\nSemoga setiap harapanmu tercapai, dari yang paling sederhana sampai yang paling lucu karena kamu memang unik dengan cara yang bikin aku jatuh cinta tiap hari. Aku selalu percaya kamu bisa melewati setiap tantangan, karena ada kekuatan besar dalam diri kamu yang lembut, yang kuat, yang selalu bikin aku kagum.\n\nTerima kasih sudah jadi bagian paling berharga dalam hidup aku. Kamu bikin hari-hari aku lebih ceria dan penuh warna. Dan di usia kamu yang ke-26 ini, aku berharap kamu makin bahagia, makin sukses, makin imut, dan makin cantik… walaupun kamu udah cantik banget sih!. 😚\n\nI love you so much! ❤️`;
    
    const paragraphs = fullMessage.split('\n\n');
    let pIndex = 0;
    
    function typeNextParagraph() {
        if (pIndex >= paragraphs.length) return;
        
        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble msg-in';
        const textSpan = document.createElement('span');
        bubble.appendChild(textSpan);
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'msg-time';
        const now = new Date();
        timeSpan.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
        bubble.appendChild(timeSpan);
        
        container.appendChild(bubble);
        
        let charIndex = 0;
        const text = paragraphs[pIndex];
        
        const typeChar = setInterval(() => {
            textSpan.textContent += text[charIndex];
            charIndex++;
            container.scrollTop = container.scrollHeight;
            
            if (charIndex >= text.length) {
                clearInterval(typeChar);
                pIndex++;
                setTimeout(typeNextParagraph, 1000);
            }
        }, 30); // Kecepatan mengetik
        typingInterval = typeChar;
    }
    
    typeNextParagraph();
}

// --- CAMERA LOGIC ---
function initCamera() {
    resetCameraState();
}

function resetCameraState() {
    currentPhotoIndex = 0;
    lastCapturedPhoto = null;
    isGalleryOpen = false;
    if (cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    
    // Reset tampilan utama kamera
    const display = document.getElementById('camera-main-display');
    display.innerHTML = '<div class="initial-text">Tap Shutter to Capture</div>';
    
    // Sembunyikan thumbnail gallery
    document.getElementById('gallery-thumb').style.opacity = '0';
    
    // Enable tombol shutter
    const btn = document.getElementById('shutter-trigger');
    btn.classList.remove('disabled');
    
    closeGalleryOverlay();
    
    // Reset isi grid gallery (opsional, jika ingin gallery kosong tiap buka app)
    // document.getElementById('gallery-grid-content').innerHTML = ''; 
}

function takePhoto() {
    // Jangan ambil foto jika sedang di mode preview gallery
    if (isGalleryOpen) return; 

    // Cek apakah foto sudah habis
    if (currentPhotoIndex >= photos.length) {
        const display = document.getElementById('camera-main-display');
        display.innerHTML = '<div class="initial-text" style="font-size:16px; font-weight:bold;">All Captured! Check Gallery 👈</div>';
        return;
    }

    // Efek Flash
    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 100);

    // Ambil data foto
    const data = photos[currentPhotoIndex];
    lastCapturedPhoto = data;
    const display = document.getElementById('camera-main-display');
    
    // Tampilkan foto di layar utama (Review) + Caption
    display.innerHTML = `
        <img src="${data.image}" style="width:100%; height:100%; object-fit:cover;">
        <div class="photo-caption-overlay">${data.text}</div>
    `;

    // Update Thumbnail di pojok kiri bawah
    const thumb = document.getElementById('gallery-thumb');
    thumb.src = data.image;
    thumb.style.opacity = '1';

    // Masukkan foto ke dalam Grid Gallery
    addToGallery(data);

    // Otomatis bersihkan layar utama setelah 1.2 detik (agar siap foto lagi)
    if (cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    cameraPhotoTimeout = setTimeout(() => {
        display.innerHTML = ''; // Layar jadi hitam
    }, 1200); 

    currentPhotoIndex++;
}

function addToGallery(photoData) {
    const grid = document.getElementById('gallery-grid-content');
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${photoData.image}" loading="lazy">`;
    // Tambahkan ke grid (paling akhir)
    grid.appendChild(item);
}

function openGalleryOverlay() {
    if (lastCapturedPhoto) {
        isGalleryOpen = true;
        document.getElementById('shutter-trigger').classList.add('disabled'); // Matikan tombol shutter
        document.getElementById('gallery-full-img').src = lastCapturedPhoto.image;
        document.getElementById('gallery-overlay').classList.add('active');
    } else {
        // Opsional: Alert jika belum ada foto
        // alert("No photos yet!");
    }
}

function closeGalleryOverlay() {
    isGalleryOpen = false;
    document.getElementById('shutter-trigger').classList.remove('disabled'); // Hidupkan tombol shutter
    document.getElementById('gallery-overlay').classList.remove('active');
}

function openGalleryView() {
    // Fungsi untuk membuka Grid View (tombol preview kecil)
    openGalleryOverlay(); // Shortcut langsung ke overlay foto terakhir
}

function closeGalleryView() {
    // Fungsi placeholder jika pakai grid view terpisah
    document.getElementById('gallery-view-mode').classList.remove('active');
    document.getElementById('camera-view-mode').style.display = 'flex';
}

// --- SPOTIFY LOGIC ---
function renderLibrary() {
    const list = document.getElementById('spotify-playlist-list');
    list.innerHTML = '';
    
    Object.keys(playlists).forEach(key => {
        const pl = playlists[key];
        const item = document.createElement('div');
        item.className = 'playlist-item';
        item.onclick = () => openPlaylist(key);
        item.innerHTML = `
            <div class="playlist-thumb" style="background:${pl.color}"><i class="${pl.icon}" style="color:white"></i></div>
            <div class="playlist-info">
                <h4>${pl.title}</h4>
                <p>${pl.desc}</p>
            </div>
        `;
        list.appendChild(item);
    });
}

function openPlaylist(key) {
    const pl = playlists[key];
    currentPlaylist = pl.songs;
    
    // Update UI Playlist Detail
    document.getElementById('pl-title').textContent = pl.title;
    document.getElementById('pl-desc').textContent = pl.desc;
    document.getElementById('pl-cover-art').style.background = pl.color;
    document.getElementById('pl-cover-art').innerHTML = `<i class="${pl.icon}"></i>`;
    
    // Tombol Play Besar
    document.getElementById('pl-play-big').onclick = () => playSong(0);

    // Render Lagu
    const songList = document.getElementById('pl-song-list');
    songList.innerHTML = '';
    pl.songs.forEach((song, idx) => {
        const row = document.createElement('div');
        row.className = 'song-row';
        row.onclick = () => playSong(idx);
        row.innerHTML = `
            <div class="song-left">
                <div class="s-title">${song.title}</div>
                <div class="s-artist">${song.artist}</div>
            </div>
            <i class="fas fa-ellipsis-h" style="color:#b3b3b3"></i>
        `;
        songList.appendChild(row);
    });

    document.getElementById('spotify-library-view').classList.remove('active');
    document.getElementById('spotify-playlist-view').classList.add('active');
}

function closePlaylist() {
    document.getElementById('spotify-playlist-view').classList.remove('active');
    document.getElementById('spotify-library-view').classList.add('active');
}

function playSong(index) {
    if(currentPlaylist.length === 0) return;
    currentSongIndex = index;
    const song = currentPlaylist[index];
    const audio = document.getElementById('audio-player');
    
    audio.src = song.src;
    audio.play().then(() => {
        isPlaying = true;
        updateMiniPlayer(song);
    }).catch(e => {
        console.log("Audio error:", e);
        alert("Gagal memutar lagu. Pastikan file MP3 ada di folder 'audio' dan namanya benar.");
    });
}

function togglePlay() {
    const audio = document.getElementById('audio-player');
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
        updatePlayIcons(false);
    } else {
        if (audio.src) {
            audio.play();
            isPlaying = true;
            updatePlayIcons(true);
        }
    }
}

function updateMiniPlayer(song) {
    document.getElementById('np-title-mini').textContent = song.title;
    document.getElementById('np-artist-mini').textContent = song.artist;
    updatePlayIcons(true);
}

function updatePlayIcons(isPlayingNow) {
    const icon = isPlayingNow ? 'fas fa-pause' : 'fas fa-play';
    document.getElementById('np-play-btn-mini').className = icon;
}

// --- TETRIS LOGIC ---
function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    
    // Hitung ukuran dinamis agar full screen di area game
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 600;
    
    canvas.width = width;
    canvas.height = height;
    
    // Hitung ukuran blok dinamis (20 baris ke bawah)
    const rows = 20;
    const blockSize = Math.floor(height / rows);
    const cols = Math.floor(width / blockSize);
    
    if (!tetrisGame) {
        tetrisGame = { 
            ctx: canvas.getContext('2d'), 
            cols: cols, 
            rows: rows, 
            board: [], 
            blockSize: blockSize, 
            score: 0, 
            level: 1, 
            running: false, 
            current: null,
            canvasWidth: width,
            canvasHeight: height
        };
        // Inisialisasi board kosong
        for(let r=0; r<rows; r++){
            tetrisGame.board[r] = [];
            for(let c=0; c<cols; c++) tetrisGame.board[r][c] = 0;
        }
    } else {
        // Update jika ada perubahan
        tetrisGame.blockSize = blockSize;
        tetrisGame.cols = cols;
        tetrisGame.rows = rows;
        tetrisGame.canvasWidth = width;
        tetrisGame.canvasHeight = height;
        tetrisGame.ctx = canvas.getContext('2d');
    }
}

function resetTetris() {
    if (!tetrisGame) initTetris();
    
    // Bersihkan board
    for(let r=0; r<tetrisGame.rows; r++){
        tetrisGame.board[r] = [];
        for(let c=0; c<tetrisGame.cols; c++) tetrisGame.board[r][c] = 0;
    }
    
    tetrisGame.score = 0;
    tetrisGame.level = 1;
    document.getElementById('score').textContent = '0';
    
    tetrisGame.running = true;
    tetrisGame.current = newPiece();
    dropStart = Date.now();
    
    loopTetris();
}

function pauseTetris() { 
    if (tetrisGame) tetrisGame.running = false; 
}

const PIECES = [
    [[[1,1,0],[0,1,1]], "#FF3B30"], // Z
    [[[0,1,1],[1,1,0]], "#34C759"], // S
    [[[0,1,0],[1,1,1]], "#AF52DE"], // T
    [[[1,1],[1,1]], "#FFD60A"],     // O
    [[[0,0,1],[1,1,1]], "#FF9500"], // L
    [[[1,1,1,1]], "#30B0C7"],       // I
    [[[1,0,0],[1,1,1]], "#007AFF"]  // J
];

function newPiece() {
    const r = Math.floor(Math.random() * PIECES.length);
    // Spawn di tengah
    const startX = Math.floor((tetrisGame.cols / 2) - (PIECES[r][0][0].length / 2));
    return {
        tetromino: PIECES[r][0],
        color: PIECES[r][1],
        x: startX,
        y: -2 // Mulai sedikit di atas layar
    };
}

let dropStart = Date.now();
function loopTetris() {
    if (!tetrisGame || !tetrisGame.running) return;
    
    let now = Date.now();
    let delta = now - dropStart;
    // Kecepatan: Base 400ms, makin cepat tiap level
    let speed = Math.max(50, 400 - (tetrisGame.level * 40));
    
    if (delta > speed) {
        moveDown();
        dropStart = Date.now();
    }
    
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris() {
    const { ctx, blockSize, board, current, canvasWidth, canvasHeight, cols, rows } = tetrisGame;
    
    // Clear Canvas
    ctx.fillStyle = "#111"; 
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Gambar Grid Tipis
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let c = 0; c <= cols; c++) {
        ctx.moveTo(c * blockSize, 0);
        ctx.lineTo(c * blockSize, rows * blockSize);
    }
    for (let r = 0; r <= rows; r++) {
        ctx.moveTo(0, r * blockSize);
        ctx.lineTo(cols * blockSize, r * blockSize);
    }
    ctx.stroke();
    ctx.closePath();
    
    // Gambar Board (Balok yang sudah mati)
    for(let r=0; r<rows; r++){
        for(let c=0; c<cols; c++){
            if(board[r][c]) drawBlock(c, r, board[r][c]);
        }
    }
    
    // Gambar Balok Aktif
    if (current) {
        for(let r=0; r<current.tetromino.length; r++){
            for(let c=0; c<current.tetromino[r].length; c++){
                if(current.tetromino[r][c]) drawBlock(current.x + c, current.y + r, current.color);
            }
        }
    }
}

function drawBlock(x, y, color) {
    const { ctx, blockSize, cols, rows } = tetrisGame;
    // Hanya gambar jika di dalam area valid
    if (x < 0 || x >= cols || y >= rows) return;
    
    ctx.fillStyle = color;
    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x*blockSize+1, y*blockSize+1, blockSize-2, blockSize-2);
}

function moveDown() {
    if (!collision(0, 1, tetrisGame.current.tetromino)) {
        tetrisGame.current.y++;
    } else {
        lock();
        tetrisGame.current = newPiece();
        // Cek Game Over (Tabrakan saat baru spawn)
        if (collision(0, 0, tetrisGame.current.tetromino)) {
            triggerGameOver();
        }
    }
}

function moveLeft() {
    if (!tetrisGame.running) return;
    if (!collision(-1, 0, tetrisGame.current.tetromino)) tetrisGame.current.x--;
}

function moveRight() {
    if (!tetrisGame.running) return;
    if (!collision(1, 0, tetrisGame.current.tetromino)) tetrisGame.current.x++;
}

function rotate() {
    if (!tetrisGame.running) return;
    let nextPattern = tetrisGame.current.tetromino[0].map((val, index) => 
        tetrisGame.current.tetromino.map(row => row[index]).reverse());
    
    // Wall kick sederhana (jika rotasi nabrak, coba geser kiri/kanan)
    if (!collision(0, 0, nextPattern)) {
        tetrisGame.current.tetromino = nextPattern;
    } else if (!collision(-1, 0, nextPattern)) {
        tetrisGame.current.x -= 1;
        tetrisGame.current.tetromino = nextPattern;
    } else if (!collision(1, 0, nextPattern)) {
        tetrisGame.current.x += 1;
        tetrisGame.current.tetromino = nextPattern;
    }
}

function collision(x, y, piece) {
    for (let r = 0; r < piece.length; r++) {
        for (let c = 0; c < piece[r].length; c++) {
            if (!piece[r][c]) continue;
            let newX = tetrisGame.current.x + c + x;
            let newY = tetrisGame.current.y + r + y;
            
            if (newX < 0 || newX >= tetrisGame.cols || newY >= tetrisGame.rows) return true;
            if (newY < 0) continue;
            if (tetrisGame.board[newY][newX]) return true;
        }
    }
    return false;
}

function lock() {
    for (let r = 0; r < tetrisGame.current.tetromino.length; r++) {
        for (let c = 0; c < tetrisGame.current.tetromino[r].length; c++) {
            if (!tetrisGame.current.tetromino[r][c]) continue;
            
            // GAME OVER LOGIC: Jika ada bagian balok yang terkunci di atas layar (y < 0)
            if (tetrisGame.current.y + r < 0) {
                triggerGameOver();
                return;
            }
            
            if (tetrisGame.current.y + r >= 0) {
                tetrisGame.board[tetrisGame.current.y + r][tetrisGame.current.x + c] = tetrisGame.current.color;
            }
        }
    }
    
    // Cek baris penuh
    let lines = 0;
    for (let r = 0; r < tetrisGame.rows; r++) {
        let full = true;
        for (let c = 0; c < tetrisGame.cols; c++) {
            if (!tetrisGame.board[r][c]) {
                full = false;
                break;
            }
        }
        if (full) {
            lines++;
            tetrisGame.board.splice(r, 1);
            // Tambah baris kosong baru di atas
            let newRow = new Array(tetrisGame.cols).fill(0);
            tetrisGame.board.unshift(newRow);
        }
    }
    
    if (lines > 0) {
        tetrisGame.score += lines * 100;
        // Naikkan level setiap 300 poin
        tetrisGame.level = Math.floor(tetrisGame.score / 300) + 1;
        document.getElementById('score').textContent = tetrisGame.score;
    }
}

function triggerGameOver() {
    tetrisGame.running = false;
    document.getElementById('final-score').textContent = tetrisGame.score;
    openModal('game-over-modal');
}

// --- CONTROLS & HELPERS ---
document.getElementById('left-btn').addEventListener('click', moveLeft);
document.getElementById('right-btn').addEventListener('click', moveRight);
document.getElementById('down-btn').addEventListener('click', moveDown);
document.getElementById('rotate-btn').addEventListener('click', rotate);

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
