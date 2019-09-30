import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from '../posts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: Post[] = [];
  private destroyed = new Subject();

  constructor(private postService: PostsService) { }

  ngOnInit() {
    this.postService.getPosts();
    this.postService.getPostUpdateListListener().pipe(takeUntil(this.destroyed)).subscribe((postList: Post[]) => {
      this.posts = postList;
    });

  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

}
