const utils = require('../utils')

function getPossibleNextPositions(map, pos) {
  const positions = [];
  if (pos.direction !== 'down' && pos.y > 0 && (pos.direction !== 'up' || (pos.streightSteps + 1 < map[pos.y - 1][pos.x].metRunning.up))) {
    positions.push({
      x: pos.x,
      y: pos.y - 1,
      streightSteps: pos.direction === 'up' ? pos.streightSteps + 1 : 1,
      direction: 'up',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y - 1][pos.x].heat
    });
    map[pos.y - 1][pos.x].metRunning.up = pos.direction === 'up' ? pos.streightSteps + 1 : 1;
  }

  if (pos.direction !== 'left' && pos.x < map[pos.y].length - 1 && (pos.direction !== 'right' || pos.streightSteps + 1 < map[pos.y][pos.x + 1].metRunning.right)) {
    positions.push({
      x: pos.x + 1,
      y: pos.y,
      streightSteps: pos.direction === 'right' ? pos.streightSteps + 1 : 1,
      direction: 'right',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y][pos.x + 1].heat
    });
    map[pos.y][pos.x + 1].metRunning.right = pos.direction === 'right' ? pos.streightSteps + 1 : 1;
  }

  if (pos.direction !== 'up' && pos.y < map.length - 1 && (pos.direction !== 'down' || pos.streightSteps + 1 < map[pos.y + 1][pos.x].metRunning.down)) {
    positions.push({
      x: pos.x,
      y: pos.y + 1,
      streightSteps: pos.direction === 'down' ? pos.streightSteps + 1 : 1,
      direction: 'down',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y + 1][pos.x].heat
    });
    map[pos.y + 1][pos.x].metRunning.down = pos.direction === 'down' ? pos.streightSteps + 1 : 1;
  }

  if (pos.direction !== 'right' && pos.x > 0 && (pos.direction !== 'left' || pos.streightSteps + 1 < map[pos.y][pos.x - 1].metRunning.left)) {
    positions.push({
      x: pos.x - 1,
      y: pos.y,
      streightSteps: pos.direction === 'left' ? pos.streightSteps + 1 : 1,
      direction: 'left',
      stepCount: pos.stepCount + 1,
      currentHeat: pos.currentHeat + map[pos.y][pos.x - 1].heat
    });
    map[pos.y][pos.x - 1].metRunning.left = pos.direction === 'left' ? pos.streightSteps + 1 : 1;
  }

  return positions;
}

function getIndexOfPositionWithMinHeat(positions) {
  let index = 0;

  for (let i = 1; i < positions.length; i++) {
    if (positions[i].currentHeat < positions[index].currentHeat) {
      index = i
    }
  }


  return index;
}

const map = utils.getFileContent(17)
  .filter((line) => line.length > 0)
  .map((line) => line.split('').map((value) => ({
    heat: Number.parseInt(value),
    metRunning: {
      up: 4,
      right: 4,
      down: 4,
      left: 4,
    }
  })));

let exitFound = false;

let positions = [];

let currentBestPos = {
  x: 0, y: 0, streightSteps: 0, direction: 'right', currentHeat: 0, stepCount: 0
};
let currentBestHeat = 0;

while (currentBestPos.x !== map[0].length || currentBestPos !== map.length) {
  positions.push(...getPossibleNextPositions(map, currentBestPos));
  const currentBesPosIndex = getIndexOfPositionWithMinHeat(positions);
  currentBestPos = positions.splice(currentBesPosIndex, 1)[0];

  if (currentBestPos.currentHeat !== currentBestHeat) {
    currentBestHeat = currentBestPos.currentHeat;
    console.log('Heat: ', currentBestHeat)
  }
}

console.log(currentBestPos);
