import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-tabata',
  templateUrl: './tabata.component.html',
  styleUrls: ['./tabata.component.scss'],
})
export class TabataComponent implements OnInit {


  amount = 0;
  displayStopwatch = false;
  timeType: string;
  @Input() timeWork = 0;
  @Input() timeRest = 0;
  countdown = true;
  @Output() getResults: any = new EventEmitter();
  @Input() unitType: string;
  
    constructor() { }
  
    ngOnInit() {}
  
    dencreaseUnit(){
      if(this.amount > 0) {
        this.amount --; 
        this.getResults.emit({operation: '--', units: 1});
      }
    }
  
    increaseUnitr(){
      this.amount ++;
      this.getResults.emit({operation: '++', units: 1});
    }
  
    goToStopwatch(timeType) {
      this.displayStopwatch = true;
      this.timeType = timeType;
    }
  
  
    hideStopwatch() {
      this.displayStopwatch = false;
      this.timeType = null;
    }
  
    getAmount(){
      this.getResults.emit({operation: '', units: this.amount});
    }
  

}
