const utils = require('../utils')

function renderMap(map) {
  map.forEach((row) => {
    console.log(...row);
  });
}

function findVerticalMirrorPosition(map) {
  for (let i = 1; i < map[0].length; i++) {
    const hasMirror = map.every(
      (line) => {
        const leftString = line.substring(0, i).split('').reverse().join('');
        const rightString = line.substring(i);

        return leftString.startsWith(rightString) || rightString.startsWith(leftString);
      }
    );
    if (hasMirror) {
      return i;
    }
  }
  return -1;
}

function findHorizontalMirrorPosition(map) {
  for (let i = 1; i < map.length; i++) {
    const hasMirror = Array.from(
      {length: map[i].length},
      (value, index) => index
    ).every(
      (index) => {
        const upperString = map.slice(0, i).map(
          (upperMap) => upperMap.charAt(index)
        ).reverse().join('');

        const lowerString = map.slice(i).map(
          (lowerMap) => lowerMap.charAt(index)
        ).join('');

        return upperString.startsWith(lowerString) || lowerString.startsWith(upperString);
      }
    );

    if (hasMirror) {
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
