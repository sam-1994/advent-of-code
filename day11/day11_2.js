const utils = require('../utils')

function renderMap(map) {
  map.forEach((row) => {
    console.log(...row);
  });
}

let planetCount = 0;
const emptyFactor = 1000000;

const map = utils.getFileContent(11).filter(
  (line) => line.length > 0).map(
  (line) => line.split('').map((char) => char === '#' ? '#' : 1)
);

console.log('Map:');
renderMap(map);

for (let y = 0; y < map.length; y++) {
  if (map[y].every((object) => object !== '#')) {
    map[y].fill(emptyFactor);
  }
}

for (let x = 0; x < map[0].length; x++) {
  if (map.every((row) => row[x] !== '#')) {
    map.forEach((row) => row[x] = emptyFactor);
  }
}

console.log('Expanded map:');
renderMap(map);

const coordinates = [];

for (let y = 0; y < map.length; y++) {
  for (let x = 0; x < map[y].length; x++) {
    if (map[y][x] === '#') {
      coordinates.push({
        x,
        y,
      });
    }
  }
}

console.log('Planets:', coordinates);

let distanceSum = 0;
for (let i = 0; i < coordinates.length; i++) {
  for (let j = i + 1; j < coordinates.length; j++) {
    const first = coordinates[i];
    const second = coordinates[j];
    const minX = Math.min(first.x, second.x);
    const maxX = Math.max(first.x, second.x);
    const minY = Math.min(first.y, second.y);
    const maxY = Math.max(first.y, second.y);

    let distance = 0;
    for (let x = minX + 1; x < maxX; x++) {
      distance += map[minY][x] === '#' ? 1 : map[minY][x];
    }

    for (let y = minX === maxX ? minY + 1 : minY; y <= maxY; y++) {
      distance += map[y][maxX] === '#' ? 1 : map[y][maxX];
    }

    console.log('Distance:', i, j, distance);

    distanceSum += distance;
  }
}

console.log('Distance sum:', distanceSum);
