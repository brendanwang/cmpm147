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

function p3_preload() {
  tilesetImage = loadImage(
    "https://cdn.glitch.global/7bf5f1d2-71f1-4f98-9219-6b0eae066c15/tinyBlocks.png?v=1714250307981"
  );
}

function p3_setup() {}

let worldSeed;

function p3_worldKeyChanged(key) {
  worldSeed = XXH.h32(key, 0);
  noiseSeed(worldSeed);
  randomSeed(worldSeed);

  // Generate tree tiles
  generateTreeTiles();
}

function p3_tileWidth() {
  return 32;
}

function p3_tileHeight() {
  return 16;
}

let [tw, th] = [p3_tileWidth(), p3_tileHeight()];

let clicks = {};

function p3_tileClicked(i, j) {
  let key = [i, j];
  let treeCount = 1 + (clicks[key] | 0); // Initially, one tree is spawned on the clicked tile
  clicks[key] = treeCount;

  // Define the neighboring offsets for each tile
  let offsets = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // Four cardinal directions
    [-1, -1], [-1, 1], [1, -1], [1, 1] // Diagonal directions
  ];

  // Iterate over the offsets to spawn trees on neighboring tiles
  for (let offset of offsets) {
    let ni = i + offset[0];
    let nj = j + offset[1];
    let neighborKey = [ni, nj];

    // Generate a random number of trees (between 0 and 5) for each neighboring tile
    let randomTreeCount = Math.floor(random(6)); // Generates a random number between 0 and 5
    clicks[neighborKey] = randomTreeCount;
  }
}

function generateTreeTiles() {
  treeTiles = [];
  const range = 200;
  for (let i = -range; i <= range; i++) {
    for (let j = -range; j <= range; j++) {
      if (random() < 0.2) { // Adjust the probability as needed
        treeTiles.push([i, j]);
      }
    }
  }
}


function p3_drawTile(i, j) {
  noStroke();

  if (XXH.h32("tile:" + [i, j], worldSeed) % 4 == 0) {
    fill(245,222,179);
  } else {
    fill(53, 76, 30);
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  // Draw trees on tree tiles
  for (let [ti, tj] of treeTiles) {
    if (i === ti && j === tj) {
      fill(139, 69, 19); // Brown color for trunk
      rect(0, -10, 5, 20); // Trunk
      fill(34, 139, 34); // Green color for leaves
      ellipse(0, -20, 20, 20); // Top leaf
      ellipse(-5, -15, 20, 20); // Left leaf
      ellipse(5, -15, 20, 20); // Right leaf
    }
  }

  // draw tile clicks
  let n = clicks[[i, j]] || 0;
  if (n > 0) {
    fill(139, 69, 19); // Brown color for house walls
    rect(-10, 0, 20, 20); // House walls

    fill(92, 51, 23); // Dark brown color for roof
    triangle(-15, 0, 0, -15, 15, 0); // Roof

    fill(255, 204, 153); // Light brown color for windows
    rect(-6, 5, 4, 4); // Window 1
    rect(2, 5, 4, 4); // Window 2

}

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