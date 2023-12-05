const utils = require('../utils')

function transformSeedThroughMapsToLocation(seed, maps) {
  return maps.reduce((currentValue, transformationMap) => {
    for(const transformation of transformationMap) {
      const transformationTarget = transformation[0];
      const transformationRangeStart = transformation[1];
      const transformationRangeLength = transformation[2];

      if(transformationRangeStart <= currentValue && currentValue < transformationRangeStart + transformationRangeLength) {
        return currentValue + transformationTarget - transformationRangeStart;
      }
    }
    return currentValue;
  }, seed);
}

let [seeds, ...maps] = utils.getFileContent(5, {
  separator: '\n\n'
});

seeds = seeds.split(':')[1].trim().split(' ').map(
  (number) => Number.parseInt(number)
);

maps = maps.map(
  (inputSection) => inputSection.split(':')[1].trim()
    .split('\n').map(
      (numbers) => numbers.split(' ').map((number) => Number.parseInt(number))
    )
);

console.log('Seeds:');
console.log(seeds);

console.log('Maps:');
console.log(maps);

const locations = seeds.map(
  (seed) => transformSeedThroughMapsToLocation(seed, maps)
);

console.log('Locations:');
console.log(locations);

const lowestLocation = Math.min(...locations);

console.log('Lowest location:', lowestLocation)
