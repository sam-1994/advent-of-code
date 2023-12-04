const utils = require('../utils')

function getNumberArrayFromSection(section) {
  return section.trim().split(' ')
    .filter((sectionPart) => sectionPart.length > 0)
    .map((sectionPart) => Number.parseInt(sectionPart));
}

function getCardValues(input) {
  let value = 0;

  input.forEach((line) => {
    numbersSections = line.split(':')[1].split('|');
    const winningNumbers = getNumberArrayFromSection(numbersSections[0]);
    const myNumbers = getNumberArrayFromSection(numbersSections[1]);

    const matches = myNumbers.filter((number) => winningNumbers.indexOf(number) >= 0).length;

    if (matches > 0) {
      value += Math.pow(2, matches - 1)
    }
  });
  
  return value;
}

const input = utils.getFileContent(4);

console.log(getCardValues(input));
