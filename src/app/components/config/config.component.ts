import { Component, OnInit } from '@angular/core';
import { ElectronController } from '../../controllers/electron.controller';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  form: FormGroup;
  constructor(private electronController: ElectronController,
              private dialogRef: MatDialogRef<ConfigComponent>,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      commonKey: '00000000000000000000000000000000',
      wiiCommonKey: '0000000000000000',
      titleKey: '00000000000000000000000000000000',
      updateServer: 'http://maschell.de/ccs/download',
      tagayaLatest: '',
      tagayaVersionList: ''
    });

    this.electronController.getConfig().then(data => {
      this.form.patchValue(data);
    });
  }

  download(): void {
    this.electronController.downloadBase().then(data => {
      console.log('success', data);
    });
  }

  save(): void {
    const value = this.form.value;
    this.electronController.setConfig(value);
    this.dialogRef.close();
  }
}
