const utils = require('../utils')

const inputs = utils.getFileContent(1);

const result = inputs
    .map((input) => input.replace(/[^\p{N}]/gu, ''))
    .reduce((sum, currentValue) => {
      const currentNumber = currentValue.charAt(0) + currentValue.charAt(currentValue.length - 1);
      return sum + Number.parseInt(currentNumber);
    }, 0);

console.log(result);