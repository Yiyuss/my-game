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
let enemies = [];  // 用來存儲所有敵人
let gameInterval;
let enemyInterval;
let gameRunning = false;
let targetPos = { x: playerPos.x, y: playerPos.y };

// 開始遊戲
startBtn.addEventListener('click', () => {
  resetGame(); // 重置遊戲狀態
  gameRunning = true;

  // 啟動遊戲邏輯
  gameInterval = setInterval(updateGame, 1000 / 60); // 每秒更新60次
  spawnEnemy();  // 初始生成一個敵人
  enemyInterval = setInterval(spawnEnemy, 5000); // 每 5 秒生成一個新的敵人
});

// 點擊移動玩家
document.addEventListener('click', (e) => {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理移動

  // 計算目標位置
  const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
  targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
  targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
});

// 讓玩家朝目標移動
function movePlayer() {
  let dx = targetPos.x - playerPos.x;
  let dy = targetPos.y - playerPos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = 4;  // 人物移動速度

  if (dist > speed) {
    playerPos.x += (dx / dist) * speed;
    playerPos.y += (dy / dist) * speed;
    player.style.left = playerPos.x + 'px';
    player.style.top = playerPos.y + 'px';
  }
}

// 生成敵人
function spawnEnemy() {
  const enemyObj = {
    pos: getRandomPosition(),  // 隨機生成敵人位置並檢查是否與其他敵人重疊
    speed: 2,  // 敵人初速度設定為2
    element: document.createElement('div')
  };

  enemyObj.element.classList.add('enemy');  // 為敵人元素添加CSS類
  enemyObj.element.style.position = 'absolute';
  enemyObj.element.style.width = '50px';
  enemyObj.element.style.height = '50px';
  enemyObj.element.style.backgroundImage = 'url("https://i.imgur.com/NPnmEtr.png")';
  enemyObj.element.style.backgroundSize = 'cover';
  enemyObj.element.style.backgroundRepeat = 'no-repeat';

  // 設置敵人的位置
  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  // 將敵人加入遊戲畫面
  document.getElementById('game-container').appendChild(enemyObj.element);

  // 添加到敵人陣列中
  enemies.push(enemyObj);

  // 開始移動敵人
  setInterval(() => moveEnemy(enemyObj), 30); // 每30ms更新一次
}

// 隨機生成敵人位置並檢查是否與其他敵人重疊
function getRandomPosition() {
  const gameContainer = document.getElementById('game-container');
  const gameContainerRect = gameContainer.getBoundingClientRect();
  
  const minDist = 60; // 最小距離，避免敵人太靠近
  let newPos;
  let overlap = true;

  while (overlap) {
    overlap = false;
    // 隨機生成敵人位置，確保敵人位於遊戲容器範圍內
    newPos = {
      x: Math.random() * (gameContainerRect.width - 50), // 減去敵人寬度
      y: Math.random() * (gameContainerRect.height - 50) // 減去敵人高度
    };

    // 檢查新位置是否與現有敵人重疊
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

// 敵人移動邏輯
function moveEnemy(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理敵人移動

  let dx = playerPos.x - enemyObj.pos.x;
  let dy = playerPos.y - enemyObj.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemyObj.speed;  // 每個敵人的移動速度

  if (dist > speed) {
    enemyObj.pos.x += (dx / dist) * speed;
    enemyObj.pos.y += (dy / dist) * speed;
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';
  }

  // 檢查敵人之間的碰撞
  avoidEnemyCollision(enemyObj);

  checkCollision(enemyObj); // 檢查是否碰撞
}

// 檢查敵人之間的碰撞並避開
function avoidEnemyCollision(enemyObj) {
  const minDist = 60; // 設定敵人之間的最小距離

  enemies.forEach(otherEnemy => {
    if (enemyObj === otherEnemy) return; // 跳過自己

    let dx = enemyObj.pos.x - otherEnemy.pos.x;
    let dy = enemyObj.pos.y - otherEnemy.pos.y;
    let dist = Math.sqrt(dx * dx + dy * dy);

    // 如果兩個敵人太近，就避開
    if (dist < minDist) {
      // 計算避免重疊的方向
      let angle = Math.atan2(dy, dx);
      let offsetX = Math.cos(angle) * (minDist - dist);
      let offsetY = Math.sin(angle) * (minDist - dist);

      // 調整敵人的位置
      enemyObj.pos.x += offsetX;
      enemyObj.pos.y += offsetY;
      enemyObj.element.style.left = enemyObj.pos.x + 'px';
      enemyObj.element.style.top = enemyObj.pos.y + 'px';
    }
  });
}

// 檢查碰撞
function checkCollision(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理碰撞檢查

  let playerRect = player.getBoundingClientRect();
  let enemyRect = enemyObj.element.getBoundingClientRect();

  if (
    playerRect.right > enemyRect.left &&
    playerRect.left < enemyRect.right &&
    playerRect.bottom > enemyRect.top &&
    playerRect.top < enemyRect.bottom
  ) {
    hitSound.play();
    showVideo(); // 播放影片
  }
}

// 更新遊戲狀態
function updateGame() {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片正在播放，不進行更新

  time++;
  timeEl.textContent = time;
  score++;
  scoreEl.textContent = score;

  movePlayer();  // 讓玩家移動
}

// 顯示影片
function showVideo() {
  endVideo.src = 'https://www.youtube.com/embed/Qybud8_paik?autoplay=1';
  videoOverlay.style.display = 'flex';
  gameRunning = false; // 暫停遊戲

  // 影片播放 9 秒後關閉
  setTimeout(() => {
    videoOverlay.style.display = 'none'; // 隱藏影片
    resetGame(); // 重置遊戲狀態
  }, 9000); // 9秒後重啟遊戲
}

// 重置遊戲狀態
function resetGame() {
  // 清除定時器
  clearInterval(gameInterval);

  // 重新初始化遊戲狀態
  score = 0;
  time = 0;
  scoreEl.textContent = score;
  timeEl.textContent = time;

  // 重新設定玩家位置
  playerPos.x = 200;
  playerPos.y = 200;
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';

  // 清除所有敵人
  enemies.forEach(enemyObj => enemyObj.element.remove());
  enemies = []; // 清空敵人陣列

  // 重新生成敵人並啟動敵人移動
  spawnEnemy();

  // 重啟遊戲定時器
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60); // 更新遊戲狀態
}

// 檢查影片是否正在播放
function isVideoPlaying() {
  return videoOverlay.style.display === 'flex';
}
