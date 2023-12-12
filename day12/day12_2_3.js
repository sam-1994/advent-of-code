const utils = require('../utils')

const cache = new Map();

function repeat(str, count, separator) {
  let result = '';
  for (let i = 1; i <= count; i++) {
    result += str;
    if (i !== count) {
      result += separator;
    }
  }

  return result;
}

function countPipeStatusCombinations(pipeStatus, damagedCounts) {
  const cacheKey = pipeStatus + ' ' + damagedCounts.join(',');

  if(cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  if (damagedCounts.length === 0) {
    if (pipeStatus.indexOf('#') < 0) {
      cache.set(cacheKey, 1);
      return 1;
    } else {
      cache.set(cacheKey, 0);
      return 0;
    }
  }

  const firstDamaged = pipeStatus.indexOf('#');
  const firstUnknown = pipeStatus.indexOf('?');

  if (firstUnknown < 0) {
    if(firstDamaged < 0) {
      cache.set(cacheKey, 0);
      return 0;
    } else {
      pipeStatus = pipeStatus.substring(firstDamaged);
    }
  } else {
    if(firstDamaged < 0) {
      pipeStatus = pipeStatus.substring(firstUnknown);
    } else {
      pipeStatus = pipeStatus.substring(Math.min(firstDamaged, firstUnknown));
    }
  }

  const minLength = damagedCounts.reduce((sum, count) => sum + count, 0) + damagedCounts.length - 1;
  if (pipeStatus.length < minLength) {
    cache.set(cacheKey, 0);
    return 0;
  }

  if (pipeStatus.charAt(0) === '#') {
    if (pipeStatus.substring(0, damagedCounts[0]).indexOf('.') >= 0) {
      cache.set(cacheKey, 0);
      return 0;
    } else if (pipeStatus.charAt(damagedCounts[0]) === '#') {
      cache.set(cacheKey, 0);
      return 0;
    } else {
      const count = countPipeStatusCombinations(pipeStatus.substring(damagedCounts[0]+1), damagedCounts.slice(1));
      cache.set(cacheKey, count);
      return count;
    }
  } else {
    const count = countPipeStatusCombinations('#' + pipeStatus.slice(1), damagedCounts)
      + countPipeStatusCombinations(pipeStatus.substring(1), damagedCounts);
    cache.set(cacheKey, count);
    return count;
  }
}

const input = utils.getFileContent(12).filter((line) => line.length > 0);

let combinationCount = 0;


const startDate = new Date();
input.forEach((line, index) => {
  const lineSegments = line.split(' ');
  const pipeStatus = repeat(lineSegments[0], 5, '?');
  const damagedCounts = repeat(lineSegments[1], 5, ',').split(',').map((value) => Number.parseInt(value));

  console.log('pipes:', pipeStatus);
  console.log('damaged counts:', ...damagedCounts);

  const validCombinationNumber = countPipeStatusCombinations(pipeStatus, damagedCounts);
  console.log('valid combination number #' + (index + 1) + ':', validCombinationNumber);
  console.log('-----------------------------------');

  combinationCount += validCombinationNumber;
});

const finishDate = new Date();
const duration = (finishDate - startDate) / 1000;
console.log(`Duration: ${Math.floor(duration / 60)}min ${duration % 60}s`);
// Duration: 0min 0.428s

console.log('Combination sum:', combinationCount);
