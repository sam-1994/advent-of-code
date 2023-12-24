const utils = require('../utils')
const fs = require('fs');

let maxX = 0;
let maxY = 0;
let maxZ = 0;

const map = [];

function renderMapXZ() {
  const res = [];
  for (let z = maxZ; z >= 0; z--) {
    let row = [];
    for (let x = 0; x <= maxX; x++) {
      let char = '.';
      for (let y = 0; y <= maxY; y++) {
        const currentChar = map[z][y][x];
        if (currentChar !== '.') {
          char = char === '.' || char === currentChar ? currentChar : '?';
        }
      }
      row.push(char.padStart(5, ' '));
    }
    res.push(row.join(''));
  }
  return res;
}

function renderMapYZ() {
  const res = [];
  for (let z = maxZ; z >= 0; z--) {
    let row = [];
    for (let y = 0; y <= maxY; y++) {
      let char = '.';
      for (let x = 0; x <= maxX; x++) {
        const currentChar = map[z][y][x];
        if (currentChar !== '.') {
          char = char === '.' || char === currentChar ? currentChar : '?';
        }
      }
      row.push(char.padStart(5, ' '));
    }
    res.push(row.join(''));
  }
  return res;
}

function renderTower() {
  const res = [];
  for (let z = maxZ; z >= 0; z--) {
    let dimension = [];
    dimension.push(('z = ' + z).padStart(Math.ceil(2.5 * maxX + 2), '-').padEnd(5 * maxX + 4, '-'));
    for (let y = maxY; y >= 0; y--) {
      let row = [];
      for (let x = 0; x <= maxX; x++) {
        const char = map[z][y][x];
        row.push(char.padStart(4, ' '));
      }
      dimension.push(row.join(' '));
    }
    res.push(dimension.join('\n'));
  }
  return res.join('\n');
}

function renderMaps(name) {
  // const maps = [
  // ...renderMapXZ(),
  // '-----------',
  // ...renderMapYZ()
  // ];
  // fs.writeFileSync(__dirname + '/maps_' + name + '.txt', maps.join('\n'));
  fs.writeFileSync(__dirname + '/maps_' + name + '.txt', renderTower());
}

const inputs = utils.getFileContent(22)
  .filter((line) => line.length > 0)
  .map(
    (line, index) => {
      const coordinates = line.split('~');
      const start = coordinates[0].split(',').map((n) => Number.parseInt(n));
      const end = coordinates[1].split(',').map((n) => Number.parseInt(n));

      maxX = Math.max(maxX, start[0], end[0]);
      maxY = Math.max(maxY, start[1], end[1]);
      maxZ = Math.max(maxZ, start[2], end[2]);

      return {
        id: index.toString(),
        size: 1 + end[0] - start[0] + end[1] - start[1] + end[2] - start[2],
        direction: start[2] !== end[2] ? 'z' : (start[1] !== end[1] ? 'y' : 'x'),
        start: {
          x: start[0],
          y: start[1],
          z: start[2],
        },
        end: {
          x: end[0],
          y: end[1],
          z: end[2],
        }
      }
    }
  )
  .sort((i1, i2) => i1.start.z - i2.start.z);


for (let z = 0; z <= maxZ; z++) {
  const dimension = [];
  for (let y = 0; y <= maxY; y++) {
    const row = [];
    for (let x = 0; x <= maxX; x++) {
      row.push(z === 0 ? '-' : '.');
    }
    dimension.push(row);
  }
  map.push(dimension);
}

inputs.forEach((input) => {
  for (let z = input.start.z; z <= input.end.z; z++) {
    for (let y = input.start.y; y <= input.end.y; y++) {
      const row = [];
      for (let x = input.start.x; x <= input.end.x; x++) {
        map[z][y][x] = input.id;
      }
    }
  }
})

renderMaps('initial');

inputs.forEach((input) => {
  let falling = true;
  do {
    for (let y = input.start.y; y <= input.end.y && falling; y++) {
      for (let x = input.start.x; x <= input.end.x && falling; x++) {
        falling = map[input.start.z - 1][y][x] === '.';
      }
    }

    if (falling) {
      for (let z = input.start.z; z <= input.end.z; z++) {
        for (let y = input.start.y; y <= input.end.y; y++) {
          for (let x = input.start.x; x <= input.end.x; x++) {
            map[z][y][x] = '.';
            map[z - 1][y][x] = input.id;
          }
        }
      }
      input.start.z--;
      input.end.z--;
    }
  } while (falling)
});

renderMaps('after_falling');

const holds = new Map();
const isHoldBy = new Map();

inputs.forEach((input) => {
  const inputHolds = [];
  const inputIsHoldBy = [];
  for (z = input.start.z; z <= input.end.z; z++) {
    for (y = input.start.y; y <= input.end.y; y++) {
      for (x = input.start.x; x <= input.end.x; x++) {
        const char = map[z][y][x];
        const charOnTop = z < maxZ ? map[z + 1][y][x] : '.';
        if (charOnTop !== '.' && charOnTop !== char && inputHolds.indexOf(charOnTop) < 0) {
          inputHolds.push(charOnTop);
        }
        const charBelow = z > 1 ? map[z - 1][y][x] : '.';
        if (charBelow !== '.' && charBelow !== char && inputIsHoldBy.indexOf(charBelow) < 0) {
          inputIsHoldBy.push(charBelow);
        }
      }
    }
  }

  holds.set(input.id, inputHolds);
  isHoldBy.set(input.id, inputIsHoldBy);
});

console.log(holds);
console.log(isHoldBy);

let res = 0;

inputs.forEach((input) => {
  const removed = [input.id];
  const potentiallyAffected = [...holds.get(input.id)];
  
  while(potentiallyAffected.length > 0) {
    const block = potentiallyAffected.shift();
    if(removed.indexOf(block) < 0 && isHoldBy.get(block).every((b) => removed.indexOf(b) >= 0)) {
      removed.push(block);
      potentiallyAffected.push(...holds.get(block));
    }
  }
  res += removed.length - 1;
});

console.log('Result:', res);