import { Component, inject, OnInit, signal } from '@angular/core';
import { delay, Subject } from 'rxjs';
import { ListComponent } from './components/list/list.component';
import { PostGateway } from './gateway/post.gateway';
import { Post } from './types/post';

export type ListData = {
  id: number;
  data?: Post;
};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  postGateway = inject(PostGateway);
  list = signal<ListData[]>([]);

  inViewportEvent = new Subject<number>();

  ngOnInit(): void {
    this.list.set(this.postGateway.getPostIds(100).map((id) => ({ id })));
    this.inViewportEvent
      .pipe(delay(1000))
      .subscribe((id) => this.inViewport(id));
  }

  async inViewport(id: number): Promise<void> {
    console.log(id);
    const post = await this.postGateway.getPost(id);

    this.list.update((list) => {
      const index = list.findIndex((item) => item.id === id);
      list[index].data = post;
      return list;
    });
  }
}
