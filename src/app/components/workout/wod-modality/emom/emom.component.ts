import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-emom',
  templateUrl: './emom.component.html',
  styleUrls: ['./emom.component.scss'],
})
export class EmomComponent implements OnInit {
displayStopwatch = false;
rounds = 0;
time = 1;
countdown = true;
@Output() getResults = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  dencreaseUnit(){
    if(this.rounds > 0) {
      this.rounds --;
      this.getResults.emit(this.rounds);
    }
  }

  increaseUnit(){
    this.rounds ++;
    this.getResults.emit(this.rounds);
  }

  goToStopwatch() {
    this.displayStopwatch = true;
  }


  hideStopwatch() {
    this.displayStopwatch = false;
  }

  getRounds(){
    this.getResults.emit(this.rounds);
  }
}
