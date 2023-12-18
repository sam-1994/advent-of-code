const utils = require('../utils')

function getPossibleNextPositions(map, pos) {
  const positions = [];
  if (pos.direction !== 'down' && pos.y > 0 && (pos.direction !== 'up' || pos.streightSteps < 3) && !map[pos.y - 1][pos.x].visited) {
    positions.push({
      x: pos.x,
      y: pos.y - 1,
      streightSteps: pos.direction === 'up' ? pos.streightSteps + 1 : 1,
      direction: 'up',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y - 1][pos.x].heat
    });
    map[pos.y - 1][pos.x].visited = true;
  }

  if (pos.direction !== 'left' && pos.x < map[pos.y].length - 1 && (pos.direction !== 'right' || pos.streightSteps < 3) && !map[pos.y][pos.x + 1].visited) {
    positions.push({
      x: pos.x + 1,
      y: pos.y,
      streightSteps: pos.direction === 'right' ? pos.streightSteps + 1 : 1,
      direction: 'right',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y][pos.x + 1].heat
    });
    map[pos.y][pos.x + 1].visited = true;
  }

  if (pos.direction !== 'up' && pos.y < map.length - 1 && (pos.direction !== 'down' || pos.streightSteps + 1 < 3) && !map[pos.y + 1][pos.x].visited) {
    positions.push({
      x: pos.x,
      y: pos.y + 1,
      streightSteps: pos.direction === 'down' ? pos.streightSteps + 1 : 1,
      direction: 'down',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y + 1][pos.x].heat
    });
    map[pos.y + 1][pos.x].visited = true;
  }

  if (pos.direction !== 'right' && pos.x > 0 && (pos.direction !== 'left' || pos.streightSteps + 1 < 3) && !map[pos.y][pos.x - 1].visited) {
    positions.push({
      x: pos.x - 1,
      y: pos.y,
      streightSteps: pos.direction === 'left' ? pos.streightSteps + 1 : 1,
      direction: 'left',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y][pos.x - 1].heat
    });
    map[pos.y][pos.x - 1].visited = true;
  }

  return positions;
}

function getIndexOfPositionWithMinHeat(map, positions) {
  let index = 0;
  const maxX = map[0].length;
  const maxY = map.length;

  for (let i = 1; i < positions.length; i++) {
    const posI = positions[i];
    const posIndex = positions[index];
    if (posI.currentHeat + maxY - posI.y + maxX - posI.x < posIndex.currentHeat + maxY - posIndex.y + maxX - posIndex.X) {
      index = i;
    }
  }

  return index;
}

const map = utils.getFileContent(17)
  .filter((line) => line.length > 0)
  .map((line) => line.split('').map((value) => ({
    heat: Number.parseInt(value),
    visited: true
  })));

let exitFound = false;

let positions = [];

let currentBestPos = {
  x: 0, y: 0, streightSteps: 0, direction: 'right', currentHeat: 0, stepCount: 0
};
let currentBestHeat = 0;

while (currentBestPos.x !== map[0].length || currentBestPos !== map.length) {
  positions.push(...getPossibleNextPositions(map, currentBestPos));
  const currentBesPosIndex = getIndexOfPositionWithMinHeat(map, positions);
  currentBestPos = positions.splice(currentBesPosIndex, 1)[0];

  const currentBestPosHeat = currentBestPos.currentHeat + map.length - currentBestPos.y + map[0].length - currentBestPos.x;

  if (currentBestPosHeat !== currentBestHeat) {
    currentBestHeat = currentBestPosHeat;
    console.log('Heat: ', currentBestHeat)
  }
}

console.log(currentBestPos);
