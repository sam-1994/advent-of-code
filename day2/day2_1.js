const utils = require('../utils')

const amounts = {
  red: 12,
  green: 13,
  blue: 14,
};

function splitTurnIntoCounts(turn) {
  return turn.split(', ').reduce((counts, cubeCount) => {
    const countSegments = cubeCount.split(' ');
    return {
      ...counts,
      [countSegments[1]]: Number.parseInt(countSegments[0]),
    }
  }, {});
}

function getGameCounts(input) {
  let splitInput = input.split(': ');

  const gameNumber = Number.parseInt(splitInput[0].split(' ')[1]);
  const turns = splitInput[1].split('; ' )

  return {
    gameNumber,
    counts: turns.map(splitTurnIntoCounts)
  }
}

function getValidGameSum(inputs) {
  const gameCounts = inputs.map(getGameCounts);

  const validGameSum = gameCounts.reduce((sum, currentRound) => {
    for(const colorCounts of currentRound.counts) {
      for(const color of Object.keys(colorCounts)) {
        if(amounts[color] < colorCounts[color]) {
          return sum;
        }
      }
    }
    return sum + currentRound.gameNumber;
  }, 0);

  return validGameSum;
}

const input = utils.getFileContent(2);

console.log(getValidGameSum(input));