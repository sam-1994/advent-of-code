const utils = require('../utils')

const cards = [
  'A',
  'K',
  'Q',
  'T',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  '3',
  '2',
  'J',
];

function countOccurrences(str, char) {
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    if (str.charAt(i) === char) {
      count++;
    }
  }

  return count;
}

function getType(hand) {
  const jokerCount = countOccurrences(hand, 'J');
  const counts = cards
    .slice(0, cards.length - 1)
    .map((card) => countOccurrences(hand, card))
    .filter((count) => count > 0)
    .sort()
    .reverse();

  if (jokerCount === 5 || counts[0] + jokerCount === 5) {
    return 7;
  } else if (counts[0] + jokerCount === 4) {
    return 6;
  } else if (counts[0] + counts[1] + jokerCount === 5) {
    return 5;
  } else if (counts[0] + jokerCount === 3) {
    return 4;
  } else if (counts[0] + counts[1] + jokerCount === 4) {
    return 3;
  } else if (counts[0] + jokerCount === 2) {
    return 2;
  } else {
    return 1;
  }
}

function compareHands(p1, p2) {
  if (p1.type === p2.type) {
    for (let i = 0; i < 5; i++) {
      if (p1.hand.charAt(i) !== p2.hand.charAt(i)) {
        return cards.indexOf(p2.hand.charAt(i)) - cards.indexOf(p1.hand.charAt(i));
      }
    }
  } else {
    return p1.type - p2.type;
  }
}

const input = utils.getFileContent(7).filter((line) => line.length > 0);

const sortedHands = input.map(
  (line) => {
    const lineParts = line.split(' ');
    const hand = lineParts[0];
    const bet = Number.parseInt(lineParts[1]);
    return {
      hand,
      bet,
      type: getType(hand),
    };
  }
).sort((p1, p2) => compareHands(p1, p2));

console.log(sortedHands);

const winnings = sortedHands.reduce((winning, hand, index) => {
  return winning + hand.bet * (index + 1);
}, 0);

console.log(winnings);
