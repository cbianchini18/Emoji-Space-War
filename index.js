const progressBar = document.querySelector("progress");
const levelSpan = document.querySelector("#level");
let timer = 5;
let level = 1;

function randomColor() {
  const red = Math.floor(Math.random() * 20);
  const green = Math.floor(Math.random() * 30);
  const blue = Math.floor(Math.random() * 200);
  return `rgba(${red},${green},${blue},0.5)`;
}

class Sprite {
  constructor(x, y, color, diameter) {
    Object.assign(this, { x, y, color, diameter });
  }
  get radius() {
    return this.diameter / 2;
  }
  move(target) {
    this.x += this.speed * (target.x - this.x);
    this.y += this.speed * (target.y - this.y);
  }
}

class Scarecrow {
  constructor() {
    this.x = random(width);
    this.y = random(height);
  }
  reposition() {
    this.x = random(width);
    this.y = random(height);
  }
  display() {
    text("🚀", this.x, this.y);
  }
}

class Player extends Sprite {
  constructor() {
    super(0, 0, "white", 20);
    this.health = 100;
    this.speed = 0.3;
  }
  render() {
    fill(this.color);
    circle(this.x, this.y, this.diameter);
    fill("yellow");
    noStroke();
    ellipse(this.x, this.y, 50, 50);
    fill("white");
    stroke(204, 102, 0);
    ellipse(this.x - 9, this.y - 5, 10, 14);
    ellipse(this.x + 9, this.y - 5, 10, 14);
    fill("lightblue");
    ellipse(this.x - 9, this.y - 3, 8, 8);
    ellipse(this.x + 9, this.y - 3, 8, 8);
    noFill();
    arc(this.x, this.y + 0.8, 27, 26, QUARTER_PI, PI - QUARTER_PI);
  }
  takeHit() {
    this.health -= 1;
    progressBar.value = this.health;
  }
  addHealth() {
    this.health += 2;
    if (this.health > 100) {
      this.health = 100;
    }
    progressBar.value = this.health;
  }
}

class PowerUp {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.diameter = 20;
  }
  reposition() {
    this.x = random(width);
    this.y = random(height);
  }
  display() {
    text("💖", this.x, this.y, this.diameter);
  }
}

class Enemy extends Sprite {
  constructor(x, y, speed) {
    super(x, y, randomColor(), 50);
    this.speed = speed;
  }
  render() {
    fill("green");
    noStroke();
    ellipse(this.x, this.y, 50, 50);
    fill("white");
    stroke(204, 102, 0);
    ellipse(this.x - 11, this.y - 5, 17, 17);
    ellipse(this.x + 11, this.y - 5, 17, 17);
    fill("red");
    ellipse(this.x - 11, this.y - 5, 5, 5);
    ellipse(this.x + 11, this.y - 5, 5, 5);
    stroke(51, 26, 0);
    strokeWeight(4);
    line(this.x - 13, this.y - 19, this.x - 5, this.y - 11);
    line(this.x + 13, this.y - 19, this.x + 5, this.y - 11);
    fill("brown");
    noStroke();
    ellipse(this.x, this.y + 7, 2.5, 2.5);
    fill("red");
    noStroke();
    ellipse(this.x, this.y + 16, 6, 6);
  }
}

function collided(sprite1, sprite2) {
  const distanceBetween = Math.hypot(
    sprite1.x - sprite2.x,
    sprite1.y - sprite2.y
  );
  const sumOfRadii = sprite1.diameter / 2 + sprite2.diameter / 2;
  return distanceBetween < sumOfRadii;
}

function randomPointOnCanvas() {
  return [
    Math.floor(Math.random() * width),
    Math.floor(Math.random() * height)
  ];
}
let width = 700;
let height = 600;
let player = new Player();
let enemies = [
  new Enemy(...randomPointOnCanvas(), 0.03),
  new Enemy(...randomPointOnCanvas(), 0.01),
  new Enemy(...randomPointOnCanvas(), 0.007),
  new Enemy(...randomPointOnCanvas(), 0.04),
  new Enemy(...randomPointOnCanvas(), 0.005)
];

function checkForDamage(enemy, player) {
  if (collided(player, enemy)) {
    player.takeHit();
  }
}

function checkForHealth(heart, player) {
  if (collided(player, heart)) {
    player.addHealth();
  }
}

function adjustSprites() {
  const characters = [player, ...enemies];
  for (let i = 0; i < characters.length; i++) {
    for (let j = i + 1; j < characters.length; j++) {
      pushOff(characters[i], characters[j]);
    }
  }
}

function pushOff(c1, c2) {
  let [dx, dy] = [c2.x - c1.x, c2.y - c1.y];
  const distance = Math.hypot(dx, dy);
  let overlap = c1.radius + c2.radius - distance;
  if (overlap > 0) {
    const adjustX = overlap / 2 * (dx / distance);
    const adjustY = overlap / 2 * (dy / distance);
    c1.x -= adjustX;
    c1.y -= adjustY;
    c2.x += adjustX;
    c2.y += adjustY;
  }
}

function backgroundGame() {
  background(0, 0, 35, 25);
  const galaxy = {
    locationX: random(width),
    locationY: random(height),
    size: random(1, 6)
  };
  fill("white");
  ellipse(galaxy.locationX, galaxy.locationY, galaxy.size, galaxy.size);
}

function showTimer() {
  textAlign(CENTER, CENTER);
  textSize(20);
  text(timer, width / 2, height / 2);
}

function startNewLevel() {
  level++;
  levelSpan.textContent = level;
  timer = 5;
  spaceship.reposition();
  heart.reposition();
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.03));
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.05));
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.07));
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.02));
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.08));
  enemies.push(new Enemy(...randomPointOnCanvas(), Math.random() * 0.02));
}

function keyPressed() {
  if (keyCode === 75) {
    enemies.pop();
  }
}

function setup() {
  createCanvas(width, height);
  noStroke();
  heart = new PowerUp();
  spaceship = new Scarecrow();
}

function draw() {
  backgroundGame();
  showTimer();
  player.render();
  player.move({ x: mouseX, y: mouseY });
  enemies.forEach(enemy => {
    enemy.render();
    checkForDamage(enemy, player);
    enemy.move(level % 5 === 0 ? spaceship : player);
  });
  adjustSprites();
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
  if (timer === 0) {
    startNewLevel();
  }
  if (timer === 5) {
    heart.display();
  }
  if (level % 5 === 0) {
    spaceship.display();
  }
  checkForHealth(heart, player);
  if (progressBar.value === 0) {
    noLoop();
    fill("red");
    text("GAME OVER", width / 2, height / 2.6);
  }
}
