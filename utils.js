const fs = require('fs');
const path = require('path');

function getFileContent(day, options = {}) {
  const fileName = options.fileName || 'input.txt';
  const separator = options.separator || '\n';

  return fs.readFileSync(path.join(__dirname, `day${day}`, fileName))
    .toString()
    .split(separator);
}

exports.getFileContent = getFileContent;
