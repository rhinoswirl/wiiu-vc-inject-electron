import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ElectronController } from '../../controllers/electron.controller';
import { AppController } from '../../controllers/app.controller';
import { ImportType } from '../../common/import-type';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends BaseComponent implements OnInit {
  form;

  constructor(private fb: FormBuilder,
              private router: Router,
              protected controller: AppController) {
    super(controller);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configureButtons(true, false);
    this.form = this.fb.group({
      injectionType: [ImportType.WII_RETAIL],
    });
  }

  next(): void {
    const injectionType = this.form.value.injectionType;
    this.controller.selectSource(injectionType);
    this.router.navigate(['source']);
  }

  previous(): void {
  }
}
