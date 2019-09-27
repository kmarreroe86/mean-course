import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor() { }

  getPosts(): Post[] {
    return [...this.posts]; // Return new copy of the posts array.
  }

  addPost(title: string, content: string): void {
    const post: Post = { title, content };
    this.posts.push(post);
    this.postUpdated.next([...this.posts]);
  }

  getPostUpdateListListener() {
    return this.postUpdated.asObservable();
  }
}
