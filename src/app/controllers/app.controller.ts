import { Injectable } from '@angular/core';
import { ImportType } from '../common/import-type';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable()
export class AppController {
  source = null;
  private sourceChanged$ = new BehaviorSubject<ImportType>(null);
  private next$ = new Subject();
  private previous$ = new Subject();
  private buttonLayout$ = new Subject();

  selectSource(source: ImportType): void {
    this.source = source;
    this.sourceChanged$.next(source);
  }

  onSourceChanged(): Observable<ImportType> {
    return this.sourceChanged$.asObservable();
  }

  next(): void {
    this.next$.next();
  }

  previous(): void {
    this.previous$.next();
  }

  onNext(): Observable<any> {
    return this.next$.asObservable();
  }

  onPrevious(): Observable<any> {
    return this.previous$.asObservable();
  }

  onButtonLayoutChanged(): Observable<any> {
    return this.buttonLayout$.asObservable();
  }

  configureButtons(hasNext = true, hasPrevious = true): void {
    this.buttonLayout$.next({ hasNext, hasPrevious });
  }
}
