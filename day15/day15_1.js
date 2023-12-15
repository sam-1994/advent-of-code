const utils = require('../utils')

function calculateHash(str) {
  let hash = 0;

  for(let i=0; i<str.length; i++) {
    hash += str.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }
  
  return hash;
}

const inputs = utils.getFileContent(15, {separator: ','});

let hashSum = 0;

inputs.forEach((input) => {
  const hash = calculateHash(input);
  console.log(`Input ${input} => Hash ${hash}`);
  hashSum += hash;
});

console.log('Hash sum', hashSum);

