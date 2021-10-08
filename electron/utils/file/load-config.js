const { app } = require('electron');
const fs = require('fs');
const fse = require('fs-extra');
const path = require("path");
const { config } = require('../config');


module.exports.loadConfig = () => {
  const appDirectory = path.join(app.getPath('home'), 'wiivc');
  const configFile = 'config.json';

  if ( !fs.existsSync(appDirectory) ) {
    fs.mkdirSync(appDirectory);
    fs.writeFileSync(path.join(appDirectory, configFile), JSON.stringify(config.get()));
    const localShared = path.join(__dirname, '..', '..', 'shared');
    fse.copySync(localShared, appDirectory);
  } else {
    config.set(JSON.parse(fs.readFileSync(path.join(appDirectory, configFile)).toString()));
    console.log(config.get());
  }

}

module.exports.writeConfig = (userConfig) => {
  config.set(userConfig);
  const appDirectory = path.join(app.getPath('home'), 'wiivc');
  const configFile = 'config.json';

  if ( fs.existsSync(appDirectory) ) {
    // fs.mkdirSync(appDirectory);
    fs.unlinkSync(path.join(appDirectory, configFile));
    fs.writeFileSync(path.join(appDirectory, configFile), JSON.stringify(config.get()));
    const currentConfig = config.get();
    const commonKey = currentConfig.commonKey;
    const wiiCommonKey = currentConfig.wiiCommonKey;
    const updateServer = currentConfig.updateServer;
    const updatetitles = 'updatetitles.csv';
    const tagayaLatest = currentConfig.tagayaLatest;
    const tagayaVersionList = currentConfig.tagayaVersionList;

    const file = `${updateServer}\n${commonKey}\n${updatetitles}\n${tagayaLatest}\n${tagayaVersionList}`;
    const commonPath = path.join(appDirectory, 'common');
    fse.ensureDirSync(commonPath);
    if (fs.existsSync(path.join(commonPath, 'config'))) {
      fs.unlinkSync(path.join(commonPath, 'config'));
    }
    fs.writeFileSync(path.join(commonPath, 'config'), file);

    if ( fs.existsSync(path.join(commonPath, 'wii_common_key.bin')) ) {
      fs.unlinkSync(path.join(commonPath, 'wii_common_key.bin'));
    }

    /*const toHexString = (byteArray) => {
      return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
      }).join('')
    }*/
    //const keyBinary = toHexString(wiiCommonKey);

    /*let keyBinary = '';
    for (var i = 0; i < wiiCommonKey.length; i += 2) {
      const part1Int = parseInt(wiiCommonKey.substr(i, 1), 16);
      console.log(part1Int);
      console.log(String.fromCharCode(part1Int));
      const part2Int = parseInt(wiiCommonKey.substring(i + 1, 1), 16);
      const keyInt = part1Int << 1 + part2Int;
      console.log(keyInt);
      const toAppend = String.fromCharCode(keyInt);
      console.log('will add', toAppend);
      keyBinary += toAppend;
    }*/


    fs.writeFileSync(path.join(commonPath, 'wii_common_key.bin'), wiiCommonKey);
  } else {
    // config.set(fs.readFileSync(path.join(appDirectory, configFile)));
    console.log('baaaaah!');
  }


  /*fs.open(appDirectory, 'rw', (err, fd) => {
    if ( err ) throw err;
    console.log('fd', fd);
    fs.close(fd, (err) => {
      if ( err ) throw err;
    });
  });*/

  /*if (!fs.exists(appDirectory)) {

    fs.create(appDirectory, );
  } else {
    console.log('exists');
  }*/
}
