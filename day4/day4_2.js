const utils = require('../utils')

function getNumberArrayFromSection(section) {
  return section.trim().split(' ')
    .filter((sectionPart) => sectionPart.length > 0)
    .map((sectionPart) => Number.parseInt(sectionPart));
}

function collectCards(input) {
  const cardNumbers = Array(input.length).fill(1);

  input.forEach((line, lineIndex) => {
    numbersSections = line.split(':')[1].split('|');
    const winningNumbers = getNumberArrayFromSection(numbersSections[0]);
    const myNumbers = getNumberArrayFromSection(numbersSections[1]);

    const matches = myNumbers.filter((number) => winningNumbers.indexOf(number) >= 0).length;

    for (let i = lineIndex + 1; i < input.length && i <= lineIndex + matches; i++) {
      cardNumbers[i] += cardNumbers[lineIndex];
    }
  });
  
  return cardNumbers.reduce((count, currentNumber) => count + currentNumber, 0);
}

const input = utils.getFileContent(4);

console.log(collectCards(input));
