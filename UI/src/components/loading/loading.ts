import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading',
  templateUrl: 'loading.html'
})
export class LoadingComponent {

  @Input() image: string;
  @Input() description: string;

  constructor() {
    this.image = "assets/imgs/loading.svg";
    this.description = "";
  }

}
