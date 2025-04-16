const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const video = document.getElementById("game-video");

let playerImage = new Image();
playerImage.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/01.png";

let enemyImage = new Image();
enemyImage.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png";

let player = { x: 100, y: 100, width: 50, height: 50 };
let enemies = [];
let keys = {};
let isGameRunning = false;
let targetPos = null; // for mouse move

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

document.addEventListener("keydown", e => { keys[e.key] = true; });
document.addEventListener("keyup", e => { keys[e.key] = false; });

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  targetPos = {
    x: e.clientX - rect.left - player.width / 2,
    y: e.clientY - rect.top - player.height / 2
  };
});

function movePlayer() {
  const speed = 4;
  if (keys["ArrowUp"] || keys["w"]) player.y -= speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += speed;

  if (targetPos) {
    const dx = targetPos.x - player.x;
    const dy = targetPos.y - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 1) {
      player.x += dx / dist * speed;
      player.y += dy / dist * speed;
    } else {
      targetPos = null;
    }
  }

  player.x = Math.max(0, Math.min(player.x, canvasWidth - player.width));
  player.y = Math.max(0, Math.min(player.y, canvasHeight - player.height));
}

function spawnEnemy() {
  const e = {
    x: Math.random() * (canvasWidth - 50),
    y: Math.random() * (canvasHeight - 50),
    width: 50,
    height: 50,
    speed: 1 + Math.random()
  };
  for (let other of enemies) {
    if (isColliding(e, other)) return; // skip if overlap
  }
  enemies.push(e);
}

function moveEnemies() {
  for (let e of enemies) {
    const dx = player.x - e.x;
    const dy = player.y - e.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      e.x += dx / dist * e.speed;
      e.y += dy / dist * e.speed;
    }
  }
}

function preventOverlap() {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i];
      const b = enemies[j];
      if (isColliding(a, b)) {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const move = 0.5;
        a.x -= (dx / dist) * move;
        a.y -= (dy / dist) * move;
        b.x += (dx / dist) * move;
        b.y += (dy / dist) * move;
      }
    }
  }
}

function isColliding(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}

function draw() {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  for (let e of enemies) {
    ctx.drawImage(enemyImage, e.x, e.y, e.width, e.height);
  }
}

function gameLoop() {
  if (!isGameRunning) return;

  movePlayer();
  moveEnemies();
  preventOverlap();
  draw();

  for (let e of enemies) {
    if (isColliding(player, e)) {
      handleCollision();
      return;
    }
  }

  requestAnimationFrame(gameLoop);
}

function handleCollision() {
  isGameRunning = false;
  video.style.display = "block";
  video.currentTime = 0;
  video.volume = 1;
  video.play();
}

video.onended = () => {
  video.style.display = "none";
  restartGame();
};

function restartGame() {
  player.x = 100;
  player.y = 100;
  enemies = [];
  for (let i = 0; i < 5; i++) spawnEnemy();
  isGameRunning = true;
  setInterval(() => {
    if (isGameRunning && enemies.length < 50) spawnEnemy();
  }, 2000);
  gameLoop();
}

startButton.onclick = () => {
  startButton.style.display = "none";
  restartGame();
};

window.onload = () => {
  video.style.display = "none";
  startButton.style.display = "block";
};
