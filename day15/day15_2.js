const utils = require('../utils')

const boxes = new Map();

function calculateHash(str) {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
    hash *= 17;
    hash %= 256;
  }

  return hash;
}

function renderBoxes() {
  for (const [key, box] of boxes.entries()) {
    console.log(`Box ${key}: ${box}`);
  }
  console.log('------------------');
}

const inputs = utils.getFileContent(15, {separator: ','});

inputs.forEach((input) => {
  const dashIndex = input.indexOf('-');
  const equalsIndex = input.indexOf('=');
  if (dashIndex >= 0) {
    const label = input.substring(0, dashIndex);
    const hash = calculateHash(label);
    const box = boxes.get(hash);
    if (!box) {
      return;
    }

    const index = box.findIndex((element) => element.startsWith(label));
    if (index >= 0) {
      box.splice(index, 1);
      if (box.length === 0) {
        boxes.delete(hash);
      }
    }
  } else if (equalsIndex >= 0) {
    const label = input.substring(0, equalsIndex);
    const hash = calculateHash(label);
    let box = boxes.get(hash);
    if (!box) {
      box = [];
      boxes.set(hash, box);
    }

    const index = box.findIndex((element) => element.startsWith(label));
    if (index >= 0) {
      box[index] = input;
    } else {
      box.push(input);
    }
  }

  renderBoxes();
});

let focusingPower = 0;

for (const [key, box] of boxes.entries()) {
  box.forEach((lens, index) => {
    const power = (Number.parseInt(key) + 1) * (index + 1) * Number.parseInt(lens.charAt(lens.length - 1));
    console.log(key, lens, power);
    focusingPower += power;
  });
}

console.log('focusing power', focusingPower);
