const utils = require('../utils')

function getMaxRight(instructions) {
  let maxRight = 0;
  instructions.reduce((width, instruction) => {
    if (instruction.direction === 'R') {
      width += instruction.length;
    } else if (instruction.direction === 'L') {
      width -= instruction.length;
    }

    maxRight = Math.max(width, maxRight);

    return width;
  }, 0);

  return maxRight;
}

function getMaxLeft(instructions) {
  let maxLeft = 0;
  instructions.reduce((width, instruction) => {
    if (instruction.direction === 'R') {
      width += instruction.length;
    } else if (instruction.direction === 'L') {
      width -= instruction.length;
    }

    maxLeft = Math.min(width, maxLeft);

    return width;
  }, 0);

  return maxLeft;
}

function getMaxDown(instructions) {
  let maxDown = 0;
  instructions.reduce((height, instruction) => {
    if (instruction.direction === 'U') {
      height -= instruction.length;
    } else if (instruction.direction === 'D') {
      height += instruction.length;
    }

    maxDown = Math.max(height, maxDown);
    return height;
  }, 0);

  return maxDown;
}

function getMaxUp(instructions) {
  let maxUp = 0;
  instructions.reduce((height, instruction) => {
    if (instruction.direction === 'U') {
      height -= instruction.length;
    } else if (instruction.direction === 'D') {
      height += instruction.length;
    }

    maxUp = Math.min(height, maxUp);
    return height;
  }, 0);

  return maxUp;
}

function travelThroughMap(map, instructions, maxLeft, maxUp) {
  let currentX = 0;
  let currentY = 0;

  instructions.forEach((instruction) => {
    if (['U', 'D'].indexOf(instruction.direction) >= 0) {
      map[currentY - maxUp][currentX - maxLeft] = instruction.direction;
    }
    for (let i = 0; i < instruction.length; i++) {
      switch (instruction.direction) {
        case 'R':
          currentX++;
          break;
        case 'L':
          currentX--;
          break;
        case 'U':
          currentY--;
          break;
        case 'D':
          currentY++;
          break;
      }

      console.log('Travel', currentX, currentY);

      map[currentY - maxUp][currentX - maxLeft] = instruction.direction;
    }
  });
}

function countFields(map) {
  let includedFields = 0;
  let lastDirection;
  for (let y = 0; y < map.length; y++) {
    let isInside = false;
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === '.') {
        if (isInside) {
          includedFields++;
        }
      } else {
        includedFields++;
        const currentPoint = map[y][x];
        if (currentPoint !== lastDirection && (currentPoint === 'U' || currentPoint === 'D')) {
          lastDirection = currentPoint;
          isInside = !isInside;
        }
      }
    }
  }

  return includedFields;
}

function renderMap(map) {
  console.log('Map:')
  map.forEach((row) => {
    console.log(row.join(''));
  });
}

const instructions = utils.getFileContent(18)
  .filter((line) => line.length > 0)
  .map((line) => {
    const lineParts = line.split(' ');
    const direction = lineParts[0];
    const length = Number.parseInt(lineParts[1]);

    return {
      direction, length,
    }
  });

console.log(instructions);


const maxLeft = getMaxLeft(instructions);
const maxRight = getMaxRight(instructions);
const maxUp = getMaxUp(instructions);
const maxDown = getMaxDown(instructions);

const map = [];

for (let y = maxUp; y <= maxDown; y++) {
  const row = [];
  for (let x = maxLeft; x <= maxRight; x++) {
    row.push('.');
  }
  map.push(row);
}

travelThroughMap(map, instructions, maxLeft, maxUp);
renderMap(map);

const includedFields = countFields(map);
console.log('Fields', includedFields);
