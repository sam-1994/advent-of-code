const utils = require('../utils')

const input = utils.getFileContent(8);

const instructions = input[0];

const locationMap = new Map();

const paths = input.slice(2).forEach((pathDirection) => {
  const matches = [...pathDirection.matchAll(/[0-9A-Z]+/g)];

  const currentLocation = matches[0][0];
  const leftLocation = matches[1][0];
  const rightLocation = matches[2][0];

  locationMap.set(currentLocation, {
    L: leftLocation,
    R: rightLocation,
  });
});

let location = 'AAA';
let steps = 0;
let instruction = 0;

while (location !== 'ZZZ') {
  const direction = instructions.charAt(instruction);
  
  location = locationMap.get(location)[direction];
  steps++;
  instruction++;
  instruction %= instructions.length;
}

console.log(steps);