import { Injectable } from '@angular/core';
import { ImportType } from '../common/import-type';

@Injectable()
export class ElectronController {
  private electronApi: any;

  constructor() {
    if ((window as any).electronApi) {
      try {
        this.electronApi = (window as any).electronApi;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }

  loadFile(path: string, type: ImportType): void {
    this.electronApi.loadFile(path, type);
  }

  getConfig(): any {
    return this.electronApi.getConfig();
  }

  setConfig(config: any): void {
    this.electronApi.setConfig(config);
  }

  downloadBase(): any {
    return this.electronApi.downloadBase();
  }

  build(): any {
    return this.electronApi.build();
  }
}
