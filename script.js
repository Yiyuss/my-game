const startBtn = document.getElementById('start-btn');
const scoreEl = document.getElementById('score');
const timeEl = document.getElementById('time');
const videoOverlay = document.getElementById('video-overlay');
const endVideo = document.getElementById('end-video');
const player = document.getElementById('player');
const hitSound = document.getElementById('hit-sound');
const gameContainer = document.getElementById('game-container');
const background = document.getElementById('background');

// 初始化遊戲狀態
let score = 0;
let time = 0;
let playerPos = { x: 200, y: 200 };
let enemies = [];
let gameInterval;
let enemyInterval;
let gameRunning = false;
let targetPos = { x: playerPos.x, y: playerPos.y };

// 開始遊戲
startBtn.addEventListener('click', () => {
  resetGame(); // 重置遊戲
  gameRunning = true;

  // 開始遊戲更新
  gameInterval = setInterval(updateGame, 1000 / 60); // 每秒更新60次
  spawnEnemy();  // 初始生成一個敵人
  enemyInterval = setInterval(spawnEnemy, 5000); // 每 5 秒生成一個新的敵人
});

// 讓玩家點擊移動
document.addEventListener('click', (e) => {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片播放中不處理移動

  const gameContainerRect = gameContainer.getBoundingClientRect();
  targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
  targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
});

// 玩家移動
function movePlayer() {
  let dx = targetPos.x - playerPos.x;
  let dy = targetPos.y - playerPos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = 4;  // 設定玩家移動速度

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
    speed: 2,  // 設定敵人移動速度
    element: document.createElement('div')
  };

  enemyObj.element.classList.add('enemy');  // 添加敵人的CSS類
  enemyObj.element.style.position = 'absolute';
  enemyObj.element.style.width = '50px';
  enemyObj.element.style.height = '50px';
  enemyObj.element.style.backgroundImage = 'url("敵人角色02.png")';  // 使用本地敵人圖片
  enemyObj.element.style.backgroundSize = 'cover';
  enemyObj.element.style.backgroundRepeat = 'no-repeat';
  gameContainer.appendChild(enemyObj.element);

  // 設置敵人初始位置
  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  enemies.push(enemyObj);  // 加入敵人陣列

  // 開始移動敵人
  setInterval(() => moveEnemy(enemyObj), 30); // 每30ms更新敵人位置
}

// 隨機生成敵人位置
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

    // 檢查新位置是否與其他敵人重疊
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

// 敵人移動
function moveEnemy(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片播放中不處理敵人移動

  let dx = playerPos.x - enemyObj.pos.x;
  let dy = playerPos.y - enemyObj.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  let speed = enemyObj.speed;

  if (dist > speed) {
    enemyObj.pos.x += (dx / dist) * speed;
    enemyObj.pos.y += (dy / dist) * speed;
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';
  }

  // 檢查碰撞
  checkCollision(enemyObj);
}

// 檢查玩家與敵人碰撞
function checkCollision(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片播放中不處理碰撞

  let playerRect = player.getBoundingClientRect();
  let enemyRect = enemyObj.element.getBoundingClientRect();

  // 撞擊檢測
  if (
    playerRect.right > enemyRect.left &&
    playerRect.left < enemyRect.right &&
    playerRect.bottom > enemyRect.top &&
    playerRect.top < enemyRect.bottom
  ) {
    hitSound.play();
    showVideo();  // 播放影片
  }
}

// 顯示影片
function showVideo() {
  endVideo.src = '影片001.mp4';  // 使用本地影片
  videoOverlay.style.display = 'flex';
  gameRunning = false;

  // 影片播放結束後，重置遊戲
  setTimeout(() => {
    videoOverlay.style.display = 'none';
    resetGame();
  }, 9000); // 設置影片顯示時間為9秒
}

// 更新遊戲狀態
function updateGame() {
  if (!gameRunning || isVideoPlaying()) return; // 如果影片播放中不更新遊戲狀態

  time++;
  timeEl.textContent = time;
  score++;
  scoreEl.textContent = score;

  movePlayer();  // 玩家移動
}

// 檢查影片是否在播放
function isVideoPlaying() {
  return videoOverlay.style.display === 'flex';
}

// 重置遊戲
function resetGame() {
  // 清除計時器
  clearInterval(gameInterval);
  clearInterval(enemyInterval);

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
  enemies = [];

  // 重新生成敵人並啟動遊戲
  gameRunning = true;
  gameInterval = setInterval(updateGame, 1000 / 60); // 遊戲每秒更新60次
  spawnEnemy();  // 初始生成一個敵人
  enemyInterval = setInterval(spawnEnemy, 5000); // 每5秒生成一個敵人
}
