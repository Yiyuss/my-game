const player = document.getElementById("player");
const enemy = document.getElementById("enemy");
const gameArea = document.getElementById("gameArea");
const startButton = document.getElementById("startButton");
const timerElement = document.getElementById("timer");
const cutscene = document.getElementById("cutscene");

let playerX = 100;
let playerY = 100;
let enemyX = 600;
let enemyY = 300;
let gameRunning = false;
let timer = 0;
let interval;

function startGame() {
  gameRunning = true;
  timer = 0;
  playerX = 100;
  playerY = 100;
  enemyX = 600;
  enemyY = 300;
  cutscene.classList.add("hidden");
  player.style.display = "block";
  enemy.style.display = "block";
  startButton.style.display = "none";
  interval = setInterval(() => {
    timer++;
    timerElement.textContent = `時間：${timer}秒`;
  }, 1000);
  requestAnimationFrame(updateGame);
}

function updateGame() {
  if (!gameRunning) return;

  player.style.left = playerX + "px";
  player.style.top = playerY + "px";

  enemyX -= 2;
  if (enemyX < -80) enemyX = 800;
  enemy.style.left = enemyX + "px";
  enemy.style.top = enemyY + "px";

  if (checkCollision(player, enemy)) {
    endGame();
    return;
  }

  requestAnimationFrame(updateGame);
}

function endGame() {
  gameRunning = false;
  clearInterval(interval);
  cutscene.classList.remove("hidden");
  cutscene.currentTime = 0;
  cutscene.play();
}

function checkCollision(a, b) {
  const aRect = a.getBoundingClientRect();
  const bRect = b.getBoundingClientRect();
  return !(
    aRect.right < bRect.left ||
    aRect.left > bRect.right ||
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom
  );
}

document.addEventListener("keydown", (e) => {
  if (!gameRunning) return;
  const step = 10;
  if (e.key === "ArrowUp") playerY -= step;
  if (e.key === "ArrowDown") playerY += step;
  if (e.key === "ArrowLeft") playerX -= step;
  if (e.key === "ArrowRight") playerX += step;
});

startButton.addEventListener("click", startGame);
