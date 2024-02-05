// Copyright (c) 2019 ml5
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */

// Classifier Variable
let classifier;

// Model URL
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/K54KJdVXx/';

// Video
let video;
let flippedVideo;

// To store the classification
let label = "";

// Dinosaur and Obstacle
const dinosaur = document.getElementById('dinosaur');
const obstacle = document.querySelector('.obstacle');

// Jumping flag
let isJumping = false;

// Event listeners
document.addEventListener('keydown', jump);

// Setup
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(128, 96);
  video = createCapture(VIDEO);
  video.size(128, 96);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  moveObstacle();
  classifyVideo();
}

// Main game loop
function draw() {
  background(0);

  // Draw the video
  image(flippedVideo, 0, 0, width, height);

  // Draw the game elements
  displayLabel();
  drawDinosaur();
  drawObstacle();
}

// Add this function to draw the dinosaur
function drawDinosaur() {
  fill(255, 0, 0); // Red color for the dinosaur
  noStroke();
  rect(dinosaurPositionX, height - dinosaurHeight, dinosaurWidth, dinosaurHeight);
}

// Add this function to draw the obstacle
function drawObstacle() {
  fill(0, 255, 0); // Green color for the obstacle
  noStroke();
  rect(obstaclePositionX, height - obstacleHeight, obstacleWidth, obstacleHeight);
}
// Display label
function displayLabel() {
  fill(255);
  textSize(16);
  textAlign(CENTER);

  if (label) {
    text(label, width / 2, height - 4);
  }
}

// Jump function
function jump(event) {
  if (event.code === 'Space' && !isJumping) {
    isJumping = true;
    jumpUp();
  }
}

// Move obstacle
function moveObstacle() {
  let obstaclePosition = parseInt(getComputedStyle(obstacle).getPropertyValue('right'));

  if (obstaclePosition > 0) {
    obstaclePosition -= 5;
    obstacle.style.right = obstaclePosition + 'px';
  } else {
    obstacle.style.right = '100vw';
  }

  setTimeout(function () {
    requestAnimationFrame(moveObstacle);
    checkCollision();
  }, 100);
}

// Collision check
function checkCollision() {
  const dinoRect = dinosaur.getBoundingClientRect();
  const obstacleRect = obstacle.getBoundingClientRect();

  if (
    dinoRect.bottom > obstacleRect.top &&
    dinoRect.top < obstacleRect.bottom &&
    dinoRect.right > obstacleRect.left &&
    dinoRect.left < obstacleRect.right
  ) {
    gameOver();
  }
}

// Game over function
function gameOver() {
  alert('Game Over!');
  location.reload();
}

// Jump up function
function jumpUp() {
  let currentPosition = parseInt(getComputedStyle(dinosaur).getPropertyValue('bottom'));

  if (currentPosition < 100) {
    currentPosition += 50;
    dinosaur.style.bottom = currentPosition + 'px';
  } else {
    jumpDown();
  }
}

// Jump down function
function jumpDown() {
  let currentPosition = parseInt(getComputedStyle(dinosaur).getPropertyValue('bottom'));

  if (currentPosition > 0) {
    currentPosition -= 50;
    dinosaur.style.bottom = currentPosition + 'px';
  } else {
    isJumping = false;
  }
}

// Video classification
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When result is obtained
function gotResult(error, results) {
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;
  classifyVideo();
}
