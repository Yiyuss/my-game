const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const startBtn = document.getElementById("start-btn");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const videoOverlay = document.getElementById("video-overlay");
const endVideo = document.getElementById("end-video");

let playerX = 100;
let playerY = 100;
let enemyX = 400;
let enemyY = 300;
let score = 0;
let timeLeft = 30;
let gameRunning = false;
let gameLoopInterval;
let countdownInterval;

function updatePositions() {
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
  enemy.style.left = enemyX + "px";
  enemy.style.top = enemyY + "px";
}

function moveEnemy() {
  const dx = playerX - enemyX;
  const dy = playerY - enemyY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > 0) {
    enemyX += (dx / distance) * 2;
    enemyY += (dy / distance) * 2;
  }
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  const enemyRect = enemy.getBoundingClientRect();

  return !(
    playerRect.right < enemyRect.left ||
    playerRect.left > enemyRect.right ||
    playerRect.bottom < enemyRect.top ||
    playerRect.top > enemyRect.bottom
  );
}

function gameLoop() {
  if (!gameRunning) return;

  moveEnemy();
  updatePositions();

  if (checkCollision()) {
    clearInterval(gameLoopInterval);
    clearInterval(countdownInterval);
    showVideo();
  }
}

function countdown() {
  if (timeLeft > 0) {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
  } else {
    clearInterval(gameLoopInterval);
    clearInterval(countdownInterval);
    showVideo();
  }
}

function showVideo() {
  endVideo.src = "https://www.youtube.com/embed/Qybud8_paik?autoplay=1&rel=0";
  videoOverlay.style.display = "flex";
  gameRunning = false;

  setTimeout(() => {
    videoOverlay.style.display = "none";
    endVideo.src = "";
    resetGame();
  }, 9000);
}

function resetGame() {
  playerX = 100;
  playerY = 100;
  enemyX = 400;
  enemyY = 300;
  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  updatePositions();
}

document.addEventListener("keydown", (event) => {
  if (!gameRunning) return;

  const step = 10;

  if (event.key === "ArrowUp" && playerY - step >= 0) playerY -= step;
  if (event.key === "ArrowDown" && playerY + step <= 526) playerY += step;
  if (event.key === "ArrowLeft" && playerX - step >= 0) playerX -= step;
  if (event.key === "ArrowRight" && playerX + step <= 974) playerX += step;

  score++;
  scoreDisplay.textContent = score;
  updatePositions();
});

startBtn.addEventListener("click", () => {
  resetGame();
  gameRunning = true;
  gameLoopInterval = setInterval(gameLoop, 30);
  countdownInterval = setInterval(countdown, 1000);
});
