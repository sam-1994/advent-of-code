const utils = require('../utils')

function renderMap(map) {
  console.log('Map:')
  map.forEach((row) => {
    console.log(...row);
  });
}

function orderMap(map, direction) {
  let outerItteratorMin;
  let outerItteratorMax;
  let outerItteratorStep;
  let innerItteratorMin;
  let innerItteratorMax;
  let innerItteratorStep;

  switch (direction) {
    case 'n':
      outerItteratorMin = 0;
      outerItteratorMax = map[0].length;
      outerItteratorStep = 1;
      innerItteratorMin = 0;
      innerItteratorMax = map.length;
      innerItteratorStep = 1;
      break;
    case 'e':
      outerItteratorMin = 0;
      outerItteratorMax = map.length;
      outerItteratorStep = 1;
      innerItteratorMin = map[0].length - 1;
      innerItteratorMax = -1;
      innerItteratorStep = -1;
      break;
    case 's':
      outerItteratorMin = 0;
      outerItteratorMax = map[0].length;
      outerItteratorStep = 1;
      innerItteratorMin = map.length - 1;
      innerItteratorMax = -1;
      innerItteratorStep = -1;
      break;
    case 'w':
      outerItteratorMin = 0;
      outerItteratorMax = map.length;
      outerItteratorStep = 1;
      innerItteratorMin = 0;
      innerItteratorMax = map[0].length;
      innerItteratorStep = 1;
      break;
  }

  for (let outer = outerItteratorMin; outer !== outerItteratorMax; outer += outerItteratorStep) {
    let freeSpaces = [];
    for (let inner = innerItteratorMin; inner !== innerItteratorMax; inner += innerItteratorStep) {
      const x = ['n', 's'].indexOf(direction) < 0 ? inner : outer;
      const y = ['n', 's'].indexOf(direction) < 0 ? outer : inner;
      const char = map[y][x];
      if (char === '.') {
        freeSpaces.push(inner);
      } else if (char === '#') {
        freeSpaces = [];
      } else if (freeSpaces.length > 0) {
        const firstFreeSpace = freeSpaces.shift();
        if (['n', 's'].indexOf(direction) < 0) {
          map[y][firstFreeSpace] = char;
        } else {
          map[firstFreeSpace][x] = char;
        }
        map[y][x] = '.';
        freeSpaces.push(inner);
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

for (let i = 0; i < 1000000000; i++) {
  if (i % 1000000 === 0) {
    console.log('Turn', i);
  }
  orderMap(map, 'n');
  orderMap(map, 'e');
  orderMap(map, 's');
  orderMap(map, 'w');
}

renderMap(map);

const weight = calculateWeight(map);
console.log('Weight:', weight);
