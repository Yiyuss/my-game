document.addEventListener('DOMContentLoaded', function() {
  const startBtn = document.getElementById('start-btn');
  const scoreEl = document.getElementById('score');
  const timeEl = document.getElementById('time');
  const videoOverlay = document.getElementById('video-overlay');
  const endVideo = document.getElementById('end-video');
  const player = document.getElementById('player');
  const hitSound = document.getElementById('hit-sound');

  let score = 0;
  let time = 0;
  let playerPos = { x: 200, y: 200 };
  let enemies = [];
  let gameRunning = false;
  let interval;

  // 开始游戏按钮事件
  startBtn.addEventListener('click', function() {
    if (gameRunning) return; // 避免多次启动
    gameRunning = true;
    startBtn.style.display = 'none'; // 隐藏开始按钮
    resetGame(); // 重置游戏状态
    score = 0;
    time = 0;
    scoreEl.textContent = `分數: ${score}`;
    timeEl.textContent = `時間: ${time}`;
    spawnEnemy();  // 生成敌人
    interval = setInterval(updateGame, 1000 / 60); // 60fps更新游戏状态
  });

  // 玩家键盘控制移动
  document.addEventListener('keydown', function(e) {
    if (!gameRunning) return;
    if (e.key === 'ArrowUp') playerPos.y -= 5;
    if (e.key === 'ArrowDown') playerPos.y += 5;
    if (e.key === 'ArrowLeft') playerPos.x -= 5;
    if (e.key === 'ArrowRight') playerPos.x += 5;
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  });

  // 生成敌人
  function spawnEnemy() {
    const enemy = {
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 50),
      element: document.createElement('div')
    };
    enemy.element.classList.add('enemy');
    enemy.element.style.left = enemy.x + 'px';
    enemy.element.style.top = enemy.y + 'px';
    document.getElementById('game-container').appendChild(enemy.element);
    enemies.push(enemy);
    moveEnemy(enemy);
  }

  // 敌人移动
  function moveEnemy(enemy) {
    const speed = 1;
    const dx = playerPos.x - enemy.x;
    const dy = playerPos.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 5) {
      const moveX = (dx / dist) * speed;
      const moveY = (dy / dist) * speed;
      enemy.x += moveX;
      enemy.y += moveY;
      enemy.element.style.left = enemy.x + 'px';
      enemy.element.style.top = enemy.y + 'px';
    }

    checkCollision(enemy);
  }

  // 碰撞检测
  function checkCollision(enemy) {
    const dx = playerPos.x - enemy.x;
    const dy = playerPos.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 50) {
      hitSound.play();
      showGameOverVideo();  // 播放结束视频
      gameRunning = false;
      clearInterval(interval); // 停止游戏更新
    }
  }

  // 播放游戏结束视频
  function showGameOverVideo() {
    videoOverlay.style.display = 'flex';
    endVideo.src = 'https://www.youtube.com/embed/your_video_id?autoplay=1';
  }

  // 重置游戏
  function resetGame() {
    playerPos = { x: 200, y: 200 };
    enemies = [];
    gameRunning = false;
    score = 0;
    time = 0;
    scoreEl.textContent = `分數: ${score}`;
    timeEl.textContent = `時間: ${time}`;
    videoOverlay.style.display = 'none';
    endVideo.src = '';  // 清空视频
  }

  // 游戏主循环
  function updateGame() {
    time++;
    timeEl.textContent = `時間: ${time}`;
    if (time % 5 === 0) spawnEnemy(); // 每5秒生成一个敌人
    enemies.forEach(moveEnemy);
  }
});
