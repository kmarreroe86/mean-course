import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient) { }

  getPosts() {

    this.http.get<{ message: string, posts: Post[] }>('http://localhost:3000/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postUpdated.next([... this.posts]);
      });
    // return [...this.posts]; // Return new copy of the posts array.
  }

  addPost(title: string, content: string): void {

    const post: Post = { id: null, title, content };
    this.http.post<{ message: string }>('http://localhost:3000/api/posts', post)
      .subscribe(data => {
        console.log(data.message);
        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
      });
  }

  getPostUpdateListListener() {
    return this.postUpdated.asObservable();
  }
}
