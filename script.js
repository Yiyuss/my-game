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
  document.getElementById('game-container').appendChild(enemyObj.element);

  // 設置敵人的位置
  enemyObj.element.style.left = enemyObj.pos.x + 'px';
  enemyObj.element.style.top = enemyObj.pos.y + 'px';

  enemies.push(enemyObj);  // 添加到敵人陣列

  // 開始移動敵人
  setInterval(() => moveEnemy(enemyObj), 30); // 每30ms更新一次
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

// 敵人移動
function moveEnemy(enemyObj) {
  if (!gameRunning || isVideoPlaying()) return; // 影片播放中不處理敵人移動

  let dx = playerPos.x - enemyObj.pos.x;
  let dy = playerPos.y - enemyObj.pos.y;
  let dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist > 0) {
    let speed = enemyObj.speed;
    enemyObj.pos.x += (dx / dist) * speed;
    enemyObj.pos.y += (dy / dist) * speed;
    enemyObj.element.style.left = enemyObj.pos.x + 'px';
    enemyObj.element.style.top = enemyObj.pos.y + 'px';
  }

  // 檢查敵人是否與玩家碰撞
  if (dist < 50) {
    score += 1;
    scoreEl.textContent = score;
    hitSound.play();
    enemyObj.element.remove();
    enemies = enemies.filter(e => e !== enemyObj);
  }
}

// 更新遊戲
function updateGame() {
  if (!gameRunning) return;

  movePlayer();
  time += 1 / 60;  // 每秒時間加1
  timeEl.textContent = time.toFixed(1);
}

// 影片播放檢查
function isVideoPlaying() {
  return videoOverlay.style.display === 'block';
}

// 重置遊戲
function resetGame() {
  score = 0;
  time = 0;
  scoreEl.textContent = score;
  timeEl.textContent = time.toFixed(1);
  gameRunning = false;
  clearInterval(gameInterval);
  clearInterval(enemyInterval);
  enemies.forEach(enemy => enemy.element.remove());
  enemies = [];
  playerPos = { x: 200, y: 200 };
  player.style.left = playerPos.x + 'px';
  player.style.top = playerPos.y + 'px';
}
