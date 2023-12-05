const utils = require('../utils')

function transformSeedRangesThroughMapsToLocationRanges(seedRanges, maps) {
  return maps.reduce((currentSeedRanges, transformationMap) => {
    const transformedRanges = [];

    currentSeedRanges.forEach((range) => {
      let seedStart = range.start;
      let seedEnd = range.end;

      for (let t = 0; t < transformationMap.length; t++) {
        const transformation = transformationMap[t];
        const transformationTarget = transformation[0];
        const transformationRangeStart = transformation[1];
        const transformationRangeEnd = transformation[1] + transformation[2] - 1;

        if (transformationRangeEnd < seedStart) {
          continue;
        }

        if (seedStart < transformationRangeStart) {
          if (seedEnd < transformationRangeStart) {
            transformedRanges.push(range);
            return;
          } else {
            transformedRanges.push({
              start: seedStart,
              end: transformationRangeStart - 1
            });
            seedStart = transformationRangeStart;
          }
        }

        if (seedEnd <= transformationRangeEnd) {
          transformedRanges.push({
            start: seedStart + transformationTarget - transformationRangeStart,
            end: seedEnd + transformationTarget - transformationRangeStart,
          });
          return;
        } else {
          transformedRanges.push({
            start: seedStart + transformationTarget - transformationRangeStart,
            end: transformationRangeEnd + transformationTarget - transformationRangeStart,
          });
          seedStart = transformationRangeEnd + 1;
        }
      }

      transformedRanges.push(range);
    });

    return transformedRanges;
  }, seedRanges);
}


let [seedRanges, ...maps] = utils.getFileContent(5, {
  separator: '\n\n'
});

seedRanges = seedRanges.split(':')[1].trim().split(' ').map(
  (number) => Number.parseInt(number)
);

seedRangeObjects = [];

for (let i = 0; i < seedRanges.length; i += 2) {
  seedRangeObjects.push({
    start: seedRanges[i],
    end: seedRanges[i] + seedRanges[i + 1] - 1
  });
}

maps = maps.map(
  (inputSection) => inputSection.split(':')[1].trim()
    .split('\n').map(
      (numbers) => numbers.split(' ').map((number) => Number.parseInt(number))
    )
    .sort((mapEntry1, mapEntry2) => mapEntry1[1] - mapEntry2[1])
);

console.log('Seed Ranges:');
console.log(seedRangeObjects);

console.log('Maps:');
console.log(maps);

const startDate = new Date();
console.log('Start:', startDate);


const locationRanges = transformSeedRangesThroughMapsToLocationRanges(seedRangeObjects, maps);
const lowestLocation = Math.min(...locationRanges.map((locationRange) => locationRange.start));

const finishDate = new Date();
console.log('Finished:', finishDate);

const duration = Math.floor(finishDate - startDate) / 1000;
console.log(`Duration: ${Math.floor(duration / 60)}min ${duration % 60}s`);

console.log('Lowest location:', lowestLocation);

// Start: 2023-12-05T12:43:33.996Z
// Finished: 2023-12-05T12:43:33.997Z
// Duration: 0min 0.001s
// Lowest location: 2520479

