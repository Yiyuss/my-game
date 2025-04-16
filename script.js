document.addEventListener('DOMContentLoaded', function () {
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
    let gameInterval;
    let enemyInterval;
    let targetPos = { x: playerPos.x, y: playerPos.y };

    // 开始游戏按钮事件
    startBtn.addEventListener('click', function () {
        resetGame();  // 重置游戏状态
        gameRunning = true;

        // 启动游戏逻辑
        gameInterval = setInterval(updateGame, 1000 / 60); // 每秒更新60次
        spawnEnemy();  // 初始生成一个敌人
        enemyInterval = setInterval(spawnEnemy, 5000); // 每5秒生成一个新的敌人
    });

    // 点击事件，控制玩家移动
    document.addEventListener('click', function (e) {
        if (!gameRunning || isVideoPlaying()) return;  // 影片播放时不处理移动

        // 计算目标位置
        const gameContainerRect = document.getElementById('game-container').getBoundingClientRect();
        targetPos.x = e.clientX - gameContainerRect.left - player.offsetWidth / 2;
        targetPos.y = e.clientY - gameContainerRect.top - player.offsetHeight / 2;
    });

    // 让玩家朝目标位置移动
    function movePlayer() {
        let dx = targetPos.x - playerPos.x;
        let dy = targetPos.y - playerPos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let speed = 4;  // 玩家移动速度

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
            speed: 2,  // 敌人初速度
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

        enemies.push(enemyObj);  // 添加到敌人数组

        // 开始移动敌人
        setInterval(() => moveEnemy(enemyObj), 30); // 每30ms更新一次
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

    // 敌人移动
    function moveEnemy(enemyObj) {
        if (!gameRunning || isVideoPlaying()) return; // 影片播放中不处理敌人移动

        let dx = playerPos.x - enemyObj.pos.x;
        let dy = playerPos.y - enemyObj.pos.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        let speed = enemyObj.speed;  // 每个敌人的移动速度

        if (dist > speed) {
            enemyObj.pos.x += (dx / dist) * speed;
            enemyObj.pos.y += (dy / dist) * speed;
            enemyObj.element.style.left = enemyObj.pos.x + 'px';
            enemyObj.element.style.top = enemyObj.pos.y + 'px';
        }

        // 检查敌人之间的碰撞
        avoidEnemyCollision(enemyObj);

        checkCollision(enemyObj);  // 检查是否与玩家碰撞
    }

    // 检查敌人之间的碰撞并避开
    function avoidEnemyCollision(enemyObj) {
        const minDist = 60; // 设置敌人之间的最小距离

        enemies.forEach(otherEnemy => {
            if (enemyObj === otherEnemy) return; // 跳过自己

            let dx = enemyObj.pos.x - otherEnemy.pos.x;
            let dy = enemyObj.pos.y - otherEnemy.pos.y;
            let dist = Math.sqrt(dx * dx + dy * dy);

            // 如果两个敌人太近，就避开
            if (dist < minDist) {
                // 计算避免重叠的方向
                let angle = Math.atan2(dy, dx);
                let offsetX = Math.cos(angle) * (minDist - dist);
                let offsetY = Math.sin(angle) * (minDist - dist);

                // 调整敌人的位置
                enemyObj.pos.x += offsetX;
                enemyObj.pos.y += offsetY;
                enemyObj.element.style.left = enemyObj.pos.x + 'px';
                enemyObj.element.style.top = enemyObj.pos.y + 'px';
            }
        });
    }

    // 检查碰撞
    function checkCollision(enemyObj) {
        if (!gameRunning || isVideoPlaying()) return;  // 影片播放中不处理碰撞检查

        let playerRect = player.getBoundingClientRect();
        let enemyRect = enemyObj.element.getBoundingClientRect();

        if (
            playerRect.right > enemyRect.left &&
            playerRect.left < enemyRect.right &&
            playerRect.bottom > enemyRect.top &&
            playerRect.top < enemyRect.bottom
        ) {
            hitSound.play();
            showVideo();  // 播放结束视频
        }
    }

    // 更新游戏状态
    function updateGame() {
        if (!gameRunning || isVideoPlaying()) return;  // 如果影片正在播放，不进行更新

        time++;
        timeEl.textContent = time;
        score++;
        scoreEl.textContent = score;

        movePlayer();  // 让玩家移动
    }

    // 显示结束视频
    function showVideo() {
        endVideo.src = 'https://www.youtube.com/embed/Qybud8_paik?autoplay=1';
        videoOverlay.style.display = 'flex';
        gameRunning = false; // 暂停游戏

        // 影片播放 9 秒后关闭
        setTimeout(() => {
            videoOverlay.style.display = 'none';  // 隐藏影片
            resetGame();  // 重置游戏状态
        }, 9000);  // 9秒后重启游戏
    }

    // 重置游戏状态
    function resetGame() {
        // 清除定时器
        clearInterval(gameInterval);
        clearInterval(enemyInterval);

        // 重新初始化游戏状态
        score = 0;
        time = 0;
        scoreEl.textContent = score;
        timeEl.textContent = time;

        // 重新设置玩家位置
        playerPos.x = 200;
        playerPos.y = 200;
        player.style.left = playerPos.x + 'px';
        player.style.top = playerPos.y + 'px';

        // 清除所有敌人
        enemies.forEach(enemyObj => enemyObj.element.remove());
        enemies = [];  // 清空敌人数组

        // 重新生成敌人并启动敌人移动
        spawnEnemy();

        // 重启游戏定时器
        gameRunning = true;
        gameInterval = setInterval(updateGame, 1000 / 60); // 更新游戏状态
    }

    // 检查视频是否正在播放
    function isVideoPlaying() {
        return videoOverlay.style.display === 'flex';
    }
});
