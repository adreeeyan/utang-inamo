import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html'
})
export class LoadingComponent implements OnInit {

  @Input() image: string;
  @Input() description: string;

  constructor() {
    this.image = "assets/imgs/loading.gif";
    this.description = "";
  }

  ngOnInit() {
    // move the loading container to app-root
    let appRoot = document.querySelector(".app-root");
    let loadingContainer = document.querySelector("loading");
    appRoot.appendChild(loadingContainer);
  }
}
