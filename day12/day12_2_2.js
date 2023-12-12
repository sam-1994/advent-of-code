const utils = require('../utils')

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
  if (damagedCounts.length === 0) {
    if (pipeStatus.indexOf('#') < 0) {
      return 1;
    } else {
      return 0;
    }
  }

  const firstDamaged = pipeStatus.indexOf('#');
  const firstUnknown = pipeStatus.indexOf('?');

  if (firstUnknown < 0) {
    if(firstDamaged < 0) {
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
    return 0;
  }

  if (pipeStatus.charAt(0) === '#') {
    if (pipeStatus.substring(0, damagedCounts[0]).indexOf('.') >= 0) {
      return 0;
    } else if (pipeStatus.charAt(damagedCounts[0]) === '#') {
      return 0;
    } else {
      return countPipeStatusCombinations(pipeStatus.substring(damagedCounts[0]+1), damagedCounts.slice(1));
    }
  } else {
    return countPipeStatusCombinations('#' + pipeStatus.slice(1), damagedCounts)
      + countPipeStatusCombinations(pipeStatus.substring(1), damagedCounts);
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
const duration = Math.floor(finishDate - startDate) / 1000;
console.log(`Duration: ${Math.floor(duration / 60)}min ${duration % 60}s`);

console.log('Combination sum:', combinationCount);
