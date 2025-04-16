// 設定畫布和影片
const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const video = document.getElementById("game-video");
const startButton = document.getElementById("start-button");

let player, enemies = [];
let gameRunning = false;
let gameInterval;

// 設定玩家角色
function createPlayer() {
  player = {
    x: canvas.width / 2 - 25,
    y: canvas.height / 2 - 25,
    width: 50,
    height: 50,
    speed: 5,
    color: "red",
    dx: 0,
    dy: 0,
  };
}

// 設定敵人
function createEnemies(num) {
  for (let i = 0; i < num; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: Math.random() * (canvas.height - 50),
      width: 50,
      height: 50,
      color: "green",
      speed: 2,
    });
  }
}

// 更新遊戲畫面
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height); // 畫出玩家角色

  // 更新敵人位置
  enemies.forEach(enemy => {
    enemy.x += (player.x - enemy.x) * 0.01;
    enemy.y += (player.y - enemy.y) * 0.01;
    ctx.fillStyle = enemy.color;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height); // 畫出敵人
  });

  movePlayer();
}

// 控制玩家移動
function movePlayer() {
  player.x += player.dx;
  player.y += player.dy;

  // 防止玩家移出邊界
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}

// 處理鍵盤按鍵
function keyDownHandler(e) {
  if (e.key === "ArrowUp") player.dy = -player.speed;
  if (e.key === "ArrowDown") player.dy = player.speed;
  if (e.key === "ArrowLeft") player.dx = -player.speed;
  if (e.key === "ArrowRight") player.dx = player.speed;
}

function keyUpHandler(e) {
  if (e.key === "ArrowUp" || e.key === "ArrowDown") player.dy = 0;
  if (e.key === "ArrowLeft" || e.key === "ArrowRight") player.dx = 0;
}

// 開始遊戲
function startGame() {
  gameRunning = true;
  startButton.style.display = "none"; // 隱藏開始按鈕
  video.play(); // 播放影片
  video.currentTime = 0; // 重設影片
  enemies = []; // 清空敵人
  createEnemies(5); // 重新生成敵人
  createPlayer(); // 重新生成玩家
  gameInterval = setInterval(updateGame, 1000 / 60); // 開始遊戲循環
}

// 停止遊戲
function stopGame() {
  clearInterval(gameInterval);
  video.pause(); // 停止影片
  video.currentTime = 0; // 重設影片
  startButton.style.display = "inline-block"; // 顯示開始按鈕
  gameRunning = false;
}

// 重新開始遊戲
function restartGame() {
  stopGame();
  startGame();
}

// 影片結束後自動重新開始
video.addEventListener("ended", restartGame);

// 按鈕事件
startButton.addEventListener("click", () => {
  if (gameRunning) {
    stopGame();
  } else {
    startGame();
  }
});

// 監聽鍵盤事件
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

// 初始化遊戲
function init() {
  createPlayer();
  createEnemies(5);
  startButton.style.display = "inline-block"; // 顯示開始遊戲按鈕
  video.style.display = "none"; // 隱藏影片
}

init();
