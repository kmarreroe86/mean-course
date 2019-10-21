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

  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();
  private posts: Post[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postPerPage: number, currentPage: number) {

    const queryparams = `?pagesize=${postPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any[], maxPosts: number }>('http://localhost:3000/api/posts' + queryparams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            };
          }),
          postCount: postData.maxPosts
        };
      })).subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postUpdated.next({ posts: [...this.posts], postCount: transformedPostsData.postCount });
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
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string): any {
    return this.http.delete('http://localhost:3000/api/posts/' + id);
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
    this.http.put('http://localhost:3000/api/posts/' + id, postData).subscribe(() => {
        this.router.navigate(['/']);
      });

  }

  getPost(postId: string): Observable<{ _id: string, title: string, content: string }> {
    // return { ...this.posts.find(p => p.id === postId) };
    return this.http.get<{ _id: string, title: string, content: string }>('http://localhost:3000/api/posts/' + postId);
  }
}
