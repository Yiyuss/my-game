const startBtn = document.getElementById('start-btn');
const player = document.getElementById('player');
const enemy = document.getElementById('enemy');
const scoreBoard = document.getElementById('score-board');
const timeBoard = document.getElementById('time-board');
const videoOverlay = document.getElementById('video-overlay');
const endVideo = document.getElementById('end-video');

let gameRunning = false;
let score = 0;
let time = 0;
let playerSpeed = 10;
let enemySpeed = 5;
let gameInterval;
let timeInterval;

function startGame() {
  score = 0;
  time = 0;
  updateScore();
  updateTime();
  resetPositions();
  gameRunning = true;

  gameInterval = setInterval(updateGame, 50);
  timeInterval = setInterval(() => {
    time++;
    updateTime();
  }, 1000);
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  gameRunning = false;
  score = 0;
  time = 0;
  updateScore();
  updateTime();
  resetPositions();
}

function updateGame() {
  if (!gameRunning) return;

  let enemyTop = parseInt(enemy.style.top);
  enemyTop += enemySpeed;
  enemy.style.top = enemyTop + 'px';

  if (enemyTop > 576) {
    score++;
    updateScore();
    resetEnemy();
  }

  if (isColliding(player, enemy)) {
    showVideo();
  }
}

function updateScore() {
  scoreBoard.innerText = '分數: ' + score;
}

function updateTime() {
  timeBoard.innerText = '時間: ' + time;
}

function resetPositions() {
  player.style.left = '487px';
  player.style.top = '500px';
  resetEnemy();
}

function resetEnemy() {
  enemy.style.left = Math.floor(Math.random() * (1024 - 50)) + 'px';
  enemy.style.top = '-50px';
}

function isColliding(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.top > bRect.bottom ||
    aRect.bottom < bRect.top ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  );
}

function showVideo() {
  endVideo.src = 'https://www.youtube.com/embed/Qybud8_paik?autoplay=1&mute=1';
  videoOverlay.style.display = 'flex';
  gameRunning = false;

  setTimeout(() => {
    videoOverlay.style.display = 'none';
    resetGame();
    endVideo.src = '';
  }, 9000);
}

document.addEventListener('keydown', (e) => {
  if (!gameRunning) return;

  let left = parseInt(player.style.left);
  if (e.key === 'ArrowLeft' && left > 0) {
    player.style.left = left - playerSpeed + 'px';
  } else if (e.key === 'ArrowRight' && left < 1024 - 50) {
    player.style.left = left + playerSpeed + 'px';
  }
});

startBtn.addEventListener('click', startGame);
