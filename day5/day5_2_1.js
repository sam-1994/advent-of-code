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


let [seedRanges, ...maps] = utils.getFileContent(5, {
  separator: '\n\n'
});

seedRanges = seedRanges.split(':')[1].trim().split(' ').map(
  (number) => Number.parseInt(number)
);

maps = maps.map(
  (inputSection) => inputSection.split(':')[1].trim()
    .split('\n').map(
      (numbers) => numbers.split(' ').map((number) => Number.parseInt(number))
    )
);

console.log('Seed Ranges:');
console.log(seedRanges);

console.log('Maps:');
console.log(maps);

const startDate = new Date();
console.log('Start:', startDate);

let lowestLocation = Number.MAX_VALUE;

for(let i=0; i<seedRanges.length; i+=2) {
  for(let seed = seedRanges[i]; seed < seedRanges[i] + seedRanges[i+1]; seed++) {
    lowestLocation = Math.min(lowestLocation, transformSeedThroughMapsToLocation(seed, maps));
  }
}
const finishDate = new Date();
console.log('Finished:', finishDate);

const duration = Math.floor(finishDate - startDate)/1000;
console.log(`Duration: ${Math.floor(duration/60)}min ${Math.floor(duration%60)}s`);

console.log('Lowest location:', lowestLocation);

// Start: 2023-12-05T12:14:48.494Z
// Finished: 2023-12-05T12:19:39.340Z
// Duration: 4min 50s
// Lowest location: 2520479

