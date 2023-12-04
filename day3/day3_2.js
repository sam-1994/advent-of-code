const utils = require('../utils')

function isCharaterANumber(char) {
  return !!char.match(/\d+/g);
}

function getNumberFromLine(line, characterIndex) {
  let startIndex = characterIndex;
  while (startIndex > 0 && isCharaterANumber(line.charAt(startIndex - 1))) {
    startIndex--;
  }

  let endIndex = characterIndex;
  while (endIndex < line.length && isCharaterANumber(line.charAt(endIndex))) {
    endIndex++;
  }

  return line.substring(startIndex, endIndex);
}

function calculateNeighbourProduct(input, lineIndex, characterIndex) {
  const neighbours = [];

  for (let y = Math.max(0, lineIndex - 1); y <= Math.min(input.length - 1, lineIndex + 1); y++) {
    const currentLine = input[y];
    if (isCharaterANumber(currentLine.charAt(characterIndex))) {
      neighbours.push(getNumberFromLine(currentLine, characterIndex));
    } else {
      if (isCharaterANumber(currentLine.charAt(characterIndex - 1))) {
        neighbours.push(getNumberFromLine(currentLine, characterIndex - 1));
      }
      if (isCharaterANumber(currentLine.charAt(characterIndex + 1))) {
        neighbours.push(getNumberFromLine(currentLine, characterIndex + 1));
      }
    }
  }
  console.log(lineIndex, characterIndex, neighbours);

  return Number.parseInt(neighbours[0]) * Number.parseInt(neighbours[1]);
}

function getGearRatioSum(input) {
  let sum = 0;

  input.forEach((line, lineIndex) => {
    const numberMatches = line.matchAll(/\*/g);

    for (const match of numberMatches) {
      const characterIndex = match.index;
      let adjacentNumbers = 0;

      for (let y = Math.max(0, lineIndex - 1); y <= Math.min(input.length - 1, lineIndex + 1); y++) {
        const neighbourInputLine = input[y];
        let neighbourPartial;
        if (characterIndex === 0) {
          neighbourPartial = neighbourInputLine.substr(0, 2);
        } else {
          neighbourPartial = neighbourInputLine.substr(characterIndex - 1, 3);
        }

        const partialNumbers = neighbourPartial.match(/\d+/g);
        if (partialNumbers) {
          adjacentNumbers += partialNumbers.length;
        }
      }

      if (adjacentNumbers === 2) {
        sum += calculateNeighbourProduct(input, lineIndex, characterIndex);
      }
    }

  });

  return sum;
}

const input = utils.getFileContent(3);

console.log(getGearRatioSum(input));
