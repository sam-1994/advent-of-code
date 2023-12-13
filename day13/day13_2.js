const utils = require('../utils')

function renderMap(map) {
  map.forEach((row) => {
    console.log(...row);
  });
}

function findVerticalMirrorPosition(map) {
  for (let i = 1; i < map[0].length; i++) {
    let differences = 0;

    map.forEach((line) => {
      const leftString = line.substring(0, i).split('').reverse().join('');
      const rightString = line.substring(i);

      for (let j = 0; j < leftString.length && j < rightString.length; j++) {
        if (leftString.charAt(j) !== rightString.charAt(j)) {
          differences++;
        }
      }
    });

    if (differences === 1) {
      return i;
    }
  }
  return -1;
}

function findHorizontalMirrorPosition(map) {
  for (let i = 1; i < map.length; i++) {
    let differences = 0;

    for (let index = 0; index < map[i].length; index++) {
      const upperString = map.slice(0, i).map(
        (upperMap) => upperMap.charAt(index)
      ).reverse().join('');

      const lowerString = map.slice(i).map(
        (lowerMap) => lowerMap.charAt(index)
      ).join('');

      for (let j = 0; j < upperString.length && j < lowerString.length; j++) {
        if (upperString.charAt(j) !== lowerString.charAt(j)) {
          differences++;
        }
      }
    }

    if (differences === 1) {
      return i;
    }
  }
  return -1;
}

const maps = utils.getFileContent(13, {
  separator: '\n\n'
}).map(
  (line) => line.split('\n')
);

let result = 0;

maps.forEach((map, index) => {
  const verticalPosition = findVerticalMirrorPosition(map);

  if (verticalPosition >= 0) {
    console.log(index + ' vertical: ', verticalPosition);
    result += verticalPosition;
  } else {
    const horizontalPosition = findHorizontalMirrorPosition(map);
    console.log(index + ' horizontal: ', horizontalPosition);

    if (horizontalPosition >= 0) {
      result += 100 * horizontalPosition;
    } else {
      console.log('No mirror found!');
      renderMap(map);
    }
  }
});

console.log(result);
