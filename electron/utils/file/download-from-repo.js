const { Subject } = require("rxjs");

const { app } = require('electron');
const fs = require('fs');
const path = require("path");
const breader = require("buffered-reader");
const BinaryReader = breader.BinaryReader;
const DataReader = breader.DataReader;
const { runtime } = require('../runtime');
const axios = require('axios').default;

module.exports.downloadFromRepo = () => {
  let systemType = '';
  /*
  WII_RETAIL
WII_HOMEBREW
GC_RETAIL
VWII_NAND
   */
  const repoUrl = 'https://raw.githubusercontent.com/cucholix/wiivc-bis/master';
  switch (runtime.config.systemType) {
    case 0:
      systemType = 'wii';
      break;
    case 1:
      systemType = 'dol';
      break;
    case 2:
      systemType = 'gcn';
      break;
    case 3:
      systemType = 'wiiware';
      break;
  }

  const filesToDownload = [
    'iconTex.png',
    'bootTvTex.png'
  ];
  console.log('system type is', systemType);
  if (systemType && repoUrl) {
    if (systemType === 'wiiware') {
      const options = [
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID}`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}E`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}P`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}J`,
      ];
      let stop = false;
      const success = (filename, response) => {
        const data = response.data;
        fs.writeFileSync(path.join(runtime.config.srcPath, filename), data);
      };
      const errorHandler = (err, idx) => {
        if (idx + 1 >= options.length) {
        }
      };
      const makeRequest = (link, filename, idx) => {
        if ( !stop ) {
          axios({
            method      : "get",
            url         : `${link}/${filename}`,
            responseType: "stream"
          })
            .then(response => success(filename, response))
            .catch(error => errorHandler(error, idx))
        }
      };

      options.forEach((link, idx) => {
        filesToDownload.forEach(file => {
          makeRequest(link, file, idx);
        });
      });

    }
    else {
      const options = [
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID}`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}E${runtime.config.cucholixRepoID.substring(4, 2)}`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}P${runtime.config.cucholixRepoID.substring(4, 2)}`,
        `${repoUrl}/${systemType}/image/${runtime.config.cucholixRepoID.substring(0, 3)}J${runtime.config.cucholixRepoID.substring(4, 2)}`,
      ];

      let stop = false;
      const success = (filename, response) => {
        response.data.pipe(fs.createWriteStream(path.join(runtime.config.srcPath, filename)));
      };
      const errorHandler = (err, idx) => {
        if ( idx + 1 >= options.length ) {
        }
      };
      const makeRequest = (link, filename, idx) => {
        if ( !stop ) {
          axios({
            method: "get",
            url: `${link}/${filename}`,
            responseType: "stream"
          })
            .then(response => success(filename, response))
            .catch(error => errorHandler(error, idx))
        }
      };

      options.forEach((link, idx) => {
        filesToDownload.forEach(file => {
          makeRequest(link, file, idx);
        });
      });
    }
  }
  /*runtime.config.titleId
  gameType
  internalGameName
  cucholixRepoID
  rootPath
  srcPath
  buildPath
  systemType*/
}
