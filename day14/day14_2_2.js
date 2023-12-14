const utils = require('../utils')

const cache = [];

function renderMap(map) {
  console.log('Map:')
  map.forEach((row) => {
    console.log(...row);
  });
}

function getCacheString(map) {
  return map.map(
    (line) => line.join('')
  ).join('|');
}

function getHorizontalString(map, x) {
  return map.map((line) => line[x]).join('');
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

  const horizontalDirection = ['n', 's'].indexOf(direction) < 0;

  for (let outer = outerItteratorMin; outer !== outerItteratorMax; outer += outerItteratorStep) {
    let freeSpaces = [];

    for (let inner = innerItteratorMin; inner !== innerItteratorMax; inner += innerItteratorStep) {
      const x = horizontalDirection ? inner : outer;
      const y = horizontalDirection ? outer : inner;

      const char = map[y][x];
      if (char === '.') {
        freeSpaces.push(inner);
      } else if (char === '#') {
        freeSpaces = [];
      } else if (freeSpaces.length > 0) {
        const firstFreeSpace = freeSpaces.shift();
        if (horizontalDirection) {
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

let map = utils.getFileContent(14).map((line) => line.split(''));
const turns = 1000000000;

let cycleFound = false;
let cycleStart = 0;
let cycleEnd = 0;

while (!cycleFound && cycleEnd <= turns) {
  if (cycleEnd % 100000 === 0) {
    console.log(cycleEnd);
  }
  const cacheKey = getCacheString(map);
  const cacheIndex = cache.indexOf(cacheKey);

  if (cacheIndex >= 0) {
    cycleStart = cacheIndex;
    cycleFound = true;
  } else {
    cycleEnd++;

    orderMap(map, 'n');
    orderMap(map, 'w');
    orderMap(map, 's');
    orderMap(map, 'e');
    renderMap(map);
  }

  cache.push(cacheKey);

}

const finalPosition = ((turns - cycleStart) % (cycleEnd - cycleStart)) + cycleStart;

console.log(cache);
console.log('Start', cycleStart);
console.log('End', cycleEnd);
console.log('Final position', finalPosition);

map = cache[finalPosition].split('|').map((line) => line.split(''));

const weight = calculateWeight(map);
console.log('Weight:', weight);
