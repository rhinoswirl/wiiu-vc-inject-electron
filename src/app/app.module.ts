import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FlexModule } from '@angular/flex-layout';
import { MatRadioModule } from '@angular/material/radio';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ElectronController } from './controllers/electron.controller';
import { AppController } from './controllers/app.controller';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TitleBarComponent } from './components/title-bar/title-bar.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { SelectSourceComponent } from './components/select-source/select-source.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { MatIcon, MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { ConfigComponent } from './components/config/config.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    TitleBarComponent,
    NavBarComponent,
    SelectSourceComponent,
    ConfigComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterModule,
    AppRoutingModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule
  ],
  providers: [
    ElectronController,
    AppController,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
