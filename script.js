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

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  startGame();
});

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
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
  enemy.style.left = Math.random() * 750 + "px";
  enemy.style.top = Math.random() * 550 + "px";
  gameContainer.appendChild(enemy);
  enemies.push({ element: enemy, x: parseFloat(enemy.style.left), y: parseFloat(enemy.style.top) });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = playerX - enemy.x;
    const dy = playerY - enemy.y;
    const dist = Math.hypot(dx, dy);
    const avoidVector = { x: 0, y: 0 };

    enemies.forEach(other => {
      if (enemy === other) return;
      const ox = other.x - enemy.x;
      const oy = other.y - enemy.y;
      const odist = Math.hypot(ox, oy);
      if (odist < 50) {
        avoidVector.x -= ox / odist;
        avoidVector.y -= oy / odist;
      }
    });

    let vx = (dx / dist) * enemySpeed + avoidVector.x;
    let vy = (dy / dist) * enemySpeed + avoidVector.y;
    const len = Math.hypot(vx, vy);
    vx = (vx / len) * enemySpeed;
    vy = (vy / len) * enemySpeed;

    enemy.x += vx;
    enemy.y += vy;

    enemy.x = Math.max(0, Math.min(enemy.x, 750));
    enemy.y = Math.max(0, Math.min(enemy.y, 550));

    enemy.element.style.left = enemy.x + "px";
    enemy.element.style.top = enemy.y + "px";

    if (Math.abs(playerX - enemy.x) < 40 && Math.abs(playerY - enemy.y) < 40) {
      playCutscene();
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
  enemies.forEach(e => e.element.remove());
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
