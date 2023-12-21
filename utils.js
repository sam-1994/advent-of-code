const fs = require('fs');
const path = require('path');

function getFileContent(day, options = {}) {
  const fileName = options.fileName || 'input.txt';
  const separator = options.separator || '\n';

  return fs.readFileSync(path.join(__dirname, `day${day}`, fileName))
    .toString()
    .split(separator);
}


function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

exports.getFileContent = getFileContent;
exports.gcd = gcd;
exports.lcm = lcm;
