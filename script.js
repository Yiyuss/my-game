// 設定初始變數
let gameStarted = false;
let enemies = [];
let player = { x: 100, y: 100, width: 50, height: 50, speed: 5 };

// 取得遊戲所需的 DOM 元素
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startButton = document.getElementById("startButton");
const video = document.getElementById("gameVideo");

// 設置畫布大小
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 當按下開始遊戲按鈕時的處理
startButton.addEventListener("click", startGame);

// 遊戲開始
function startGame() {
  if (gameStarted) {
    // 如果遊戲已經開始，重置遊戲
    resetGame();
  } else {
    // 啟動遊戲
    gameStarted = true;
    startButton.textContent = "重新開始";
    resetGame();
  }
}

// 重置遊戲邏輯
function resetGame() {
  // 清除敵人
  enemies = [];
  // 重新生成敵人
  generateEnemies();
  // 重新設置角色位置
  resetPlayerPosition();
  // 重置影片
  resetVideo();
  // 開始遊戲邏輯
  gameLoop();
}

// 生成敵人
function generateEnemies() {
  for (let i = 0; i < 10; i++) {
    let enemy = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 2
    };
    enemies.push(enemy);
  }
}

// 重設玩家位置
function resetPlayerPosition() {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
}

// 重置影片
function resetVideo() {
  video.currentTime = 0;
  video.play();
}

// 遊戲循環
function gameLoop() {
  // 更新畫布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 繪製背景
  ctx.drawImage(document.getElementById("background"), 0, 0, canvas.width, canvas.height);

  // 繪製玩家角色
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // 繪製敵人
  enemies.forEach(enemy => {
    ctx.fillStyle = "blue";
    ctx.fillRect(enemy.x, enemy.y, 50, 50);
    enemy.x += Math.random() * 2 - 1;  // 隨機移動
    enemy.y += Math.random() * 2 - 1;
  });

  // 請求下一幀
  requestAnimationFrame(gameLoop);
}

// 用滑鼠或鍵盤控制角色
document.addEventListener("mousemove", function(event) {
  if (gameStarted) {
    player.x = event.clientX - player.width / 2;
    player.y = event.clientY - player.height / 2;
  }
});

// 鍵盤控制
document.addEventListener("keydown", function(event) {
  if (gameStarted) {
    if (event.key === "ArrowLeft") {
      player.x -= player.speed;
    } else if (event.key === "ArrowRight") {
      player.x += player.speed;
    } else if (event.key === "ArrowUp") {
      player.y -= player.speed;
    } else if (event.key === "ArrowDown") {
      player.y += player.speed;
    }
  }
});
