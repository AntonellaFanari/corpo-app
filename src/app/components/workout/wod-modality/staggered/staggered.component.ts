import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-staggered',
  templateUrl: './staggered.component.html',
  styleUrls: ['./staggered.component.scss'],
})
export class StaggeredComponent implements OnInit {
displayStopwatch = false;
time = 0;
@Output() getResults: any = new EventEmitter();

  constructor() { }

  ngOnInit() {}
  goToStopwatch() {
    this.displayStopwatch = true;
  }


  hideStopwatch() {
    this.displayStopwatch = false;
  }

  getTime(time) {
    this.time = time;
    this.displayStopwatch = false;
    this.getResults.emit(this.time);
  }


}
