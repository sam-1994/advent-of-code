const utils = require('../utils')

function renderMap(map) {
  map.forEach((row) => {
    console.log(...row);
  });
}

let planetCount = 0;

const map = utils.getFileContent(11).filter(
  (line) => line.length > 0).map(
  (line) => line.split('').map((char) => char === '#' ? planetCount++ : '.')
);

console.log('Map:');
renderMap(map);

for (let y = 0; y < map.length; y++) {
  if (map[y].every((object) => object === '.')) {
    map.splice(y, 0, Array(map[y].length).fill('.'));
    y++;
  }
}

for (let x = 0; x < map[0].length; x++) {
  if(map.every((row) => row[x] === '.')) {
    map.forEach((row) => row.splice(x, 0, '.'));
    x++
  }
}

console.log('Expanded map:');
renderMap(map);

const coordinates = [];

for(let y=0; y<map.length; y++) {
  for(let x=0; x<map[y].length; x++) {
    if(map[y][x] !== '.') {
      coordinates.push({
        x,
        y,
      });
    }
  }
}

console.log('Planets:', coordinates);

let distanceSum =0;
for(let i=0; i<coordinates.length; i++) {
  for(let j=i+1; j<coordinates.length; j++) {
    const first = coordinates[i];
    const second = coordinates[j];
    const distance = Math.abs(first.x - second.x) + Math.abs(first.y - second.y);
    console.log('Distance:', i, j, distance);
    distanceSum += distance;
  }
}

console.log('Distance sum:', distanceSum);
