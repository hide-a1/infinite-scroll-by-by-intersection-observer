import { Component, input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ListData } from '../../app.component';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [MatExpansionModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss',
})
export class DetailComponent {
  post = input.required<ListData>();
}
