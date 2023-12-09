const utils = require('../utils')

function calculateNextValue(sequence) {
  if(sequence.every((value) => value === sequence[0])) {
    return sequence[0];
  }

  const nextSequence = [];

  for(let i=1; i<sequence.length; i++) {
    nextSequence.push(sequence[i] - sequence[i-1]);
  }

  const nextValueOfNextSequence = calculateNextValue(nextSequence);
  
  return sequence[sequence.length - 1] + nextValueOfNextSequence;
}

const input = utils.getFileContent(9);

const sequences = input.map(
  (line) => line.split(' ').map(
    (value) => Number.parseInt(value)
  )
);

let sum = 0;

sequences.forEach((sequence) => {
  const nextValue = calculateNextValue(sequence);
  console.log(sequence, nextValue);
  sum += nextValue;
});

console.log(sum)