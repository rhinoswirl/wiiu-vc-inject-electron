import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseComponent } from '../base/base.component';
import { AppController } from '../../controllers/app.controller';
import { Router } from '@angular/router';
import { ElectronController } from '../../controllers/electron.controller';

@Component({
  selector: 'app-select-source',
  templateUrl: './select-source.component.html',
  styleUrls: ['./select-source.component.scss']
})
export class SelectSourceComponent extends BaseComponent implements OnInit {
  @ViewChild('fileInput')
  fileNode: ElementRef;

  form: FormGroup;
  constructor(protected controller: AppController,
              protected electronController: ElectronController,
              private router: Router,
              private fb: FormBuilder) {
    super(controller);
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.configureButtons();
    this.form = this.fb.group({
      file: null
    });
  }

  onFileSelected(): void {
    const inputNode: any = this.fileNode.nativeElement;

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        console.log('onload', e.target.result);
      };

      if (inputNode?.files?.[0]) {
        const selectedFile = inputNode.files[0];
        this.form.patchValue({ file: selectedFile.path });
        this.electronController.loadFile(selectedFile.path, this.controller.source);
        // TODO: we need to read
        // reader.readAsArrayBuffer(inputNode.files[0]);
      } else {
        this.form.patchValue({ file: null });
      }
    }
  }

  next(): void {
    this.electronController.build();
  }

  previous(): void {
    this.controller.selectSource(null);
    this.router.navigate(['']);
  }
}
