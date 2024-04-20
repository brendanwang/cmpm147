// Author: Brendan Wang
// Date: 4/21/24

/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];
  let waterStartCol = 0;
  let waterEndCol = numCols;
  let waveAmplitude = 3;
  let waveFrequency = 0.3;

  // Function to place specific tiles on certain coordinates
  function placeTileOnCoordinates(x, y, tile) {
    if (x >= 0 && x < numCols && y >= 0 && y < numRows) {
      grid[y][x] = tile;
    }
  }

  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      // Calculate the vertical displacement for the current column based on sine wave
      let verticalDisplacement = Math.sin(j * waveFrequency) * waveAmplitude;

      // Calculate the start and end row of the water stream for the current column
      let waterStartRow = Math.floor(numRows / 2) + verticalDisplacement;
      let waterEndRow = waterStartRow + 9; // Water stream spans 3 rows

      // Check if the current cell is within the water stream area
      if (i >= waterStartRow && i <= waterEndRow && j >= waterStartCol && j <= waterEndCol) {
        if (Math.random() < 0.03) { // 3% chance of spawning bubbles in water
          row.push("Z");
        } else {
          row.push("W"); // Place water tile
        }
      } else {
        if (Math.random() < 0.07) { // 7% chance of spawning trees
          row.push("T");
        } else {
          row.push("G"); // Place default grass tile
        }
      }
    }
    grid.push(row);
  }

  // top edge of grass HORIZONTAL
  placeTileOnCoordinates(3, 12, "E");
  placeTileOnCoordinates(4, 12, "E");
  placeTileOnCoordinates(5, 12, "E");
  placeTileOnCoordinates(6, 12, "E");
  placeTileOnCoordinates(7, 12, "E");
  placeTileOnCoordinates(8, 12, "E");
  
  placeTileOnCoordinates(13, 8, "E");
  placeTileOnCoordinates(14, 8, "E");
  placeTileOnCoordinates(15, 8, "E");
  placeTileOnCoordinates(16, 8, "E");
  placeTileOnCoordinates(17, 8, "E");
  placeTileOnCoordinates(18, 8, "E");
  placeTileOnCoordinates(19, 8, "E");
  
  // top edge of grass DOWNWARDS CURVE
  placeTileOnCoordinates(2, 12, "C");
  placeTileOnCoordinates(2, 11, "A");
  placeTileOnCoordinates(1, 11, "C");
  placeTileOnCoordinates(1, 10, "A");
  placeTileOnCoordinates(0, 10, "C");
  placeTileOnCoordinates(0, 9, "A");
  
  // top edge of grass UPWARDS CURVE
  placeTileOnCoordinates(9, 12, "B");
  placeTileOnCoordinates(9, 11, "D");
  placeTileOnCoordinates(10, 11, "B");
  placeTileOnCoordinates(10, 10, "D");
  placeTileOnCoordinates(11, 10, "B");
  placeTileOnCoordinates(10, 10, "D");
  placeTileOnCoordinates(11, 9, "D");
  placeTileOnCoordinates(12, 9, "B");
  placeTileOnCoordinates(12, 8, "D");
  
  // bottom edge of grass HORIZONTAL
  placeTileOnCoordinates(13, 17, "U");
  placeTileOnCoordinates(14, 17, "U");
  placeTileOnCoordinates(15, 17, "U");
  placeTileOnCoordinates(16, 17, "U");
  placeTileOnCoordinates(17, 17, "U");
  placeTileOnCoordinates(18, 17, "U");
  
  // bottom edge of grass DOWNWARDS DIAGONAL
  placeTileOnCoordinates(19, 18, "X");
  
  // bottom edge of grass UPWARDS DIAGONAL
  placeTileOnCoordinates(12, 18, "Y");
  placeTileOnCoordinates(11, 19, "Y");
  

  return grid;
}

function drawGrid(grid) {
  background(42, 172, 255); // black background

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      let tileType = grid[i][j];
      // Render different tiles based on the tile type
      switch (tileType) {
        case 'G':
          placeTile(i, j, floor(random(3)), 0); // Grass tile
          break;
        case 'W':
          placeTile(i, j, 0, 13); // Water tile
          break;
        case 'E':
          placeTile(i, j, 10, 0); // Downwards Horizontal Edge tile
          break;
        case 'U':
          placeTile(i, j, 10, 2); // Upwards Horizontal Edge tile
          break;
        case 'A':
          placeTile(i, j, 11, 0); // Downwards Diagonal Edge tile
          break;
        case 'B':
          placeTile(i, j, 12, 2); // Upwards Diagonal Edge tile
          break;
        case 'C':
          placeTile(i, j, 12, 1); // Vertical Edge tile facing left
          break;
        case 'D':
          placeTile(i, j, 9, 0); // Vertical Edge tile facing right
          break;
        case 'X':
          placeTile(i, j, 9, 2); // Upwards facing downwards edge
          break;
        case 'Y':
          placeTile(i, j, 11, 2); // Upwards facing downwards edge
          break;
        case 'Z':
          placeTile(i, j, floor(random(1,4)), 13); // Water bubbles
          break;
        case 'T':
          placeTile(i, j, floor(random(15,19)), 2); // Tree
          break;
        default:
          break;
      }
    }
  }
}