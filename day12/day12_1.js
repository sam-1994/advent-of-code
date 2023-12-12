const utils = require('../utils')

function getPipeStatusCombinations(pipeStatus) {
  const firstUnknownStatus = pipeStatus.indexOf('?');
  if(firstUnknownStatus < 0) {
    return [pipeStatus];
  } else {
    return [
      ...getPipeStatusCombinations(pipeStatus.replace('?', '.')),
      ...getPipeStatusCombinations(pipeStatus.replace('?', '#')),
    ];
  }
}

function getValidationRegex(damagedCounts) {
  let regex = '^\\.*';
  damagedCounts.forEach((count, index) => {
    regex += `#{${count}}`;
    if(index !== damagedCounts.length - 1) {
      regex += '\\.+'
    }
  });
  regex += '\\.*$';

  return new RegExp(regex);
}

const input = utils.getFileContent(12).filter((line) => line.length > 0);

let combinationCount = 0;

input.forEach((line) => {
  const lineSegments = line.split(' ');
  const pipeStatus = lineSegments[0];
  const damagedCounts = lineSegments[1].split(',').map((value) => Number.parseInt(value));
  const validationRegex = getValidationRegex(damagedCounts);

  console.log('pipes:', pipeStatus);
  console.log('damaged counts:', ...damagedCounts);
  console.log('validation regex:', validationRegex);

  const pipeStatusCombinations = getPipeStatusCombinations(pipeStatus);
  console.log('pipe status combinations:', pipeStatusCombinations);

  const validCombinationNumber = pipeStatusCombinations.filter(
    (status) => !!status.match(validationRegex)
  ).length;
  console.log('valid combination number', validCombinationNumber);
  console.log('-----------------------------------');

  combinationCount += validCombinationNumber;
});

console.log('Combination sum:', combinationCount);
