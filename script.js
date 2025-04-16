const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const timerDisplay = document.getElementById("timer");
const video = document.getElementById("video");

let player = {
    x: 100,
    y: 100,
    width: 50,
    height: 50,
    speed: 5,
};

let enemy = {
    x: 400,
    y: 300,
    width: 50,
    height: 50,
    speed: 2,
};

let keys = {};
let gameRunning = false;
let startTime;
let timerInterval;
let videoPlayed = false;

// 載入圖片
const playerImage = new Image();
playerImage.src = "角色01.png";

const enemyImage = new Image();
enemyImage.src = "敵人角色02.png";

// 監聽鍵盤操作
document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// 開始遊戲按鈕
startButton.addEventListener("click", () => {
    gameRunning = true;
    videoPlayed = false;

    player.x = 100;
    player.y = 100;
    enemy.x = 400;
    enemy.y = 300;

    startTime = Date.now();
    startButton.style.display = "none";
    video.style.display = "none";
    video.pause();
    video.currentTime = 0;

    timerInterval = setInterval(updateTimer, 1000);
    requestAnimationFrame(updateGame);
});

function updateTimer() {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    timerDisplay.textContent = `時間：${elapsedSeconds} 秒`;
}

function movePlayer() {
    if (keys["ArrowUp"]) player.y -= player.speed;
    if (keys["ArrowDown"]) player.y += player.speed;
    if (keys["ArrowLeft"]) player.x -= player.speed;
    if (keys["ArrowRight"]) player.x += player.speed;

    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}

function moveEnemy() {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        enemy.x += (dx / distance) * enemy.speed;
        enemy.y += (dy / distance) * enemy.speed;
    }
}

function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawEnemy() {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
}

function isColliding(a, b) {
    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function updateGame() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    moveEnemy();

    drawPlayer();
    drawEnemy();

    if (isColliding(player, enemy) && !videoPlayed) {
        videoPlayed = true;
        gameRunning = false;
        clearInterval(timerInterval);

        video.style.display = "block";
        video.play();

        startButton.style.display = "block";
        startButton.textContent = "重新開始";
        return;
    }

    requestAnimationFrame(updateGame);
}
