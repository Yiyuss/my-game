const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("cutscene");
let playerImg = new Image();
playerImg.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/01.png";
let enemyImg = new Image();
enemyImg.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png";

let player = { x: 400, y: 300, size: 50, speed: 5 };
let enemies = [];
let keys = {};
let gameRunning = false;
let enemySpawnInterval;
let collisionDetected = false;

function spawnEnemy() {
  let x = Math.random() * (canvas.width - 50);
  let y = Math.random() * (canvas.height - 50);
  let dx = 0;
  let dy = 0;

  let tries = 0;
  while (tries < 100) {
    let overlap = enemies.some(e =>
      Math.abs(e.x - x) < 50 && Math.abs(e.y - y) < 50
    );
    if (!overlap) break;
    x = Math.random() * (canvas.width - 50);
    y = Math.random() * (canvas.height - 50);
    tries++;
  }

  enemies.push({ x, y, size: 50, dx, dy });
}

function resetGame() {
  player.x = 400;
  player.y = 300;
  enemies = [];
  collisionDetected = false;
  for (let i = 0; i < 3; i++) spawnEnemy();
}

function playCutscene() {
  gameRunning = false;
  video.style.display = "block";
  video.currentTime = 0;
  video.muted = false;
  video.play();
}

video.onended = () => {
  video.style.display = "none";
  resetGame();
  gameRunning = true;
};

function update() {
  if (!gameRunning) return;

  // 控制玩家
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // 碰撞偵測
  for (let e of enemies) {
    if (
      player.x < e.x + e.size &&
      player.x + player.size > e.x &&
      player.y < e.y + e.size &&
      player.y + player.size > e.y
    ) {
      collisionDetected = true;
    }
  }

  if (collisionDetected) {
    playCutscene();
    return;
  }

  // 移動敵人（追蹤玩家）
  for (let e of enemies) {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      e.x += (dx / dist) * 1.5;
      e.y += (dy / dist) * 1.5;
    }
  }

  // 新增敵人（最多 20 個）
  if (enemies.length < 20 && Math.random() < 0.01) {
    spawnEnemy();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(playerImg, player.x, player.y, player.size, player.size);
  for (let e of enemies) {
    ctx.drawImage(enemyImg, e.x, e.y, e.size, e.size);
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

startBtn.addEventListener("click", () => {
  resetGame();
  gameRunning = true;
  startBtn.style.display = "none";
});

window.addEventListener("keydown", e => (keys[e.key] = true));
window.addEventListener("keyup", e => (keys[e.key] = false));

window.onload = () => {
  resetGame();
  gameLoop();
};
