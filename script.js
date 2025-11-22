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
const playlists = {
    'good-vibes': {
        title: 'Good Vibes',
        desc: 'Playlist • Mika Cantik',
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
        desc: 'Playlist • Mika Cantik',
        color: '#2980b9',
        icon: 'fas fa-cloud-rain',
        songs: [
            { title: "Blue Skies", artist: "Birdy", src: "./audio/blue_skies.mp3" },
            { title: "Ocean Eyes", artist: "Billie Eilish", src: "./audio/ocean_eyes.mp3" }
        ]
    },
    'night-chill': {
        title: 'Night Chill',
        desc: 'Playlist • Mika Cantik',
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

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 60000);
    renderLibrary(); 
});

// --- GIFT LOGIC ---
function openGift() {
    const container = document.querySelector('.gift-container');
    const screen = document.getElementById('gift-intro');
    container.classList.add('open');
    document.querySelector('.gift-text').style.opacity = '0';
    
    setTimeout(() => {
        screen.classList.add('fade-out');
        setTimeout(() => {
            screen.style.display = 'none';
            simulateBoot();
        }, 800);
    }, 600);
}

function updateClock() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${h}:${m}`;
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

// --- Navigation ---
function openApp(appName) {
    const homeScreen = document.getElementById('home-screen');
    const targetApp = document.getElementById(`${appName}-app`);
    if (targetApp) {
        homeScreen.classList.remove('active');
        targetApp.classList.add('active');
        currentApp = appName;
        if (appName === 'tetris') { initTetris(); resetTetris(); }
        if (appName === 'camera') initCamera();
    }
}

function goHome() {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('home-screen').classList.add('active');
    if (currentApp === 'whatsapp') closeChatRoom();
    if (currentApp === 'tetris') pauseTetris();
    if (currentApp === 'camera') resetCameraState();
    currentApp = null;
}

// --- WhatsApp ---
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
    const text = "Hi Sayang,\n\nHappy Birthday yang ke-26! 🎉\n\nSemoga semua impianmu tercapai, makin cantik, makin pintar, dan bahagia selalu. Terima kasih sudah jadi bagian terindah di hidupku. I love you! ❤️";
    
    let i = 0;
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble msg-in';
    bubble.style.marginTop = '20px';
    const span = document.createElement('span');
    const time = document.createElement('span');
    time.className = 'msg-time';
    
    const now = new Date();
    time.innerText = `${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`;
    
    bubble.appendChild(span);
    bubble.appendChild(time);
    container.appendChild(bubble);
    
    typingInterval = setInterval(() => {
        if (i < text.length) {
            span.innerText += text.charAt(i);
            i++;
            container.scrollTop = container.scrollHeight;
        } else {
            clearInterval(typingInterval);
        }
    }, 30);
}

// --- CAMERA LOGIC ---
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

function takePhoto() {
    if (isGalleryOpen) return; 
    if (currentPhotoIndex >= photos.length) {
        document.getElementById('camera-main-display').innerHTML = '<div class="initial-text" style="font-size:16px; font-weight:bold;">All Captured! Check Gallery 👈</div>';
        return;
    }

    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 100);

    const data = photos[currentPhotoIndex];
    lastCapturedPhoto = data;
    const display = document.getElementById('camera-main-display');
    display.innerHTML = `<img src="${data.image}" style="width:100%; height:100%; object-fit:cover;"><div class="photo-caption-overlay">${data.text}</div>`;
    const thumb = document.getElementById('gallery-thumb');
    thumb.src = data.image;
    thumb.style.opacity = '1';
    
    const grid = document.getElementById('gallery-grid-content');
    const newItem = document.createElement('div');
    newItem.className = 'gallery-item';
    newItem.innerHTML = `<img src="${data.image}">`;
    grid.appendChild(newItem);

    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    cameraPhotoTimeout = setTimeout(() => { display.innerHTML = ''; }, 1200); 
    currentPhotoIndex++;
}

function openGalleryOverlay() {
    if (lastCapturedPhoto) {
        isGalleryOpen = true;
        document.getElementById('shutter-trigger').classList.add('disabled'); 
        document.getElementById('gallery-full-img').src = lastCapturedPhoto.image;
        document.getElementById('gallery-overlay').classList.add('active');
    }
}

function closeGalleryOverlay() {
    isGalleryOpen = false;
    document.getElementById('shutter-trigger').classList.remove('disabled'); 
    document.getElementById('gallery-overlay').classList.remove('active');
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
        item.innerHTML = `<div class="playlist-thumb" style="background:${pl.color}"><i class="${pl.icon}" style="color:white"></i></div><div class="playlist-info"><h4>${pl.title}</h4><p>${pl.desc}</p></div>`;
        list.appendChild(item);
    });
}

function openPlaylist(key) {
    const pl = playlists[key];
    currentPlaylist = pl.songs;
    document.getElementById('pl-title').textContent = pl.title;
    document.getElementById('pl-desc').textContent = pl.desc;
    document.getElementById('pl-cover-art').style.background = pl.color;
    document.getElementById('pl-cover-art').innerHTML = `<i class="${pl.icon}"></i>`;
    document.getElementById('pl-play-big').onclick = () => playSong(0);

    const songList = document.getElementById('pl-song-list');
    songList.innerHTML = '';
    pl.songs.forEach((song, idx) => {
        const row = document.createElement('div');
        row.className = 'song-row';
        row.onclick = () => playSong(idx);
        row.innerHTML = `<div class="song-left"><div class="s-title">${song.title}</div><div class="s-artist">${song.artist}</div></div><i class="fas fa-ellipsis-h" style="color:#b3b3b3"></i>`;
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
    const song = currentPlaylist[index];
    const audio = document.getElementById('audio-player');
    audio.src = song.src;
    audio.play().then(() => { isPlaying = true; updateMiniPlayer(song); }).catch(e => { alert("File lagu tidak ditemukan."); });
}

function togglePlay() {
    const audio = document.getElementById('audio-player');
    if(isPlaying) { audio.pause(); isPlaying = false; updatePlayIcons(false); } 
    else { if(audio.src) { audio.play(); isPlaying = true; updatePlayIcons(true); } }
}

function updateMiniPlayer(song) {
    document.getElementById('np-title-mini').textContent = song.title;
    document.getElementById('np-artist-mini').textContent = song.artist;
    updatePlayIcons(true);
}

function updatePlayIcons(state) {
    document.getElementById('np-play-btn-mini').className = state ? 'fas fa-pause' : 'fas fa-play';
}

// --- TETRIS LOGIC ---
function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    canvas.width = container.clientWidth || 300;
    canvas.height = container.clientHeight || 600;
    
    const rows = 12; const cols = 12;
    const blockSize = canvas.width / cols;
    
    if (!tetrisGame) {
        tetrisGame = { ctx: canvas.getContext('2d'), cols, rows, board: [], blockSize, score: 0, level: 1, running: false, current: null, w: canvas.width, h: canvas.height };
    } else {
        tetrisGame.blockSize = blockSize; tetrisGame.ctx = canvas.getContext('2d');
    }
}

function resetTetris() {
    if(!tetrisGame) initTetris();
    for(let r=0;r<tetrisGame.rows;r++){ tetrisGame.board[r]=[]; for(let c=0;c<tetrisGame.cols;c++) tetrisGame.board[r][c]=0; }
    tetrisGame.score=0; document.getElementById('score').textContent='0';
    tetrisGame.running=true; tetrisGame.current=newPiece();
    dropStart=Date.now(); loopTetris();
}
function pauseTetris(){ if(tetrisGame) tetrisGame.running=false; }

const PIECES=[[[[1,1,0],[0,1,1]],"#FF3B30"],[[[0,1,1],[1,1,0]],"#34C759"],[[[0,1,0],[1,1,1]],"#AF52DE"],[[[1,1],[1,1]],"#FFD60A"],[[[0,0,1],[1,1,1]],"#FF9500"],[[[1,1,1,1]],"#30B0C7"],[[[1,0,0],[1,1,1]],"#007AFF"]];
function newPiece(){ const r=Math.floor(Math.random()*PIECES.length); const startX = Math.floor((tetrisGame.cols/2)-1); return{shape:PIECES[r][0],color:PIECES[r][1],x:startX,y:-2}; }

let dropStart=Date.now();
function loopTetris(){
    if(!tetrisGame || !tetrisGame.running) return;
    let now=Date.now(); let delta=now-dropStart;
    let speed = Math.max(50, 300 - (tetrisGame.level * 30));
    if(delta > speed){ moveDown(); dropStart=Date.now(); }
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris(){
    const { ctx, w, h, blockSize, board, current, cols, rows } = tetrisGame;
    const gameW = cols * blockSize; const gameH = rows * blockSize;
    const offX = (w - gameW)/2; const offY = (h - gameH)/2;
    
    ctx.fillStyle="#111"; ctx.fillRect(0,0,w,h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"; ctx.lineWidth = 1;
    for(let c=0;c<=cols;c++) { ctx.beginPath(); ctx.moveTo(offX+c*blockSize, offY); ctx.lineTo(offX+c*blockSize, offY+gameH); ctx.stroke(); }
    for(let r=0;r<=rows;r++) { ctx.beginPath(); ctx.moveTo(offX, offY+r*blockSize); ctx.lineTo(offX+gameW, offY+r*blockSize); ctx.stroke(); }

    for(let r=0;r<rows;r++)for(let c=0;c<cols;c++)if(board[r][c])drawBlock(offX+c*blockSize, offY+r*blockSize, board[r][c]);
    if(current)for(let r=0;r<current.shape.length;r++)for(let c=0;c<current.shape[r].length;c++)if(current.shape[r][c])drawBlock(offX+(current.x+c)*blockSize, offY+(current.y+r)*blockSize, current.color);
}

function drawBlock(x,y,color){
    const s = tetrisGame.blockSize;
    tetrisGame.ctx.fillStyle=color; tetrisGame.ctx.fillRect(x,y,s,s);
    tetrisGame.ctx.strokeStyle="rgba(255,255,255,0.5)"; tetrisGame.ctx.strokeRect(x,y,s,s);
}

function moveDown(){
    if(!collision(0,1)) { tetrisGame.current.y++; } 
    else {
        lock(); 
        tetrisGame.current=newPiece();
        if(collision(0,0)) { tetrisGame.running=false; document.getElementById('final-score').textContent=tetrisGame.score; openModal('game-over-modal'); }
    }
}
function moveLeft(){if(tetrisGame.running && !collision(-1,0))tetrisGame.current.x--}
function moveRight(){if(tetrisGame.running && !collision(1,0))tetrisGame.current.x++}
function rotate(){ 
    if(!tetrisGame.running) return;
    let next = tetrisGame.current.shape[0].map((_,i) => tetrisGame.current.shape.map(row => row[i]).reverse());
    if(!collision(0,0,next)) tetrisGame.current.shape = next;
}

function collision(ox, oy, shape) {
    const p = tetrisGame.current; const mat = shape || p.shape;
    for(let r=0;r<mat.length;r++)for(let c=0;c<mat[r].length;c++)if(mat[r][c]){
        let nx=p.x+c+ox; let ny=p.y+r+oy;
        if(nx<0||nx>=tetrisGame.cols||ny>=tetrisGame.rows) return true;
        if(ny>=0 && tetrisGame.board[ny][nx]) return true;
    } return false;
}

function lock(){
    const p = tetrisGame.current;
    for(let r=0;r<p.shape.length;r++)for(let c=0;c<p.shape[r].length;c++)if(p.shape[r][c]){
        if(p.y+r < 0) { tetrisGame.running=false; openModal('game-over-modal'); return; }
        tetrisGame.board[p.y+r][p.x+c] = p.color;
    }
    for(let r=0;r<tetrisGame.rows;r++) {
        if(tetrisGame.board[r].every(v=>v!==0)) {
            tetrisGame.board.splice(r,1);
            tetrisGame.board.unshift(Array(tetrisGame.cols).fill(0));
            tetrisGame.score += 100;
            document.getElementById('score').textContent = tetrisGame.score;
        }
    }
}

document.getElementById('left-btn').addEventListener('click',moveLeft);
document.getElementById('right-btn').addEventListener('click',moveRight);
document.getElementById('down-btn').addEventListener('click',moveDown);
document.getElementById('rotate-btn').addEventListener('click',rotate);

function openModal(id){document.getElementById(id).classList.add('active')}
function closeModal(id){document.getElementById(id).classList.remove('active')}
