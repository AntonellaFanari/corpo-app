import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { StopwatchComponent } from 'src/app/components/stopwatch/stopwatch.component';
import { ExerciseItem, WodGroup } from 'src/app/domain/workout/wod';

@Component({
  selector: 'app-shortest-possible-time',
  templateUrl: './shortest-possible-time.component.html',
  styleUrls: ['./shortest-possible-time.component.scss'],
})
export class ShortestPossibleTimeComponent implements OnInit {
  time = 0;
  totalTime = 0;
  roundStopwatch = 0;
  stopwatchTime: number;
  countdownTime: number;
  @ViewChild(StopwatchComponent, { static: false }) stopWatch: StopwatchComponent;
  @Input() exerciseItem: ExerciseItem;
  @Input() rounds: number;
  times: any[];
  @Output() getResults = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
    console.log("rondas recibidas: ", this.rounds);
    this.getRoundsAmount();
  }
  goToStopwatch(i) {
    this.roundStopwatch = i + 1;
  }


  hideStopwatch() {
    this.roundStopwatch = 0;
  }

  getTime(time) {
    this.time = time;
    let registeredTime = this.times.find(x => x.round == this.roundStopwatch).time;
    this.totalTime = this.totalTime - registeredTime + time;
    this.times.find(x => x.round == this.roundStopwatch).time = time;
    this.roundStopwatch = 0;
    this.getResults.emit({registeredTime, times: this.times, time: this.time});
  }

  getRoundsAmount() {
    this.times = [];
    for (let i = 0; i < this.rounds; i++) {
      let time = { round: i + 1, time: 0 };
      this.times.push(time);

    }
  }



}
