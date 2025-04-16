const player = document.getElementById("player");
const enemiesContainer = document.getElementById("enemies");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const videoOverlay = document.getElementById("video-overlay");
const cutscene = document.getElementById("cutscene");
const startBtn = document.getElementById("start-btn");

let score = 0;
let timer = 0;
let gameInterval;
let spawnInterval;
let timerInterval;
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
  timer = 0;
  speed = 2;
  enemies = [];
  enemiesContainer.innerHTML = "";
  player.style.top = "50%";
  player.style.left = "50%";
  scoreDisplay.textContent = score;
  timerDisplay.textContent = timer;
}

function movePlayer() {
  const step = 5;
  let top = player.offsetTop;
  let left = player.offsetLeft;

  if (keys["ArrowUp"] && top > 0) top -= step;
  if (keys["ArrowDown"] && top + 50 < gameHeight) top += step;
  if (keys["ArrowLeft"] && left > 0) left -= step;
  if (keys["ArrowRight"] && left + 50 < gameWidth) left += step;

  player.style.top = top + "px";
  player.style.left = left + "px";
}

function spawnEnemy() {
  const enemy = document.createElement("div");
  enemy.classList.add("enemy");

  let x, y, tries = 0, overlap = true;

  while (overlap && tries < 100) {
    x = Math.random() * (gameWidth - 50);
    y = Math.random() * (gameHeight - 50);
    overlap = enemies.some(e => {
      const dx = e.x - x;
      const dy = e.y - y;
      return Math.sqrt(dx * dx + dy * dy) < 50;
    });
    tries++;
  }

  enemy.style.left = x + "px";
  enemy.style.top = y + "px";
  enemiesContainer.appendChild(enemy);

  enemies.push({
    el: enemy,
    x, y,
    dx: (Math.random() - 0.5) * speed,
    dy: (Math.random() - 0.5) * speed
  });
}

function moveEnemies() {
  enemies.forEach((enemy, i) => {
    enemy.x += enemy.dx;
    enemy.y += enemy.dy;

    if (enemy.x < 0 || enemy.x > gameWidth - 50) enemy.dx *= -1;
    if (enemy.y < 0 || enemy.y > gameHeight - 50) enemy.dy *= -1;

    for (let j = 0; j < enemies.length; j++) {
      if (i === j) continue;
      const other = enemies[j];
      const dx = enemy.x - other.x;
      const dy = enemy.y - other.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 50) {
        enemy.dx *= -1;
        enemy.dy *= -1;
      }
    }

    enemy.el.style.left = enemy.x + "px";
    enemy.el.style.top = enemy.y + "px";
  });
}

function checkCollision() {
  const playerRect = player.getBoundingClientRect();
  for (let enemy of enemies) {
    const rect = enemy.el.getBoundingClientRect();
    if (
      playerRect.left < rect.right &&
      playerRect.right > rect.left &&
      playerRect.top < rect.bottom &&
      playerRect.bottom > rect.top
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
  timerInterval = setInterval(() => {
    timer++;
    score++;
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timer;
    if (timer % 10 === 0) speed += 0.5;
  }, 1000);
}

function endGame() {
  isGameRunning = false;
  clearInterval(gameInterval);
  clearInterval(spawnInterval);
  clearInterval(timerInterval);

  videoOverlay.style.display = "flex";
  cutscene.currentTime = 0;
  cutscene.play();

  cutscene.onended = () => {
    startGame();
  };
}

startBtn.addEventListener("click", () => {
  startGame();
});
