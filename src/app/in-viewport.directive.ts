import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
} from '@angular/core';
import { debounceTime, filter, Subject } from 'rxjs';

@Directive({
  selector: '[inViewport]',
  standalone: true,
})
export class InViewportDirective implements OnDestroy, AfterViewInit {
  private element = inject(ElementRef);
  debounceTime = input(0);

  inViewport = output<void>();

  private observer!: IntersectionObserver;
  private subject$ = new Subject<
    | {
        entry: IntersectionObserverEntry;
        observer: IntersectionObserver;
      }
    | undefined
  >();

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        this.subject$.next({ entry, observer });
      });
    });

    this.observer.observe(this.element.nativeElement);

    this.subject$
      .pipe(
        debounceTime(this.debounceTime()),
        filter((value) => value !== undefined)
      )
      .subscribe(async ({ entry }) => {
        if (entry.isIntersecting) {
          this.inViewport.emit();
          this.observer.disconnect();
        }
      });
  }

  ngOnDestroy(): void {
    this.observer.disconnect();
  }
}
