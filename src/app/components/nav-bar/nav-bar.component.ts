import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AppController } from '../../controllers/app.controller';
import { ImportType } from '../../common/import-type';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, OnDestroy {
  private subscriptions = [];
  hasPrevious = true;
  hasNext = true;

  constructor(private controller: AppController) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.controller.onButtonLayoutChanged()
        .subscribe(data => {
          this.hasPrevious = data.hasPrevious;
          this.hasNext = data.hasNext;
        })
    );
  }

  previous(): void {
    this.controller.previous();
  }

  next(): void {
    this.controller.next();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
