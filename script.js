// 等待页面加载完成后再进行初始化
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
  let enemies = [];  // 用来存储所有敌人
  let gameInterval;
  let enemyInterval;
  let gameRunning = false;
  let targetPos = { x: playerPos.x, y: playerPos.y };

  // 开始游戏
  startBtn.addEventListener('click', (e) => {
    resetGame(); // 重置游戏状态
    gameRunning = true;

    // 启动游戏逻辑
    gameInterval = setInterval(updateGame, 1000 / 60); // 每秒更新60次
    spawnEnemy();  // 初始生成一个敌人
    enemyInterval = setInterval(spawnEnemy, 5000); // 每 5 秒生成一个新的敌人
  });

  // 点击移动玩家
  document.addEventListener('click', (e) => {
    if (!gameRunning || isVideoPlaying()) return; // 影片播放中不处理移动

    // 计算目标位置
    const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
    targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
    targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
  });

  // 让玩家朝目标移动
  function movePlayer() {
    let dx = targetPos.x - playerPos.x;
    let dy = targetPos.y - playerPos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);
    let speed = 4;  // 人物移动速度

    if (dist > speed) {
      playerPos.x += (dx / dist) * speed;
      playerPos.y += (dy / dist) * speed;
      player.style.left = playerPos.x + 'px';
      player.style.top = playerPos.y + 'px';
    }
  }

  // 生成敌人
  function spawnEnemy() {
    const enemyObj = {
      pos: getRandomPosition(),  // 随机生成敌人位置
      speed: 1.5,  // 敌人移动速度
      element: document.createElement('div')
    };

    enemyObj.element.classList.add('enemy');  // 为敌人元素添加CSS类
    enemyObj.element.style.position = 'absolute';
    enemyObj.element.style.width = '50px';
    enemyObj.element.style.height = '50px';
    enemyObj.element.style.backgroundImage = 'url("https://i.imgur.com/NPnmEtr.png")';
    enemyObj.element.style.backgroundSize = 'cover';
    enemyObj.element.style.backgroundRepeat = 'no-repeat';
    document.getElementById('game-container').appendChild(enemyObj.element);

    // 设置敌人的位置
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';

    enemies.push(enemyObj);  // 添加到敌人阵列

    // 开始移动敌人
    setInterval(() => moveEnemy(enemyObj), 1000 / 60); // 每帧更新敌人位置
  }

  // 随机生成敌人位置并检查是否与其他敌人重叠
  function getRandomPosition() {
    const minDist = 60; // 最小距离，避免敌人太靠近
    let newPos;
    let overlap = true;

    while (overlap) {
      overlap = false;
      newPos = {
        x: Math.random() * (window.innerWidth - 50),
        y: Math.random() * (window.innerHeight - 50)
      };

      // 检查新位置是否与现有敌人重叠
      for (let i = 0; i < enemies.length; i++) {
        let dist = Math.sqrt(
          Math.pow(newPos.x - enemies[i].pos.x, 2) + Math.pow(newPos.y - enemies[i].pos.y, 2)
        );
        if (dist < minDist) {
          overlap = true;
          break;
        }
      }
    }

    return newPos;
  }

  // 移动敌人，朝玩家移动
  function moveEnemy(enemy) {
    const dx = playerPos.x - enemy.pos.x;
    const dy = playerPos.y - enemy.pos.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const speed = enemy.speed;

    if (dist > speed) {
      enemy.pos.x += (dx / dist) * speed;
      enemy.pos.y += (dy / dist) * speed;
      enemy.element.style.left = enemy.pos.x + 'px';
      enemy.element.style.top = enemy.pos.y + 'px';
    }
  }

  // 更新游戏状态
  function updateGame() {
    if (gameRunning) {
      movePlayer();  // 控制玩家移动
      checkCollisions();  // 检查碰撞
    }
  }

  // 检查玩家与敌人是否碰撞
  function checkCollisions() {
    for (const enemy of enemies) {
      const dx = playerPos.x - enemy.pos.x;
      const dy = playerPos.y - enemy.pos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 50) {
        hitSound.play();
        showGameOverVideo();  // 播放结束影片
        gameRunning = false;
        break;
      }
    }
  }

  // 显示游戏结束视频
  function showGameOverVideo() {
    videoOverlay.style.display = 'flex';
    endVideo.src = 'https://www.youtube.com/embed/your_video_id?autoplay=1';
  }

  // 检查视频是否正在播放
  function isVideoPlaying() {
    return videoOverlay.style.display === 'flex';
  }

  // 重置游戏状态
  function resetGame() {
    playerPos = { x: 200, y: 200 };
    score = 0;
    time = 0;
    enemies = [];
    gameRunning = false;

    scoreEl.textContent = `分数: ${score}`;
    timeEl.textContent = `时间: ${time}`;
    videoOverlay.style.display = 'none';
    endVideo.src = '';
  }
});
