let balloonY;
let happiness = 0;
let dogImg;
let boneImg;
let flipAngle = 0;

let flipping = true;
let flipCount = 0;
let lastFlipTime = 0;
let flipPauseDuration = 1000; // milliseconds pause between flips


let treats = [];
let dogX = 140;
let treatScore = 0;

let input;
let response = "";

let clouds = [];
let darkClouds = [];
let birds = [];

let confettiParticles = [];

let gameState = "instructions";
let startButton;

function preload() {
  dogImg = loadImage("sprite.png");
  boneImg = loadImage("bone.png");
}

function setup() {
  createCanvas(400, 600);
  balloonY = height - 100;
  textAlign(CENTER, CENTER);
  textSize(16);

  startButton = createButton("Start Game");
  startButton.position(width / 2 + 470, height - 60);
  startButton.mousePressed(() => {
    gameState = "playing";
    startButton.hide();
    input.show();
  });

  input = createInput();
  input.position(width / 2 + 425, height - 1);
  input.size(200);
  input.attribute("placeholder", "Say something kind...");
  input.changed(handleInput);
  input.hide();

  clouds.push(new Cloud(-50, 100));
  clouds.push(new Cloud(-150, 180));
  clouds.push(new Cloud(-100, 60));

  for (let i = 0; i < 15; i++) {
    treats.push(new Treat(random(20, width - 20), random(100, height - 100)));
  }

  for (let i = 0; i < 5; i++) {
    darkClouds.push(new DarkCloud(random(width), random(height - 100, height - 20)));
  }
}

function draw() {
  if (gameState === "instructions") {
    drawInstructions();
  } else if (gameState === "playing") {
    drawGame();
  } else if (gameState === "won") {
    drawCelebration();
  }
}

function drawInstructions() {
  background(255, 240, 255);
  fill(80);
  textSize(22);
  text("Welcome to Scrappy's Balloon Game!", width / 2, 100);
  textSize(16);
  text(
    "Help Scrappy float above his cloudy thoughts!\n\nType affirmations for him\n(ex. - you can do it!)\n\nand\n\n Collect treats\nUse ← → to move\n Watch the balloon rise\n\nClick 'Start Game' to begin!",
    width / 2,
    height / 2
  );
}

function drawGame() {
  background(200, 240, 255);

  let cloudAlpha = map(happiness, 0, 100, 255, 0);
  for (let cloud of clouds) {
    cloud.update();
    cloud.display(cloudAlpha);
  }

  let sunY = map(happiness, 0, 100, -100, 100);
  drawSun(width / 2, sunY);

  for (let bird of birds) {
    bird.update();
    bird.display();
  }

  if (happiness >= 100) {
    gameState = "won";
    input.hide();

    // Generate confetti
    for (let i = 0; i < 100; i++) {
      confettiParticles.push(new Confetti());
    }

    return;
  }

  let darkAlpha = map(happiness, 0, 100, 255, 0);
  for (let dc of darkClouds) {
    dc.update();
    dc.display(darkAlpha);
  }

  let floatUp = map(happiness, 0, 100, 0, 300);
  let currentY = balloonY - floatUp;

  // Balloon string
  stroke(150);
  line(dogX + 70, currentY + 40, dogX + 70, currentY + 110);

  // Balloon
  noStroke();
  fill(255, 100, 150);
  ellipse(dogX + 70, currentY, 80, 100);

  // Dog face
  fill(0);
  text(happiness < 30 ? ":(" : happiness < 70 ? ":|" : ":D", dogX + 70, currentY);

  // Dog image
  imageMode(CORNER);
  image(dogImg, dogX, currentY + 60, 140, 100);

  // Text and affirmations
  fill(50);
  textSize(14);
  text("Happiness: " + happiness, width / 2, 30);
  text("Help Scrappy overcome his cloudy thoughts!", width / 2, 50);
  textSize(16);
  fill(80);
  text(response, width / 2, currentY - 70);

  // Treats (bones)
  for (let treat of treats) {
    treat.display();
    treat.checkCollected(dogX, currentY);
  }

  fill(50);
  text("Treats Collected: " + treatScore, width / 2, 70);
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    dogX -= 10;
  } else if (keyCode === RIGHT_ARROW) {
    dogX += 10;
  }
  dogX = constrain(dogX, 0, width - 140);
}

function handleInput() {
  let message = input.value().toLowerCase();
  input.value("");

  if (
    message.includes("you") ||
    message.includes("good") ||
    message.includes("friend") ||
    message.includes("love") ||
    message.includes("great") ||
    message.includes("happy") ||
    message.includes("u")
  ) {
    happiness = min(happiness + 5, 100);
    response = "";

    if (happiness >= 40) {
      birds.push(new Bird());
    }
  } else {
    response = "Hmm... I like kind words!";
  }
}

class Cloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(0.1, 0.3);
  }

  update() {
    this.x += this.speed;
    if (this.x > width + 50) {
      this.x = -50;
    }
  }

  display(alpha) {
    noStroke();
    fill(255, alpha);
    ellipse(this.x, this.y, 60, 60);
    ellipse(this.x + 30, this.y + 10, 60, 60);
    ellipse(this.x - 30, this.y + 10, 60, 60);
    ellipse(this.x, this.y + 20, 60, 60);
  }
}

class DarkCloud {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.speed = random(0.2, 0.5);
  }

  update() {
    this.x += this.speed;
    if (this.x > width + 60) {
      this.x = -60;
    }
  }

  display(alpha) {
    noStroke();
    fill(50, 50, 50, alpha);
    ellipse(this.x, this.y, 80, 60);
    ellipse(this.x + 30, this.y + 10, 70, 50);
    ellipse(this.x - 30, this.y + 10, 70, 50);
  }
}

class Treat {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 20;
    this.collected = false;
  }

  display() {
    if (!this.collected) {
      imageMode(CENTER);
      image(boneImg, this.x, this.y, 30, 30);
    }
  }

  checkCollected(dogX, dogY) {
    if (!this.collected && dist(this.x, this.y, dogX + 70, dogY + 90) < 30) {
      this.collected = true;
      treatScore += 1;
    }
  }
}

class Bird {
  constructor() {
    this.x = random(width);
    this.y = random(height / 2);
    this.size = random(20, 30);
    this.speed = random(1, 2);
  }

  update() {
    this.x += this.speed;
    if (this.x > width + this.size) {
      this.x = -this.size;
    }
  }

  display() {
    if (!boneImg) return;
    imageMode(CENTER);
    image(boneImg, this.x, this.y, this.size, this.size);
  }
}

// 🎉 Confetti Class 🎉
class Confetti {
  constructor() {
    this.x = random(width);
    this.y = random(-100, 0);
    this.size = random(2, 6);
    this.speed = random(1, 2);
    this.color = color(random(255), random(255), random(255));
  }

  update() {
    this.y += this.speed;
    if (this.y > height) {
      this.y = random(-50, -10);
      this.x = random(width);
    }
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

function drawSun(x, y) {
  noStroke();
  fill(255, 204, 0);
  ellipse(x, y, 100, 100);
}

function drawCelebration() {
  background(255, 230, 250);
  fill(255, 100, 150);
  textSize(24);
  text("Woof!\n You helped me overcome\n my bad thoughts!", width / 2, height / 2 - 100);
  textSize(18);
  text("Thank you for\n the affirmations!", width / 2, height / 2);

  // Draw & update animated confetti
  for (let c of confettiParticles) {
    c.update();
    c.display();
  }

  // Handle dog flipping with pause
  if (flipping) {
    flipAngle += 0.15; // ⏩ faster flip

    if (flipAngle >= TWO_PI) {
      flipAngle = 0;
      flipCount++;
      flipping = false;
      lastFlipTime = millis(); // record time when flip ends
    }
  } else {
    // Wait for pause duration, then resume flipping (up to 2 times)
    if (millis() - lastFlipTime >= flipPauseDuration && flipCount < 2) {
      flipping = true;
    }
  }

  // Draw the rotating dog
  push();
  translate(width / 2, height / 2 + 100);
  rotate(flipAngle);
  imageMode(CENTER);
  image(dogImg, 0, 0, 140, 100);
  pop();
}