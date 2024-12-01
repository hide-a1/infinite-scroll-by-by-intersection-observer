import { Injectable } from '@angular/core';
import { Post } from '../types/post';

@Injectable({ providedIn: 'root' })
export class PostGateway {
  async getPost(id: number): Promise<Post> {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${id}`
    );
    return await response.json();
  }

  async getPosts(): Promise<Post[]> {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return await response.json();
  }
}
