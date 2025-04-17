let avatar;
let thunder, creepyMusic;
let tileImg, avatarImg, coinImg, doorImg;
let score = 0;
let timeLeft = 23;
let lastTimeCheck;
let coins = [];
let door;
let doorSpawner = false;
let brick1; 
let gameState = "start";
let gameWon = false;
let fears = [
  "thunder scares me..",
  "Scared of the vacuum!",
  "Mailmen freak me out!",
  "Why are balloons so scary?",
  "Not the bathtub again..D:",
  "Mirrors? whos that on the other side?",
  "Please no fireworks.",
];
let currentFear = ""; // text to show under dog
let fearTimer = 0;
let map = [
  "@@@@@@@@@@@@@@@@@@@",
  "@   @        @    @",
  "@   @        @    @",
  "@   @@@      @    @",
  "@                 @",
  "@                 @",
  "@                 @",
  "@@@@@    @@@  @@@@@",
  "@   @      @      @",
  "@   @      @      @",
  "@   @@@    @      @",
  "@                 @",
  "@              @  @",
  "@              @  @",
  "@            @@@@@@",
  "@@@@@             @",
  "@   @     @       @",
  "@   @     @       @",
  "@      @@@@       @",
  "@              @@@@",
  "@             @@@@@",
  "@@@@@@@@@@@@@@@@@@@",
];

function preload() {
  avatarImg = loadImage("sprite.png");
  tileImg = loadImage("tile.png");
  coinImg = loadImage("coin.png");
  doorImg = loadImage("door.png");
  creepyMusic = loadSound("creepy-carousel_edited.wav");
}

function setup() {
  new Canvas(600, 760, "pixelate x2");
  allSprites.pixelPerfect = true;
  allSprites.rotationLock = true;
  allSprites.tileSize = 32;
  avatar = new Sprite(1.9, 1.9, 1, 1);
  avatar.img = avatarImg;

  

  brick1 = new Group();
  brick1.img = tileImg;
  brick1.collider = "none";
  brick1.tile = "@";

  new Tiles(map, 0.5, 0.5, 1, 1);

  ////// below is coin ////////
  // Designated positions for coins
  let coinPositions = [
    { x: 5.7, y: 1.8 },
    { x: 1.5, y: 8.7 },
    { x: 10, y: 9 },
    { x: 17, y: 2 },
    { x: 17.2, y: 16 },
    { x: 17.2, y: 13 },
    { x: 2, y: 17 },
  ];
  // Create coins with images
  for (let pos of coinPositions) {
    let coin = new Sprite(pos.x, pos.y, 3, 3);
    coin.img = coinImg;
    coin.scale = 0.6;
    coin.label = "coin";
    coins.push(coin);
  }
  
  avatar.visible = false;
for (let c of coins) {
  c.visible = false;
}
for (let b of brick1) {
  b.visible = false;
}

  
}
//// music for the game ////
function backgroundMusic() {
  creepyMusic.play();
  creepyMusic.loop();
  creepyMusic.setVolume(0.3);
  userStartAudio();
}

function draw() {
  clear();

  if (gameState === "start") {
    drawStartScreen();
    return;
  }

  if (gameState === "playing") {
    drawGame();
  }
}


function drawStartScreen() {
  background(0);
  textAlign(CENTER, CENTER);
  textSize(45);
  fill("white");
  text("SCRAPPY'S FEAR MAZE", width / 2, height / 2 - 80);

  textSize(30);
  fill("gray");
  text("Press ENTER to begin", width / 2, height / 2 + 10);
  text("W,A,S,D or arrow keys to move", width / 2, height / 2 + 60);
}

function keyPressed() {
  if (gameState === "start" && keyCode === ENTER) {
    gameState = "playing";
    backgroundMusic();
  }
}

function drawGame() {
  
  avatar.visible = true;
for (let coin of coins) {
  coin.visible = true;
}
for (let b of brick1) {
  b.visible = true;
}
if (door) door.visible = true;
  
  avatar.visible = gameState === "playing";
for (let coin of coins) {
  coin.visible = gameState === "playing";
}
if (door) door.visible = gameState === "playing";
  
  clear();

  
  
  ////// score text/////
  textSize(45);
  fill(173,216,230);
   textAlign(LEFT, BOTTOM);
  text("score:" + score, 45, 750);
  ////// timer text //////
  fill(173,216,230);
  textSize(40);
  text("Time: " + timeLeft, 255, 750);
  
//// checks timer //////
  if (!lastTimeCheck) {
    lastTimeCheck = millis();
  }

  let now = millis();
  if (now - lastTimeCheck >= 1000) {
    timeLeft--;
    lastTimeCheck = now;
  }

  //this just spawns the door in. 
  if (score >= 7 || coins.length == 0) {
    if (doorSpawner == false) {
      doorSpawner = true;
      ///// below is door code //////
      door = new Sprite(10.5, 20, 1, 1);
      // door.visible = false; // Hide door till all coins are found
      door.img = doorImg;
    }
  }

  /////door////
  if (door && avatar.overlapping(door)) {
    gameWon = true;
    creepyMusic.stop();
  }

  if (timeLeft <= 0 && !gameWon) {
    brick1.remove();
    textSize(60);
    fill("red");
    textAlign(CENTER, CENTER);
    text("TIME'S UP!", width / 2, height / 2 - 53);
    textSize(35)
    textAlign(CENTER, CENTER);
    text("Woof! \n You'll get it next time!", width / 2, height / 2 + 48);
    fill(173,216,230);
    textSize(24)
    textAlign(CENTER, CENTER);
    text("Sometimes, the scariest part of\n fear is just the anticipation.\n Once you face it, it’s not so bad.", width / 2, height / 2 + 180);
    
    noLoop();
    creepyMusic.stop();
  }

  if (gameWon) {
    brick1.remove();
    textSize(60);
    fill("yellow");
    textAlign(CENTER, CENTER);
    text("YOU WIN!", width / 2, height / 2);
    fill(173,216,230);
    textSize(35)
    textAlign(CENTER, CENTER);
    text("Woof! \nYou helped me face my fears!", width / 2, height / 2 + 60);
    textSize(24)
    textAlign(CENTER, CENTER);
    text("Sometimes, the scariest part of\n fear is just the anticipation.\n Once you face it, it’s not so bad.", width / 2, height / 2 + 180);
    noLoop();
  }

  for (let i = coins.length - 1; i >= 0; i--) {
    if (avatar.overlapping(coins[i])) {
      coins[i].remove();
      coins.splice(i, 1);
      score += 1;
      timeLeft += 5; // Add 5 seconds per coin

      if (score - 1 < fears.length) {
        currentFear = fears[score - 1];
        fearTimer = millis();
      }
    }
  }

  if (currentFear && millis() - fearTimer < 3000) {
    fill(255, 0, 0);
    textSize(16);
    textAlign(CENTER);
    //change the * 30 multiplier
   text(currentFear, width / 2, height / 2);
  }

  if (kb.pressed("up") && isOpen(avatar.x, avatar.y - 1)) {
    avatar.moveTo(createVector(avatar.x, avatar.y - 1), 0.2);
    //avatar.y--;
  } else if (kb.pressed("left") && isOpen(avatar.x - 1, avatar.y)) {
    avatar.moveTo(createVector(avatar.x - 1, avatar.y), 0.2);
    //avatar.x--;
  } else if (kb.pressed("right") && isOpen(avatar.x + 1, avatar.y)) {
    avatar.moveTo(createVector(avatar.x + 1, avatar.y), 0.2);
  } else if (kb.pressed("down") && isOpen(avatar.x, avatar.y + 1)) {
    avatar.moveTo(createVector(avatar.x, avatar.y + 1), 0.2);
    //avatar.y++;
  }
}

function isOpen(x, y) {
  let i = floor(x);
  let j = floor(y);
  let tile = map[j][i];
  if (tile == " ") {
    return true;
  } else {
    return false;
  }
}
