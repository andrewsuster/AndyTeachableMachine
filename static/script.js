const dinosaur = document.getElementById('dinosaur');
const obstacle = document.querySelector('.obstacle');

let isJumping = false;

document.addEventListener('keydown', jump);

function jump(event) {
  if (event.code === 'Space' && !isJumping) {
    isJumping = true;
    jumpUp();
  }
}

function jumpUp() {
  let currentPosition = parseInt(getComputedStyle(dinosaur).getPropertyValue('bottom'));

  if (currentPosition < 100) {
    currentPosition += 50;
    dinosaur.style.bottom = currentPosition + 'px';
  } else {
    jumpDown();
  }
}

function jumpDown() {
  let currentPosition = parseInt(getComputedStyle(dinosaur).getPropertyValue('bottom'));

  if (currentPosition > 0) {
    currentPosition -= 50;
    dinosaur.style.bottom = currentPosition + 'px';
  } else {
    isJumping = false;
  }
}

function moveObstacle() {
  let obstaclePosition = parseInt(getComputedStyle(obstacle).getPropertyValue('right'));

  if (obstaclePosition > 0) {
    obstaclePosition -= 5;
    obstacle.style.right = obstaclePosition + 'px';
  } else {
    obstacle.style.right = '100vw';
  }

  requestAnimationFrame(moveObstacle);

  checkCollision();
}

function checkCollision() {
  const dinoRect = dinosaur.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    dinoRect.bottom > obstacleRect.top &&
    dinoRect.top < obstacleRect.bottom &&
    dinoRect.right > obstacleRect.left &&
    dinoRect.left < obstacleRect.right
  ) {
    alert('Game Over!');
    location.reload();
  }
}

moveObstacle();
