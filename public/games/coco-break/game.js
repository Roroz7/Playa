const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const hud = document.getElementById("hud");
const scoreDisplay = document.getElementById("score-display");
const livesDisplay = document.getElementById("lives-display");
const finalScoreDisplay = document.getElementById("final-score");
const saveInfo = document.getElementById("save-info");

const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");

let animationId;
let isPlaying = false;

// Variables de jeu
let score = 0;
let lives = 3;

// Paddle (La planche en bambou)
const paddle = {
  width: 100,
  height: 20,
  x: canvas.width / 2 - 50,
  y: canvas.height - 40,
  speed: 8,
  dx: 0
};

// Balle (La noix de coco)
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  radius: 10,
  speed: 5,
  dx: 4,
  dy: -4
};

// Briques
const brickRowCount = 5;
const brickColumnCount = 9;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 60;
const brickOffsetLeft = 20;

let bricks = [];

function initBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      // Couleurs tropicales pour les briques
      const colors = ["#FF6B6B", "#FFD166", "#06D6A0", "#118AB2", "#EF476F"];
      bricks[c][r] = { x: 0, y: 0, status: 1, color: colors[r % colors.length] };
    }
  }
}

// Dessins
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "#8B4513"; // Marron bois/bambou
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = "#F5DEB3"; // Couleur chair de coco
  ctx.fill();
  ctx.strokeStyle = "#5C4033"; // Coque marron
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.closePath();
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
        const brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = bricks[c][r].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function movePaddle() {
  paddle.x += paddle.dx;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebond murs (gauche, droite, haut)
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius) {
    // Si touche le bas = perte d'une vie
    lives--;
    livesDisplay.innerText = `Vies: ${lives}`;
    if (!lives) {
      gameOver();
    } else {
      resetBall();
    }
  }

  // Rebond paddle
  if (
    ball.x > paddle.x &&
    ball.x < paddle.x + paddle.width &&
    ball.y + ball.radius > paddle.y
  ) {
    ball.dy = -ball.dy;
    // Ajout d'un peu d'angle selon où ça tape
    let hitPoint = ball.x - (paddle.x + paddle.width / 2);
    ball.dx = hitPoint * 0.15;
  }
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (
          ball.x > b.x &&
          ball.x < b.x + brickWidth &&
          ball.y > b.y &&
          ball.y < b.y + brickHeight
        ) {
          ball.dy = -ball.dy;
          b.status = 0;
          score += 100;
          scoreDisplay.innerText = `Score: ${score}`;
          
          // Accélérer un peu la balle
          ball.speed += 0.05;
          
          // Vérifier la victoire
          let allBroken = true;
          for (let c = 0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
              if (bricks[c][r].status === 1) allBroken = false;
            }
          }
          if (allBroken) {
            // Victoire = on recrée un niveau plus dur
            score += 1000;
            initBricks();
            resetBall();
            paddle.width = Math.max(50, paddle.width - 10);
          }
        }
      }
    }
  }
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height - 60;
  ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
  ball.dy = -4;
  paddle.x = canvas.width / 2 - paddle.width / 2;
}

function update() {
  if (!isPlaying) return;

  // Effacer
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Dessiner
  drawBricks();
  drawPaddle();
  drawBall();

  // Bouger
  movePaddle();
  moveBall();
  collisionDetection();

  animationId = requestAnimationFrame(update);
}

function startGame() {
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  
  score = 0;
  lives = 3;
  scoreDisplay.innerText = `Score: ${score}`;
  livesDisplay.innerText = `Vies: ${lives}`;
  
  initBricks();
  resetBall();
  
  isPlaying = true;
  update();
}

function gameOver() {
  isPlaying = false;
  cancelAnimationFrame(animationId);
  hud.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalScoreDisplay.innerText = score;
  
  // Envoi du score à la plateforme parente via postMessage !
  try {
    saveInfo.innerText = "Envoi du score en cours...";
    window.parent.postMessage({
      type: "SUBMIT_SCORE",
      score: score
    }, "*"); // Dans un vrai projet, spécifier l'origine cible
    saveInfo.innerText = "Score envoyé à la plateforme !";
  } catch(e) {
    saveInfo.innerText = "";
  }
}

// Contrôles
document.addEventListener("keydown", (e) => {
  if (e.key === "Right" || e.key === "ArrowRight") {
    paddle.dx = paddle.speed;
  } else if (e.key === "Left" || e.key === "ArrowLeft") {
    paddle.dx = -paddle.speed;
  }
});

document.addEventListener("keyup", (e) => {
  if (
    e.key === "Right" ||
    e.key === "ArrowRight" ||
    e.key === "Left" ||
    e.key === "ArrowLeft"
  ) {
    paddle.dx = 0;
  }
});

// Support souris
canvas.addEventListener("mousemove", (e) => {
  const relativeX = e.clientX - canvas.offsetLeft;
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2;
  }
});

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", startGame);

// Dessin initial
initBricks();
drawBricks();
drawPaddle();
drawBall();
