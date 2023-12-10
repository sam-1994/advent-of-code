const utils = require('../utils')

function findStartCoordinates(map) {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === 'S') {
        return {
          x,
          y,
        }
      }
    }
  }
}


const map = utils.getFileContent(10).filter((line) => line.length > 0).map((line) => line.split(''));

const startCoordinates = findStartCoordinates(map);
const startX = startCoordinates.x;
const startY = startCoordinates.y;

console.log('start', startX, startY);

function hasEndAtNorth(x, y) {
  const char = map[y][x];
  return ['|', 'L', 'J', 'S'].indexOf(char) >= 0;
}

function hasEndAtEast(x, y) {
  const char = map[y][x];
  return ['-', 'L', 'F', 'S'].indexOf(char) >= 0;
}

function hasEndAtSouth(x, y) {
  const char = map[y][x];
  return ['|', '7', 'F', 'S'].indexOf(char) >= 0;
}

function hasEndAtWest(x, y) {
  const char = map[y][x];
  return ['-', 'J', '7', 'S'].indexOf(char) >= 0;
}

let steps = 0;
let currentX = startX;
let currentY = startY;
let direction = '';

do {
  console.log('current point', currentX, currentY);
  steps++;
  if (direction !== 'south' && currentY < map.length - 1 && hasEndAtSouth(currentX, currentY) && hasEndAtNorth(currentX, currentY + 1)) {
    currentY++;
    direction = 'north';
  } else if (direction !== 'west' && 0 < currentX && hasEndAtWest(currentX, currentY) && hasEndAtEast(currentX - 1, currentY)) {
    currentX--;
    direction = 'east';
  } else if (direction !== 'north' && 0 < currentY && hasEndAtNorth(currentX, currentY) && hasEndAtSouth(currentX, currentY - 1)) {
    currentY--;
    direction = 'south';
  } else if (direction !== 'east' && currentX < map[currentY].length - 1 && hasEndAtEast(currentX, currentY) && hasEndAtWest(currentX + 1, currentY)) {
    currentX++;
    direction = 'west';
  } else {
    throw new Error('Nothing found');
  }
} while (currentX !== startX || currentY !== startY)

console.log('Back at start in', steps);
console.log('Max distance', Math.ceil(steps / 2));
