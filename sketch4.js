let dog, bone, fence, mailman;
let score = 0;
let speed = 2;
let maxSpeed = 10;

let dogImg, boneImg, fenceImg, mailImg;
let isGameOver = false;
let retryButton;
let gameState = "start";

let jumpForce = -10;
let gravity = 0.5;
let isJumping = false;
let jumpVelocity = 0.1;
let groundLevel;

let mailJumpForce = -8;
let mailIsJumping = false;
let mailJumpVelocity = 0;

let jumpSound;
let barkSound;
let anger = [
  "GET THE MAIL MAN!!",
  "YOU ARE MINE!!",
  "NOT ON MY TURF!",
  "Gimme a treat!",
  "WHY ARE YOU RUNNING!",
  "RUN WHILE YOU CAN!",
  "YOU’RE ON MY TURF!",
  "FEEL MY FURY!",
  "BARK BARK BARK!!!",
  "FEEL MY FURY!",
];
let angerText = "";

////// parallax code //////
let mountainImg, houseImg, floorImg;
let mountainX = 0;
let houseX = 0;
let floorX = 0;

function preload() {
  dogImg = loadImage("sprite.png");
  boneImg = loadImage("bone.png");
  fenceImg = loadImage("fence-post.png");
  mailImg = loadImage("mail-man.png");
  jumpSound = loadSound("game-jump.mp3");
  barkSound = loadSound("dog-barks.wav");
   mountainImg = loadImage("mountain-background.png");
   houseImg = loadImage("house-backgrounds.png");
  floorImg = loadImage("flooring.png");
}

function setup() {
  createCanvas(600, 400);
  groundLevel = height - 30;
  allSprites.rotationLock = true;
  
  // Dog sprite //
  dog = createSprite(100, groundLevel, 50, 50);
  dog.img = dogImg;
  dog.scale = 1;

  // Bone sprite //
  bone = createSprite(width, groundLevel, 30, 30);
  bone.img = boneImg;
  bone.scale = 1;

  // Fence sprite //
  fence = createSprite(width + random(200, 400), groundLevel, 30, 30);
  fence.img = fenceImg;
  fence.scale = 1;

  // Mailman sprite (non-interactive) //
  mailman = createSprite(dog.position.x + 100, groundLevel, 30, 60);
  mailman.img = mailImg;
  mailman.scale = 1;
  mailman.collider = 'none';
}

function draw() {
  background('skyblue');

   let playing = gameState === "play";
  dog.visible = playing;
  mailman.visible = playing;
  bone.visible = playing;
  fence.visible = playing;
  
  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawGame(); 
  } else if (gameState === "gameOver") {
    drawGameOverScreen();
  }
}

function drawStartScreen() {
 background('darkred');
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(40);
  text("Angry Chase!", width / 2, height / 2 - 40);
  textSize(20);
  text("Press SPACE to Start", width / 2, height / 2 + 20);
  textSize(15);
  text("Controls: Up arrow to jump", width / 2, height / 2 + 55);
}

function keyPressed() {
if (gameState === "start" && key === " ") {
    gameState = "play";
  }

  if (gameState === "gameOver" && (key === "r" || key === "R")) {
    resetGame();
    gameState = "play";
  }
}

function resetGame() {
score = 0;
  speed = 2;
  dog.position.y = groundLevel;
  fence.position.x = width + random(200, 400);
  bone.position.x = width + random(50, 100);
  angerText = "";
}

function drawGameOverScreen() {
background(30);
  fill(255, 0, 0);
  textSize(35);
  textAlign(CENTER, CENTER);
  text("Woof!\nJumping made the anger go away!", width / 2, height / 2 - 100);
  fill(255);
  textSize(20);
textAlign(CENTER, CENTER);  // Adjust alignment if needed

// Adjust the y-position for line spacing
text("Recognize when you're angry.", width / 2, height / 2 - 30);
text("Instead of letting it control you, try taking a step back", width / 2, height / 2);
// text("take a step back", width / 2, height / 2 + 30);
  fill(255, 0, 0);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 + 40);
  
  text("Press R to Retry", width / 2, height / 2 + 70);
}


  

function drawGame() {
  
  ////// Draw parallax mountain background LAYER 1 /////////
image(mountainImg, mountainX, 0, width, height);
image(mountainImg, mountainX + width, 0, width, height);

// Move mountain background slowly to create parallax effect
mountainX -= speed * 0.1; // slower than game speed for parallax

// Loop the image for seamless scrolling //
if (mountainX <= -width) {
  mountainX = 0;
}
  /////// DRAW parallax house background LAYER 2 //////////
  image(houseImg, houseX, 0, width, height);
image(houseImg, houseX + width, 0, width, height);
houseX -= speed * 0.3;
if (houseX <= -width) {
  houseX = 0;
}
  ///// Draw parallax floor backgorund LAYER 3 ////////
  image(floorImg, floorX, 0, width, height);
image(floorImg, floorX + width, 0, width, height);
floorX -= speed * 0.6;
if (floorX <= -width) {
  floorX = 0;
}

  
  
  ///// Turn off camera movement for UI //////
  camera.off();
  
  ///// Display score //////
  fill(0);
  textSize(24);
  textAlign(LEFT, TOP);
  text("Score: " + score, 20, 30);
  
  ////// Turn camera back on to continue gameplay rendering ///////
  camera.on();
  
  // Dog jump
  if (keyIsDown(UP_ARROW) && !isJumping) {
    isJumping = true;
    jumpVelocity = jumpForce;
    jumpSound.setVolume(0.3);
    jumpSound.play();
  }

  if (isJumping) {
    dog.position.y += jumpVelocity;
    jumpVelocity += gravity;
    if (dog.position.y >= groundLevel) {
      dog.position.y = groundLevel;
      isJumping = false;
    }
  }

  // Mailman stays ahead of dog
  mailman.position.x = dog.position.x + 360;

  // Mailman jump over bone or fence
  if (!mailIsJumping &&
       (abs(mailman.position.x - fence.position.x) < 60)) {
    mailIsJumping = true;
    mailJumpVelocity = mailJumpForce;
  }

  if (mailIsJumping) {
    mailman.position.y += mailJumpVelocity;
    mailJumpVelocity += gravity;
    if (mailman.position.y >= groundLevel) {
      mailman.position.y = groundLevel;
      mailIsJumping = false;
    }
  }

  // Move obstacles
  bone.position.x -= speed;
  fence.position.x -= speed;

  // Recycle bone
  if (bone.position.x < -30) {
    bone.position.x = width + random(50, 100);
  }

  // Recycle fence
  if (fence.position.x < -30) {
    fence.position.x = width + random(200, 400);
  }

  // Speed ramp-up
  if (speed < maxSpeed) {
    speed += 0.01;
  }

  
  // Dog collects bone
  if (dog.overlap(bone)) {
    score++;
    bone.position.x = width + random(50, 100);
     angerText = random(anger);
    barkSound.setVolume(0.3);
    barkSound.play();
  }
  
  if (angerText !== "") {
  fill(255, 0, 0);
  textSize(17);
  textAlign(CENTER);
  text(angerText, dog.position.x, dog.position.y - 40);
}
  
  // Dog hits fence
  if (dog.overlap(fence)) {
  gameState = "gameOver";
}
}

function gameOver() {
  background(30);
  fill(255, 0, 0);
  textSize(35);
  textAlign(CENTER, CENTER);
  text("Woof!Jumping made the anger go away!", width / 2, height / 2 - 100);
  fill(255);
  textSize(20);
textAlign(CENTER, CENTER);  // Adjust alignment if needed

// Adjust the y-position for line spacing
text("Recognize when you're angry.", width / 2, height / 2 - 30);
text("Instead of letting it control you, try taking a step back", width / 2, height / 2);
// text("take a step back", width / 2, height / 2 + 30);
  fill(255, 0, 0);
  textSize(24);
  text("Score: " + score, width / 2, height / 2 + 40);
  
    if (!retryButton) {
    retryButton = createButton("Retry");
    retryButton.position(width / 2 - 40, height / 2 + 70);
    retryButton.mousePressed(restartGame);
  }
}

function restartGame() {
  // Reset game state
  isGameOver = false;
  score = 0;
  speed = 2;

  // Reset dog and obstacles
  dog.position.y = groundLevel;
  bone.position.x = width;
  fence.position.x = width + random(200, 400);

  angerText = "";

  // Remove the retry button
  retryButton.remove();
  retryButton = null;
}