const utils = require('../utils')

function getNextBeamFromEmptySpace(map, beam) {
  switch (beam.direction) {
    case 'up':
      if (beam.y > 0) {
        return {
          x: beam.x,
          y: beam.y - 1,
          direction: beam.direction
        }
      }
      break;
    case 'right':
      if (beam.x < map[beam.y].length - 1) {
        return {
          x: beam.x + 1,
          y: beam.y,
          direction: beam.direction
        }
      }
      break;
    case 'down':
      if (beam.y < map.length - 1) {
        return {
          x: beam.x,
          y: beam.y + 1,
          direction: beam.direction
        }
      }
      break;
    case 'left':
      if (beam.x > 0) {
        return {
          x: beam.x - 1,
          y: beam.y,
          direction: beam.direction
        }
      }
      break;
  }
}


function getNextBeamFromSlashMirror(map, beam) {
  switch (beam.direction) {
    case 'up':
      if (beam.x < map[beam.y].length - 1) {
        return {
          x: beam.x + 1,
          y: beam.y,
          direction: 'right'
        }
      }
      break;
    case 'right':
      if (beam.y > 0) {
        return {
          x: beam.x,
          y: beam.y - 1,
          direction: 'up'
        }
      }
      break;
    case 'down':
      if (beam.x > 0) {
        return {
          x: beam.x - 1,
          y: beam.y,
          direction: 'left'
        }
      }
      break;
    case 'left':
      if (beam.y < map.length - 1) {
        return {
          x: beam.x,
          y: beam.y + 1,
          direction: 'down'
        }
      }
      break;
  }
}


function getNextBeamFromBackslashMirror(map, beam) {
  switch (beam.direction) {
    case 'up':
      if (beam.x > 0) {
        return {
          x: beam.x - 1,
          y: beam.y,
          direction: 'left'
        }
      }
      break;
    case 'right':
      if (beam.y < map.length - 1) {
        return {
          x: beam.x,
          y: beam.y + 1,
          direction: 'down'
        }
      }
      break;
    case 'down':
      if (beam.x < map[beam.y].length - 1) {
        return {
          x: beam.x + 1,
          y: beam.y,
          direction: 'right'
        }
      }
      break;
    case 'left':
      if (beam.y > 0) {
        return {
          x: beam.x,
          y: beam.y - 1,
          direction: 'up'
        }
      }
      break;
  }
}

function getNextBeamsFromVerticalSplitter(map, beam) {
  const nextBeams = [];

  if (beam.direction !== 'down') {
    if (beam.y > 0) {
      nextBeams.push({
        x: beam.x,
        y: beam.y - 1,
        direction: 'up'
      });
    }
  }

  if (beam.direction !== 'up') {
    if (beam.y < map.length - 1) {
      nextBeams.push({
        x: beam.x,
        y: beam.y + 1,
        direction: 'down'
      });
    }
  }

  return nextBeams;
}


function getNextBeamsFromHorizontalSplitter(map, beam) {
  const nextBeams = [];

  if (beam.direction !== 'right') {
    if (beam.x > 0) {
      nextBeams.push({
        x: beam.x - 1,
        y: beam.y,
        direction: 'left'
      });
    }
  }

  if (beam.direction !== 'left') {
    if (beam.x < map[beam.y].length - 1) {
      nextBeams.push({
        x: beam.x + 1,
        y: beam.y,
        direction: 'right'
      });
    }
  }

  return nextBeams;
}

function countEnergizedFields(map) {
  let energizedFields = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map.length; x++) {
      if (map[y][x].energized) {
        energizedFields++;
      }
    }
  }

  return energizedFields;
}

const map = utils.getFileContent(16)
  .filter((line) => line.length > 0)
  .map(
    (line) => line.split('').map(
      (char) => ({
        char,
        energized: false,
        metFrom: {
          up: false,
          right: false,
          down: false,
          left: false,
        }
      })
    )
  );

const beams = [{
  x: 0,
  y: 0,
  direction: 'right'
}];

while (beams.length > 0) {
  const beam = beams.shift();
  const field = map[beam.y][beam.x];

  if (!field) {
    console.log(beam);
  }

  if (field.metFrom[beam.direction]) {
    continue;
  }

  field.energized = true;
  field.metFrom[beam.direction] = true;

  let nextBeams = [];

  switch (field.char) {
    case '.':
      nextBeams.push(getNextBeamFromEmptySpace(map, beam));
      break;
    case '/':
      nextBeams.push(getNextBeamFromSlashMirror(map, beam));
      break;
    case '\\':
      nextBeams.push(getNextBeamFromBackslashMirror(map, beam));
      break;
    case '|':
      nextBeams = getNextBeamsFromVerticalSplitter(map, beam);
      break;
    case '-':
      nextBeams = getNextBeamsFromHorizontalSplitter(map, beam);
      break;
  }

  beams.push(...nextBeams.filter((beam) => !!beam));
}

console.log('Energized fields: ' + countEnergizedFields(map));
