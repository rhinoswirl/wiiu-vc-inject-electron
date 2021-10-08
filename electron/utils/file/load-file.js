const { Subject } = require("rxjs");

const { app } = require('electron');
const fs  = require('fs');
const path = require("path");
const breader = require("buffered-reader");
const BinaryReader = breader.BinaryReader;
const DataReader = breader.DataReader;
const { runtime } = require('../runtime');
const { downloadFromRepo } = require('./download-from-repo');

const onError = () => {
  console.log('there was an error');
  runtime.delete();
}

const processWbfs = (reader, callback, errorCb) => {
  reader.seek(0x200, (error) => {
    if (!error) {
      reader.read(4, (error, bytes, bytesRead) => {
        runtime.config.titleId = bytes.toString();
      });
    }
  });

  reader.seek(0x218, (error) => {
    if ( !error ) {
      reader.read(8, (error, bytes, bytesRead) => {
        runtime.config.gameType = bytes.readBigInt64LE(0);
      });
    }
  });

  reader.seek(0x220, (error) => {
    if (!error) {
      let stop = false;
      while (!stop) {
        reader.read(1, (error, bytes, bytesRead) => {
          const bytesAsString = bytes.toString();
          if ( bytesAsString !== '\0' ) {
            runtime.config.internalGameName += bytesAsString;
          } else {
            runtime.config.internalGameName = runtime.config.internalGameName.replaceAll('&', 'and');
            stop = true;
          }
        });
      }

    }
  });

  reader.seek(0x200, (error) => {
    if ( !error ) {
      let stop = false;
      while (!stop) {
        reader.read(1, (error, bytes, bytesRead) => {
          const bytesAsString = bytes.toString();
          if ( bytesAsString !== '\0' ) {
            runtime.config.cucholixRepoID += bytesAsString;
          } else {
            stop = true;
          }
        });
      }
    }
  });

  callback();

}

const processDol = (reader, callback, errorCb) => {
  runtime.config.internalGameName = 'N/A';

  reader.seek(0x2A0, (error) => {
    if ( !error ) {
      reader.read(4, (error, bytes, bytesRead) => {
        runtime.config.titleId = bytes.toString();
      });
    }
  });
  callback();

}

const processIso = (reader, callback, errorCb) => {

  reader.seek(0x18, (error) => {
    if ( !error ) {
      reader.read(8, (error, bytes, bytesRead) => {
        runtime.config.gameType = bytes.readBigInt64LE(0);
      });
    }
  });

  reader.seek(0x20, (error) => {
    if ( !error ) {
      let stop = false;
      while (!stop) {
        reader.read(1, (error, bytes, bytesRead) => {
          const bytesAsString = bytes.toString();
          if ( bytesAsString !== '\0' ) {
            runtime.config.internalGameName += bytesAsString;
          } else {
            stop = true;
          }
        });
      }
      runtime.config.internalGameName = runtime.config.internalGameName.replaceAll('&', 'and');
    }
  });

  reader.seek(0x00, (error) => {
    if ( !error ) {
      let stop = false;
      while (!stop) {
        reader.read(1, (error, bytes, bytesRead) => {
          const bytesAsString = bytes.toString();
          if ( bytesAsString !== '\0' ) {
            runtime.config.cucholixRepoID += bytesAsString;
          } else {
            stop = true;
          }
        });
      }
    }
  });

  callback();
}

const onWbfsProcessed = () => {
  const system = runtime.config.systemType;
  if (system !== 0 || runtime.config.gameType !== 2745048157n) {
    console.log('This is not a Wii image. It will not be loaded.');
    onError();
  } else {
    // TODO: review is this exactly the same as gcn?
    const titleIdHex = runtime.config.titleId.toString(16);
    console.log(titleIdHex);
    const finalTitleIdHex = titleIdHex.substring(6, 2) + titleIdHex.substring(4, 2) + titleIdHex.substring(2, 2) + titleIdHex.substring(0, 2);
    runtime.config.titleIdHex = finalTitleIdHex;
    runtime.config.packedTitleLine1 = runtime.config.internalGameName;
    runtime.config.packedTitleIDLine = ('00050002' + runtime.config.titleIdHex);
    let str = '';
    for (var i = 0; i < runtime.config.titleIdHex.length; i += 2)
      str += String.fromCharCode(parseInt(runtime.config.titleIdHex.substr(i, 2), 16));
    runtime.config.titleIDText = str;
    runtime.config.titleIDLabel = `${runtime.config.titleIDText} / ${runtime.config.titleIdHex}`

    downloadFromRepo();
  }
}

const onDolProcessed = (fileInfo, systemType) => {
  // TODO: implement
}

const onIsoProcessed = (fileInfo, systemType) => {
  const system = runtime.config.systemType;
  runtime.config.internalGameName = runtime.config.internalGameName.replaceAll('&', 'and');
  console.log('internalgamename', runtime.config.internalGameName);
  if ( system === 2 && runtime.config.gameType !== 4440324665927270400n ) {
    console.log('This is not a GameCube image. It will not be loaded.');
    onError();
  } else {
    const titleIdHex = runtime.config.titleId.toString(16);
    console.log(titleIdHex);
    const finalTitleIdHex = titleIdHex.substring(6, 2) + titleIdHex.substring(4, 2) + titleIdHex.substring(2, 2) + titleIdHex.substring(0, 2);
    runtime.config.titleIdHex = finalTitleIdHex;
    runtime.config.packedTitleLine1 = runtime.config.internalGameName;
    runtime.config.packedTitleIDLine = ('00050002' + runtime.config.titleIdHex);
    let str = '';
    for (var i = 0; i < runtime.config.titleIdHex.length; i += 2)
      str += String.fromCharCode(parseInt(runtime.config.titleIdHex.substr(i, 2), 16));
    runtime.config.titleIDText = str;
    runtime.config.titleIDLabel = `${runtime.config.titleIDText} / ${runtime.config.titleIdHex}`

    console.log(runtime.config);
    downloadFromRepo();
  }
}

module.exports.loadFile = (file, systemType) => {
  const subject = new Subject();

  /*
  WII_RETAIL,
  WII_HOMEBREW,
  GC_RETAIL,
  VWII_NAND,
   */

  runtime.init();
  runtime.config.disc1Path = file;
  runtime.config.systemType = systemType;
  const reader = new BinaryReader(file);
  reader.read(4, (error, bytes, bytesRead) => {
    const fileHeader = bytes.readInt32LE(0);
    runtime.config.titleId = fileHeader;
    console.log('fileHeader is', fileHeader);
    if ( fileHeader === 1397113431n) {
      console.log('will process wbfs');
      processWbfs(reader, onWbfsProcessed, onError);
    } else if (fileHeader === 65536n) {
      console.log('will process dol');
      processDol(reader, onDolProcessed, onError);
    } else {
      console.log('will process iso');
      processIso(reader, onIsoProcessed, onError);
    }
    reader.close(() => { console.log('closed')});
  });

  return subject.asObservable();



  /*
  if (OpenGame.ShowDialog() == DialogResult.OK)
            {
                GameSourceDirectory.Text = OpenGame.FileName;
                GameSourceDirectory.ForeColor = Color.Black;
                FlagGameSpecified = true;
                //Get values from game file
                using (var reader = new BinaryReader(File.OpenRead(OpenGame.FileName)))
                {
                    reader.BaseStream.Position = 0x00;
                    TitleIDInt = reader.ReadInt32();
                    //WBFS Check

                    else
                    {
                        if (TitleIDInt == 65536) //Performs actions if the header indicates a DOL file
                        {
                            reader.BaseStream.Position = 0x2A0;
                            TitleIDInt = reader.ReadInt32();
                            InternalGameName = "N/A";
                        }
                        else //Performs actions if the header indicates a normal Wii / GC iso
                        {
                            FlagWBFS = false;
                            reader.BaseStream.Position = 0x18;
                            GameType = reader.ReadInt64();
                            TempString = "";
                            reader.BaseStream.Position = 0x20;
                            while ((int)(TempChar = reader.ReadChar()) != 0) TempString = TempString + TempChar;
                            InternalGameName = TempString;
                            TempString = "";
                            reader.BaseStream.Position = 0x00;
                            while ((int)(TempChar = reader.ReadChar()) != 0) TempString = TempString + TempChar;
                            CucholixRepoID = TempString;
                        }
                    }
                }
                //Flag if GameType Int doesn't match current SystemType
                if (SystemType == "wii" && GameType != 2745048157)
                {
                    GameSourceDirectory.Text = "Game file has not been specified";
                    GameSourceDirectory.ForeColor = Color.Red;
                    FlagGameSpecified = false;
                    GameNameLabel.Text = "";
                    TitleIDLabel.Text = "";
                    TitleIDInt = 0;
                    TitleIDHex = "";
                    GameType = 0;
                    CucholixRepoID = "";
                    PackedTitleLine1.Text = "";
                    PackedTitleIDLine.Text = "";
                    MessageBox.Show("This is not a Wii image. It will not be loaded.");
                    goto EndOfGameSelection;
                }
                if (SystemType == "gcn" && GameType != 4440324665927270400)
                {
                    GameSourceDirectory.Text = "Game file has not been specified";
                    GameSourceDirectory.ForeColor = Color.Red;
                    FlagGameSpecified = false;
                    GameNameLabel.Text = "";
                    TitleIDLabel.Text = "";
                    TitleIDInt = 0;
                    TitleIDHex = "";
                    GameType = 0;
                    CucholixRepoID = "";
                    PackedTitleLine1.Text = "";
                    PackedTitleIDLine.Text = "";
                    MessageBox.Show("This is not a GameCube image. It will not be loaded.");
                    goto EndOfGameSelection;
                }
                GameNameLabel.Text = InternalGameName;
                PackedTitleLine1.Text = InternalGameName;
                //Convert pulled Title ID Int to Hex for use with Wii U Title ID
                TitleIDHex = TitleIDInt.ToString("X");
                TitleIDHex = TitleIDHex.Substring(6, 2) + TitleIDHex.Substring(4, 2) + TitleIDHex.Substring(2, 2) + TitleIDHex.Substring(0, 2);
                if (SystemType == "dol")
                {
                    TitleIDLabel.Text = TitleIDHex;
                    PackedTitleIDLine.Text = ("00050002" + TitleIDHex);
                    TitleIDText = "BOOT";
                }
                else
                {
                    TitleIDText = string.Join("", System.Text.RegularExpressions.Regex.Split(TitleIDHex, "(?<=\\G..)(?!$)").Select(x => (char)Convert.ToByte(x, 16)));
                    TitleIDLabel.Text = (TitleIDText + " / " + TitleIDHex);
                    PackedTitleIDLine.Text = ("00050002" + TitleIDHex);
                }
            }
   */

  /*
  private void RepoDownload_Click(object sender, EventArgs e)
        {
            if (CucholixRepoID == "")
            {
                MessageBox.Show("Please select your game before using this option");
                FlagRepo = false;
            }
            else
            {
                if (SystemType == "wiiware")
                {
                    if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID + "/iconTex.png") == true)
                    {
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "E" + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "E";
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "P" + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "P";
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "J" + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "J";
                        DownloadFromRepo();
                    }
                    else
                    {
                        FlagRepo = false;
                        if (MessageBox.Show("Cucholix's Repo does not have assets for your game. You will need to provide your own. Would you like to visit the GBAtemp request thread?", "Game not found on Repo", MessageBoxButtons.YesNo, MessageBoxIcon.Asterisk) == DialogResult.Yes)
                        {
                            System.Diagnostics.Process.Start("https://gbatemp.net/threads/483080/");
                        }
                    }
                }
                else
                {
                    if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID + "/iconTex.png") == true)
                    {
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "E" + CucholixRepoID.Substring(4, 2) + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "E" + CucholixRepoID.Substring(4, 2);
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "P" + CucholixRepoID.Substring(4, 2) + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "P" + CucholixRepoID.Substring(4, 2);
                        DownloadFromRepo();
                    }
                    else if (RemoteFileExists("https://raw.githubusercontent.com/cucholix/wiivc-bis/master/" + SystemType + "/image/" + CucholixRepoID.Substring(0, 3) + "J" + CucholixRepoID.Substring(4, 2) + "/iconTex.png") == true)
                    {
                        CucholixRepoID = CucholixRepoID.Substring(0, 3) + "J" + CucholixRepoID.Substring(4, 2);
                        DownloadFromRepo();
                    }
                    else
                    {
                        FlagRepo = false;
                        if (MessageBox.Show("Cucholix's Repo does not have assets for your game. You will need to provide your own. Would you like to visit the GBAtemp request thread?", "Game not found on Repo", MessageBoxButtons.YesNo, MessageBoxIcon.Asterisk) == DialogResult.Yes)
                        {
                            System.Diagnostics.Process.Start("https://gbatemp.net/threads/483080/");
                        }
                    }
                }
            }
        }
   */

  /*const appDirectory = path.join(app.getPath('home'), 'wiivc');
  const configFile = 'config.json';

  console.log(fs);

  const config = {
    batatas: 1
  };

  if (!fs.existsSync(appDirectory)) {
    fs.mkdirSync(appDirectory);
    fs.writeFileSync(path.join(appDirectory, configFile), JSON.stringify(config));
  } else {
    console.log('exists');
  }*/

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
