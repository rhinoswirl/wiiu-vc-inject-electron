import { Component, Directive, OnDestroy, OnInit } from '@angular/core';
import { AppController } from '../../controllers/app.controller';

@Directive()
export abstract class BaseComponent implements OnInit, OnDestroy {
  private subscriptions = [];

  constructor(protected controller: AppController) {
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.controller.onNext().subscribe(() => this.next()),
      this.controller.onPrevious().subscribe(() => this.previous())
    );
  }

  configureButtons(hasNext = true, hasPrevious = true): void {
    this.controller.configureButtons(hasNext, hasPrevious);
  }

  abstract next(): void;
  abstract previous(): void;

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
