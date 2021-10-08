const fse = require('fs-extra');
const fs = require('fs');
const { load_binaries } = require('../binaries/load_binaries');
const { config } = require('../config');
const path = require("path");
const { app } = require('electron');

const child_process = require('child_process');

const appDirectory = path.join(app.getPath('home'), 'wiivc');

module.exports.prepare = () => {
  const commonPath = path.join(appDirectory, 'common');
  fse.ensureDirSync(commonPath);
  if (fs.existsSync(path.join(commonPath, 'config'))) {
    const bin = load_binaries();
    const titleKey = config.get().titleKey;
    process.chdir(commonPath);
    child_process.execSync(`"${bin.download_base}" "${bin.JNUSTool}" "${titleKey}"`);
    return true;
  } else {
    console.log('config does not exist');
    return false;
  }
}
