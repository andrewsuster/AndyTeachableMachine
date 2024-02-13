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
let useless = 5;
let loadingScreenDuration = 3000;
let loadingComplete = false;
let loadingStartTime;
let button;

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

let fist;
let palm;

function preload() {
  classifier = ml5.imageClassifier(imageModelURL + 'model.json');
   s2 = loadImage('/static/s2.png');
   PIPE = loadImage('/static/PIPE.png');
   PIPE2 = loadImage('/static/PIPE2.png');
   skyImage = loadImage('/static/SKY.png');
   treeImage = loadImage('/static/TREES.png');
   palm = loadImage('/static/openhand.jpeg');
   fist = loadImage('/static/closedhand.jpeg');
}

function setup() {

loadingStartTime = millis();
  let canvasX = (windowWidth - 1280) / 2;
  let canvasY = (windowHeight - 650) /1.3
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
   if (!loadingComplete) {
        background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Loading...", width / 2, height / 2);


        if (millis() - loadingStartTime >= loadingScreenDuration) {
            loadingComplete = true; // Loading complete, allow game to start
        }
    }
   else {
     background(0);
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text("Adjust your webcam until you can consistantly change the hand", width / 2, (height / (5/4)))-50;
        text("Press 'space' when ready", width / 2, (height / (5/4))+50);


if(label == 'Jump') {
    image(palm, 480,100, 300, 300); // Adjusted x and y coordinates
} else {
    image(fist, 480,100 , 300, 300); // Adjusted x and y coordinates
}

 image(flippedVideo, 1000, 0);



if (keyCode === 32){


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

    scrollPosition = 0;
  }

    image(treeImage, treescrollPosition, 0, width, height);

   image(treeImage, treescrollPosition + width, 0, width, height);

    if (treescrollPosition <= -width) {

    treescrollPosition = 0;
  }

    if (!gameStarted) {
      score=0;
          image(flippedVideo, 1000, 0);
    image(s2, 100, playerY, 50, playerHeight);
    fill(100, 100,100,100);
    rect(0, 0, width, height);
    fill(0);
    textSize(32);
    textAlign(CENTER);
    fill(255, 255, 255);
    text('Start Game With Spacebar', width / 2, height / 2);

    fill(150, 150, 150);
    textSize(23);
    text('(Please wait until webcam loads)', width / 2, (height / 2)+50);



    return;
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

}    else if (objectX + objectWidth < 170 && !isGameOver && !passedThroughPipe) {
                score++;


                passedThroughPipe = true;
            } else if (objectX + objectWidth >= 170) {

                passedThroughPipe = false;
            }


  if (isGameOver) {

    scrollSpeed = 0;


     imagescrollSpeed = 0.1;

   treeimagescrollSpeed = 0;

    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER);
    text('Game Over', width / 2, height / 2);

    image(flippedVideo, 1000, 0);
    image(s2, 100, playerY, 50, playerHeight);
    fill(100, 100, 100);
    textSize(15);
    text('Press (Space) to Start Again!', width / 2, (height / 2)+25);
    image(PIPE, objectX, height - obstacleHeight, objectWidth, obstacleHeight);

   image(PIPE2, objectX, 0, objectWidth, obstacleHeight);
         fill(0); // Set text color to white
                textSize(50);
                text(score, (width / 2) + 3.5, (100) + 3.5);


                fill(255); // Set text color to white
                textSize(50);
                text(score, width / 2, 100);

    return;
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
  if (playerY > jumpHeight-220) {
    playerY -= 5;
  } else {
    isJumping = false;
  }
} else if (playerY < height - playerHeight) {
  playerY += 5;
}


    image(flippedVideo, 1000, 0);
    fill(255); // Set text color to white
             fill(0); // Set text color to white
                textSize(50);
                text(score, (width / 2) + 3.5, (100) + 3.5);


                fill(255); // Set text color to white
                textSize(50);
                text(score, width / 2, 100);
}// game
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
    score = 0;

    scrollSpeed = 4.3;


     imagescrollSpeed = 1;

    treeimagescrollSpeed = 2.5;
  }


    if (keyCode === 32 && !gameStarted && loadingComplete) {
    // start game
    gameStarted = true;
  }
}

function changeUseless() {
  // Change the value of the useless variable
  useless = 2;
}