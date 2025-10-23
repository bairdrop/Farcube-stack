const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const scoreText = document.getElementById("scoreText");

let stack = [];
let currentCube;
let cubeSpeed = 3;
let gameOver = false;
let score = 0;

const cubeWidth = 100;
const cubeHeight = 20;

function resetGame() {
  stack = [{ x: 150, y: 580, width: cubeWidth }];
  cubeSpeed = 3;
  score = 0;
  gameOver = false;
  newCube();
  draw();
}

function newCube() {
  const lastCube = stack[stack.length - 1];
  currentCube = {
    x: 0,
    y: lastCube.y - cubeHeight,
    width: lastCube.width,
    dir: 1
  };
}

function update() {
  if (gameOver) return;

  currentCube.x += cubeSpeed * currentCube.dir;
  if (currentCube.x + currentCube.width > canvas.width || currentCube.x < 0) {
    currentCube.dir *= -1;
  }

  draw();
  requestAnimationFrame(update);
}

function dropCube() {
  if (gameOver) return;

  const lastCube = stack[stack.length - 1];
  const delta = currentCube.x - lastCube.x;

  // Missed completely
  if (Math.abs(delta) > lastCube.width) {
    endGame();
    return;
  }

  // Trim cube width based on alignment
  const overlap = lastCube.width - Math.abs(delta);
  const newX = delta > 0 ? currentCube.x : lastCube.x;
  stack.push({ x: newX, y: currentCube.y, width: overlap });
  score++;
  scoreText.innerText = `Score: ${score}`;
  newCube();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stack.forEach(cube => {
    ctx.fillStyle = "#22d3ee";
    ctx.fillRect(cube.x, cube.y, cube.width, cubeHeight);
  });
  ctx.fillStyle = "#facc15";
  ctx.fillRect(currentCube.x, currentCube.y, currentCube.width, cubeHeight);
}

function endGame() {
  gameOver = true;
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Game Over!", 130, 300);
  ctx.fillText(`Final Score: ${score}`, 130, 340);
}

startBtn.addEventListener("click", () => {
  resetGame();
  update();
});

canvas.addEventListener("click", dropCube);
