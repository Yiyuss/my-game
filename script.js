const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("gameVideo");
const startButton = document.getElementById("startButton");

const gameWidth = canvas.width;
const gameHeight = canvas.height;

const playerImg = new Image();
playerImg.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/01.png";

const enemyImg = new Image();
enemyImg.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png";

let playerX = gameWidth / 2 - 25;
let playerY = gameHeight / 2 - 25;
let playerSpeed = 5;

let enemies = [];
let enemySpeed = 1.5;
let lastEnemySpawnTime = 0;
let spawnInterval = 3000;

let score = 0;
let gameRunning = false;
let keys = {};

function drawPlayer() {
  ctx.drawImage(playerImg, playerX, playerY, 50, 50);
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.drawImage(enemyImg, enemy.x, enemy.y, 50, 50);
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    let dx = playerX - enemy.x;
    let dy = playerY - enemy.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * enemySpeed;
      enemy.y += (dy / dist) * enemySpeed;
    }
  });
}

function spawnEnemy() {
  const positions = [
    { x: 0, y: 0 },
    { x: gameWidth - 50, y: 0 },
    { x: 0, y: gameHeight - 50 },
    { x: gameWidth - 50, y: gameHeight - 50 }
  ];
  const pos = positions[Math.floor(Math.random() * positions.length)];
  enemies.push({ x: pos.x, y: pos.y });
}

function checkCollisions() {
  for (let enemy of enemies) {
    if (
      playerX < enemy.x + 50 &&
      playerX + 50 > enemy.x &&
      playerY < enemy.y + 50 &&
      playerY + 50 > enemy.y
    ) {
      endGame();
      return;
    }
  }
}

function updateScore() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("分數：" + score, 10, 30);
}

function animate() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, gameWidth, gameHeight);

  drawPlayer();
  drawEnemies();
  moveEnemies();
  checkCollisions();
  updateScore();

  if (Date.now() - lastEnemySpawnTime > spawnInterval) {
    spawnEnemy();
    lastEnemySpawnTime = Date.now();
  }

  score++;
  requestAnimationFrame(animate);
}

startButton.addEventListener("click", function () {
  startButton.style.display = "none";
  score = 0;
  gameRunning = true;
  playerX = gameWidth / 2 - 25;
  playerY = gameHeight / 2 - 25;
  enemies = [];
  video.pause();
  video.currentTime = 0;
  video.style.display = "none";
  spawnEnemy();
  lastEnemySpawnTime = Date.now();
  updateScore();
  animate();
});

function endGame() {
  gameRunning = false;
  video.style.display = "block";
  video.play();
  video.onended = () => {
    startButton.style.display = "block";
    enemies = [];
  };
}

document.addEventListener("keydown", e => {
  keys[e.key] = true;
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

function handlePlayerMovement() {
  if (keys["ArrowUp"] || keys["w"]) playerY -= playerSpeed;
  if (keys["ArrowDown"] || keys["s"]) playerY += playerSpeed;
  if (keys["ArrowLeft"] || keys["a"]) playerX -= playerSpeed;
  if (keys["ArrowRight"] || keys["d"]) playerX += playerSpeed;
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  playerX = x - 25;
  playerY = y - 25;
});

setInterval(() => {
  if (gameRunning) {
    handlePlayerMovement();
  }
}, 1000 / 60);
