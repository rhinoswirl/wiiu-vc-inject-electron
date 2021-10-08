const fse = require('fs-extra');
const path = require("path");
const { app } = require('electron');

const appDirectory = path.join(app.getPath('home'), 'wiivc');
const binPath = path.join(appDirectory, 'bin');
const binOsxPath = path.join(binPath, 'osx');
const binJarPath = path.join(binPath, 'jar');


class Runtime {
  config = {
    titleId          : '',
    disc1Path        : '',
    disc2Path        : '',
    gameType         : 0,
    internalGameName : '',
    cucholixRepoID   : '',
    rootPath         : '',
    srcPath          : '',
    buildPath        : '',
    systemType       : -1,
    titleIdHex       : '',
    packedTitleLine1 : '',
    packedTitleLine2 : '',
    packedTitleIDLine: '',
    titleIDText      : '',
    titleIDLabel     : '',
    builtDiscPath: ''
  }

  static instance = null;

  static getInstance() {
    if ( !this.instance ) {
      this.instance = new Runtime();
    }
    return this.instance;
  }

  init() {
    this.config = {
      titleId         : '',
      disc1Path: '',
      disc2Path: '',
      gameType        : 0,
      internalGameName: '',
      cucholixRepoID  : '',
      rootPath        : '',
      srcPath         : '',
      buildPath       : '',
      systemType      : -1,
      titleIdHex      : '',
      packedTitleLine1: '',
      packedTitleLine2: '',
      packedTitleIDLine: '',
      titleIDText: '',
      titleIDLabel: '',
      builtDiscPath: ''
    };

    const datedPath = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
    const tmpRootPath = path.join(appDirectory, 'tmp', datedPath);
    fse.ensureDirSync(tmpRootPath);
    const tmpSrcPath = path.join(tmpRootPath, 'src');
    fse.ensureDirSync(tmpSrcPath);
    const tmpBuildPath = path.join(tmpRootPath, 'build');
    fse.ensureDirSync(tmpBuildPath);
    this.config.rootPath = tmpRootPath;
    this.config.srcPath = tmpSrcPath;
    this.config.buildPath = tmpBuildPath;
    console.log('initialized!');
    console.log(this.config);
  }

  delete() {
    if (this.config.rootPath !== '' && fs.existsSync(this.config.rootPath)) {
      fs.rmdirSync(this.config.buildPath);
    }
    this.config = {
      titleId          : '',
      disc1Path        : '',
      disc2Path        : '',
      gameType         : 0,
      internalGameName : '',
      cucholixRepoID   : '',
      rootPath         : '',
      srcPath          : '',
      buildPath        : '',
      systemType       : -1,
      titleIdHex       : '',
      packedTitleLine1 : '',
      packedTitleLine2 : '',
      packedTitleIDLine: '',
      titleIDText      : '',
      titleIDLabel     : '',
      builtDiscPath    : ''
    };
  }
}

module.exports.runtime = Runtime.getInstance();
