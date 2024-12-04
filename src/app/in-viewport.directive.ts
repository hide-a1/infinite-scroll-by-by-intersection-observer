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

  private observer: IntersectionObserver | undefined;
  private subject$ = new Subject<IntersectionObserverEntry | undefined>();

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        this.subject$.next(entry);
      });
    });

    this.observer.observe(this.element.nativeElement);

    this.subject$
      .pipe(
        debounceTime(this.debounceTime()),
        filter((value) => value !== undefined)
      )
      .subscribe(async (entry) => {
        if (entry.isIntersecting) {
          this.inViewport.emit();
          this.observer?.disconnect();
        }
      });
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
