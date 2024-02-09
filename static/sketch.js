// Copyright (c) 2019 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Webcam Image Classification using a pre-trained customized model and p5.js
This example uses p5 preload function to create the classifier
=== */


let classifier;
let imageModelURL = 'https://teachablemachine.withgoogle.com/models/Op0AtSLBE/';


let video;
let flippedVideo;
let label = "";

//square
let playerY;
let playerHeight = 50; // Adjusted player height
let jumpHeight = 200; // Adjusted to jump twice as high
let isJumping = false;

//obstacle
let objectX;
let objectWidth = 30;
let obstacleHeight = 250; // Adjusted obstacle height
let scrollSpeed = 5;


let isGameOver = false;
let gameStarted = false;
let s2;
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
   s2 = loadImage('/static/s2.png');
}

function setup() {

  // Calculate the horizontal position to center the canvas
  let canvasX = (windowWidth - 1280) / 2;
  // Calculate the vertical position to center the canvas
  let canvasY = (windowHeight - 650)
  // Create the canvas with the calculated positions
  createCanvas(1280, 650).position(canvasX, canvasY);

  video = createCapture(VIDEO);
  video.size(320, 240);
  video.hide();

  flippedVideo = ml5.flipImage(video);
  playerY = height - playerHeight;
  objectX = width;

  classifyVideo();
}

function draw() {
  background(0);
  image(flippedVideo, 1000, 0);
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text(label, width / 1.1, height / 2.5);


    if (!gameStarted) {
    fill(100, 100,100,100); // Semi-transparent white
    rect(0, 0, width, height); // Draw transparent overlay
    fill(0);
    textSize(32);
    textAlign(CENTER);
    fill(255, 255, 255);
    text('Start Game With Spacebar', width / 2, height / 2);

    fill(150, 150, 150);
    textSize(23);
    text('(Please wait until webcam loads)', width / 2, (height / 2)+50);



    return; // Stop drawing further if game not started
  }

//collisions
  if (
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= height - playerHeight &&
    playerY + playerHeight >= height - obstacleHeight) ||
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= obstacleHeight &&
    playerY + playerHeight >= 0)
  ) {
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

//player
  fill(0, 0, 0,0);
  rect(100, playerY, 50, playerHeight);
  image(s2, 100, playerY, 50, playerHeight);

//obstacles
  fill(0, 255, 0);
  rect(objectX, height - obstacleHeight, objectWidth, obstacleHeight);
  rect(objectX, 0, objectWidth, obstacleHeight);

  objectX -= scrollSpeed;

//obstacle reset
  if (objectX + objectWidth < 0) {
    objectX = width;
  }

  if (isJumping) {
    playerY -= 5;
    if (playerY < height - playerHeight - jumpHeight) {
      isJumping = false;
    }
  } else if (playerY < height - playerHeight) {
    playerY += 5;
  }
}

function classifyVideo() {
  flippedVideo = ml5.flipImage(video);
  classifier.classify(flippedVideo, gotResult);
}

function gotResult(error, results) {
  // If there is an error
  if (error) {
    console.error(error);
    return;
  }

  label = results[0].label;


//jump
  if (label === 'Jump') {
    jump();
  }


  classifyVideo();
}

function jump() {
  if (!isJumping) {
    isJumping = true;
  }
}

//restart hgame
function keyPressed() {
  if (keyCode === 32 && isGameOver) {
    // restart game
    isGameOver = false;
    playerY = height - playerHeight;
    objectX = width;
  }


    if (keyCode === 32 && !gameStarted) {
    // start game
    gameStarted = true;
  }
}


