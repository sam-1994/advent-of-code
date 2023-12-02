const utils = require('../utils')

const numbers = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9'
}

const addUppTwoDigitNumbersFromInput = (input) => {
  let result = 0;

  for (const i of input) {
    result += findTwoDigitNumber(i);
  }

  return result;
};

const translate = (input) => {
  return digitsMap[input] ? digitsMap[input] : input;
};

function getNumberOfCurrentInput(input) {
  const regexString = '(?=(\\d|' + Object.keys(numbers).join('|') + '))';
  const regex = new RegExp(regexString, 'gm')
  const inputNumbers = [...input.matchAll(regex)].map((match) => match[1]);

  const firstNumber = inputNumbers[0];
  const lastNumber = inputNumbers[inputNumbers.length - 1];

  const result = (numbers[firstNumber] ?? firstNumber) + (numbers[lastNumber] ?? lastNumber);

  return Number.parseInt(result);
}

const inputs = utils.getFileContent(1);

const result = inputs.reduce((sum, input) => sum + getNumberOfCurrentInput(input), 0)

console.log(result);