import { Injectable } from '@angular/core';
import { Post } from './post.model';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

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
    this.http.get<{ message: string, posts: any[], maxPosts: number }>(BACKEND_URL + queryparams)
      .pipe(map(postData => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
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

    this.http.post<{ message: string, post: Post }>(BACKEND_URL, postData)
      .subscribe(() => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string): any {
    return this.http.delete(BACKEND_URL + id);
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
        imagePath: image,
        creator: null
      };
    }
    this.http.put(BACKEND_URL + id, postData).subscribe(() => {
        this.router.navigate(['/']);
      });

  }

  getPost(postId: string): Observable<{ _id: string, title: string, content: string, imagePath: string,  creator: string }> {
    // return { ...this.posts.find(p => p.id === postId) };
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string,  creator: string }>(
      BACKEND_URL + postId);
  }
}
