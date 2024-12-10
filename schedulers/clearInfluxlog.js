const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../logs/influx.log');

function clearLogFile() {
  fs.writeFileSync(logFilePath, JSON.stringify({ data: [] }, null, 2));
  console.log('influx.log has been cleared.');
}

module.exports = { clearLogFile };
