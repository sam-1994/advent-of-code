const fs = require('fs');
const path = require('path');

function getFileContent(day, fileName = 'input.txt') {
    return fs.readFileSync(path.join(__dirname, `day${day}`, fileName))
        .toString()
        .split('\n');
}

exports.getFileContent = getFileContent;