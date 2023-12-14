const utils = require('../utils')

function renderMap(map) {
  console.log('Map:')
  map.forEach((row) => {
    console.log(...row);
  });
}

function orderMap(map) {
  for (let x = 0; x < map[0].length; x++) {
    let freeSpaces = [];
    for (let y = 0; y < map.length; y++) {
      const char = map[y][x];
      if (char === '.') {
        freeSpaces.push(y);
      } else if(char === '#') {
        freeSpaces = [];
      } else if(freeSpaces.length > 0) {
        const firstFreeSpace = freeSpaces.shift();
        map[firstFreeSpace][x] = char;
        map[y][x] = '.';
        freeSpaces.push(y);
      }
    }
  }
}

function calculateWeight(map) {
  let weight = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      const char = map[y][x];
      if (char === 'O') {
        weight += map.length - y;
      }
    }
  }

  return weight;
}

const map = utils.getFileContent(14).map((line) => line.split(''));

renderMap(map);

orderMap(map);

renderMap(map);

const weight = calculateWeight(map);
console.log('Weight:', weight);
