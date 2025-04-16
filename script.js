const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("start-button");
const video = document.getElementById("game-video");

let player = {
  x: 100,
  y: 100,
  width: 50,
  height: 50,
  image: new Image()
};
player.image.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/01.png";

let enemies = [];
let enemyImage = new Image();
enemyImage.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png";

let isGameRunning = false;
let keys = {};

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const targetX = e.clientX - rect.left - player.width / 2;
  const targetY = e.clientY - rect.top - player.height / 2;
  player.x = targetX;
  player.y = targetY;
});

function spawnEnemy() {
  let enemy = {
    x: Math.random() * (canvasWidth - 50),
    y: Math.random() * (canvasHeight - 50),
    width: 50,
    height: 50,
    speed: 1 + Math.random() * 1.5
  };

  // 避免初始重疊
  for (let e of enemies) {
    if (isColliding(enemy, e)) return;
  }

  enemies.push(enemy);
}

function movePlayer() {
  const speed = 4;
  if (keys["ArrowUp"] || keys["w"]) player.y -= speed;
  if (keys["ArrowDown"] || keys["s"]) player.y += speed;
  if (keys["ArrowLeft"] || keys["a"]) player.x -= speed;
  if (keys["ArrowRight"] || keys["d"]) player.x += speed;

  // 邊界限制
  player.x = Math.max(0, Math.min(player.x, canvasWidth - player.width));
  player.y = Math.max(0, Math.min(player.y, canvasHeight - player.height));
}

function moveEnemies() {
  for (let enemy of enemies) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0) {
      enemy.x += (dx / dist) * enemy.speed;
      enemy.y += (dy / dist) * enemy.speed;
    }
  }
}

function preventEnemyOverlap() {
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const e1 = enemies[i];
      const e2 = enemies[j];
      if (isColliding(e1, e2)) {
        const dx = e2.x - e1.x;
        const dy = e2.y - e1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const overlap = 0.5;

        e1.x -= (dx / dist) * overlap;
        e1.y -= (dy / dist) * overlap;
        e2.x += (dx / dist) * overlap;
        e2.y += (dy / dist) * overlap;
      }
    }
  }
}

function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function drawPlayer() {
  ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
  for (let enemy of enemies) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
  }
}

function gameLoop() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  moveEnemies();
  preventEnemyOverlap();
  drawPlayer();
  drawEnemies();

  for (let enemy of enemies) {
    if (isColliding(player, enemy)) {
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
  startGame();
};

function startGame() {
  player.x = 100;
  player.y = 100;
  enemies = [];
  isGameRunning = true;

  for (let i = 0; i < 5; i++) {
    spawnEnemy();
  }

  setInterval(() => {
    if (isGameRunning && enemies.length < 50) {
      spawnEnemy();
    }
  }, 2000);

  gameLoop();
}

startButton.onclick = () => {
  startButton.style.display = "none";
  startGame();
};

window.onload = () => {
  video.style.display = "none";
  startButton.style.display = "block";
};
