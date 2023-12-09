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

let locations = [...locationMap.keys()].filter(
  (location) => location.endsWith('A')
);

let steps = 0;
let instruction = 0;

const startDate = new Date();
console.log('Start:', startDate);

while (!locations.every((location) => location.endsWith('Z'))) {
  console.log(steps);
  const direction = instructions.charAt(instruction);

  locations = locations.map(
    (location) => {
      return locationMap.get(location)[direction]
    }
  );
  steps++;
  instruction++;
  instruction %= instructions.length;
}

const finishDate = new Date();
console.log('Finished:', finishDate);

const duration = Math.floor(finishDate - startDate)/1000;
console.log(`Duration: ${Math.floor(duration/60)}min ${Math.floor(duration%60)}s`);

console.log('Steps:', steps);
