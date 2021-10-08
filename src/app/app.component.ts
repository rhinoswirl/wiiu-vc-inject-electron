import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ElectronController } from './controllers/electron.controller';
import { AppController } from './controllers/app.controller';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  currentScreen = 0;
  title = 'Wii U VC Inject';

  constructor(private controller: AppController) {

  }

  next(): void {
    this.controller.next();
  }

  previous(): void {
    this.controller.previous();
  }

}
