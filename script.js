const player = document.getElementById("player");
const startButton = document.getElementById("startButton");
const cutscene = document.getElementById("cutscene");
const gameContainer = document.getElementById("gameContainer");

let enemies = [];
let keys = {};
let gameRunning = false;
let playerX = 100, playerY = 100;
const speed = 5;
const enemySpeed = 1.5;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  startGame();
});

function movePlayer() {
  if (keys["ArrowUp"]) playerY -= speed;
  if (keys["ArrowDown"]) playerY += speed;
  if (keys["ArrowLeft"]) playerX -= speed;
  if (keys["ArrowRight"]) playerX += speed;

  playerX = Math.max(0, Math.min(playerX, 750));
  playerY = Math.max(0, Math.min(playerY, 550));
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
}

function createEnemy() {
  const enemy = document.createElement("img");
  enemy.src = "https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png";
  enemy.className = "enemy";
  enemy.x = Math.random() * 750;
  enemy.y = Math.random() * 550;
  enemy.style.left = enemy.x + "px";
  enemy.style.top = enemy.y + "px";
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;
    const dist = Math.hypot(dx, dy);

    let avoidX = 0, avoidY = 0;
    enemies.forEach(other => {
      if (enemy === other) return;
      const ox = enemy.x - other.x;
      const oy = enemy.y - other.y;
      const odist = Math.hypot(ox, oy);
      if (odist < 50 && odist > 0) {
        avoidX += ox / odist;
        avoidY += oy / odist;
      }
    });

    let vx = dx / dist + avoidX;
    let vy = dy / dist + avoidY;
    const len = Math.hypot(vx, vy);
    vx = (vx / len) * enemySpeed;
    vy = (vy / len) * enemySpeed;

    enemy.x += vx;
    enemy.y += vy;
    enemy.x = Math.max(0, Math.min(enemy.x, 750));
    enemy.y = Math.max(0, Math.min(enemy.y, 550));
    enemy.style.left = enemy.x + "px";
    enemy.style.top = enemy.y + "px";

    if (Math.abs(playerX - enemy.x) < 40 && Math.abs(playerY - enemy.y) < 40) {
      if (gameRunning) playCutscene();
    }
  });
}

function gameLoop() {
  if (!gameRunning) return;
  movePlayer();
  moveEnemies();
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameRunning = true;
  playerX = 100;
  playerY = 100;
  player.style.left = playerX + "px";
  player.style.top = playerY + "px";
  enemies.forEach(e => e.remove());
  enemies = [];
  for (let i = 0; i < 5; i++) createEnemy();
  requestAnimationFrame(gameLoop);
}

function playCutscene() {
  gameRunning = false;
  cutscene.currentTime = 0;
  cutscene.style.display = "block";
  cutscene.muted = false;
  cutscene.play();
  cutscene.onended = () => {
    cutscene.style.display = "none";
    startGame();
  };
}
