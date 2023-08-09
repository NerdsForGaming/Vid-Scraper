const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const startAppId = 10;
const endAppId = 1689283190;

const logsFilePath = path.join(__dirname, 'logs.txt');
const gameDataFilePath = path.join(__dirname, 'game_data.json');

function logToFile(message) {
  try {
    fs.appendFileSync(logsFilePath, `${message}\n`);
    console.log(`Logged: ${message}`);
  } catch (error) {
    console.error(`Error while logging: ${error.message}`);
  }
}

function writeJsonToFile(data) {
  try {
    fs.writeFileSync(gameDataFilePath, JSON.stringify(data, null, 2));
    console.log('Game data JSON file written successfully.');
  } catch (error) {
    console.error('An error occurred while writing game data JSON file:', error.message);
  }
}

async function scrapeAllApps() {
  const gameData = {};

  for (let appId = startAppId; appId <= endAppId; appId++) {
    const url = `https://store.steampowered.com/app/${appId}/`;

    try {
      const response = await axios.get(url, { timeout: 60000 });

      if (response.status === 200) {
        const $ = cheerio.load(response.data);
        const mp4HdSources = [];

        $('.highlight_movie').each((index, element) => {
          const mp4HdSource = $(element).attr('data-mp4-hd-source');
          if (mp4HdSource) {
            mp4HdSources.push(mp4HdSource);
          }
        });

        if (mp4HdSources.length > 0) {
          gameData[appId] = mp4HdSources;
          logToFile(`App ID ${appId}: MP4 HD Sources - ${JSON.stringify(mp4HdSources)}`);
        } else {
          logToFile(`App ID ${appId}: No MP4 HD Sources found`);
        }
      } else {
        logToFile(`App ID ${appId}: Error retrieving data`);
      }
    } catch (error) {
      logToFile(`App ID ${appId}: Error scraping data - ${error.message}`);
    }
  }

  writeJsonToFile(gameData);
  console.log('Scraping and JSON creation complete.');
}

scrapeAllApps();
