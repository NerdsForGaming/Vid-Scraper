const fs = require('fs');
const path = require('path');

const gameDataFilePath = path.join(__dirname, 'game_data.json');

function writeJsonToFile(data) {
  try {
    fs.writeFileSync(gameDataFilePath, JSON.stringify(data, null, 2));
    console.log('Game data JSON file written successfully.');
  } catch (error) {
    console.error('An error occurred while writing game data JSON file:', error.message);
  }
}

const gameData = {
  12345: ['source1.mp4', 'source2.mp4'],
  67890: ['source3.mp4', 'source4.mp4'],
};

writeJsonToFile(gameData);

console.log('Script execution complete.');
