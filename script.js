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
  console.log('Game started');
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
    pos: getRandomPosition(),  // 隨機生成敵人位置
    speed: 1.5,  // 敵人移動速度
    element: document.createElement('div')
  };

  enemyObj.element.classList.add('enemy');  // 為敵人元素添加CSS類
  enemyObj.element.style.position = 'absolute';
  enemyObj.element.style.width = '50px';
  enemyObj.element.style.height = '50px';
  enemyObj.element.style.backgroundImage = 'url("https://i.imgur.com/NPnmEtr.png")';
  enemyObj.element.style.backgroundSize = 'cover';
  enemyObj.element.style.backgroundRepeat = 'no-repeat';
  document.getElementById('game-container').appendChild(enemyObj.element);

  // 設置敵人的位置
  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  enemies.push(enemyObj);  // 添加到敵人陣列

  // 開始移動敵人
  setInterval(() => moveEnemy(enemyObj), 1000 / 60); // 每幀更新敵人位置
}

// 隨機生成敵人位置並檢查是否與其他敵人重疊
function getRandomPosition() {
  const minDist = 60; // 最小距離，避免敵人太靠近
  let newPos;
  let overlap = true;

  while (overlap) {
    overlap = false;
    newPos = {
      x: Math.random() * (window.innerWidth - 50),
      y: Math.random() * (window.innerHeight - 50)
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

// 移動敵人，朝玩家移動
function moveEnemy(enemy) {
  // 目標位置是玩家的位置
  const targetX = playerPos.x;
  const targetY = playerPos.y;

  // 計算敵人當前位置與目標的距離
  let dx = targetX - enemy.pos.x;
  let dy = targetY - enemy.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemy.speed;

  // 如果距離大於敵人移動速度，繼續移動
  if (dist > speed) {
    // 計算每次更新的移動距離
    let moveX = (dx / dist) * speed;
    let moveY = (dy / dist) * speed;

    // 更新敵人位置
    enemy.pos.x += moveX;
    enemy.pos.y += moveY;

    // 更新敵人元素的樣式
    enemy.element.style.left = enemy.pos.x + 'px';
    enemy.element.style.top = enemy.pos.y + 'px';
  } else {
    // 如果敵人接近玩家，停下來
    enemy.pos.x = targetX;
    enemy.pos.y = targetY;
    enemy.element.style.left = enemy.pos.x + 'px';
    enemy.element.style.top = enemy.pos.y + 'px';
  }

  // 檢查是否與玩家碰撞
  checkCollision(enemy);
}

// 檢查敵人與玩家的碰撞
function checkCollision(enemy) {
  const enemyRect = enemy.element.getBoundingClientRect();
  const playerRect = player.getBoundingClientRect();

  if (
    enemyRect.left < playerRect.right &&
    enemyRect.right > playerRect.left &&
    enemyRect.top < playerRect.bottom &&
    enemyRect.bottom > playerRect.top
  ) {
    // 如果碰撞，顯示影片
    showVideo();
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
    videoOverlay.style.display = 'none';
    resetGame();
  }, 9000);
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
