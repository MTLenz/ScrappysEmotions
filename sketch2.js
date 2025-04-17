let dogImg, bgMusic, backgroundImg;
let dogX, facing = 1;

let raindrops = [];
let bubbles = [];
let tears = [];

let score = 0;
let gameState = "title";
let bubbleSpawnTimer = 0;

function preload() {
  dogImg = loadImage("sprite.png");
  backgroundImg = loadImage("rainypark.jpg"); // Your background image
  soundFormats('mp3');
  bgMusic = loadSound("ChillHopMusic.mp3");
}

function setup() {
  createCanvas(400, 600);
  dogX = width / 2;

  for (let i = 0; i < 30; i++) {
    raindrops.push(new Raindrop());
  }

  userStartAudio();
  frameRate(60);
}
function draw() {
  if (gameState === "title") {
    imageMode(CORNER);
    image(backgroundImg, 0, 0, width, height); // Stretch background to fit canvas
    drawTitleScreen(); // Instructions first
    drawDog();         // Then the dog image
  } else if (gameState === "play") {
    background(200, 220, 255);
    playGame();
  } else if (gameState === "celebrate") {
    background(255, 230, 250);
    drawCelebration();
  }
}

function drawTitleScreen() {
  fill(255); // White text
  textAlign(CENTER, CENTER);
  textSize(28);
  text("Tears Help Too!", width / 2, 80);

  textSize(16);
  
  text("Mission:\n Help Scrappy process emotions\n by popping the emotion balloons", width / 2, 310);
  
  text("Use ← → to move\nPress SPACE to Cry and shoot tears", width / 2, 145);
  text("Press ENTER to start", width / 2, 460);
}

function drawDog() {
  imageMode(CENTER);
  image(dogImg, width / 2, height - 100, 120, 100); // Lower position
}


function playGame() {
  drawRaindrops();

  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
    dogX -= 3;
    facing = -1;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
    dogX += 3;
    facing = 1;
  }
  dogX = constrain(dogX, 20, width - 20);

  // Draw dog
  imageMode(CENTER);
  push();
  translate(dogX, height - 80);
  scale(facing, 1);
  image(dogImg, 0, 0, 100, 80);
  pop();

  // Tears
  for (let i = tears.length - 1; i >= 0; i--) {
    tears[i].move();
    tears[i].display();

    for (let j = bubbles.length - 1; j >= 0; j--) {
      if (tears[i].hits(bubbles[j])) {
        bubbles.splice(j, 1);
        score++;
        tears.splice(i, 1);
        if (score >= 20) gameState = "celebrate";
        break;
      }
    }
  }

  // Emotion bubbles
  for (let bubble of bubbles) {
    bubble.move();
    bubble.display();
  }

  if (frameCount % 60 === 0 && bubbles.length < 5) {
    bubbles.push(new EmotionBubble());
  }

  fill(0);
  textAlign(LEFT);
  textSize(16);
  text("Emotions processed: " + score, 10, 20);
}
function keyPressed() {
  if (gameState === "title" && keyCode === ENTER) {
    gameState = "play";
    if (!bgMusic.isPlaying()) {
      bgMusic.setVolume(0.2); // Set initial volume lower (range is 0.0 to 1.0)
      bgMusic.loop();
    }
  }
  if (gameState === "play" && key === ' ') {
    tears.push(new Tear(dogX, height - 100, facing));
  }
}


// --- Classes ---

class EmotionBubble {
  constructor() {
    this.x = random(50, width - 50);
    this.y = -random(100);
    this.size = random(70, 110);
    this.speed = random(0.5, 1.5);
    this.label = random(["Worry", "Anger", "Sadness", "Fear", "Stress", "Loneliness"]);
    this.color = color(random(100, 255), random(100, 200), random(200, 255), 200);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = -50;
      this.x = random(50, width - 50);
    }
  }

  display() {
    fill(this.color);
    noStroke();
    ellipse(this.x, this.y, this.size);
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(this.size / 5);
    text(this.label, this.x, this.y);
  }
}

class Tear {
  constructor(x, y, dir) {
    this.x = x;
    this.y = y;
    this.size = 10;
    this.speed = 5;
    this.dir = dir;
  }

  move() {
    this.y -= this.speed;
    this.x += this.dir * 2;
  }

  display() {
    fill(100, 100, 255, 180);
    ellipse(this.x, this.y, this.size, this.size + 5);
  }

  hits(bubble) {
    let d = dist(this.x, this.y, bubble.x, bubble.y);
    return d < bubble.size / 2;
  }
}

class Raindrop {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.length = random(10, 20);
    this.speed = random(2, 4);
  }

  move() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = 0;
      this.x = random(width);
    }
  }

  display() {
    stroke(150, 180);
    line(this.x, this.y, this.x, this.y + this.length);
  }
}

function drawRaindrops() {
  for (let drop of raindrops) {
    drop.move();
    drop.display();
  }
}

function drawCelebration() {
  fill(100, 100, 255);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Tears are a good way", width / 2, height / 2 - 40);
  text("to help process emotions!", width / 2, height / 2);
  textSize(16);
  text("I don’t know emotions,\n but I know you need them", width / 2, height / 2 + 40);
  textSize(16);
  fill(0);
  text("-Scrappy", width / 2, height / 2 + 90);
}
