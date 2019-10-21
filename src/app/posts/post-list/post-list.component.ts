import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 3, 5];
  currentPage = 1;
  userIsAuthenticated = false;
  private destroyed = new Subject();

  constructor(private postService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    this.postService.getPostUpdateListListener().pipe(takeUntil(this.destroyed))
      .subscribe((postListData: { posts: Post[], postCount: number }) => {
        this.posts = postListData.posts;
        this.totalPosts = postListData.postCount;
        this.isLoading = false;
      });

    this.authService.getAuthSatusListener().pipe(takeUntil(this.destroyed)).subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.userIsAuthenticated = this.authService.getIsAuht();
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  onDeletePost(id: string): void {
    this.postService.deletePost(id).subscribe(() => {
      this.isLoading = true;
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChanged(event: PageEvent) {
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1;
    this.postsPerPage = event.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }

}
