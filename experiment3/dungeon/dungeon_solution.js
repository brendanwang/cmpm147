/* exported generateGrid, drawGrid */
/* global placeTile */

function generateGrid(numCols, numRows) {
  let grid = [];

  // Fill the grid with walls
  for (let i = 0; i < numRows; i++) {
    let row = [];
    for (let j = 0; j < numCols; j++) {
      row.push("#");
    }
    grid.push(row);
  }

  // Randomly generate rooms
  const numRooms = 5; // You can adjust the number of rooms as needed
  const rooms = []; // Store the rooms' positions and sizes
  
  for (let n = 0; n < numRooms; n++) {
    const roomWidth = floor(random(4, 8)); // Random width between 4 and 8 tiles
    const roomHeight = floor(random(4, 8)); // Random height between 4 and 8 tiles
    const startX = floor(random(numCols - roomWidth));
    const startY = floor(random(numRows - roomHeight));

    // Store the room's position and size
    rooms.push({
      x: startX,
      y: startY,
      width: roomWidth,
      height: roomHeight
    });

    // Carve out the room
    for (let i = startY; i < startY + roomHeight; i++) {
      for (let j = startX; j < startX + roomWidth; j++) {
        grid[i][j] = "_"; // Set the tiles inside the room to empty spaces
        
        // Randomly place monsters, treasure chests, and traps
        if (random() < 0.03) { // 3% chance of placing a monster
          grid[i][j] = "D";
        } else if (random() < 0.03) { // 3% chance of placing a treasure chest
          grid[i][j] = "C";
        } else if (random() < 0.02) { // 2% chance of placing treasure
          grid[i][j] = "T";
        }
      }
    }
  }

  // Connect rooms with corridors
  for (let i = 0; i < rooms.length - 1; i++) {
    const roomA = rooms[i];
    const roomB = rooms[i + 1];
    
    // Connect the centers of the two rooms
    const centerA = {
      x: roomA.x + Math.floor(roomA.width / 2),
      y: roomA.y + Math.floor(roomA.height / 2)
    };
    const centerB = {
      x: roomB.x + Math.floor(roomB.width / 2),
      y: roomB.y + Math.floor(roomB.height / 2)
    };

    // Carve corridors horizontally and vertically
    for (let x = Math.min(centerA.x, centerB.x); x <= Math.max(centerA.x, centerB.x); x++) {
      grid[centerA.y][x] = "_";
    }
    for (let y = Math.min(centerA.y, centerB.y); y <= Math.max(centerA.y, centerB.y); y++) {
      grid[y][centerB.x] = "_";
    }
  }

  return grid;
}


// Check if a given location is inside the grid and contains the target value
function gridCheck(grid, i, j, target) {
  return i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && grid[i][j] === target;
}

// Form a 4-bit code using gridCheck on the north/south/east/west neighbors of i,j for the target code
function gridCode(grid, i, j, target) {
  let code = 0;
  code += gridCheck(grid, i - 1, j, target) ? 1 << 0 : 0; // North
  code += gridCheck(grid, i + 1, j, target) ? 1 << 1 : 0; // South
  code += gridCheck(grid, i, j + 1, target) ? 1 << 2 : 0; // East
  code += gridCheck(grid, i, j - 1, target) ? 1 << 3 : 0; // West
  return code;
}

// Draw based on the generated code
function drawContext(grid, i, j, target, ti, tj) {
  const code = gridCode(grid, i, j, target);
  const lookup = [
    [0, 0], [1, 0], [2, 0], [3, 0], [0, 1], [1, 1], [2, 1], [3, 1],
    [0, 2], [1, 2], [2, 2], [3, 2], [0, 3], [1, 3], [2, 3], [3, 3]
  ];

  const [tiOffset, tjOffset] = lookup[code];
  placeTile(i, j, ti + tiOffset, tj + tjOffset);
}



function drawGrid(grid) {
  background(0); // black background

  for(let i = 0; i < grid.length; i++) {
    for(let j = 0; j < grid[i].length; j++) {
      let tileType = grid[i][j];
      // Render different tiles based on the tile type
      switch (tileType) {
        case '#':
          if (gridCheck(grid, i, j, '_') ||
              gridCheck(grid, i - 1, j, '_') ||
              gridCheck(grid, i + 1, j, '_') ||
              gridCheck(grid, i, j - 1, '_') ||
              gridCheck(grid, i, j + 1, '_')) {
            // If the current tile or any neighboring tile is a dungeon room tile,
            // render a different dungeon tile
            placeTile(i, j, 24, 23); // Different dungeon tile
          } else {
            placeTile(i, j, floor(random(3)), 23); // dungeon tile
          }
          break;
        case '_':
          placeTile(i, j, floor(random(3)), 9); // dungeon room tile
          break;
        case 'D':
          placeTile(i, j, floor(random(28,30)), 0,1); // debris tile
          break;
        case 'C':
          placeTile(i, j, floor(random(0,6)), 28,30); // chest tile
          break;
        case 'T':
          placeTile(i, j, floor(random(26,28)), 0,3); // treasure tile
          break;
        default:
          break;
      }
    }
  }
}

