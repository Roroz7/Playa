const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// DOM Elements
const startScreen = document.getElementById("start-screen");
const gameOverScreen = document.getElementById("game-over-screen");
const hud = document.getElementById("hud");
const scoreDisplay = document.getElementById("score");
const finalScoreDisplay = document.getElementById("final-score");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const submitStatus = document.getElementById("submit-status");

// Game Variables
let frames = 0;
let score = 0;
let gameSpeed = 5;
let isGameOver = false;
let isPlaying = false;
let animationId;

// Physics
const GRAVITY = 0.6;

// Crab Object
const crab = {
  x: 50,
  y: 0,
  width: 40,
  height: 40,
  dy: 0,
  jumpForce: 12,
  grounded: false,
  
  draw() {
    // Corps
    ctx.fillStyle = "#FF6B6B";
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Yeux
    ctx.fillStyle = "white";
    ctx.fillRect(this.x + 25, this.y + 5, 8, 8);
    ctx.fillStyle = "black";
    ctx.fillRect(this.x + 28, this.y + 8, 4, 4);
    
    // Pince
    ctx.fillStyle = "#C92A2A";
    ctx.fillRect(this.x + 35, this.y + 10, 10, 10);
  },
  
  update() {
    this.y += this.dy;
    
    // Gravity
    if (this.y + this.height < canvas.height - 40) {
      this.dy += GRAVITY;
      this.grounded = false;
    } else {
      this.dy = 0;
      this.y = canvas.height - 40 - this.height;
      this.grounded = true;
    }
  },
  
  jump() {
    if (this.grounded) {
      this.dy = -this.jumpForce;
    }
  }
};

// Obstacles
const obstacles = [];

class Obstacle {
  constructor() {
    this.width = 30 + Math.random() * 20;
    this.height = 30 + Math.random() * 50;
    this.x = canvas.width;
    this.y = canvas.height - 40 - this.height;
  }
  
  draw() {
    ctx.fillStyle = "#E6C280"; // Sand color
    ctx.fillRect(this.x, this.y, this.width, this.height);
    
    // Sandcastle details
    ctx.fillStyle = "#D4AF37";
    ctx.fillRect(this.x, this.y, this.width / 3, 10);
    ctx.fillRect(this.x + (this.width / 3) * 2, this.y, this.width / 3, 10);
  }
  
  update() {
    this.x -= gameSpeed;
  }
}

function handleObstacles() {
  if (frames % (Math.floor(80 + Math.random() * 60)) === 0) {
    obstacles.push(new Obstacle());
  }
  
  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].update();
    obstacles[i].draw();
    
    // Collision Detection
    if (
      crab.x < obstacles[i].x + obstacles[i].width &&
      crab.x + crab.width > obstacles[i].x &&
      crab.y < obstacles[i].y + obstacles[i].height &&
      crab.y + crab.height > obstacles[i].y
    ) {
      gameOver();
    }
    
    // Remove off-screen obstacles
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1);
      i--;
      score += 10;
    }
  }
}

function drawBackground() {
  // Ciel
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height - 40);

  // Soleil
  ctx.fillStyle = "#FFD93D";
  ctx.beginPath();
  ctx.arc(700, 80, 40, 0, Math.PI * 2);
  ctx.fill();

  // Sable
  ctx.fillStyle = "#F5DEB3";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
}

function updateGame() {
  if (isGameOver) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBackground();
  
  crab.update();
  crab.draw();
  
  handleObstacles();
  
  // Acceleration
  if (frames % 600 === 0 && gameSpeed < 15) {
    gameSpeed += 0.5;
  }
  
  // Score based on survival time
  if (frames % 10 === 0) {
    score += 1;
    scoreDisplay.innerText = score;
  }
  
  frames++;
  animationId = requestAnimationFrame(updateGame);
}

function resetGame() {
  crab.y = canvas.height - 40 - crab.height;
  crab.dy = 0;
  obstacles.length = 0;
  score = 0;
  frames = 0;
  gameSpeed = 6;
  isGameOver = false;
  scoreDisplay.innerText = score;
}

function startGame() {
  startScreen.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  hud.classList.remove("hidden");
  
  resetGame();
  isPlaying = true;
  updateGame();
}

function gameOver() {
  isGameOver = true;
  isPlaying = false;
  cancelAnimationFrame(animationId);
  
  hud.classList.add("hidden");
  gameOverScreen.classList.remove("hidden");
  finalScoreDisplay.innerText = score;
  submitStatus.innerText = "Enregistrement du score...";
  
  // Send score to Playa platform
  window.parent.postMessage(
    {
      type: "GAME_OVER",
      score: score
    },
    "*"
  );
  
  setTimeout(() => {
    submitStatus.innerText = "Score enregistré ! ✓";
    submitStatus.style.color = "#FFD93D";
  }, 1000);
}

// Controls
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    if (isPlaying) {
      crab.jump();
    }
  }
});

window.addEventListener("mousedown", () => {
  if (isPlaying) {
    crab.jump();
  }
});

window.addEventListener("touchstart", (e) => {
  if (isPlaying) {
    e.preventDefault();
    crab.jump();
  }
}, { passive: false });

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", () => {
  submitStatus.innerText = "";
  submitStatus.style.color = "#4ECDC4";
  startGame();
});

// Initial draw
drawBackground();
crab.y = canvas.height - 40 - crab.height;
crab.draw();
