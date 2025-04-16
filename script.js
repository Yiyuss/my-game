const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const videoOverlay = document.getElementById('video-overlay');
const endVideo = document.getElementById('end-video');
const player = document.getElementById('player');
const hitSound = document.getElementById('hit-sound');

let score = 0;
let time = 0;
let playerPos = { x: 200, y: 200 };
let enemies = [];
let gameInterval;
let enemyInterval;
let gameRunning = false;
let targetPos = { x: playerPos.x, y: playerPos.y };

startBtn.addEventListener('click', startGame);

document.addEventListener('click', (e) => {
  if (!gameRunning || isVideoPlaying()) return;
  const rect = document.getElementById('game-container').getBoundingClientRect();
  targetPos.x = e.clientX - rect.left - player.offsetWidth / 2;
  targetPos.y = e.clientY - rect.top - player.offsetHeight / 2;
});

function startGame() {
  resetGame();
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60);
  spawnEnemy();
  enemyInterval = setInterval(spawnEnemy, 5000);
}

function resetGame() {
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  enemies.forEach(e => e.element.remove());
  enemies = [];
  score = 0;
  time = 0;
  scoreEl.textContent = score;
  timeEl.textContent = time;
  playerPos = { x: 200, y: 200 };
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60);
  enemyInterval = setInterval(spawnEnemy, 5000);
}

function movePlayer() {
  let dx = targetPos.x - playerPos.x;
  let dy = targetPos.y - playerPos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = 4;

  if (dist > speed) {
    playerPos.x += (dx / dist) * speed;
    playerPos.y += (dy / dist) * speed;
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  }
}

function spawnEnemy() {
  const enemy = {
    pos: getRandomPosition(),
    speed: 2,
    element: document.createElement('div')
  };

  enemy.element.classList.add('enemy');
  document.getElementById('game-container').appendChild(enemy.element);
  enemy.element.style.left = enemy.pos.x + 'px';
  enemy.element.style.top = enemy.pos.y + 'px';
  enemies.push(enemy);

  enemy.moveInterval = setInterval(() => moveEnemy(enemy), 30);
}

function getRandomPosition() {
  const minDist = 60;
  let newPos, overlap;
  do {
    newPos = {
      x: Math.random() * (1024 - 50),
      y: Math.random() * (576 - 50)
    };
    overlap = enemies.some(e => {
      let dx = newPos.x - e.pos.x;
      let dy = newPos.y - e.pos.y;
      return Math.sqrt(dx * dx + dy * dy) < minDist;
    });
  } while (overlap);
  return newPos;
}

function moveEnemy(enemy) {
  if (!gameRunning || isVideoPlaying()) return;
  let dx = playerPos.x - enemy.pos.x;
  let dy = playerPos.y - enemy.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemy.speed;

  if (dist > speed) {
    enemy.pos.x += (dx / dist) * speed;
    enemy.pos.y += (dy / dist) * speed;
    enemy.element.style.left = enemy.pos.x + 'px';
    enemy.element.style.top = enemy.pos.y + 'px';
  }

  avoidEnemyCollision(enemy);
  checkCollision(enemy);
}

function avoidEnemyCollision(current) {
  const minDist = 60;
  enemies.forEach(other => {
    if (other === current) return;
    let dx = current.pos.x - other.pos.x;
    let dy = current.pos.y - other.pos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < minDist && dist > 0) {
      let angle = Math.atan2(dy, dx);
      let offsetX = Math.cos(angle) * (minDist - dist);
      let offsetY = Math.sin(angle) * (minDist - dist);
      current.pos.x += offsetX / 2;
      current.pos.y += offsetY / 2;
      current.element.style.left = current.pos.x + 'px';
      current.element.style.top = current.pos.y + 'px';
    }
  });
}

function checkCollision(enemy) {
  if (!gameRunning || isVideoPlaying()) return;
  let playerRect = player.getBoundingClientRect();
  let enemyRect = enemy.element.getBoundingClientRect();

  if (
    playerRect.right > enemyRect.left &&
    playerRect.left < enemyRect.right &&
    playerRect.bottom > enemyRect.top &&
    playerRect.top < enemyRect.bottom
  ) {
    hitSound.play();
    showVideo();
  }
}

function updateGame() {
  if (!gameRunning || isVideoPlaying()) return;
  time++;
  score++;
  timeEl.textContent = time;
  scoreEl.textContent = score;
  movePlayer();
}

function showVideo() {
  endVideo.src = 'https://www.youtube.com/embed/Qybud8_paik?autoplay=1';
  videoOverlay.style.display = 'flex';
  gameRunning = false;
  setTimeout(() => {
    videoOverlay.style.display = 'none';
    endVideo.src = ''; // 停止影片播放
    startGame(); // 自動重新開始
  }, 9000);
}

function isVideoPlaying() {
  return videoOverlay.style.display === 'flex';
}
