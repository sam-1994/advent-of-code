const utils = require('../utils')
const fs = require('fs');

function renderMap(map) {
  return map.map(
    (row) => row.map(
      (field) => field.plot ? (field.steps >= 100 ? field.steps : ' ' + (field.steps > 9 || field.steps < 0 ? field.steps : ' ' + field.steps)) : ' . '
    ).join(' ')
  ).join('\n');
}

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
        plot: char !== '#',
        visitedInEvenSteps: char === 'S',
        steps: -1,
      }
    })
  );

const maxX = map[0].length;
const maxY = map.length;

let currentPositions = [map[startY][startX]];

const steps = 64;
// const steps = 26501365;

for (let i = 1; i <= steps && currentPositions.length > 0; i++) {
  const nextPositions = [];

  currentPositions.forEach((position) => {
    if (position.steps < 0) {
      position.steps = i - 1;
    }
    if (position.y > 0) {
      const topField = map[position.y - 1][position.x];
      if (topField.plot && !topField.visitedInEvenSteps) {
        topField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(topField);
      }
    }
    if (position.y < maxY - 1) {
      const bottomField = map[position.y + 1][position.x];
      if (bottomField.plot && !bottomField.visitedInEvenSteps) {
        bottomField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(bottomField);
      }
    }
    if (position.x > 0) {
      const leftField = map[position.y][position.x - 1];
      if (leftField.plot && !leftField.visitedInEvenSteps) {
        leftField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(leftField);
      }
    }
    if (position.x < maxX - 1) {
      const rightField = map[position.y][position.x + 1];
      if (rightField.plot && !rightField.visitedInEvenSteps) {
        rightField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(rightField);
      }
    }
  });

  currentPositions = nextPositions;
}

let count = 0;
for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x].visitedInEvenSteps) {
      const remainingSteps = steps - Math.abs(x - startX) - Math.abs(y - startY);
      const repX = Math.floor(remainingSteps / maxX);
      const repY = Math.floor(remainingSteps / maxY);
      count += (repX + 1) * (repX + 1) / 2 * 4 - 3;
    }
  }
}

fs.writeFileSync(__dirname + '/map_2_2.txt', renderMap(map));

console.log('Steps:', steps);
console.log('Count', count);

console.log('Rep:', steps * steps / (maxX * maxY));
console.log('Rest:', steps * steps % (maxX * maxY));

