class Config {
  _config = {
    commonKey: '00000000000000000000000000000000',
    wiiCommonKey: '0000000000000000',
    titleKey : '00000000000000000000000000000000',
    updateServer: '',
    tagayaLatest: '',
    tagayaVersionList: ''
  }

  static instance = null;

  static getInstance() {
    if (!this.instance) {
      this.instance = new Config();
    }
    return this.instance;
  }

  get() {
    return this._config;
  }

  set(config) {
    this._config = config;
  }
}

module.exports.config = {
  get: () => {
    return Config.getInstance().get()
  },
  set: (config) => {
    Config.getInstance().set(config);
  }
};
