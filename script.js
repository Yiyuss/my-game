<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game</title>
  <style>
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    #game-container {
      position: relative;
      width: 100%;
      height: 100%;
      background-image: url("https://raw.githubusercontent.com/Yiyuss/my-game/main/170117-2330-1-VqLzt.jpg");
      background-size: cover;
      background-position: center;
    }

    #player {
      position: absolute;
      width: 50px;
      height: 50px;
      background-image: url("https://raw.githubusercontent.com/Yiyuss/my-game/main/01.png");
      background-size: cover;
    }

    .enemy {
      position: absolute;
      width: 50px;
      height: 50px;
      background-image: url("https://raw.githubusercontent.com/Yiyuss/my-game/main/02.png");
      background-size: cover;
    }

    #start-btn {
      position: absolute;
      top: 20px;
      left: 20px;
      padding: 10px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
    }

    #score, #time {
      position: absolute;
      top: 20px;
      color: white;
      font-size: 24px;
    }

    #time {
      left: 150px;
    }

    #score {
      left: 80px;
    }

    #video-overlay {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      justify-content: center;
      align-items: center;
    }

    #end-video {
      width: 80%;
      height: 80%;
    }
  </style>
</head>
<body>

  <div id="game-container">
    <div id="player"></div>
    <button id="start-btn">Start Game</button>
    <div id="score">0</div>
    <div id="time">0</div>
    <div id="video-overlay">
      <iframe id="end-video" src="" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
    </div>
  </div>

  <audio id="hit-sound" src="https://raw.githubusercontent.com/Yiyuss/my-game/main/hit-sound.mp3"></audio>

  <script src="https://raw.githubusercontent.com/Yiyuss/my-game/main/script.js"></script>
</body>
</html>
