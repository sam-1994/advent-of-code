const utils = require('../utils')

const cache = new Map();

const map = utils.getFileContent(17)
  .filter((line) => line.length > 0)
  .map((line, y) => line.split('').map((value, x) => Number.parseInt(value)));

const maxX = map[0].length - 1;
const maxY = map.length - 1;

function getCacheString(x, y, direction, streightSteps) {
  return `${x}_${y}_${direction}_${streightSteps}`;
}

function getPossibleNextPositions(position) {
  let [_x, _y, direction, _streightSteps] = position.split('_');
  const x = Number.parseInt(_x);
  const y = Number.parseInt(_y);
  const streightSteps = Number.parseInt(_streightSteps);
  const heat = cache.get(position);

  const positions = [];

  if (y > 0 && direction !== 's' && (direction !== 'n' || streightSteps < 3)) {
    const northCacheString = getCacheString(x, y - 1, 'n', direction === 'n' ? streightSteps + 1 : 1);
    const northHeat = heat + map[y - 1][x];
    if (!cache.has(northCacheString) || northHeat < cache.get(northCacheString)) {
      cache.set(northCacheString, northHeat);
      positions.push(northCacheString);
    }
  }

  if (x < maxX && direction !== 'w' && (direction !== 'e' || streightSteps < 3)) {
    const eastCacheString = getCacheString(x + 1, y, 'e', direction === 'e' ? streightSteps + 1 : 1);
    const eastHeat = heat + map[y][x + 1];
    if (!cache.has(eastCacheString) || eastHeat < cache.get(eastCacheString)) {
      cache.set(eastCacheString, eastHeat);
      positions.push(eastCacheString);
    }
  }

  if (y < maxY && direction !== 'n' && (direction !== 's' || streightSteps < 3)) {
    const southCacheString = getCacheString(x, y + 1, 's', direction === 's' ? streightSteps + 1 : 1);
    const southHeat = heat + map[y + 1][x];
    if (!cache.has(southCacheString) || southHeat < cache.get(southCacheString)) {
      cache.set(southCacheString, southHeat);
      positions.push(southCacheString);
    }
  }

  if (x > 0 && direction !== 'e' && (direction !== 'w' || streightSteps < 3)) {
    const westCacheString = getCacheString(x - 1, y, 'w', direction === 'w' ? streightSteps + 1 : 1);
    const westHeat = heat + map[y][x - 1];
    if (!cache.has(westCacheString) || westHeat < cache.get(westCacheString)) {
      cache.set(westCacheString, westHeat);
      positions.push(westCacheString);
    }
  }

  return positions;
}

function getIndexOfPositionWithMinHeat(positions) {
  let index = 0;
  let heatEstimationIndex = Number.MAX_VALUE;

  for (let i = 0; i < positions.length; i++) {
    let [_x, _y] = positions[i].split('_');

    const x = Number.parseInt(_x);
    const y = Number.parseInt(_y);
    const heat = cache.get(positions[i]);

    const heatEstimation = heat + maxY - y + maxX - x;
    if (heatEstimation < heatEstimationIndex) {
      index = i;
      heatEstimationIndex = heatEstimation;
    }
  }

  return index;
}


const eastStartCacheString = getCacheString(1, 0, 'e', 1);
const southStartCacheString = getCacheString(0, 1, 's', 1);

cache.set(eastStartCacheString, map[0][1]);
cache.set(southStartCacheString, map[1][0]);

let currentPositions = [eastStartCacheString, southStartCacheString];

let currentBestPosition;

do {
  const currentBesPositionIndex = getIndexOfPositionWithMinHeat(currentPositions);
  currentBestPosition = currentPositions.splice(currentBesPositionIndex, 1)[0];
  const currentBestPositionHeat = cache.get(currentBestPosition);
  console.log(currentBestPosition, currentBestPositionHeat);

  currentPositions.push(...getPossibleNextPositions(currentBestPosition));
} while (!currentBestPosition.startsWith(`${maxX}_${maxY}`))

console.log('Heat:', cache.get(currentBestPosition));
