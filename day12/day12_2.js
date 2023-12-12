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

function validatePipeStatus(pipeStatus, damagedCounts) {
  const firstUnknown = pipeStatus.indexOf('?');

  let knownPipelineStatusPart = firstUnknown < 0 ? pipeStatus : pipeStatus.substring(0, firstUnknown);

  const damagedCountsOfStatus = [...knownPipelineStatusPart.matchAll(/#+/g)].map(
    (match) => match[0].length
  );

  if (firstUnknown >= 0 && pipeStatus.charAt(firstUnknown - 1) === '#') {
    damagedCountsOfStatus.splice(damagedCountsOfStatus.length - 1, 1);
  }

  for (let i = 0; i < damagedCountsOfStatus.length; i++) {
    if (damagedCounts[i] !== damagedCountsOfStatus[i]) {
      return false;
    }
  }

  return damagedCountsOfStatus.length === damagedCounts.length || firstUnknown >= 0;
}

function getPipeStatusCombinations(pipeStatus, damagedCounts) {
  const combinations = [
    pipeStatus
  ];
  let currentElementIndex = 0;
  const totalDamages = damagedCounts.reduce((total, damages) => total + damages, 0);

  while (currentElementIndex < combinations.length) {
    const status = combinations[currentElementIndex];

    const statusDamages = [...status.matchAll(/#/g)].length;
    const statusUnknown = [...status.matchAll(/\?/g)].length;

    if (statusUnknown === 0) {
      if (statusDamages === totalDamages && validatePipeStatus(status, damagedCounts)) {
        currentElementIndex++;
      } else {
        combinations.splice(currentElementIndex, 1);
      }
    } else {
      combinations.splice(currentElementIndex, 1);

      if(statusDamages + statusUnknown > totalDamages) {
        const healthyOption = status.replace('?', '.');
        if (validatePipeStatus(healthyOption, damagedCounts)) {
          combinations.push(healthyOption);
        }
      }

      if (statusDamages < totalDamages) {
        const damagedOption = status.replace('?', '#');
        if (validatePipeStatus(damagedOption, damagedCounts)) {
          combinations.push(damagedOption);
        }
      }
    }
  }

  return combinations;
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

  const pipeStatusCombinations = getPipeStatusCombinations(pipeStatus, damagedCounts);

  const validCombinationNumber = pipeStatusCombinations.length;
  console.log('valid combination number #' + (index + 1) + ':', validCombinationNumber);
  console.log('-----------------------------------');

  combinationCount += validCombinationNumber;
});

const finishDate = new Date();
const duration = Math.floor(finishDate - startDate) / 1000;
console.log(`Duration: ${Math.floor(duration / 60)}min ${duration % 60}s`);

console.log('Combination sum:', combinationCount);
