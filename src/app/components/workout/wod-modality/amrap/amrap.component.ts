import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WodGroup } from 'src/app/domain/workout/wod';

@Component({
  selector: 'app-amrap',
  templateUrl: './amrap.component.html',
  styleUrls: ['./amrap.component.scss'],
})
export class AmrapComponent implements OnInit {
  @Input() group: WodGroup;
  displayStopwatch = false;
  rounds = 0;
  countdown = true;
  @Input() viewType: string;
  amount = 0
  @Input() time = 0;
  @Output() getResults: any = new EventEmitter();
  @Input() unitType: string;

  constructor() { }

  ngOnInit() {
    console.log("group recibido: ", this.group);
  }
  dencreaseUnit(type) {
    switch (type) {
      case 'rounds':
        if (this.rounds > 0) {
          this.rounds--;
          this.getResults.emit({type: 'rounds', units: this.rounds});
        }
        break;
      case 'amount':
        if (this.amount > 0) {
          this.amount--;
          this.getResults.emit({type: 'repetitions', units: this.amount});
        }
      default:
        break;
    }

  }

  increaseUnit(type) {
    switch (type) {
      case 'rounds':
        this.rounds++;
        this.getResults.emit({type: 'rounds', units: this.rounds});
        break;
      case 'amount':
        this.amount++;
        (this.unitType == 'Repetciones')? this.getResults.emit({type: 'repetitions', units: this.amount}): this.getResults.emit({type: 'metros', units: this.amount});
      default:
        break;
    }
  }

  goToStopwatch() {
    this.displayStopwatch = true;
    this.time = this.time;
  }

  hideStopwatch() {
    this.displayStopwatch = false;
  }

  getAmount(){
    this.getResults.emit({type: 'repetitions', units: this.amount});
  }

  getRounds(){
    this.getResults.emit({type: 'rounds', units: this.rounds});
  }

}
