import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {

  private postUpdated = new Subject<Post[]>();
  private posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts() {

    this.http.get<{ message: string, posts: any[] }>('http://localhost:3000/api/posts')
      .pipe(map(postData => {
        return postData.posts.map(post => {
          return {
            title: post.title,
            content: post.content,
            id: post._id,
            imagePath: post.imagePath
          };
        });
      }))
      .subscribe((transformedPosts) => {
        this.posts = transformedPosts;
        this.postUpdated.next([...this.posts]);
      });
    // return [...this.posts]; // Return new copy of the posts array.
  }

  addPost(title: string, content: string, image: File): void {

    // const post: Post = { id: null, title, content };
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title); // 'image' key match the string in the backend for multer storage middleware in add post route.

    this.http.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(data => {
        console.log(data.message);
        const post = {
          id: data.post.id,
          title,
          content,
          imagePath: data.post.imagePath
        };

        this.posts.push(post);
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string): void {
    this.http.delete('http://localhost:3000/api/posts/' + id).subscribe(() => {
      this.posts = this.posts.filter(p => p.id !== id);
      this.postUpdated.next([...this.posts]);
      console.log('frontend post deleted');
    });
  }

  getPostUpdateListListener() {
    return this.postUpdated.asObservable();
  }

  updatePost(id: string, title: string, content: string, image: File | string) {

    let postData: Post | FormData;
    if (typeof image === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image
      };
    }
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(
      response => {
        const updatePosts = [...this.posts];
        const oldPostIndex = updatePosts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: ''
        };
        updatePosts[oldPostIndex] = post;
        this.posts = updatePosts;
        this.postUpdated.next([...this.posts]);
        this.router.navigate(['/']);
      });

  }

  getPost(postId: string): Observable<{ _id: string, title: string, content: string }> {
    // return { ...this.posts.find(p => p.id === postId) };
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + postId);
  }
}
