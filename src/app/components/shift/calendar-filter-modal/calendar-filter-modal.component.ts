import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModalOptions } from 'ion2-calendar';
import { AttendanceReservation } from 'src/app/domain/member/attendance-reservation';
import { Class } from 'src/app/domain/member/class';
import { AttendanceService } from 'src/app/services/attendance.service';
import { ClassService } from 'src/app/services/class.service';
import { ShiftService } from 'src/app/services/shift.service';

@Component({
  selector: 'app-calendar-filter-modal',
  templateUrl: './calendar-filter-modal.component.html',
  styleUrls: ['./calendar-filter-modal.component.scss'],
})
export class CalendarFilterModalComponent implements OnInit {
  classes: Class[] = [];
  selectedClass: number;
  selectedDates: boolean;
  resultFilter: [] = [];

  @Input() dateType: string;
  dateRange: {
    from: Date;
    to: Date
  } = {
      from: new Date(),
      to: new Date()
    };

  customActionSheetOptions: any = {
    header: 'Clases',
    subHeader: 'seleccione una clase',
    cssClass: 'my-custom-select-class',
  };

  option: CalendarModalOptions = {
    pickMode: 'range',
    title: 'RANGE',
    defaultDateRange: this.dateRange,
    canBackwardsSelected: true,
    weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S']
  };


  constructor(public modalController: ModalController,
    private classService: ClassService,
    private attendanceService: AttendanceService,
    private dp: DatePipe,
    private shiftService: ShiftService
  ) {

  }

  ngOnInit() {
    console.log("tipo de datos: ", this.dateType)
    this.getClasses();
  }

  onChange(event) {
    this.selectedDates = true;
    console.log("fecha parametro: ", event)
    console.log("from: ", this.dateRange.from);
    console.log("to: ", this.dateRange.to);
  }

  async close() {
      const closeModal: {} = {result: this.resultFilter, open: false};
      console.log("datos pasados: ", closeModal);
      await this.modalController.dismiss(closeModal);

  }

  getClasses() {
    this.classService.getAll().subscribe(
      result => {
        console.log("clases: ", result);
        this.classes = result;
      },
      error => console.error(error)
    );
  }

  selectClass(event) {
    let id = (<any>event).target.value;
    console.log("clase seleccionada: ", id);
    this.selectedClass = id;
  }

  filterResults() {
    console.log("tipo de datos: ", this.dateType);
    let from: string;
    let to: string;
    if (this.selectedDates) {
      from = this.dateRange.from.toString();
      to = this.dateRange.to.toString();
    } else {
      from = this.dp.transform(this.dateRange.from, 'yyyy-MM-dd');
      to = this.dp.transform(this.dateRange.from, 'yyyy-MM-dd');
    };
    let classId = (!this.selectedClass)? 0: this.selectedClass;
    if(this.dateType == "reserves"){
      this.attendanceService.getByFromByToByClass(from, to, classId).subscribe(
        response => {
          console.log("reservations: ", response.result);
          this.resultFilter = response.result;
          this.close();
        },
        error => console.error(error)
      )
    }else{
      this.shiftService.getAll(from, to, classId).subscribe(
        response => {
          console.log("turnos:", response.result);
          this.resultFilter = response.result;
          this.close();
        },
        error => {
          console.error(error);
        }
      )
    }
  
  }

}
