import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppController } from '../../controllers/app.controller';
import { ImportType } from '../../common/import-type';
import { ConfigComponent } from '../config/config.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.scss']
})
export class TitleBarComponent implements OnInit, OnDestroy {
  currentSource: ImportType;
  title: string;
  private subscriptions = [];

  constructor(private controller: AppController,
              private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.controller.onSourceChanged()
        .subscribe(source => {
          this.sourceChanged(source);
        })
    );
  }

  sourceChanged(source): void {
    this.currentSource = source;
    switch (this.currentSource) {
      case ImportType.WII_RETAIL:
        this.title = 'Wii Retail Injection';
        break;
      case ImportType.GC_RETAIL:
        this.title = 'GC Retail Injection';
        break;
      case ImportType.VWII_NAND:
        this.title = 'vWii NAND Title Launcher';
        break;
      case ImportType.WII_HOMEBREW:
        this.title = 'Wii Homebrew Injection';
        break;
      default:
        this.title = 'Welcome to VC Inject';
    }
  }

  openSettings(): void {
    this.dialog.open(ConfigComponent);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
