import { Component, input, output } from '@angular/core';
import { ListData } from '../../app.component';
import { InViewportDirective } from '../../in-viewport.directive';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [DetailComponent, InViewportDirective],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  list = input.required<ListData[]>();
  inViewport = output<number>();
}
