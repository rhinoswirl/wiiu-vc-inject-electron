const fse = require('fs-extra');
const path = require("path");
const { app } = require('electron');

const appDirectory = path.join(app.getPath('home'), 'wiivc');
const binPath = path.join(appDirectory, 'bin');
const binOsxPath = path.join(binPath, 'osx');
const binJarPath = path.join(binPath, 'jar');


module.exports.createBuild = () => {
  const tmpRootPath = path.join(appDirectory, 'tmp', new Date().toISOString().replace(':', '-').replace('.', '-'));
  fse.ensureDirSync(tmpRootPath);
  const tmpSrcPath = path.join(tmpRootPath, 'src');
  fse.ensureDirSync(tmpSrcPath);
  const tmpBuildPath = path.join(tmpRootPath, 'build');
  fse.ensureDirSync(tmpBuildPath);

  const bin = loadBinaries();

  const tmpIconPath = path.join(tmpSrcPath, 'iconTex.png');
  const tmpBannerPath = path.join(tmpSrcPath, 'bootTvTex.png');
  const tmpDrcPath = path.join(tmpSrcPath, 'bootDrcTex.png');
  const tmpLogoPath = path.join(tmpSrcPath, 'bootLogoTex.png');
  const tmpSoundPath = path.join(tmpSrcPath, 'bootSound.wav');

  process.chdir(tmpBuildPath);


}
