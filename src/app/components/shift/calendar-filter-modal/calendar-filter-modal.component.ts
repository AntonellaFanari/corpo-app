import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarModalOptions, DayConfig } from 'ion2-calendar';
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
  selectedClass = "0";
  selectedDates: boolean;
  resultFilter: [] = [];
  filterRange = false;
  date = this.getDateString();
  selectedOption = "date";

  @Input() dateType: string;
  @Input() displayCalendar = false;
  dateRange: {
    from: Date;
    to: Date
  } = {
      from: new Date(),
      to: new Date()
    };

  customActionSheetOptions = {
    header: 'Clases',
    subHeader: 'seleccione una clase',
    cssClass: 'my-custom-select-class',
  };

  // daysConfig: DayConfig = {
  //   date: this.date,
  //   marked: true,
  //   cssClass: 'selected-date'
  // }

  optionDate: CalendarModalOptions;


  optionDateRange: CalendarModalOptions;

  constructor(public modalController: ModalController,
    private classService: ClassService,
    private attendanceService: AttendanceService,
    private dp: DatePipe,
    private shiftService: ShiftService,
    private cdRef:ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    console.log("tipo de datos: ", this.dateType)
    this.optionDate = this.getOptionDate();
    this.optionDateRange = this.getOptionDateRange();
    this.getClasses();
    this.date = this.getDateString();
  }

  getDateString(){
    let today = new Date();
    // console.log();
    return today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate()
  }

//   ngAfterViewChecked()
// {
//   console.log( "! changement de la date du composant !" );
//   this.date = new Date();
// }

  selectDay(event) {
    this.selectedDates = true;
    console.log("fecha parametro: ", event);
  }

  selectDayRanger(event){
    this.selectedDates = true;
    console.log("fecha parametro: ", event);
  }


  close() {
    const closeModal = null;
    console.log("datos pasados: ", closeModal);
    this.displayCalendar = false;
    this.sendData(null);
  }

  async sendData(closeModal) {
    await this.modalController.dismiss(closeModal);
  }

  // openCalendar() {
  //   console.log("dia de hoy: ", this.date);
  //   let today = new Date(2022, this.date.getMonth(), this.date.getDate(), 0, 0, 0);
  //   console.log("hoy: ", this.date.getDay());
  //   let daysConfig: DayConfig[] = [];
  //   for (let i = 0; i < 60; i++) {
  //     let date = new Date(this.date.getFullYear(), this.date.getMonth()-1, i + 1);
  //     daysConfig.push({
  //       date: date,
  //       disable: (date < today)? true: false
  //     });
  //     console.log("dia: ", date);
  //   }
  //   return daysConfig;
  // }

  getOptionDateRange() {

    return {
      pickMode: 'range',
      title: 'RANGE',
      color: 'secondary',
      defaultDateRange: this.dateRange,
      canBackwardsSelected: (this.dateType == "shifts") ? false : true,
      disableWeeks: [0],
      showToggleButtons: true,
      showMonthPicker: false,
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    }
  }

  getOptionDate() {
    console.log("tipo: ", this.dateType);
    return {
      pickMode: 'single',
      title: 'SINGLE',
      defaultDate: this.date,
      canBackwardsSelected: (this.dateType == "shifts") ? false : true,
      color: 'secondary',
      disableWeeks: [0],
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      showToggleButtons: true,
      showMonthPicker: false
    }
  }

  selectOption() {
    console.log("opcion: ", this.selectedOption);
    this.filterRange = (this.selectedOption == "date") ? false : true;
    if (this.filterRange) this.getOptionDateRange();
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

  // markDisabled = (date: Date) => {
  //   console.log("llama")
  //   var current = new Date();
  //   return date < current;
  // };

  filterResults() {
    console.log("tipo de datos: ", this.dateType);
    let from: string;
    let to: string;
    if (this.filterRange) {
      from = this.dateRange.from.toString();
      to = this.dateRange.to.toString();
    } else {
      from = this.date.toString();
    }
    let classId = parseInt(this.selectedClass);
    if (this.dateType == "reserves") {
      if (this.filterRange) {
        this.attendanceService.getByFromByToByClass(from, to, classId).subscribe(
          response => {
            this.resultFilter = response.result;
            const closeModal: {} = { result: this.resultFilter, open: false };
            console.log("reservations: ", response.result);
            this.sendData(closeModal);
          },
          error => console.error(error)
        )
      } else {
        this.attendanceService.getByDay(from, classId).subscribe(
          response => {
            console.log("reservations: ", response.result);
            this.resultFilter = response.result;            
            const closeModal: {} = { result: this.resultFilter, open: false };
            this.sendData(closeModal);
          },
          error => console.error(error)
        )
      }

    } else {
      if (this.filterRange) {
        this.shiftService.getAll(from, to, classId).subscribe(
          response => {
            console.log("turnos:", response.result);
            this.resultFilter = response.result;
            const closeModal: {} = { result: this.resultFilter, open: false };
            this.sendData(closeModal);
          },
          error => {
            console.error(error);
          }
        )
      } else {
        this.shiftService.getByDay(from, classId).subscribe(
          response => {
            console.log("turnos de hoy:", response.result);
            this.resultFilter = response.result;
            const closeModal: {} = { result: this.resultFilter, open: false };
            this.sendData(closeModal);
          },
          error => {
            console.error(error);
          }
        )
      }
    }
  }


}