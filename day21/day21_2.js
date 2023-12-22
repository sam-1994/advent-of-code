const utils = require('../utils')

function getCacheKey(x, y) {
  return `${x}_${y}`;
}

const visitedFieldsInEvenSteps = [];

let startX;
let startY;

const map = utils.getFileContent(21)
  .filter((line) => line.length > 0)
  .map(
    (line, y) => line.split('').map((char, x) => {
      if (char === 'S') {
        startX = x;
        startY = y;
      }
      return {
        x,
        y,
        char,
        plot: char !== '#'
      }
    })
  );

const maxX = map[0].length;
const maxY = map.length;

let currentPositions = [{
  x: startX,
  y: startY
}];

const steps = 26501365;

for (let i = 1; i <= steps; i++) {
  const nextPositions = [];

  currentPositions.forEach((position) => {
    const x = position.x;
    const y = position.y;
    const posX = ((x) % maxX + maxX) % maxX;
    const posY = ((y) % maxY + maxY) % maxY;

    const topY = ((y - 1) % maxY + maxY) % maxY;
    const topField = map[topY][posX];
    if (!topField) {
      console.log('ll')
    }
    if (topField.plot && visitedFieldsInEvenSteps.indexOf(getCacheKey(x, y - 1)) < 0) {
      if (i % 2 === 0) {
        visitedFieldsInEvenSteps.push(getCacheKey(x, y - 1))
      }
      nextPositions.push({
        x: x,
        y: y - 1,
      });
    }

    const bottomY = ((y + 1) % maxY + maxY) % maxY;
    const bottomField = map[bottomY][posX];
    if (bottomField.plot && visitedFieldsInEvenSteps.indexOf(getCacheKey(x, y + 1)) < 0) {
      if (i % 2 === 0) {
        visitedFieldsInEvenSteps.push(getCacheKey(x, y + 1))
      }
      nextPositions.push({
        x: x,
        y: y + 1,
      });
    }

    const leftX = ((x - 1) % maxX + maxX) % maxX;
    const leftField = map[posY][leftX];
    if (leftField.plot && !visitedFieldsInEvenSteps.indexOf(getCacheKey(x - 1, y)) < 0) {
      if (i % 2 === 0) {
        visitedFieldsInEvenSteps.push(getCacheKey(x - 1, y))
      }
      nextPositions.push({
        x: x - 1,
        y: y,
      });
    }

    const rightX = ((x + 1) % maxX + maxX) % maxX;
    const rightField = map[posY][rightX];
    if (rightField.plot && !visitedFieldsInEvenSteps.indexOf(getCacheKey(x + 1, y)) < 0) {
      if (i % 2 === 0) {
        visitedFieldsInEvenSteps.push(getCacheKey(x + 1, y))
      }
      nextPositions.push({
        x: x + 1,
        y: y,
      });
    }
  });

  currentPositions = nextPositions;
  if (i % 100000 === 0) {
    console.log('Steps:', i);
  }
  // console.log('Positions:', nextPositions);
}

const count = visitedFieldsInEvenSteps.size;

console.log('Count', count);
