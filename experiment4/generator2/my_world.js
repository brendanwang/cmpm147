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
  clicks[key] = 1 + (clicks[key] | 0);
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
    fill(255,255,255);
  } else {
    fill(185,232,234);
  }

  push();

  beginShape();
  vertex(-tw, 0);
  vertex(0, th);
  vertex(tw, 0);
  vertex(0, -th);
  endShape(CLOSE);

  for (let [ti, tj] of treeTiles) {
    if (i === ti && j === tj) {
      fill(134,214,216); // color of igloo
      beginShape();
      curveVertex(-15, -10); // Igloo base curve start
      curveVertex(-15, -10);
      curveVertex(-10, -30); // Igloo base curve middle
      curveVertex(0, -35); // Igloo base curve top
      curveVertex(10, -30); // Igloo base curve middle
      curveVertex(15, -10); // Igloo base curve end
      curveVertex(15, -10);
      endShape(CLOSE); // Igloo base curve end

      fill(200); // Light gray color for igloo entrance
      beginShape();
      for (let angle = 0; angle <= PI; angle += PI / 20) {
        let x = 7 * cos(angle);
        let y = -10 - 10 * sin(angle); // Flipped y-coordinate
        vertex(x, y);
      }
      endShape(CLOSE); // Igloo entrance (half-circle)
    }
  }


  // draw tile clicks
  let n = clicks[[i, j]] || 0;
  if (n > 0) {
    // Penguin body
    fill(0); // Black color for penguin body
    ellipse(0, -5, 20, 25); // Body ellipse

    // Penguin head
    fill(255); // White color for penguin head
    ellipse(0, -20, 15, 15); // Head ellipse

    // Penguin eyes
    fill(0); // Black color for penguin eyes
    ellipse(-4, -22, 3, 3); // Left eye
    ellipse(4, -22, 3, 3); // Right eye

    // Penguin beak
    fill(255, 204, 0); // Yellow color for penguin beak
    triangle(-2, -15, 2, -15, 0, -10); // Triangle for beak
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