const gameContainer = document.getElementById("game-container");
const startButton = document.getElementById("start-btn");
const cutscene = document.getElementById("cutscene");
const videoOverlay = document.getElementById("video-overlay");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");

let player;
let enemies = [];
let score = 0;
let time = 0;
let gameInterval;
let timeInterval;
let keys = {};
let gameRunning = false;

function createPlayer() {
  player = document.createElement("div");
  player.id = "player";
  player.style.left = "100px";
  player.style.top = "100px";
  gameContainer.appendChild(player);
}

function createEnemy() {
  const enemy = document.createElement("div");
  enemy.className = "enemy";
  let x, y, overlapping;
  do {
    x = Math.random() * (gameContainer.clientWidth - 50);
    y = Math.random() * (gameContainer.clientHeight - 50);
    overlapping = enemies.some(e => {
      const rect = e.getBoundingClientRect();
      return Math.abs(rect.left - x) < 50 && Math.abs(rect.top - y) < 50;
    });
  } while (overlapping);
  enemy.style.left = x + "px";
  enemy.style.top = y + "px";
  gameContainer.appendChild(enemy);
  enemies.push(enemy);
}

function movePlayer() {
  const speed = 5;
  let x = parseInt(player.style.left);
  let y = parseInt(player.style.top);

  if (keys["ArrowLeft"]) x -= speed;
  if (keys["ArrowRight"]) x += speed;
  if (keys["ArrowUp"]) y -= speed;
  if (keys["ArrowDown"]) y += speed;

  x = Math.max(0, Math.min(gameContainer.clientWidth - 50, x));
  y = Math.max(0, Math.min(gameContainer.clientHeight - 50, y));

  player.style.left = x + "px";
  player.style.top = y + "px";
}

function moveEnemies() {
  enemies.forEach(enemy => {
    let ex = parseInt(enemy.style.left);
    let ey = parseInt(enemy.style.top);
    let px = parseInt(player.style.left);
    let py = parseInt(player.style.top);

    if (ex < px) ex += 1;
    if (ex > px) ex -= 1;
    if (ey < py) ey += 1;
    if (ey > py) ey -= 1;

    // 確保敵人不重疊
    let overlapping = enemies.some(other => {
      if (other === enemy) return false;
      const ox = parseInt(other.style.left);
      const oy = parseInt(other.style.top);
      return Math.abs(ex - ox) < 50 && Math.abs(ey - oy) < 50;
    });

    if (!overlapping) {
      enemy.style.left = ex + "px";
      enemy.style.top = ey + "px";
    }
  });
}

function checkCollisions() {
  const px = parseInt(player.style.left);
  const py = parseInt(player.style.top);

  enemies.forEach(enemy => {
    const ex = parseInt(enemy.style.left);
    const ey = parseInt(enemy.style.top);
    const dx = px - ex;
    const dy = py - ey;
    if (Math.abs(dx) < 50 && Math.abs(dy) < 50) {
      endGame();
    }
  });
}

function updateScoreAndTime() {
  score++;
  time++;
  scoreDisplay.textContent = `分數：${score}`;
  timeDisplay.textContent = `時間：${time}`;
}

function clearGame() {
  enemies.forEach(e => e.remove());
  enemies = [];
  if (player) player.remove();
}

function startCutscene() {
  videoOverlay.style.display = "flex";
  cutscene.currentTime = 0;
  cutscene.play();
}

function endGame() {
  clearInterval(gameInterval);
  clearInterval(timeInterval);
  gameRunning = false;
  startCutscene();
}

cutscene.onended = () => {
  videoOverlay.style.display = "none";
  startGame();
};

function startGame() {
  clearGame();
  score = 0;
  time = 0;
  scoreDisplay.textContent = "分數：0";
  timeDisplay.textContent = "時間：0";

  createPlayer();
  for (let i = 0; i < 5; i++) createEnemy();

  gameRunning = true;

  gameInterval = setInterval(() => {
    if (!gameRunning) return;
    movePlayer();
    moveEnemies();
    checkCollisions();
  }, 20);

  timeInterval = setInterval(() => {
    if (!gameRunning) return;
    updateScoreAndTime();
    if (time % 5 === 0) createEnemy(); // 每五秒新增敵人
  }, 1000);
}

startButton.addEventListener("click", () => {
  if (!gameRunning) {
    startCutscene();
  }
});

document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);
