const utils = require('../utils')

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

const directions = ['R', 'D', 'L', 'U'];

const instructions = utils.getFileContent(18)
  .filter((line) => line.length > 0)
  .map((line) => {
    const color = line.split(' ')[2];
    const length = Number.parseInt(color.substring(2, 7), 16);
    const direction = directions[Number.parseInt(color.substring(7, 8))];

    return {
      direction, length, color,
    }
  });

console.log(instructions);

const coordinates = [{x: 0, y: 0}];
let stepSum = 0;
instructions.forEach((instruction) => {
  stepSum+= instruction.length;
  const lastCoordinates = coordinates[coordinates.length - 1];
  let nextX = lastCoordinates.x;
  let nextY = lastCoordinates.y;

  switch (instruction.direction) {
    case 'U':
      nextY -= instruction.length;
      break;
    case 'R':
      nextX += instruction.length;
      break;
    case 'D':
      nextY += instruction.length;
      break;
    case 'L':
      nextX -= instruction.length;
      break;
  }

  coordinates.push({
    x: nextX,
    y: nextY,
  });

});

console.log(coordinates);

let sum = 0;

for (let i = 0; i < coordinates.length - 1; i++) {
  sum += (coordinates[i].y + coordinates[i + 1].y) * (coordinates[i].x - coordinates[i+1].x)
}

console.log('A', (sum+stepSum) / 2 +1);
