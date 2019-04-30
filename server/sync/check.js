const fs = require('fs');

fs.readFile('../../package.json', () => {
  setTimeout(() => console.log(1));
  setImmediate(() => console.log(2));
});