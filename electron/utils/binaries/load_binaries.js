const path = require("path");
const { app } = require('electron');
const appDirectory = path.join(app.getPath('home'), 'wiivc');
const binPath = path.join(appDirectory, 'bin');
const binOsxPath = path.join(binPath, 'osx');
const binJarPath = path.join(binPath, 'jar');
const binPythonPath = path.join(binPath, 'python');

module.exports.load_binaries = () => {
  // TODO: get os and load proper binaries
  return {
    convert          : path.join(binOsxPath, 'convert.sh'),
    download_base    : path.join(binOsxPath, 'download_base.sh'),
    wit              : path.join(binOsxPath, 'wit', 'wit'),
    wbfs_file        : path.join(binOsxPath, 'wbfs_file', 'wbfs_file'),
    nfs2iso2nfs      : path.join(binOsxPath, 'nfs2iso2nfs', 'nfs2iso2nfs'),
    GetExtTypePatcher: path.join(binOsxPath, 'GetExtTypePatcher', 'GetExtTypePatcher'),
    c2w_patcher      : path.join(binOsxPath, 'c2w_patcher', 'c2w_patcher'),
    wav2btsnd        : 'java -jar ' + path.join(binJarPath, 'wav2btsnd.jar'),
    NUSPacker        : 'java -jar ' + path.join(binJarPath, 'NUSPacker.jar'),
    JNUSTool         : 'java -jar ' + path.join(binJarPath, 'JNUSTool.jar'),
    replace          : path.join(appDirectory, 'base', 'replace', 'run.sh'),
    metaVerify       : 'python ' + path.join(binPythonPath, 'meta-verify.py'),
  };
}
