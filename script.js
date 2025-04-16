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
let collisionDetected = false;

function spawnEnemy() {
  let tries = 0;
  while (tries < 100) {
    let x = Math.random() * (canvas.width - 50);
    let y = Math.random() * (canvas.height - 50);
    let overlap = enemies.some(e => Math.abs(e.x - x) < 50 && Math.abs(e.y - y) < 50);
    if (!overlap) {
      enemies.push({ x, y, size: 50 });
      break;
    }
    tries++;
  }
}

function resetGame() {
  player = { x: 400, y: 300, size: 50, speed: 5 };
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

  // 玩家控制
  if (keys["ArrowUp"]) player.y -= player.speed;
  if (keys["ArrowDown"]) player.y += player.speed;
  if (keys["ArrowLeft"]) player.x -= player.speed;
  if (keys["ArrowRight"]) player.x += player.speed;

  // 邊界限制
  player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

  // 敵人碰撞玩家
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

  // 敵人追蹤玩家
  for (let e of enemies) {
    let dx = player.x - e.x;
    let dy = player.y - e.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      let moveX = (dx / dist) * 1.5;
      let moveY = (dy / dist) * 1.5;

      let nextX = e.x + moveX;
      let nextY = e.y + moveY;

      let overlap = enemies.some(other =>
        other !== e &&
        Math.abs(other.x - nextX) < 50 &&
        Math.abs(other.y - nextY) < 50
      );

      if (!overlap) {
        e.x = nextX;
        e.y = nextY;
      }
    }
  }

  if (enemies.length < 20 && Math.random() < 0.01) spawnEnemy();
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

window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false);

window.onload = () => {
  resetGame();
  gameLoop();
};
