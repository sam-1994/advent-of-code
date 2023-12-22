const utils = require('../utils')
const fs = require('fs');

function renderMap(map) {
  return map.map(
    (row) => row.map(
      (field) => field.plot ? (field.steps >= 100 ? field.steps : ' ' + (field.steps > 9 || field.steps < 0 ? field.steps : ' ' + field.steps)) : ' . '
    ).join(' ')
  ).join('\n');
}

function sumFrom1ToN(n) {
  return n * (n + 1) / 2;
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

const steps = 1000;
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
for (let y = 0; y < maxY; y++) {
  for (let x = 0; x < maxX; x++) {
    const remainingSteps = steps - Math.abs(y) - Math.abs(x);
    const remainingRepetitionsQ1 = Math.floor((steps + y - startY - x - startX) / maxX);
    const remainingRepetitionsQ2 = Math.floor((steps + y - startY + x - startX) / maxX);
    const remainingRepetitionsQ3 = Math.floor((steps - y - startY + x - startX) / maxX);
    const remainingRepetitionsQ4 = Math.floor((steps - y - startY - x - startX) / maxX);

    if (map[y][x].visitedInEvenSteps) {
      count += sumFrom1ToN(remainingRepetitionsQ1) + sumFrom1ToN(remainingRepetitionsQ2) + sumFrom1ToN(remainingRepetitionsQ3) + sumFrom1ToN(remainingRepetitionsQ4);
    }
  }
}

count -= 4 * steps / 2;

// 668697
// 679064

// maxX = 11
// xStart = 5
// x = -6
// xRef = 10
// x + xStart + xMax = 10
// %maxX = 10

// maxX = 100
// xStart = 60
// x = 128
// xRef = 28
// x - xStart = 68
// %maxX = 68
// +xStart = 128
// %maxX = 28

fs.writeFileSync(__dirname + '/map_2_3.txt', renderMap(map));

console.log('Steps:', steps);
console.log('Count', count);


// 0 0
// 0 1
// 0 2
// 0 3
// 0 4
// 0 5
// 0 6
// 1 0
// 1 1
// 1 2
// 1 3
// 1 4
// 1 5
// 2 0
// 2 1
// 2 2
// 2 3
// 2 4
// 3 0
// 3 1
// 3 2
// 3 3
// 4 0
// 4 1
// 4 2
// 5 0
// 5 1
// 6 0
