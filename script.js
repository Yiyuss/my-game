document.addEventListener('DOMContentLoaded', () => {
  // 取得元素
  const startButton = document.getElementById('start-button');
  const gameCanvas = document.getElementById('game-canvas');
  const gameVideo = document.getElementById('game-video');
  const ctx = gameCanvas.getContext('2d');

  let gameStarted = false;
  let player = {
    x: 100,
    y: 100,
    image: new Image(),
    speed: 5,
    resetPosition() {
      this.x = 100;
      this.y = 100;
    }
  };

  let enemies = [];
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * 800,
      y: Math.random() * 600,
      image: new Image(),
      speed: 2
    });
  }

  // 加載資源
  player.image.src = 'https://raw.githubusercontent.com/Yiyuss/my-game/main/角色01.png';
  enemies.forEach(enemy => {
    enemy.image.src = 'https://raw.githubusercontent.com/Yiyuss/my-game/main/敵人角色02.png';
  });

  // 設置遊戲初始化
  function startGame() {
    if (!gameStarted) {
      gameStarted = true;
      startButton.style.display = 'none';  // 隱藏開始按鈕
      gameVideo.style.display = 'block';  // 顯示影片
      gameVideo.play();
      
      // 初始化遊戲元素
      initGame();
    }
  }

  startButton.addEventListener('click', startGame);

  // 初始化遊戲
  function initGame() {
    player.resetPosition();
    enemies.forEach(enemy => {
      enemy.x = Math.random() * 800;
      enemy.y = Math.random() * 600;
    });
    // 確保畫面更新
    requestAnimationFrame(gameLoop);
  }

  // 遊戲主循環
  function gameLoop() {
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height); // 清除畫布
    drawBackground(); // 繪製背景
    drawPlayer();  // 繪製玩家
    drawEnemies(); // 繪製敵人

    // 敵人追蹤玩家
    enemies.forEach(enemy => {
      moveEnemyTowardsPlayer(enemy);
    });

    // 動畫循環
    requestAnimationFrame(gameLoop);
  }

  function drawBackground() {
    ctx.fillStyle = 'black'; // 背景顏色
    ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
  }

  function drawPlayer() {
    ctx.drawImage(player.image, player.x, player.y);
  }

  function drawEnemies() {
    enemies.forEach(enemy => {
      ctx.drawImage(enemy.image, enemy.x, enemy.y);
    });
  }

  // 敵人追蹤玩家邏輯
  function moveEnemyTowardsPlayer(enemy) {
    const dx = player.x - enemy.x;
    const dy = player.y - enemy.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 50) {
      return;  // 當敵人接近玩家時停止移動
    }
    const angle = Math.atan2(dy, dx);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;
  }

  // 處理滑鼠與鍵盤事件
  window.addEventListener('keydown', handleKeyboardMovement);

  function handleKeyboardMovement(event) {
    switch (event.key) {
      case 'ArrowUp':
        player.y -= player.speed;
        break;
      case 'ArrowDown':
        player.y += player.speed;
        break;
      case 'ArrowLeft':
        player.x -= player.speed;
        break;
      case 'ArrowRight':
        player.x += player.speed;
        break;
    }
  }

  // 停止遊戲與重啟
  function stopGame() {
    gameStarted = false;
    startButton.style.display = 'block'; // 顯示開始按鈕
    gameVideo.pause();  // 停止影片
    gameVideo.currentTime = 0;  // 重設影片播放時間
  }

  // 當影片結束時，重新啟動遊戲
  gameVideo.addEventListener('ended', () => {
    stopGame();
    initGame();  // 遊戲重新啟動
  });
});
