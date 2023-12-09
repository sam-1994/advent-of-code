const utils = require('../utils')

function calculatePreviousValue(sequence) {
  if(sequence.every((value) => value === sequence[0])) {
    return sequence[0];
  }

  const nextSequence = [];

  for(let i=1; i<sequence.length; i++) {
    nextSequence.push(sequence[i] - sequence[i-1]);
  }

  const previousValueOfNextSequence = calculatePreviousValue(nextSequence);

  return sequence[0] - previousValueOfNextSequence;
}

const input = utils.getFileContent(9);

const sequences = input.map(
  (line) => line.split(' ').map(
    (value) => Number.parseInt(value)
  )
);

let sum = 0;

sequences.forEach((sequence) => {
  const previousValue = calculatePreviousValue(sequence);
  console.log(sequence, previousValue);
  sum += previousValue;
});

console.log(sum)
