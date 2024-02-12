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
let passedThroughPipe = false;
let score = 0;
let video;
let flippedVideo;
let label = "";

//square
let playerY;
let playerHeight = 50;
let jumpHeight = 220;
let isJumping = false;

//obstacle
let objectX;
let objectWidth = 85;
let obstacleHeight = 200;
let scrollSpeed = 4.3;

let scrollPosition = 0;
let imagescrollSpeed = 1;

let treescrollPosition = 0;
let treeimagescrollSpeed = 2.5;

let skyImage;
let treeImage;

let isGameOver = false;
let gameStarted = false;
let s2;
let PIPE;
let PIPE2;
function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
   s2 = loadImage('/static/s2.png');
   PIPE = loadImage('/static/PIPE.png');
   PIPE2 = loadImage('/static/PIPE2.png');
   skyImage = loadImage('/static/SKY.png');
   treeImage = loadImage('/static/TREES.png');
}

function setup() {

  // Calculate the horizontal position to center the canvas
  let canvasX = (windowWidth - 1280) / 2;
  // Calculate the vertical position to center the canvas
  let canvasY = (windowHeight - 650) /1.3
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
  background(209,237,242);

  fill(255);
  textSize(16);
  textAlign(CENTER);




  //background images

   scrollPosition -= imagescrollSpeed;

   treescrollPosition -= treeimagescrollSpeed;

   image(skyImage, scrollPosition, 0, width, height);

   image(skyImage, scrollPosition + width, 0, width, height);

    if (scrollPosition <= -width) {
    // Reset the scroll position to the right of the second image
    scrollPosition = 0;
  }

    image(treeImage, treescrollPosition, 0, width, height);

   image(treeImage, treescrollPosition + width, 0, width, height);

    if (treescrollPosition <= -width) {
    // Reset the scroll position to the right of the second image
    treescrollPosition = 0;
  }

    if (!gameStarted) {
      score=0;
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
    // Condition to check if the player collides with the pipe
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= height - playerHeight &&
    playerY + playerHeight >= height - obstacleHeight) ||
    (objectX < 100 + 50 &&
    objectX + objectWidth > 100 &&
    playerY <= obstacleHeight &&
    playerY + playerHeight >= 0)
) {
    // If player collides with an obstacle (pipe)
    isGameOver = true;
    score = 0; // Reset score to zero
} else if (objectX + objectWidth < 100 && !isGameOver && !passedThroughPipe) {
    // If player successfully passes through the pipe without colliding and hasn't passed through already
    score++; // Increase score by one
    passedThroughPipe = true; // Set flag to true to indicate that player passed through the pipe
} else if (objectX + objectWidth >= 100) {
    // Reset the flag when the pipe moves past the player
    passedThroughPipe = false;
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
  fill(0, 0, 0);
  rect(objectX, height - obstacleHeight, objectWidth, obstacleHeight);
  rect(objectX, 0, objectWidth, obstacleHeight);

  image(PIPE, objectX, height - obstacleHeight, objectWidth, obstacleHeight);
// scale(1, -1);
   image(PIPE2, objectX, 0, objectWidth, obstacleHeight);
//scale(1, 1);
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

    image(flippedVideo, 1000, 0);
    text(label, width / 1.1, height / 2.5);

    fill(255); // Set text color to white
    text("Score: " + score, width / 2, 50);
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
    score = 0;
  }


    if (keyCode === 32 && !gameStarted) {
    // start game
    gameStarted = true;
  }
}