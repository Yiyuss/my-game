// 設置畫布和遊戲上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 玩家角色資料
let player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

// 敵人資料
let enemies = [];

// 初始化計分與遊戲狀態
let score = 0;
let gameOver = false;

// 監聽鍵盤事件來控制玩家移動
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === 'ArrowUp' || e.key === 'w') {
        player.dy = -player.speed;
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        player.dy = player.speed;
    }
}

function keyUpHandler(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'd' || e.key === 'a') {
        player.dx = 0;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'w' || e.key === 's') {
        player.dy = 0;
    }
}

// 檢查兩個敵人是否重疊
function checkOverlap(enemy1, enemy2) {
    return !(enemy1.x + enemy1.width < enemy2.x || 
             enemy1.x > enemy2.x + enemy2.width || 
             enemy1.y + enemy1.height < enemy2.y || 
             enemy1.y > enemy2.y + enemy2.height);
}

// 生成敵人，並確保不會與其他敵人重疊
function createEnemy() {
    let newEnemy;
    let overlap;

    // 保證新敵人不會重疊
    do {
        overlap = false;
        newEnemy = {
            x: Math.random() * (canvas.width - 50), // 避免超出畫布
            y: Math.random() * (canvas.height - 50), // 避免超出畫布
            width: 50, // 假設敵人寬度為50
            height: 50, // 假設敵人高度為50
            speed: 2
        };

        // 檢查所有已生成的敵人，看看是否會重疊
        for (let i = 0; i < enemies.length; i++) {
            if (checkOverlap(newEnemy, enemies[i])) {
                overlap = true;
                break; // 如果重疊，則重新生成敵人
            }
        }
    } while (overlap); // 若發現重疊，繼續生成直到沒有重疊

    enemies.push(newEnemy);
}

// 移動敵人，並確保他們之間不會重疊
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        let enemy = enemies[i];
        let direction = Math.random() * 2 * Math.PI;
        enemy.x += Math.cos(direction) * enemy.speed;
        enemy.y += Math.sin(direction) * enemy.speed;

        // 邊界檢查
        if (enemy.x < 0) enemy.x = 0;
        if (enemy.x > canvas.width - enemy.width) enemy.x = canvas.width - enemy.width;
        if (enemy.y < 0) enemy.y = 0;
        if (enemy.y > canvas.height - enemy.height) enemy.y = canvas.height - enemy.height;

        // 檢查敵人之間是否重疊，若有重疊則將其移動回上一步
        for (let j = 0; j < enemies.length; j++) {
            if (i !== j && checkOverlap(enemy, enemies[j])) {
                // 如果有重疊，反向移動
                enemy.x -= Math.cos(direction) * enemy.speed;
                enemy.y -= Math.sin(direction) * enemy.speed;
            }
        }
    }
}

// 畫出玩家和敵人
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除畫布

    // 畫玩家
    ctx.fillStyle = 'green';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // 畫敵人
    ctx.fillStyle = 'red';
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillRect(enemies[i].x, enemies[i].y, enemies[i].width, enemies[i].height);
    }

    // 顯示分數
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, 10, 30);
}

// 更新遊戲狀態
function update() {
    if (!gameOver) {
        player.x += player.dx;
        player.y += player.dy;

        // 保持玩家在畫布內
        if (player.x < 0) player.x = 0;
        if (player.x > canvas.width - player.width) player.x = canvas.width - player.width;
        if (player.y < 0) player.y = 0;
        if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;

        // 更新敵人
        moveEnemies();

        // 每 1000 毫秒生成一個敵人
        if (Math.random() < 0.02) {
            createEnemy();
        }

        // 畫出遊戲畫面
        draw();

        // 每 16ms 更新一次畫面
        requestAnimationFrame(update);
    }
}

// 啟動遊戲
function startGame() {
    gameOver = false;
    score = 0;
    enemies = [];  // 清空敵人
    document.getElementById('startButton').style.display = 'none'; // 隱藏開始遊戲按鈕
    update(); // 開始更新遊戲
}

// 停止遊戲
function gameOverFunc() {
    gameOver = true;
    alert("Game Over!");
}

// 監聽開始遊戲的按鈕
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('gameOverButton').addEventListener('click', gameOverFunc);
