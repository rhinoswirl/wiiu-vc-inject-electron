const fse = require('fs-extra');
const fs = require('fs');
const path = require("path");
const { app } = require('electron');
const { runtime } = require('../runtime');
const { load_binaries } = require('../binaries/load_binaries');

const appDirectory = path.join(app.getPath('home'), 'wiivc');
const commonPath = path.join(appDirectory, 'common');
const basePath = path.join(appDirectory, 'base');
const binPath = path.join(appDirectory, 'bin');
const dolPath = path.join(appDirectory, 'dol');
const binOsxPath = path.join(binPath, 'osx');
const binJarPath = path.join(binPath, 'jar');
const child_process = require('child_process');
const { config } = require('../config');

const build_write = () => {
  console.log('finishing build');
  const tmpRootPath = runtime.config.rootPath;
  const tmpSrcPath = runtime.config.srcPath;
  const tmpBuildPath = runtime.config.buildPath;
  const bin = load_binaries();

  console.log('Encrypting contents into installable WUP Package...');
  process.chdir(tmpRootPath);
  const targetPath = path.join(appDirectory, 'install');
  fse.ensureDirSync(targetPath);
  const titlePath = path.join(targetPath, `WUP-N-${runtime.config.titleIDText}_${runtime.config.packedTitleIDLine}`);
  fse.ensureDirSync(titlePath);
  const params = ['-in', `"${tmpBuildPath}"`, '-out', `"${titlePath}"`, '-encryptKeyWith', config.get().commonKey];
  const command = bin.NUSPacker + ' ' + params.join(' ');
  console.log('will run', command);
  const nusPacker = child_process.execSync(command);
  /*nusPacker.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  nusPacker.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  nusPacker.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });*/
  console.log(nusPacker);

}
const build_finalize = () => {
  console.log('finishing build');
  const tmpRootPath = runtime.config.rootPath;
  const tmpSrcPath = runtime.config.srcPath;
  const tmpBuildPath = runtime.config.buildPath;
  const bin = load_binaries();

  //fse.ensureDirSync(path.join(tmpSrcPath, 'TIKTEMP'));
  const witcmd = `${bin.wit} extract "${runtime.config.builtDiscPath}" --psel data --files +tmd.bin --files +ticket.bin --DEST "${path.join(tmpSrcPath, 'TIKTEMP')}" -v`; //-vv1
  console.log('wit command:', witcmd);
  const returnV = child_process.execSync(witcmd);
  console.log('done', returnV.toString());
  if (fs.existsSync(path.join(tmpSrcPath, 'TIKTEMP'))) {
    fse.copySync(path.join(tmpSrcPath, 'TIKTEMP', 'tmd.bin'), path.join(tmpBuildPath, 'code', 'rvlt.tmd'));
    fse.copySync(path.join(tmpSrcPath, 'TIKTEMP', 'ticket.bin'), path.join(tmpBuildPath, 'code', 'rvlt.tik'));
    //fs.unlinkSync(path.join(tmpSrcPath, 'TIKTEMP'));
  }

  console.log('Converting processed game to NFS format...');
  console.log('cd ', path.join(tmpBuildPath, 'content'));
  process.chdir(path.join(tmpBuildPath, 'content'));

  let lrpatchflag = '';
  /*
  if (LRPatch.Checked)
            {
                lrpatchflag = " -lrpatch";
            }
   */

  /*
  if (SystemType == "wii")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc" + nfspatchflag + lrpatchflag + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (SystemType == "dol")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc -homebrew" + passpatch + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (SystemType == "wiiware")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc -homebrew" + nfspatchflag + lrpatchflag + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
   */
  //gcn
  if (runtime.config.systemType === 2) {
    const nfs2iso2nfscmd = `${bin.nfs2iso2nfs} -wiikey "${path.join(commonPath, 'wii_common_key.bin')}" -enc -homebrew -passthrough -iso "${runtime.config.builtDiscPath}"`;
    console.log('nfs2iso2nfscmd command:', nfs2iso2nfscmd);
    const nfs2iso2nfs = child_process.spawn(bin.nfs2iso2nfs, ['-wiikey', path.join(commonPath, 'wii_common_key.bin'), '-enc', '-homebrew', '-passthrough', '-iso', runtime.config.builtDiscPath]);
    nfs2iso2nfs.stdout.on('data', function (data) {
      //console.log('stdout: ' + data.toString());
    });

    nfs2iso2nfs.stderr.on('data', function (data) {
      console.log('stderr: ' + data.toString());
    });

    nfs2iso2nfs.on('exit', function (code) {
      console.log('child process exited with code ' + code.toString());
      build_write();
    });
    //const returnV = child_process.execSync(nfs2iso2nfscmd);
    //console.log('done', returnV.toString());
  }








  /*
            string lrpatchflag = "";
            if (LRPatch.Checked)
            {
                lrpatchflag = " -lrpatch";
            }
            if (SystemType == "wii")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc" + nfspatchflag + lrpatchflag + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (SystemType == "dol")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc -homebrew" + passpatch + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (SystemType == "wiiware")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc -homebrew" + nfspatchflag + lrpatchflag + " -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (SystemType == "gcn")
            {
                LauncherExeFile = TempToolsPath + "EXE\\nfs2iso2nfs.exe";
                LauncherExeArgs = "-enc -homebrew -passthrough -iso \"" + OpenGame.FileName + "\"";
                LaunchProgram();
            }
            if (DisableTrimming.Checked == false) { File.Delete(OpenGame.FileName); } else if (FlagWBFS) { File.Delete(OpenGame.FileName); }
            BuildProgress.Value = 85;
            ///////////////////////////

            //Encrypt contents with NUSPacker
            BuildStatus.Text = "Encrypting contents into installable WUP Package...";
            BuildStatus.Refresh();
            Directory.SetCurrentDirectory(TempRootPath);
            LauncherExeFile = TempToolsPath + "JAR\\NUSPacker.exe";
            LauncherExeArgs = "-in BUILDDIR -out \"" + OutputFolderSelect.SelectedPath + "\\WUP-N-" + TitleIDText + "_" + PackedTitleIDLine.Text + "\" -encryptKeyWith " + WiiUCommonKey.Text;
            LaunchProgram();
            BuildProgress.Value = 100;
   */
}

const build_gc = () => {
  console.log('building gc');
  const tmpRootPath = runtime.config.rootPath;
  const tmpSrcPath = runtime.config.srcPath;
  const tmpBuildPath = runtime.config.buildPath;
  const bin = load_binaries();

  fse.ensureDirSync(path.join(tmpSrcPath, 'TEMPISOBASE'));
  console.log('copying base');
  fse.copySync(path.join(basePath, 'base'), path.join(tmpSrcPath, 'TEMPISOBASE'));
  console.log('done');
  /*
  if (Force43NINTENDONT.Checked) {
    File.Copy(TempToolsPath + "DOL\\FIX94_nintendont_force43_autoboot.dol", TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
  } else if (CustomMainDol.Checked) {
    File.Copy(OpenMainDol.FileName, TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
  } else if (DisableNintendontAutoboot.Checked) {
    File.Copy(TempToolsPath + "DOL\\FIX94_nintendont_forwarder.dol", TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
  } else {
   */
  console.log('main.dol');
  fse.copySync(path.join(dolPath, 'FIX94_nintendont_default_autoboot.dol'), path.join(tmpSrcPath, 'TEMPISOBASE', 'sys', 'main.dol'));
  console.log('done');
  /*
  }
   */
  console.log('copying discs...');
  fse.copySync(runtime.config.disc1Path, path.join(tmpSrcPath, 'TEMPISOBASE', 'files', 'game.iso'));
  if ( runtime.config.disc2Path !== '') {
    fse.copySync(runtime.config.disc2Path, path.join(tmpSrcPath, 'TEMPISOBASE', 'files', 'disc2.iso'));
  }
  console.log('done');
  console.log('running wit');
  const witcmd = `${bin.wit} copy "${path.join(tmpSrcPath, 'TEMPISOBASE')}" --DEST "${path.join(tmpSrcPath, 'game.iso')}" -ovv --links --iso`;
  console.log('wit command:', witcmd);
  child_process.execSync(witcmd);
  runtime.config.builtDiscPath = path.join(tmpSrcPath, 'game.iso');
  //child_process.execSync(`${bin.wit} copy "${path.join(tmpSrcPath, 'TEMPISOBASE')}" --DEST "${path.join(tmpSrcPath, 'game.iso')}" -ovv --links --iso`);
  console.log('done');

  build_finalize();

  /*
  FileSystem.CreateDirectory(TempSourcePath + "TEMPISOBASE");
                FileSystem.CopyDirectory(TempToolsPath + "BASE", TempSourcePath + "TEMPISOBASE");
                if (Force43NINTENDONT.Checked)
                {
                    File.Copy(TempToolsPath + "DOL\\FIX94_nintendont_force43_autoboot.dol", TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
                }
                else if (CustomMainDol.Checked)
                {
                    File.Copy(OpenMainDol.FileName, TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
                }
                else if (DisableNintendontAutoboot.Checked)
                {
                    File.Copy(TempToolsPath + "DOL\\FIX94_nintendont_forwarder.dol", TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
                }
                else
                {
                    File.Copy(TempToolsPath + "DOL\\FIX94_nintendont_default_autoboot.dol", TempSourcePath + "TEMPISOBASE\\sys\\main.dol");
                }
                File.Copy(OpenGame.FileName, TempSourcePath + "TEMPISOBASE\\files\\game.iso");
                if (FlagGC2Specified) { File.Copy(OpenGC2.FileName, TempSourcePath + "TEMPISOBASE\\files\\disc2.iso"); }
                LauncherExeFile = TempToolsPath + "WIT\\wit.exe";
                LauncherExeArgs = "copy " + ShortenPath(TempSourcePath + "TEMPISOBASE") + " --DEST " + ShortenPath(TempSourcePath + "game.iso") + " -ovv --links --iso";
                MessageBox.Show(LauncherExeArgs);
                LaunchProgram();
                Directory.Delete(TempSourcePath + "TEMPISOBASE", true);
                OpenGame.FileName = TempSourcePath + "game.iso";
   */
}

module.exports.build = () => {
  const tmpRootPath = runtime.config.rootPath;
  const tmpSrcPath = runtime.config.srcPath;
  const tmpBuildPath = runtime.config.buildPath;

  fse.ensureDirSync(tmpRootPath);
  fse.ensureDirSync(tmpSrcPath);
  fse.ensureDirSync(tmpBuildPath);

  console.log('Copying base files to temporary build directory...');
  const rythmFeverBase = path.join(commonPath, 'Rhythm Heaven Fever [VAKE01]');
  console.log('from: ', rythmFeverBase);
  console.log('to: ', tmpBuildPath);
  fse.copySync(rythmFeverBase, tmpBuildPath);
  console.log('done!');

  // TODO: C2WPatchFlag
  console.log('Generating app.xml and meta.xml');
  const appxml = path.join(basePath, 'app.xml');
  const meta1xml = path.join(basePath, 'meta1line.xml');
  const meta2xml = path.join(basePath, 'meta2line.xml');
  fse.copySync(appxml, path.join(tmpSrcPath, 'app.xml'));
  fse.copySync(meta1xml, path.join(tmpSrcPath, 'meta1line.xml'));
  fse.copySync(meta2xml, path.join(tmpSrcPath, 'meta2line.xml'));

  const bin = load_binaries();
  process.chdir(tmpSrcPath);
  child_process.execSync(`"${bin.replace}" "${runtime.config.titleIDText}" "${runtime.config.packedTitleIDLine}" "${runtime.config.titleIdHex}" "${runtime.config.packedTitleLine1}" "${runtime.config.packedTitleLine2}"`);

  // fs.unlinkSync(path.join(tmpBuildPath, 'meta2line.xml'));


  fse.ensureDirSync(path.join(tmpBuildPath, 'code'));
  fse.ensureDirSync(path.join(tmpBuildPath, 'meta'));
  // fse.moveSync(path.join(tmpBuildPath, 'meta.xml'), path.join(tmpBuildPath, 'meta'));

  console.log('moving meta');
  fse.moveSync(path.join(tmpSrcPath, 'meta1line.xml'), path.join(tmpBuildPath, 'meta', 'meta.xml'));
  console.log('done');

  console.log('moving app.xml');
  fse.moveSync(path.join(tmpSrcPath, 'app.xml'), path.join(tmpBuildPath, 'code', 'app.xml'));
  console.log('done');

  console.log('running convert');
  child_process.execSync(`${bin.convert}`);
  child_process.execSync(`${bin.metaVerify}`);
  console.log('done');
  console.log('placing tgas');
  fse.moveSync(path.join(tmpSrcPath, 'iconTex.tga'), path.join(tmpBuildPath, 'meta', 'iconTex.tga'));
  fse.moveSync(path.join(tmpSrcPath, 'bootTvTex.tga'), path.join(tmpBuildPath, 'meta', 'bootTvTex.tga'));
  fse.moveSync(path.join(tmpSrcPath, 'bootDrcTex.tga'), path.join(tmpBuildPath, 'meta', 'bootDrcTex.tga'));
  console.log('done');

  build_gc();


  // fse.copySync(path.join(runtime.config.buildPath, 'iconTex.png'), path.join(runtime.config.buildPath, 'iconTex.png'));
  // fse.copySync(path.join(runtime.config.buildPath, 'bootTvTex.png'), path.join(runtime.config.buildPath, 'bootDrcTex.png'));

  // TODO: aparentemente faz tudo
  return 0;
  /*
  'iconTex.png',
    'bootTvTex.png'
   */
  /*
  path.join(runtime.config.buildPath, filename)
   */


  /*fse.copySync(rythmFeverBase, tmpBuildPath);

  fse.copySync(runtime.config.disc1Path, tmpBuildPath);




  const tmpIconPath = path.join(tmpSrcPath, 'iconTex.png');
  const tmpBannerPath = path.join(tmpSrcPath, 'bootTvTex.png');
  const tmpDrcPath = path.join(tmpSrcPath, 'bootDrcTex.png');
  const tmpLogoPath = path.join(tmpSrcPath, 'bootLogoTex.png');
  const tmpSoundPath = path.join(tmpSrcPath, 'bootSound.wav');

  process.chdir(tmpBuildPath);*/






}
