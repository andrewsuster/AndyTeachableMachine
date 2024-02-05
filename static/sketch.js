// Copyright (c) 2019 ml5
//
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
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/q_6tzXFwq/';

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";

// Player (Dinosaur) variables
let playerY;
let playerHeight = 50; // Adjusted player height
let jumpHeight = 200; // Adjusted to jump twice as high
let isJumping = false;

// Scrolling Object variables
let objectX;
let objectWidth = 30;
let obstacleHeight = 250; // Adjusted obstacle height
let scrollSpeed = 5;

// Game state variables
let isGameOver = false;

// Load the model first
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
}

function setup() {
  createCanvas(1280, 650);
  // Create the video
  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);

  // Initialize player position
  playerY = height - playerHeight;

  // Initialize scrolling object position
  objectX = width;

  // Start classifying
  classifyVideo();
}

function draw() {
  background(0);

  // Draw the video
  image(flippedVideo, 1000, 0);

  // Draw the label
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 1.1, height / 2.5);

  // Check for collision between player and obstacles
  if (
    // Collision with top obstacle
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= height - playerHeight &&
    playerY + playerHeight >= height - obstacleHeight) ||
    // Collision with bottom obstacle
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= obstacleHeight &&
    playerY + playerHeight >= 0)
  ) {
    // Collision occurred, game over
    isGameOver = true;
  }

  if (isGameOver) {
    fill(255, 0, 0); // Red color
    textSize(32);
    textAlign(CENTER);
    text('Game Over', width / 2, height / 2);

    fill(100, 100, 100);
    textSize(15);
    text('Press (Space) to Start Again!', width / 2, (height / 2)+25);
    return; // Stop drawing further if game over
  }

  // Draw the player (dinosaur)
  fill(255, 0, 0); // Red color
  rect(100, playerY, 50, playerHeight);

  // Draw the scrolling obstacles
  fill(0, 0, 255); // Blue color
  rect(objectX, height - obstacleHeight, objectWidth, obstacleHeight);
  rect(objectX, 0, objectWidth, obstacleHeight);

  // Update scrolling object position
  objectX -= scrollSpeed;

  // Check if the scrolling object is off the screen
  if (objectX + objectWidth < 0) {
    // Reset the object to the right of the screen
    objectX = width;
  }

  // Update player position
  if (isJumping) {
    playerY -= 5;
    if (playerY < height - playerHeight - jumpHeight) {
      isJumping = false;
    }
  } else if (playerY < height - playerHeight) {
    playerY += 5;
  }
}

// Get a prediction for the current video frame
function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

// When we get a result
function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }
  // The results are in an array ordered by confidence.
  // console.log(results[0]);
  label = results[0].label;

  // Check for open fist to trigger jump
  if (label === 'Open') {
    if (!isGameOver) {
      jump();
    } else {
      // Restart the game
      isGameOver = false;
      playerY = height - playerHeight;
      objectX = width;
    }
  }

  // Check for 'Jump' to trigger jump
  if (label === 'Jump') {
    jump();
  }

  // Classify again!
  classifyVideo();
}

// Function to handle jump (can be triggered with spacebar)
function jump() {
  if (!isJumping) {
    isJumping = true;
  }
}

// Handle spacebar press to restart the game
function keyPressed() {
  if (keyCode === 32 && isGameOver) { // 32 is the keycode for the spacebar
    // Restart the game
    isGameOver = false;
    playerY = height - playerHeight;
    objectX = width;
  }
}
