/* exported setup, draw */

let seed = 239;

const grassColor = "#282214";
const sunColor = "#fffadb";
const sunGlowColor = "rgba(255, 218, 171, 0.3)";
const glowSize = 3; // Adjust the size of the glow rings
const glowRingSize = 4; // Adjust the size of each glow ring
const cloudColor = "rgba(119, 66, 69, 0.6)";
const mountainColor = "#493742"; // Brown color for mountains
const bladeColor = "#4a3d1e";
const starColor = "#bdbbbb"; // White color for stars
const numStars = 100; // Number of stars

let clouds = [];
let mountainYPosition;
let stars = [];

function setup() {
  createCanvas(450, 300);
  createButton("reimagine").mousePressed(reimagineScene);

  initializeMountainRange();
  initializeClouds();
  initializeStars();
}

function draw() {
  randomSeed(seed);

  background(0); // Set background to black

  drawSkyGradient(); // Draw gradient for the sky

  noStroke();

  // Draw stars
  for (let star of stars) {
    fill(starColor);
    ellipse(star.x, star.y, star.size);
  }

  // Draw sun glow
  fill(sunGlowColor);
  let sunX = width / 2;
  let sunY = height * 0.55;
  for (let i = 0; i < glowSize; i++) {
    let radius = 40 + i * glowRingSize;
    ellipse(sunX, sunY, radius * 2);
  }

  // Draw sun
  fill(sunColor);
  ellipse(sunX, sunY, 40);

  // Draw mountain ranges
  fill(mountainColor);
  beginShape();
  vertex(0, height);
  for (let x = 0; x < width + 1; x += 10) { // width of the mountain ranges
    let y = noise(x * 0.01) * 100 + mountainYPosition; // Adjust amplitude as needed
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  // Draw grass lower
  fill(grassColor);
  let grassHeight = height * 0.7;
  rect(0, grassHeight, width, height - grassHeight);

  // Move and draw clouds
  for (let cloud of clouds) {
    // Move the cloud from left to right
    cloud.x += cloud.speed;
    if (cloud.x - cloud.width / 2 > width) { // Check if right edge of cloud is beyond canvas
      cloud.x = -cloud.width / 2; // Reset cloud position
    }
    // Draw the cloud
    fill(cloudColor);
    ellipse(cloud.x, cloud.y, cloud.width, cloud.height);
  }
  
  // Draw grass blades
  fill(bladeColor);
  const numGrassBlades = 50000 * random();
  const scrub = mouseX / width;
  for (let i = 0; i < numGrassBlades; i++) {
    let z = random();
    let x = width * ((random() + (scrub / 50 + millis() / 500000.0) / z) % 1);
    let s = width / 500 / z; // Adjust the size of grass blades
    let y = height / 1.54 + height / 20 / z;
    triangle(x, y - s, x - s / 4, y, x + s / 4, y);
  }
}

function drawSkyGradient() {
  // Define gradient colors
  let fromColor = color("#564751"); // Grayish-Orange
  let toColor = color(255, 72, 37); // Orange

  // Draw gradient from top to bottom
  for (let y = 0; y < height; y++) {
    let inter = map(y, 0, height, 0, 1);
    let c = lerpColor(fromColor, toColor, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function initializeMountainRange() {
  mountainYPosition = height * 0.5; // Reset initial y position of the mountain line
  seed++;
}

function initializeClouds() {
  clouds = [];
  for (let i = 0; i < 10; i++) {
    let cloud = {
      x: random(width), // Random initial x position
      y: random(height * 0.6), // Random initial y position in the upper part of the canvas
      speed: random(0.2, 0.5), // Random speed
      width: random(400, 500), // Random width
      height: random(10, 15) // Random height
    };
    clouds.push(cloud);
  }
}

function initializeStars() {
  stars = [];
  for (let i = 0; i < numStars; i++) {
    let star = {
      x: random(width), // Random x position
      y: random(height), // Random y position across the entire canvas
      size: random(1, 2) // Random size for faint stars
    };
    stars.push(star);
  }
}

function reimagineScene() {
  initializeClouds();
  initializeMountainRange();
  initializeStars();
}
