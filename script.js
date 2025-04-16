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

startBtn.addEventListener('click', () => {
  resetGame();
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60);
  spawnEnemy();
  enemyInterval = setInterval(spawnEnemy, 5000);
});

document.addEventListener('click', (e) => {
  if (!gameRunning || isVideoPlaying()) return;

  const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
  targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
  targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
});

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
  const enemyObj = {
    pos: getRandomPosition(),
    speed: 2,
    element: document.createElement('div')
  };

  enemyObj.element.classList.add('enemy');
  enemyObj.element.style.position = 'absolute';
  enemyObj.element.style.width = '50px';
  enemyObj.element.style.height = '50px';
  enemyObj.element.style.backgroundImage = 'url("02.png")';
  enemyObj.element.style.backgroundSize = 'cover';
  enemyObj.element.style.backgroundRepeat = 'no-repeat';
  document.getElementById('game-container').appendChild(enemyObj.element);

  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  enemies.push(enemyObj);

  setInterval(() => moveEnemy(enemyObj), 30);
}

function getRandomPosition() {
  const minDist = 60;
  let newPos;
  let overlap = true;

  while (overlap) {
    overlap = false;
    newPos = {
      x: Math.random() * (1024 - 50),
      y: Math.random() * (576 - 50)
    };

    for (let i = 0; i < enemies.length; i++) {
      let dist = Math.sqrt(
        Math.pow(newPos.x - enemies[i].pos.x, 2) + Math.pow(newPos.y - enemies[i].pos.y, 2)
      );
      if (dist < minDist) {
        overlap = true;
        break;
      }
    }
  }

  return newPos;
}

function moveEnemy(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return;

  let dx = playerPos.x - enemyObj.pos.x;
  let dy = playerPos.y - enemyObj.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemyObj.speed;

  if (dist > speed) {
    enemyObj.pos.x += (dx / dist) * speed;
    enemyObj.pos.y += (dy / dist) * speed;
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';
  }

  avoidEnemyCollision(enemyObj);
  checkCollision(enemyObj);
}

function avoidEnemyCollision(enemyObj) {
  const minDist = 60;

  enemies.forEach(otherEnemy => {
    if (enemyObj === otherEnemy) return;

    let dx = enemyObj.pos.x - otherEnemy.pos.x;
    let dy = enemyObj.pos.y - otherEnemy.pos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < minDist) {
      let angle = Math.atan2(dy, dx);
      let offsetX = Math.cos(angle) * (minDist - dist);
      let offsetY = Math.sin(angle) * (minDist - dist);

      enemyObj.pos.x += offsetX;
      enemyObj.pos.y += offsetY;
      enemyObj.element.style.left = enemyObj.pos.x + 'px';
      enemyObj.element.style.top = enemyObj.pos.y + 'px';
    }
  });
}

function checkCollision(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return;

  let playerRect = player.getBoundingClientRect();
  let enemyRect = enemyObj.element.getBoundingClientRect();

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
  timeEl.textContent = time;
  score++;
  scoreEl.textContent = score;

  movePlayer();
}

function showVideo() {
  endVideo.currentTime = 0;
  videoOverlay.style.display = 'flex';
  gameRunning = false;

  setTimeout(() => {
    videoOverlay.style.display = 'none';
    resetGame();
  }, 9000);
}

function resetGame() {
  clearInterval(gameInterval);

  score = 0;
  time = 0;
  scoreEl.textContent = score;
  timeEl.textContent = time;

  playerPos.x = 200;
  playerPos.y = 200;
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';

  enemies.forEach(enemyObj => enemyObj.element.remove());
  enemies = [];

  spawnEnemy();

  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60);
}

function isVideoPlaying() {
  return videoOverlay.style.display === 'flex';
}
