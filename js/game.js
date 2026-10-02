const umbrella = document.getElementById("umbrella");
const gameArea = document.getElementById("game-area");
const scoreElement = document.getElementById("score");
const timeElement = document.getElementById("time");
const titleBack = document.getElementById("title-back");
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const startButton = document.getElementById("start-button");
const gameOverScreen = document.getElementById("game-over-screen");
const finalScore = document.getElementById("final-score");
const restartButton = document.getElementById("restart-button");
const restartCountdown = document.getElementById("restart-countdown");
const countdown = document.getElementById("countdown");
let score = 0;
let time = 30;
let gameOver = false;
let spawnTimer;
let timer;
const items = [
  {
    image: "./img/same.PNG",
    type: "shark",
    score: 7,
    speed: 6,
  },
  {
    image: "./img/same.PNG",
    type: "shark",
    score: 10,
    speed: 7,
  },
  {
    image: "./img/red.PNG",
    type: "candy",
    speed: 5,
  },
  {
    image: "./img/blue.PNG",
    type: "candy",
    speed: 4,
  },
  {
    image: "./img/violet.PNG",
    type: "candy",
    speed: 5,
  },
  {
    image: "./img/pink.PNG",
    type: "candy",
    speed: 4,
  },
  {
    image: "./img/green.PNG",
    type: "candy",
    speed: 6,
  },
  {
    image: "./img/yellow.PNG",
    type: "candy",
    speed: 5,
  },
  {
    image: "./img/onion1.PNG",
    type: "onion",
    score: -3,
    speed: 6,
  },
  {
    image: "./img/onion1.PNG",
    type: "onion",
    score: -5,
    speed: 7,
  },
  {
    image: "./img/onion2.PNG",
    type: "onion",
    score: -7,
    speed: 8,
  },
];
let activeItems = [];
// メンバーカラー
const memberColors = [
  "#E53935", // 暇72：赤
  "#4FC3F7", // 雨乃こさめ：水色
  "#9B59B6", // いるま：紫
  "#E91E63", // LAN：ピンク
  "#4CAF50", // すち：緑
  "#FBC02D", // みこと：黄色
];
// カウントダウンの色をランダムに
function setRandomMemberColor(target) {
  const randomColor = memberColors[Math.floor(Math.random() * memberColors.length)];
  target.style.color = randomColor;
}
// ゲーム開始カウントダウン
startButton.addEventListener("click", function () {
  // STARTを押した時点で音声再生を許可してもらう
  playSE(countdownSE);
  // メンバーカラーをランダムに設定
  setRandomMemberColor(countdown);
  // STARTを押したら説明文を消す
  document.querySelectorAll(".caption").forEach(function (caption) {
    caption.style.display = "none";
  });
  startButton.style.display = "none";
  let count = 3;
  countdown.textContent = count;
  playSE(countdownSE);
  const countdownTimer = setInterval(function () {
    count--;
    if (count > 0) {
      countdown.textContent = count;
      playSE(countdownSE);
    } else {
      clearInterval(countdownTimer);
      countdown.textContent = "はじまるよ～ん";
      playSE(startSE);
      setTimeout(function () {
        titleScreen.style.display = "none";
        gameScreen.style.display = "block";
        countdown.textContent = "";
        startGame();
      }, 700);
    }
  }, 1000);
});
// ゲーム開始
function startGame() {
  playRandomBGM();
  score = 0;
  time = 30;
  gameOver = false;
  activeItems = [];
  scoreElement.textContent = score;
  timeElement.textContent = time;
  scoreElement.classList.remove("score-minus");
  umbrellaX = 50;
  umbrella.style.left = umbrellaX + "%";
  createItems();
  spawnTimer = setInterval(function () {
    if (!gameOver) {
      createItems();
    }
  }, 1100);
  fall();
  timer = setInterval(function () {
    time--;
    timeElement.textContent = time;
    if (time <= 0) {
      endGame();
    }
  }, 1000);
}
// ゲーム終了
function endGame() {
  gameOver = true;
  stopBGM();
  playSE(gameoverSE);
  clearInterval(timer);
  clearInterval(spawnTimer);
  activeItems.forEach(function (item) {
    item.element.remove();
  });
  activeItems = [];
  finalScore.textContent = score;
  gameScreen.style.display = "none";
  gameOverScreen.style.display = "flex";
}
// アイテム
function createItem() {
  const itemData = items[Math.floor(Math.random() * items.length)];
  let itemScore;
  if (itemData.type === "candy") {
    itemScore = Math.floor(Math.random() * 4) + 1;
  } else {
    itemScore = itemData.score;
  }
  const item = document.createElement("div");
  item.className = "item";
  item.dataset.type = itemData.type;
  item.dataset.score = itemScore;
  const img = document.createElement("img");
  img.src = itemData.image;
  img.alt = "";

  item.appendChild(img);
  gameArea.appendChild(item);
  const maxX = gameArea.clientWidth - 80;
  const randomX = Math.random() * maxX;

  item.style.left = randomX + "px";
  const y = -100;
  item.style.top = y + "px";

  activeItems.push({
    element: item,
    y: y,
    speed: itemData.speed,
    score: itemScore,
  });
}
function createItems() {
  const itemCount = Math.floor(Math.random() * 4) + 1;
  for (let i = 0; i < itemCount; i++) {
    createItem();
  }
}
// 傘を動かす
let umbrellaX = 50;
function moveUmbrella(direction) {
  if (gameOver || gameScreen.style.display === "none") {
    return;
  }
  umbrellaX += direction * 5;
  if (umbrellaX < 0) {
    umbrellaX = 0;
  }
  if (umbrellaX > 100) {
    umbrellaX = 100;
  }
  umbrella.style.left = umbrellaX + "%";
}
// PC：キーボード操作
document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    moveUmbrella(-1);
  }
  if (event.key === "ArrowRight") {
    moveUmbrella(1);
  }
});
// PC・スマホ：画面上のボタン操作
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");
leftButton.addEventListener("pointerdown", function (event) {
  event.preventDefault();
  moveUmbrella(-1);
});
rightButton.addEventListener("pointerdown", function (event) {
  event.preventDefault();
  moveUmbrella(1);
});
// スマホのスワイプ操作
let touchStartX = 0;
gameArea.addEventListener("touchstart", function (event) {
  touchStartX = event.touches[0].clientX;
});
gameArea.addEventListener(
  "touchmove",
  function (event) {
    if (gameOver) {
      return;
    }
    const touchX = event.touches[0].clientX;
    const diffX = touchX - touchStartX;
    if (Math.abs(diffX) > 10) {
      if (diffX > 0) {
        moveUmbrella(1);
      } else {
        moveUmbrella(-1);
      }
      touchStartX = touchX;
    }
    event.preventDefault();
  },
  { passive: false },
);
// 当たり判定
function checkCollision(item) {
  const umbrellaRect = umbrella.getBoundingClientRect();
  const itemRect = item.element.getBoundingClientRect();

  const itemLeft = itemRect.left + 20;
  const itemRight = itemRect.right - 20;
  const itemTop = itemRect.top + 20;
  const itemBottom = itemRect.bottom - 20;

  const shrinkAmount = window.innerWidth <= 600 ? 25 : 40;
  const umbrellaLeft = umbrellaRect.left + shrinkAmount;
  const umbrellaRight = umbrellaRect.right - shrinkAmount;
  const umbrellaTop = umbrellaRect.top + 80;
  const umbrellaBottom = umbrellaRect.bottom - 20;

  if (itemLeft < umbrellaRight && itemRight > umbrellaLeft && itemTop < umbrellaBottom && itemBottom > umbrellaTop) {
    return true;
  }
  return false;
}
// キャッチ
function catchItem(item) {
  score += item.score;
  scoreElement.textContent = score;
  if (item.score < 0) {
    playSE(onionSE);
    scoreElement.classList.add("score-minus");
    setTimeout(function () {
      scoreElement.classList.remove("score-minus");
    }, 500);
  } else if (item.element.dataset.type === "shark") {
    playSE(sharkSE);
  } else if (item.element.dataset.type === "candy") {
    playSE(candySE);
  }
  item.element.remove();
  const index = activeItems.indexOf(item);
  if (index !== -1) {
    activeItems.splice(index, 1);
  }
}
// アイテムを落とす
function fall() {
  if (gameOver) {
    return;
  }
  for (let i = activeItems.length - 1; i >= 0; i--) {
    const item = activeItems[i];
    item.y += item.speed;
    item.element.style.top = item.y + "px";
    if (checkCollision(item)) {
      catchItem(item);
      continue;
    }
    if (item.y > gameArea.clientHeight) {
      item.element.remove();
      activeItems.splice(i, 1);
    }
  }
  requestAnimationFrame(fall);
}
// もう一度遊ぶ
restartButton.addEventListener("click", function () {
  // リスタート用カウントダウンもランダムカラー
  setRandomMemberColor(restartCountdown);
  restartButton.style.display = "none";
  let count = 3;
  restartCountdown.textContent = count;
  playSE(countdownSE);
  const restartTimer = setInterval(function () {
    count--;
    if (count > 0) {
      restartCountdown.textContent = count;
      playSE(countdownSE);
    } else {
      clearInterval(restartTimer);
      restartCountdown.textContent = "はじまるよ～ん";
      playSE(startSE);
      setTimeout(function () {
        gameOverScreen.style.display = "none";
        gameScreen.style.display = "block";
        restartCountdown.textContent = "";
        restartButton.style.display = "";
        startGame();
      }, 700);
    }
  }, 1000);
});
// タイトル画面に戻る
titleBack.addEventListener("click", function (e) {
  e.preventDefault();
  stopBGM();
  gameOverScreen.style.display = "none";
  titleScreen.style.display = "flex";
  countdown.textContent = "";
  startButton.style.display = "";
  document.querySelectorAll(".caption").forEach(function (caption) {
    caption.style.display = "";
  });
  restartCountdown.textContent = "";
  restartButton.style.display = "";
});
// BGM・効果音
const bgmList = ["./sound/bgm/bgm01.mp3", "./sound/bgm/bgm02.mp3", "./sound/bgm/bgm03.mp3"];
const countdownSE = new Audio("./sound/se/countdown.mp3");
const startSE = new Audio("./sound/se/start.mp3");
const candySE = new Audio("./sound/se/candy.mp3");
const sharkSE = new Audio("./sound/se/shark.mp3");
const onionSE = new Audio("./sound/se/onion.mp3");
const gameoverSE = new Audio("./sound/se/gameover.mp3");

let bgm = new Audio();
let lastBGMIndex = -1;
let soundEnabled = true;

// BGMをランダム再生
function playRandomBGM() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * bgmList.length);
  } while (bgmList.length > 1 && randomIndex === lastBGMIndex);
  lastBGMIndex = randomIndex;
  bgm.src = bgmList[randomIndex];
  bgm.loop = true;
  bgm.volume = 0.3;
  if (soundEnabled) {
    bgm.play().catch(function (error) {
      console.log("BGMを再生できませんでした:", error);
    });
  }
}
// BGM停止
function stopBGM() {
  bgm.pause();
  bgm.currentTime = 0;
}
// SE再生
function playSE(sound) {
  if (!soundEnabled) {
    return;
  }
  sound.currentTime = 0;
  sound.play().catch(function (error) {
    console.log("SEを再生できませんでした:", error);
  });
}
const soundToggle = document.getElementById("sound-toggle");
soundToggle.addEventListener("click", function () {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    soundToggle.textContent = "🔊";
    soundToggle.classList.remove("sound-off");
    if (gameScreen.style.display !== "none" && gameOverScreen.style.display === "none") {
      bgm.play().catch(function (error) {
        console.log("BGMを再生できませんでした:", error);
      });
    }
  } else {
    soundToggle.textContent = "🔇";
    soundToggle.classList.add("sound-off");
    bgm.pause();
    bgm.currentTime = 0;
    countdownSE.pause();
    countdownSE.currentTime = 0;
    startSE.pause();
    startSE.currentTime = 0;
    candySE.pause();
    candySE.currentTime = 0;
    sharkSE.pause();
    sharkSE.currentTime = 0;
    onionSE.pause();
    onionSE.currentTime = 0;
    gameoverSE.pause();
    gameoverSE.currentTime = 0;
  }
});
