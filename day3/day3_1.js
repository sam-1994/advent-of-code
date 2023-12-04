const utils = require('../utils')


function getSum(input) {
  let sum = 0;

  input.forEach((line, lineIndex) => {
    const numberMatches = line.matchAll(/\d+/g);

    for (const match of numberMatches) {
      const value = match [0];
      const startIndex = match.index;
      const endIndex = match.index + value.length;
      let isValidNumber = false;

      for (let y = Math.max(0, lineIndex - 1); y <= Math.min(input.length - 1, lineIndex + 1); y++) {
        const neighbourInputLine = input[y];
        let neighbourPartial;
        if (startIndex === 0) {
          neighbourPartial = neighbourInputLine.substr(0, value.length + 1);
        } else {
          neighbourPartial = neighbourInputLine.substr(startIndex - 1, value.length + 2);
        }

        const matchingSymbol = neighbourPartial.match(/[^0-9.]/);
        if (matchingSymbol) {
          isValidNumber = true;
        }
      }

      if(isValidNumber) {
        sum += Number.parseInt(value);
      }
    }

  });

  return sum;
}

const input = utils.getFileContent(3);

console.log(getSum(input));
