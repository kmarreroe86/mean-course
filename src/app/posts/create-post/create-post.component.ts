import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../posts.service';
import { Subject } from 'rxjs/internal/Subject';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeTypeImageAsyncValidator } from './mime-type.validator';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit, OnDestroy {
  postTitle: string;
  postContent: string;
  postId: string;
  mode: string;
  postModel: Post;
  isLoading = false;
  imagePreview: string;

  form: FormGroup;
  private destroyed = new Subject();

  constructor(private postService: PostsService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      content: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null,
        {
          validators: [Validators.required],
          asyncValidators: [mimeTypeImageAsyncValidator]
        })
    });
    this.postModel = { id: null, title: '', content: '' };
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPost(this.postId).subscribe(postData => {
          this.postModel = { id: postData._id, title: postData.title, content: postData.content };

          this.form.setValue({
            title: this.postModel.title,
            content: this.postModel.content
          });

          this.isLoading = false;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }

  savePost() {
    if (this.form.invalid) { return; }
    this.isLoading = true;

    if (this.mode === 'create') {
      this.postService.addPost(this.form.value.title, this.form.value.content);
      this.form.reset();
    } else {
      this.postService.updatePost(this.postModel);
    }
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file }); // patchValue allows to target one control of the form
    this.form.get('image').updateValueAndValidity(); // tells to angular that the value changed and re-evaluated the validity

    const reader = new FileReader(); // Create a reader
    reader.onload = () => {
      this.imagePreview = reader.result as string; // Define the onload event function of the reader
    };

    reader.readAsDataURL(file);  // Call the reader to load the resource. Fire onload event when its done.
  }
}
