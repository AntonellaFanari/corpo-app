import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit {
  @Input()countdownTime: number;
  minutes: number = 0;
  seconds = 0;
  timer: any;
  @Output() hideDisplayStopwatch = new EventEmitter();
  @Output() getTime = new EventEmitter();
  time: number;
  initiated = false;
  @Input() countdown = false;


  constructor() { }

  ngOnInit() {
    // this.lessThanMinutes();
    // this.lessThanSeconds();
    if(this.countdown) this.getCountdownTime();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.countdown) this.getCountdownTime();
  }

  getCountdownTime() {
    this.minutes = this.countdownTime;

    this.minutes--;
    this.seconds = 59;
  }

  play() {
    this.initiated = true;
    console.log("llegue");
    if (!this.countdownTime) {
      this.timer = setTimeout(() => {
        this.seconds++;
        if (this.seconds == 60) {
          this.minutes++;
          this.seconds = 0;
        }
        this.play();
      }, 1000);
    } else {
      this.timer = setTimeout(() => {
        if (this.seconds != 0) {
          this.seconds--;
          this.play();
        } else if (this.seconds == 0 && this.minutes != 0) {
          this.minutes--;
          this.seconds = 59;
          this.play();
        } else if (this.minutes == 0 && this.seconds == 0){
          this.save();
        }

      }, 1000);
    }

  }


  lessThanMinutes() {
    return this.minutes < 10;
  }

  lessThanSeconds() {
    return this.seconds < 10;
  }

  reset() {    
    this.initiated = false;
    if (!this.countdownTime) {
      this.seconds = 0;
      this.minutes = 0;
    } else {
      this.minutes = this.countdownTime;

      this.minutes--;
      this.seconds = 59;
    }

    clearTimeout(this.timer);
  }

  pause() {
    clearTimeout(this.timer);
    this.initiated = false;
  }

  goBack() {
    this.countdownTime = null;
    this.countdown = false;
    this.reset();
    this.hideDisplayStopwatch.emit();

  }

  save() {
    if(!this.countdown){

      this.time = this.seconds + (this.minutes * 60);
      console.log("tiempo en segundos: ", this.time);
      this.reset();
      this.initiated = false;
      this.getTime.emit(this.time);
      
    }else{
      
    this.initiated = false;
      this.getTime.emit();

    }
    this.reset();
  }
}
