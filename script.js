const player = document.getElementById("player");
const enemiesContainer = document.getElementById("enemies");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const videoOverlay = document.getElementById("video-overlay");
const cutscene = document.getElementById("cutscene");
const startBtn = document.getElementById("start-btn");

let score = 0;
let enemies = [];
let isGameRunning = false;
let speed = 2;
let keys = {};

const gameWidth = 1024;
const gameHeight = 576;

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

function resetGame() {
  score = 0;
  enemies = [];
  enemiesContainer.innerHTML = "";
  player.style.top = "50%";
  player.style.left = "50%";
  scoreDisplay.textContent = score;
  timerDisplay.textContent = 0;  // 去除計時器
}

function movePlayer() {
  const step = 5;
  const rect = player.getBoundingClientRect();
  const containerRect = enemiesContainer.getBoundingClientRect();

  let top = player.offsetTop;
  let left = player.offsetLeft;

  if (keys["ArrowUp"] && top > 0) top -= step;
  if (keys["ArrowDown"] && top + player.offsetHeight < gameHeight) top += step;
  if (keys["ArrowLeft"] && left > 0) left -= step;
  if (keys["ArrowRight"] && left + player.offsetWidth < gameWidth) left += step;

  player.style.top = top + "px";
  player.style.left = left + "px";
}

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  let x = Math.random() * (gameWidth - 50);
  let y = Math.random() * (gameHeight - 50);

  enemy.style.left = x + "px";
  enemy.style.top = y + "px";
  enemiesContainer.appendChild(enemy);

  enemies.push({
    el: enemy,
    x,
    y,
    dx: 0,
    dy: 0
  });
}

function moveEnemies() {
  enemies.forEach(enemy => {
    const dx = player.offsetLeft - enemy.x;
    const dy = player.offsetTop - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const direction = distance === 0 ? { x: 0, y: 0 } : { x: dx / distance, y: dy / distance };
    
    enemy.dx = direction.x * speed;
    enemy.dy = direction.y * speed;

    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    enemy.el.style.left = enemy.x + "px";
    enemy.el.style.top = enemy.y + "px";
  });
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  for (let enemy of enemies) {
    const enemyRect = enemy.el.getBoundingClientRect();
    if (
      playerRect.left < enemyRect.right &&
      playerRect.right > enemyRect.left &&
      playerRect.top < enemyRect.bottom &&
      playerRect.bottom > enemyRect.top
    ) {
      endGame();
      return;
    }
  }
}

function updateGame() {
  movePlayer();
  moveEnemies();
  checkCollision();
}

function startGame() {
  resetGame();
  isGameRunning = true;
  videoOverlay.style.display = "none";

  gameInterval = setInterval(updateGame, 20);
  spawnInterval = setInterval(spawnEnemy, 2000);
}

function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);

  videoOverlay.style.display = "flex";
  cutscene.currentTime = 0;
  cutscene.play();

  cutscene.onended = () => {
    startGame(); // 自動重新開始
  };
}

startBtn.addEventListener("click", () => {
  if (!isGameRunning) startGame();
});
