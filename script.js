// --- Global State ---
let currentApp = null;
let tetrisGame = null;
let typingInterval = null;

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

document.addEventListener('DOMContentLoaded', () => {
    simulateBoot();
    updateClock();
    setInterval(updateClock, 60000);
});

function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// --- Boot Animation ---
function simulateBoot() {
    const bar = document.getElementById('progress-fill');
    const loadingScreen = document.getElementById('loading-screen');
    const homeScreen = document.getElementById('home-screen');
    
    setTimeout(() => { bar.style.width = '30%'; }, 500);
    setTimeout(() => { bar.style.width = '70%'; }, 1500);
    setTimeout(() => { bar.style.width = '100%'; }, 2500);
    
    setTimeout(() => {
        loadingScreen.classList.remove('active');
        homeScreen.classList.add('active');
    }, 3000);
}

// --- Navigation System ---
function openApp(appName) {
    const homeScreen = document.getElementById('home-screen');
    const targetApp = document.getElementById(`${appName}-app`);
    
    if (targetApp) {
        homeScreen.classList.remove('active');
        targetApp.classList.add('active');
        currentApp = appName;
        
        if (appName === 'tetris') initTetris();
        if (appName === 'camera') resetCamera();
    }
}

function goHome() {
    if (!currentApp) return;
    
    const currentEl = document.getElementById(`${currentApp}-app`);
    const homeScreen = document.getElementById('home-screen');
    
    if (currentEl) {
        currentEl.classList.remove('active');
        if (currentApp === 'whatsapp') closeChatRoom();
        if (currentApp === 'tetris') pauseTetris();
    }
    
    homeScreen.classList.add('active');
    currentApp = null;
}

// --- WhatsApp Logic ---
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

// --- Camera Logic ---
function resetCamera() {
    const display = document.querySelector('.photo-display');
    display.innerHTML = '<div style="color:white; text-align:center; margin-top:100px;">Tap Shutter Button</div>';
    const btn = document.getElementById('shutter-trigger');
    btn.onclick = startPhotoSequence;
}

function startPhotoSequence() {
    const display = document.querySelector('.photo-display');
    const btn = document.getElementById('shutter-trigger');
    btn.onclick = null; 
    display.innerHTML = ''; 
    
    // Flash Effect
    const flash = document.createElement('div');
    flash.style.position = 'absolute';
    flash.style.top = '0'; flash.style.left = '0';
    flash.style.width = '100%'; flash.style.height = '100%';
    flash.style.background = 'white';
    flash.style.zIndex = '100';
    flash.style.transition = 'opacity 0.2s';
    document.querySelector('.camera-viewport').appendChild(flash);
    
    let photoIndex = 0;

    function captureNext() {
        if (photoIndex >= photos.length) {
            const doneText = document.createElement('div');
            doneText.style.color = 'white';
            doneText.style.textAlign = 'center';
            doneText.style.marginTop = '20px';
            doneText.innerHTML = 'Happy Birthday Mika! 🎂';
            display.appendChild(doneText);
            btn.onclick = resetCamera;
            return;
        }
        
        flash.style.opacity = '1';
        setTimeout(() => flash.style.opacity = '0', 100);
        
        const data = photos[photoIndex];
        const wrapper = document.createElement('div');
        wrapper.className = 'photo-frame';
        wrapper.innerHTML = `
            <img src="${data.image}" onerror="this.src='https://via.placeholder.com/300x400/ccc/333?text=No+Image'">
            <div class="photo-overlay-text">${data.text}</div>
        `;
        
        display.appendChild(wrapper);
        display.scrollTop = display.scrollHeight;
        
        photoIndex++;
        setTimeout(captureNext, 1500);
    }
    
    captureNext();
}

// --- Spotify Logic ---
document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', function() {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
    });
});

// --- Tetris Logic ---
function initTetris() {
    const canvas = document.getElementById('tetris-canvas');
    const container = document.querySelector('.tetris-game-container');
    
    const width = container.clientWidth - 40;
    const height = container.clientHeight - 20;
    
    canvas.width = width;
    canvas.height = height;
    
    const blockSize = Math.floor(height / 20);
    
    if (!tetrisGame) {
        tetrisGame = {
            ctx: canvas.getContext('2d'),
            cols: 10, rows: 20,
            board: [],
            blockSize: blockSize,
            score: 0, level: 1,
            running: false,
            current: null
        };
        resetTetris();
    } else {
        tetrisGame.blockSize = blockSize;
        tetrisGame.running = true;
        loopTetris();
    }
}

function resetTetris() {
    for (let r = 0; r < 20; r++) {
        tetrisGame.board[r] = [];
        for (let c = 0; c < 10; c++) {
            tetrisGame.board[r][c] = 0;
        }
    }
    tetrisGame.score = 0;
    document.getElementById('score').textContent = '0';
    tetrisGame.running = true;
    tetrisGame.current = newPiece();
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
    return {
        tetromino: PIECES[r][0],
        color: PIECES[r][1],
        x: 3, y: -2
    };
}

let dropStart = Date.now();
function loopTetris() {
    if (!tetrisGame.running) return;
    
    let now = Date.now();
    let delta = now - dropStart;
    if (delta > (1000 - (tetrisGame.level * 50))) {
        moveDown();
        dropStart = Date.now();
    }
    
    drawTetris();
    requestAnimationFrame(loopTetris);
}

function drawTetris() {
    const { ctx, blockSize, board, current } = tetrisGame;
    const canvas = document.getElementById('tetris-canvas');
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for(let r=0; r<20; r++){
        for(let c=0; c<10; c++){
            if(board[r][c]){
                drawBlock(c, r, board[r][c]);
            }
        }
    }
    
    if(current){
        for(let r=0; r<current.tetromino.length; r++){
            for(let c=0; c<current.tetromino[r].length; c++){
                if(current.tetromino[r][c]){
                    drawBlock(current.x + c, current.y + r, current.color);
                }
            }
        }
    }
}

function drawBlock(x, y, color) {
    const { ctx, blockSize } = tetrisGame;
    ctx.fillStyle = color;
    ctx.fillRect(x*blockSize, y*blockSize, blockSize, blockSize);
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x*blockSize, y*blockSize, blockSize, blockSize);
}

function moveDown() {
    if(!collision(0, 1, tetrisGame.current.tetromino)) {
        tetrisGame.current.y++;
    } else {
        lock();
        tetrisGame.current = newPiece();
        if(collision(0, 0, tetrisGame.current.tetromino)){
            tetrisGame.running = false;
            openModal('game-over-modal');
        }
    }
}

function moveLeft() {
    if(!collision(-1, 0, tetrisGame.current.tetromino)) tetrisGame.current.x--;
}
function moveRight() {
    if(!collision(1, 0, tetrisGame.current.tetromino)) tetrisGame.current.x++;
}
function rotate() {
    let nextPattern = tetrisGame.current.tetromino[0].map((val, index) => 
        tetrisGame.current.tetromino.map(row => row[index]).reverse());
    if(!collision(0, 0, nextPattern)) tetrisGame.current.tetromino = nextPattern;
}

function collision(x, y, piece) {
    for(let r=0; r<piece.length; r++){
        for(let c=0; c<piece[r].length; c++){
            if(!piece[r][c]) continue;
            let newX = tetrisGame.current.x + c + x;
            let newY = tetrisGame.current.y + r + y;
            if(newX < 0 || newX >= 10 || newY >= 20) return true;
            if(newY < 0) continue;
            if(tetrisGame.board[newY][newX]) return true;
        }
    }
    return false;
}

function lock() {
    for(let r=0; r<tetrisGame.current.tetromino.length; r++){
        for(let c=0; c<tetrisGame.current.tetromino[r].length; c++){
            if(!tetrisGame.current.tetromino[r][c]) continue;
            if(tetrisGame.current.y + r >= 0){
                tetrisGame.board[tetrisGame.current.y + r][tetrisGame.current.x + c] = tetrisGame.current.color;
            }
        }
    }
    let lines = 0;
    for(let r=0; r<20; r++){
        let full = true;
        for(let c=0; c<10; c++) if(!tetrisGame.board[r][c]) full = false;
        if(full){
            lines++;
            tetrisGame.board.splice(r, 1);
            tetrisGame.board.unshift(new Array(10).fill(0));
        }
    }
    if(lines > 0) {
        tetrisGame.score += lines * 100;
        document.getElementById('score').textContent = tetrisGame.score;
    }
}

document.getElementById('left-btn').addEventListener('click', moveLeft);
document.getElementById('right-btn').addEventListener('click', moveRight);
document.getElementById('down-btn').addEventListener('click', moveDown);
document.getElementById('rotate-btn').addEventListener('click', rotate);

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
