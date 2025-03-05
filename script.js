const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game settings
const tileSize = 20; // Size of each tile
const rows = canvas.height / tileSize; // Number of rows
const columns = canvas.width / tileSize; // Number of columns

// Pac-Man
let pacman = {
  x: 1,
  y: 1,
  speed: 0.5, // Slower speed
  direction: "right",
};

// Ghosts
const ghosts = [
  { x: 10, y: 10, speed: 0.4, direction: "left" }, // Slower speed
  { x: 15, y: 10, speed: 0.4, direction: "right" }, // Slower speed
];

// Pellets
let pellets = [];
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < columns; j++) {
    pellets.push({ x: j, y: i });
  }
}

// Walls (customize this to create your maze)
const walls = [
  // Horizontal walls
  { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }, { x: 4, y: 1 }, { x: 5, y: 1 },
  { x: 7, y: 1 }, { x: 8, y: 1 }, { x: 9, y: 1 }, { x: 10, y: 1 }, { x: 11, y: 1 },
  { x: 1, y: 3 }, { x: 2, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }, { x: 5, y: 3 },
  { x: 7, y: 3 }, { x: 8, y: 3 }, { x: 9, y: 3 }, { x: 10, y: 3 }, { x: 11, y: 3 },
  { x: 1, y: 5 }, { x: 2, y: 5 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 5, y: 5 },
  { x: 7, y: 5 }, { x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 5 }, { x: 11, y: 5 },
  { x: 1, y: 7 }, { x: 2, y: 7 }, { x: 3, y: 7 }, { x: 4, y: 7 }, { x: 5, y: 7 },
  { x: 7, y: 7 }, { x: 8, y: 7 }, { x: 9, y: 7 }, { x: 10, y: 7 }, { x: 11, y: 7 },

  // Vertical walls
  { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }, { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 1, y: 7 },
  { x: 5, y: 1 }, { x: 5, y: 2 }, { x: 5, y: 3 }, { x: 5, y: 4 }, { x: 5, y: 5 }, { x: 5, y: 6 }, { x: 5, y: 7 },
  { x: 7, y: 1 }, { x: 7, y: 2 }, { x: 7, y: 3 }, { x: 7, y: 4 }, { x: 7, y: 5 }, { x: 7, y: 6 }, { x: 7, y: 7 },
  { x: 11, y: 1 }, { x: 11, y: 2 }, { x: 11, y: 3 }, { x: 11, y: 4 }, { x: 11, y: 5 }, { x: 11, y: 6 }, { x: 11, y: 7 },
];

// Game state
let score = 0;
let gameOver = false;

// Draw Pac-Man
function drawPacman() {
  ctx.beginPath();
  ctx.arc(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2,
    tileSize / 2,
    0.2 * Math.PI,
    1.8 * Math.PI
  );
  ctx.lineTo(
    pacman.x * tileSize + tileSize / 2,
    pacman.y * tileSize + tileSize / 2
  );
  ctx.fillStyle = "yellow";
  ctx.fill();
  ctx.closePath();
}

// Draw ghosts
function drawGhosts() {
  ghosts.forEach((ghost) => {
    ctx.beginPath();
    ctx.arc(
      ghost.x * tileSize + tileSize / 2,
      ghost.y * tileSize + tileSize / 2,
      tileSize / 2,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  });
}

// Draw pellets
function drawPellets() {
  pellets.forEach((pellet) => {
    ctx.beginPath();
    ctx.arc(
      pellet.x * tileSize + tileSize / 2,
      pellet.y * tileSize + tileSize / 2,
      3,
      0,
      2 * Math.PI
    );
    ctx.fillStyle = "white";
    ctx.fill();
    ctx.closePath();
  });
}

// Draw walls
function drawWalls() {
  walls.forEach((wall) => {
    ctx.fillStyle = "blue";
    ctx.fillRect(wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
  });
}

// Check collision with walls
function checkWallCollision(x, y) {
  return walls.some((wall) => wall.x === x && wall.y === y);
}

// Move Pac-Man
function movePacman() {
  let newX = pacman.x;
  let newY = pacman.y;

  if (pacman.direction === "right") newX += pacman.speed;
  if (pacman.direction === "left") newX -= pacman.speed;
  if (pacman.direction === "up") newY -= pacman.speed;
  if (pacman.direction === "down") newY += pacman.speed;

  // Check for wall collision
  if (!checkWallCollision(Math.floor(newX), Math.floor(newY))) {
    pacman.x = newX;
    pacman.y = newY;
  }

  // Wrap around the screen
  if (pacman.x < 0) pacman.x = columns - 1;
  if (pacman.x >= columns) pacman.x = 0;
  if (pacman.y < 0) pacman.y = rows - 1;
  if (pacman.y >= rows) pacman.y = 0;

  // Check for pellet collection
  pellets = pellets.filter((pellet) => {
    if (Math.floor(pellet.x) === Math.floor(pacman.x) && Math.floor(pellet.y) === Math.floor(pacman.y)) {
      score++;
      return false;
    }
    return true;
  });

  // Check for ghost collision
  ghosts.forEach((ghost) => {
    if (Math.floor(ghost.x) === Math.floor(pacman.x) && Math.floor(ghost.y) === Math.floor(pacman.y)) {
      gameOver = true;
    }
  });
}

// Move ghosts
function moveGhosts() {
  ghosts.forEach((ghost) => {
    let newX = ghost.x;
    let newY = ghost.y;

    if (ghost.direction === "right") newX += ghost.speed;
    if (ghost.direction === "left") newX -= ghost.speed;
    if (ghost.direction === "up") newY -= ghost.speed;
    if (ghost.direction === "down") newY += ghost.speed;

    // Check for wall collision
    if (!checkWallCollision(Math.floor(newX), Math.floor(newY))) {
      ghost.x = newX;
      ghost.y = newY;
    } else {
      // Change direction if hitting a wall
      const directions = ["left", "right", "up", "down"];
      ghost.direction = directions[Math.floor(Math.random() * directions.length)];
    }

    // Wrap around the screen
    if (ghost.x < 0) ghost.x = columns - 1;
    if (ghost.x >= columns) ghost.x = 0;
    if (ghost.y < 0) ghost.y = rows - 1;
    if (ghost.y >= rows) ghost.y = 0;
  });
}

// Handle keyboard input
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") pacman.direction = "right";
  if (e.key === "ArrowLeft") pacman.direction = "left";
  if (e.key === "ArrowUp") pacman.direction = "up";
  if (e.key === "ArrowDown") pacman.direction = "down";
});

// Game loop
function gameLoop() {
  if (!gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawWalls();
    drawPellets();
    drawPacman();
    drawGhosts();

    movePacman();
    moveGhosts();

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(`Score: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
  } else {
    ctx.fillStyle = "white";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Start the game
gameLoop();
