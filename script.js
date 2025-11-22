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
    { text: 'Cantik yang Gak Pernah Gagal 💕', image: './images/photo1.jpg' },
    { text: 'Imutnya Bikin Lupa Dunia 🧸', image: './images/photo2.jpg' },
    { text: 'Elegan ✨', image: './images/photo3.jpg' },
    { text: 'Senyum yang Jadi Favorit Aku ❤️', image: './images/photo4.jpg' },
    { text: 'Pesona yang Susah Dilupain 🌹', image: './images/photo5.jpg' },
    { text: 'Cantik dari Sudut Mana Pun 📸', image: './images/photo6.jpg' },
    { text: 'Manis Bikin Diabetes 🍯', image: './images/photo7.jpg' },
    { text: 'Yang Aku Sayang Selamanya 💖', image: './images/photo8.jpg' }
];

// --- Setup Data Playlist & Lagu (LOKAL) ---
// PASTIKAN FILE MP3 ADA DI FOLDER 'audio'
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

// --- Navigation (FIXED BLANK SCREEN) ---
function openApp(appName) {
    const homeScreen = document.getElementById('home-screen');
    const targetApp = document.getElementById(`${appName}-app`);
    if (targetApp) {
        homeScreen.classList.remove('active');
        targetApp.classList.add('active');
        currentApp = appName;
        if (appName === 'tetris') initTetris();
        if (appName === 'camera') initCamera();
    }
}

function goHome() {
    // Reset Semua Layar ke Non-Active
    document.querySelectorAll('.app-screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Paksa Tampilkan Home Screen
    document.getElementById('home-screen').classList.add('active');

    // Reset Logic per App
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
        }, 30);
        typingInterval = typeChar;
    }
    typeNextParagraph();
}

// --- CAMERA LOGIC (FIXED PREVIEW & CLICK) ---
function initCamera() {
    resetCameraState();
}

function resetCameraState() {
    currentPhotoIndex = 0;
    lastCapturedPhoto = null;
    isGalleryOpen = false;
    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    
    const display = document.getElementById('camera-main-display');
    display.innerHTML = '<div class="initial-text">Tap Shutter to Capture</div>';
    document.getElementById('gallery-thumb').style.opacity = '0';
    
    const btn = document.getElementById('shutter-trigger');
    btn.classList.remove('disabled');
    
    closeGalleryOverlay();
}

function takePhoto() {
    if (isGalleryOpen) return; // Prevent Click if gallery open

    // 1. Cek Habis
    if (currentPhotoIndex >= photos.length) {
        const display = document.getElementById('camera-main-display');
        display.innerHTML = '<div class="initial-text" style="font-size:16px; font-weight:bold;">All Captured! Check Gallery 👈</div>';
        return;
    }

    // 2. Flash Effect
    const flash = document.getElementById('camera-flash');
    flash.style.opacity = '1';
    setTimeout(() => { flash.style.opacity = '0'; }, 100);

    // 3. Show Photo on Main Screen (Review)
    const data = photos[currentPhotoIndex];
    lastCapturedPhoto = data;
    const display = document.getElementById('camera-main-display');
    
    // Render gambar full di viewfinder
    display.innerHTML = `<img src="${data.image}" style="width:100%; height:100%; object-fit:cover;">`;

    // Update Thumbnail
    const thumb = document.getElementById('gallery-thumb');
    thumb.src = data.image;
    thumb.style.opacity = '1';

    // 4. Auto Reset Screen after 1 second
    if(cameraPhotoTimeout) clearTimeout(cameraPhotoTimeout);
    cameraPhotoTimeout = setTimeout(() => {
        display.innerHTML = ''; // Layar jadi hitam lagi
    }, 1000);

    currentPhotoIndex++;
}

function openGalleryOverlay() {
    if (lastCapturedPhoto) {
        isGalleryOpen = true;
        document.getElementById('shutter-trigger').classList.add('disabled'); // Disable Shutter
        document.getElementById('gallery-full-img').src = lastCapturedPhoto.image;
        document.getElementById('gallery-overlay').classList.add('active');
    } else {
        // Do nothing if no photo
    }
}

function closeGalleryOverlay() {
    isGalleryOpen = false;
    document.getElementById('shutter-trigger').classList.remove('disabled'); // Enable Shutter
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
        item.innerHTML = `
            <div class="playlist-thumb" style="background:${pl.color}"><i class="${pl.icon}" style="color:white"></i></div>
            <div class="playlist-info"><h4>${pl.title}</h4><p>${pl.desc}</p></div>
        `;
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
        row.innerHTML = `
            <div class="song-left"><div class="s-title">${song.title}</div><div class="s-artist">${song.artist}</div></div>
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
        alert("File lagu tidak ditemukan. Pastikan path lokal benar.");
    });
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

function updatePlayIcons(isPlayingNow) {
    const icon = isPlayingNow ? 'fas fa-pause' : 'fas fa-play';
    document.getElementById('np-play-btn-mini').className = icon;
}

// --- TETRIS LOGIC (FAST & GAME OVER FIX) ---
function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    
    const width = container.clientWidth > 0 ? container.clientWidth : 300;
    const height = container.clientHeight > 0 ? container.clientHeight : 600;
    canvas.width = width; canvas.height = height;
    
    const blockSize = Math.floor(height / 20);
    
    if (!tetrisGame) {
        tetrisGame = { ctx: canvas.getContext('2d'), cols: 10, rows: 20, board: [], blockSize: blockSize, score: 0, level: 1, running: false, current: null };
        resetTetris();
    } else {
        tetrisGame.blockSize = blockSize;
        tetrisGame.ctx = canvas.getContext('2d');
        tetrisGame.running = true;
        loopTetris();
    }
}

function resetTetris() {
    for(let r=0;r<20;r++){tetrisGame.board[r]=[];for(let c=0;c<10;c++)tetrisGame.board[r][c]=0}
    tetrisGame.score=0; tetrisGame.level=1;
    document.getElementById('score').textContent='0';
    tetrisGame.running=true;
    tetrisGame.current=newPiece();
    loopTetris();
}
function pauseTetris(){ if(tetrisGame) tetrisGame.running=false; }

const PIECES=[[[[1,1,0],[0,1,1]],"#FF3B30"],[[[0,1,1],[1,1,0]],"#34C759"],[[[0,1,0],[1,1,1]],"#AF52DE"],[[[1,1],[1,1]],"#FFD60A"],[[[0,0,1],[1,1,1]],"#FF9500"],[[[1,1,1,1]],"#30B0C7"],[[[1,0,0],[1,1,1]],"#007AFF"]];
function newPiece(){const r=Math.floor(Math.random()*PIECES.length);return{tetromino:PIECES[r][0],color:PIECES[r][1],x:3,y:-2}}

let dropStart=Date.now();
function loopTetris(){
    if(!tetrisGame || !tetrisGame.running) return;
    let now=Date.now();let delta=now-dropStart;
    // Base Speed 300ms (Cepat)
    let speed = Math.max(50, 300 - (tetrisGame.level * 30));
    if(delta > speed){ moveDown(); dropStart=Date.now(); }
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris(){
    const{ctx,blockSize,board,current}=tetrisGame;
    ctx.fillStyle="#111"; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
    for(let r=0;r<20;r++)for(let c=0;c<10;c++)if(board[r][c])drawBlock(c,r,board[r][c]);
    if(current)for(let r=0;r<current.tetromino.length;r++)for(let c=0;c<current.tetromino[r].length;c++)if(current.tetromino[r][c])drawBlock(current.x+c,current.y+r,current.color);
}
function drawBlock(x,y,color){const{ctx,blockSize}=tetrisGame;ctx.fillStyle=color;ctx.fillRect(x*blockSize,y*blockSize,blockSize,blockSize);ctx.strokeStyle="rgba(255,255,255,0.3)";ctx.lineWidth=2;ctx.strokeRect(x*blockSize,y*blockSize,blockSize,blockSize)}

function moveDown(){
    if(!collision(0,1,tetrisGame.current.tetromino)) {
        tetrisGame.current.y++;
    } else {
        lock();
        tetrisGame.current=newPiece();
        // CHECK GAME OVER: Jika piece baru langsung collide
        if(collision(0,0,tetrisGame.current.tetromino)){
            tetrisGame.running=false;
            document.getElementById('final-score').textContent = tetrisGame.score;
            openModal('game-over-modal');
        }
    }
}
function moveLeft(){
    if(!tetrisGame.running) return;
    if(!collision(-1,0,tetrisGame.current.tetromino))tetrisGame.current.x--;
}
function moveRight(){
    if(!tetrisGame.running) return;
    if(!collision(1,0,tetrisGame.current.tetromino))tetrisGame.current.x++;
}
function rotate(){
    if(!tetrisGame.running) return;
    let nextPattern=tetrisGame.current.tetromino[0].map((val,index)=>tetrisGame.current.tetromino.map(row=>row[index]).reverse());if(!collision(0,0,nextPattern))tetrisGame.current.tetromino=nextPattern;
}
function collision(x,y,piece){for(let r=0;r<piece.length;r++)for(let c=0;c<piece[r].length;c++){if(!piece[r][c])continue;let newX=tetrisGame.current.x+c+x;let newY=tetrisGame.current.y+r+y;if(newX<0||newX>=10||newY>=20)return true;if(newY<0)continue;if(tetrisGame.board[newY][newX])return true}return false}
function lock(){
    for(let r=0;r<tetrisGame.current.tetromino.length;r++)for(let c=0;c<tetrisGame.current.tetromino[r].length;c++){
        if(!tetrisGame.current.tetromino[r][c])continue;
        // CHECK GAME OVER (JIKA MENUMPUK DI ATAS)
        if(tetrisGame.current.y+r < 0) {
            tetrisGame.running = false;
            document.getElementById('final-score').textContent = tetrisGame.score;
            openModal('game-over-modal');
            return;
        }
        if(tetrisGame.current.y+r>=0)tetrisGame.board[tetrisGame.current.y+r][tetrisGame.current.x+c]=tetrisGame.current.color;
    }
    let lines=0;
    for(let r=0;r<20;r++){let full=true;for(let c=0;c<10;c++)if(!tetrisGame.board[r][c])full=false;if(full){lines++;tetrisGame.board.splice(r,1);tetrisGame.board.unshift(new Array(10).fill(0))}}
    if(lines>0){ tetrisGame.score+=lines*100; tetrisGame.level = Math.floor(tetrisGame.score / 300) + 1; document.getElementById('score').textContent=tetrisGame.score; }
}

// Controls & Modals
document.getElementById('left-btn').addEventListener('click',moveLeft);document.getElementById('right-btn').addEventListener('click',moveRight);document.getElementById('down-btn').addEventListener('click',moveDown);document.getElementById('rotate-btn').addEventListener('click',rotate);
function openModal(id){document.getElementById(id).classList.add('active')}
function closeModal(id){document.getElementById(id).classList.remove('active')}
