import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { WodService } from 'src/app/services/wod.service';
import { PeriodizationService } from '../../../services/periodization.service';

@Component({
  selector: 'app-wod',
  templateUrl: './wod.component.html',
  styleUrls: ['./wod.component.scss'],
})
export class WodComponent implements OnInit {

  @Input() wod: any;
  @Output() wodEventEmitter = new EventEmitter();
  displayRest: boolean;
  rest = 0;
  send: boolean;

  constructor(private wodService: WodService,
    private customAlertService: CustomAlertService,
    private router: Router) { }

  ngOnInit() {
    console.log("wod recibido: ", this.wod);
    this.wodService.getAll().subscribe((wods) => {
      console.log(wods)
    })

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("wod", this.wod)
  }

  goBack() {
    this.wodEventEmitter.emit();
  }

  openVideo(url: string) {
    console.log(url)
    window.open(url, '_system');
  }

  getValue(exercise) {
    return exercise.value + " " + exercise.mode;

  }

  getGoals(goals) {
    return goals.split("-");
  }

  restDisplay(){
    this.displayRest = true;
  }

  cancelRest(){
    this.displayRest = false;
  }


  saveRest(){
      this.wodService.updateRest(this.wod.wod.id, this.rest).subscribe(
        response => {
          console.log("hs de descanso guardadas");
          this.goBack();
          this.displayRest = false;
        },
        error => {
          console.error(error);
          if (error.status == 400) {
            this.customAlertService.display("Gestión de Wods", error.error.errores);
          } if (error.status == 500) {
            this.customAlertService.display("Gestión de Wods", ["Error al intentar guardar el tiempo de descanso."]);
          }
        })
    }
}
