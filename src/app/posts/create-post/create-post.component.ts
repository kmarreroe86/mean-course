import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {
  newPost = 'No Content';

  constructor() {}

  ngOnInit() {}

  savePost(htmlElem: HTMLTextAreaElement) {
    console.dir(htmlElem);
    console.log(htmlElem);
    this.newPost = htmlElem.value;
  }
}
