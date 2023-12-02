const utils = require('../utils')

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

function getPowerOfRound(round) {
  const minimalAmounts = {
    red: 0,
    green: 0,
    blue: 0,
  };
  for(const colorCounts of round.counts) {
    for(const color of Object.keys(colorCounts)) {
      minimalAmounts[color] = Math.max(minimalAmounts[color], colorCounts[color])
    }
  }
  return minimalAmounts.red * minimalAmounts.green * minimalAmounts.blue;
}

function getMimimumGamePower(inputs) {
  const gameCounts = inputs.map(getGameCounts);

  const gamePower = gameCounts.reduce((power, currentRound) => {
    return power + getPowerOfRound(currentRound);
  }, 0);

  return gamePower;
}

const input = utils.getFileContent(2);

console.log(getMimimumGamePower(input));