document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-button');
  const gameCanvas = document.getElementById('game-canvas');
  const gameVideo = document.getElementById('game-video');
  const ctx = gameCanvas.getContext('2d');
  
  let gameStarted = false;
  
  // 用來控制遊戲開始與重置
  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      startButton.style.display = 'none';  // 隱藏開始按鈕
      gameVideo.style.display = 'block';  // 顯示影片
      gameVideo.play();
      
      // 初始化遊戲元素，如玩家、敵人等
      initGame();
    }
  }

  startButton.addEventListener('click', startGame);

  // 初始化遊戲元素
  function initGame() {
    // 重置玩家位置、分數、敵人等
    player.resetPosition();
    enemies.reset();
    // 確保畫面更新
    requestAnimationFrame(gameLoop);
  }

  // 遊戲主循環
  function gameLoop() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // 清除畫布
    drawPlayer();  // 繪製玩家
    drawEnemies(); // 繪製敵人

    // 動畫循環
    requestAnimationFrame(gameLoop);
  }

  function drawPlayer() {
    // 使用 canvas 渲染玩家
    ctx.drawImage(player.image, player.x, player.y);
  }

  function drawEnemies() {
    // 使用 canvas 渲染敵人
    enemies.forEach(enemy => {
      ctx.drawImage(enemy.image, enemy.x, enemy.y);
    });
  }

  // 假設你的玩家和敵人對象，這些可以根據需求進行調整
  let player = {
    x: 100,
    y: 100,
    image: new Image(),
    resetPosition() {
      this.x = 100;
      this.y = 100;
    }
  };

  let enemies = [];
  // 假設有一些敵人初始化
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      image: new Image()
    });
  }

  player.image.src = 'https://raw.githubusercontent.com/Yiyuss/my-game/main/角色01.png';
  enemies.forEach(enemy => {
    enemy.image.src = 'https://raw.githubusercontent.com/Yiyuss/my-game/main/敵人角色02.png';
  });

  // 處理滑鼠與鍵盤事件
  window.addEventListener('keydown', handleKeyboardMovement);
  
  function handleKeyboardMovement(event) {
    switch (event.key) {
      case 'ArrowUp': player.y -= 5; break;
      case 'ArrowDown': player.y += 5; break;
      case 'ArrowLeft': player.x -= 5; break;
      case 'ArrowRight': player.x += 5; break;
    }
  }
});
