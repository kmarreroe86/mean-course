import { Component, OnInit } from '@angular/core';

import { Post } from './posts/post.model';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Mean course';
  posts: Post[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.autoAuthorizeUser();
  }


  onPostAdded(post) {
    this.posts.push(post);
  }
}
