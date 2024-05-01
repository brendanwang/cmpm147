"use strict";

/* global XXH, loadImage, random */
/* exported --
    p3_preload
    p3_setup
    p3_worldKeyChanged
    p3_tileWidth
    p3_tileHeight
    p3_tileClicked
    p3_drawBefore
    p3_drawTile
    p3_drawSelectedTile
    p3_drawAfter
*/

let treeTiles = [];
let worldSeed;

function p3_preload() {}

function p3_setup() {}

function p3_drawBefore() {
  background(84, 73, 61); // Change the background color here
}

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);
}

function p3_tileWidth() {
  return 20;
}

function p3_tileHeight() {
  return 10;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  let treeCount = 1 + (clicks[key] | 0); // Initially, one tree is spawned on the clicked tile
  clicks[key] = treeCount;

  // Animate the clicked tile
  animateTile(i, j);

  // Define the maximum distance for tiles to be animated
  let maxDistance = 4; // Adjust this value to change the radius of the circular animation

  // Iterate over all tiles to find those within the circular radius
  for (let x = -maxDistance; x <= maxDistance; x++) {
    for (let y = -maxDistance; y <= maxDistance; y++) {
      // Calculate the distance between the clicked tile and the current tile
      let distance = dist(i, j, i + x, j + y);

      // If the distance is within the circular radius, animate the tile
      if (distance <= maxDistance) {
        animateTile(i + x, j + y);
      }
    }
  }
}



function animateTile(i, j) {
  // Define animation properties
  let animationDuration = 32; // Duration of animation in frames
  let animationFrame = 0; // Current frame of animation
  let initialY = th; // Initial y-coordinate of the tile
  let waveHeight = 100; // Height of the wave motion (increased for larger radius)

  // Start animation loop
  let animationInterval = setInterval(() => {
    // Increment animation frame
    animationFrame++;

    // Perform animation logic
    // Calculate new y-coordinate based on wave motion
    let newY = initialY + Math.sin(animationFrame * 0.1) * waveHeight;

    // Update tile position
    clicks[[i, j]] = { newY };

    // End animation if animation frame reaches duration
    if (animationFrame >= animationDuration) {
      clearInterval(animationInterval); // Stop animation loop
      clicks[[i, j]] = 0; // Reset tile properties after animation
    }
  }, 50); // Animation frame rate (adjust as needed)
}


function generateTreeTiles() {
  treeTiles = [];
  const range = 200;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (random() < 0.5) { // Adjust the probability as needed
        treeTiles.push([i, j]);
      }
    }
  }
}


function p3_drawTile(i, j) {
  noStroke();

  // Get the animation state of the tile
  let animationState = clicks[[i, j]];

  // Calculate the y-coordinate of the tile based on the animation state
  let newY = animationState ? animationState.newY : 0;

  // Apply the new y-coordinate to the translation
  push();
  translate(0, newY);

  // Draw the tile
  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(236, 204, 162); // First color
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 1) {
    fill(225, 191, 146); // Second color
  } else if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 2) {
    fill(194,167,128); // Third color
  } else {
    fill(194,162,128); // Fourth color
  }
  

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  pop();
}

function p3_drawSelectedTile(i, j) {
  noFill();
  stroke(0, 255, 0, 128);

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  noStroke();
  fill(0);
  text("tile " + [i, j], 0, 0);
}
