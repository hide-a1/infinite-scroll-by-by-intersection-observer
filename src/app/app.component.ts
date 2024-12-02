import { Component, inject, OnInit, signal } from '@angular/core';
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

  ngOnInit(): void {
    this.list.set(this.postGateway.getPostIds(100).map((id) => ({ id })));
  }

  async inViewport(id: number): Promise<void> {
    const post = await this.postGateway.getPost(id);

    this.list.update((list) => {
      const index = list.findIndex((item) => item.id === id);
      list[index].data = post;
      return list;
    });
  }
}
