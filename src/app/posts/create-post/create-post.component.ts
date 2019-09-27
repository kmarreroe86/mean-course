import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  postTitle: string;
  postContent: string;
  private destroyed = new Subject();

  constructor(private postService: PostsService) { }

  ngOnInit() { }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  savePost(form: NgForm) {
    if (form.invalid) { return; }

    this.postService.addPost(form.value.title, form.value.content);
    form.resetForm();
  }
}
