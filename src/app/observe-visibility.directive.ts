import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
import { delay, filter, Subject } from 'rxjs';

@Directive({
  selector: '[observeVisibility]',
  standalone: true,
})
export class ObserveVisibilityDirective
  implements OnDestroy, OnInit, AfterViewInit
{
  debounceTime = input(0);
  rootMargin = input(0);
  threshold = input(1);

  visible = output<boolean>();

  private element = inject(ElementRef);

  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<
    | {
        entry: IntersectionObserverEntry;
        observer: IntersectionObserver;
      }
    | undefined
  >();

  ngOnInit() {
    this.createObserver();
  }

  ngAfterViewInit() {
    this.startObservingElements();
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = undefined;
    }

    this.subject$.next(undefined);
    this.subject$.complete();
  }

  private createObserver() {
    const options: IntersectionObserverInit = {
      rootMargin: this.rootMargin() + 'px',
      threshold: this.threshold(),
    };

    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.subject$.next({ entry, observer });
      });
    }, options);
  }

  private startObservingElements() {
    if (!this.observer) {
      return;
    }

    this.observer.observe(this.element.nativeElement);

    this.subject$
      .pipe(delay(this.debounceTime()), filter(Boolean))
      .subscribe(async ({ entry, observer }) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          this.visible.emit(true);
        } else {
          this.visible.emit(false);
        }
      });
  }
}
