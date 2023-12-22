const utils = require('../utils')

function renderMap(map) {
  map.forEach((row) => {
    console.log(...row.map((field) => field.visitedInEvenSteps ? 'O' : field.char))
  });
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
      }
    })
  );

const maxX = map[0].length - 1;
const maxY = map.length - 1;

renderMap(map);

let currentPositions = [map[startY][startX]];

for (let i = 1; i <= 64 && currentPositions.length > 0; i++) {
  const nextPositions = [];

  currentPositions.forEach((position) => {
    if (position.y > 0) {
      const topField = map[position.y - 1][position.x];
      if (topField.plot && !topField.visitedInEvenSteps) {
        topField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(topField);
      }
    }
    if (position.y < maxY) {
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
    if (position.x < maxX) {
      const rightField = map[position.y][position.x + 1];
      if (rightField.plot && !rightField.visitedInEvenSteps) {
        rightField.visitedInEvenSteps = i % 2 === 0;
        nextPositions.push(rightField);
      }
    }
  });

  currentPositions = nextPositions;
  console.log('Steps:', i);
  console.log('Positions:', nextPositions);
  renderMap(map);
}

let count = 0;
for(let y=0; y<map.length; y++) {
  for(let x=0; x<map[y].length; x++) {
    if(map[y][x].visitedInEvenSteps) {
      count++;
    }
  }
}

console.log('Count', count);
