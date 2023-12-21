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

const stepsOfLocation = locations.map((location) => {
    let steps = 0;
    let instruction = 0;

    const startDate = new Date();

    while (!location.endsWith('Z')) {
      const direction = instructions.charAt(instruction);

      location = locationMap.get(location)[direction]
      steps++;
      instruction++;
      instruction %= instructions.length;
    }

    return steps;
  }
);

console.log(stepsOfLocation);

console.log(
  stepsOfLocation.reduce((result, steps) => utils.lcm(result, steps), 1)
);
