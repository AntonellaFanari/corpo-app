import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, CalendarModalOptions, DayConfig } from 'ion2-calendar';
import { AttendanceService } from 'src/app/services/attendance.service';






@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  date: string;
  type: 'string';
  options: CalendarModalOptions;
  attendance: DayConfig[] = [];
  month: number = 0;
  dateMulti: string[] = [];
  constructor(private attendanceService: AttendanceService) {


  }

  ngOnInit() {
    this.getAttendancesByMonth();
  }

  getAttendancesByMonth(){
    this.attendance = [];
    this.attendanceService.getByMonth(this.month).subscribe((data) => {
      
      console.log("llego: ", data.result );
      data.result.forEach(date => {
        if(date.status == 3){
          this.attendance.push(this.getDayConfigAttended(date.dateShift));
          this.dateMulti.push(date.dateShift);
          console.log("fechas de asistencias: ", this.dateMulti);
        }if(date.status == 4)
        this.attendance.push(this.getDayConfigNoAttended(date.dateShift))
      });
      this.setupAttendance();
    })
  }

  setupAttendance(){
    this.options = {
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      daysConfig: this.attendance,
      pickMode: 'multi',
      canBackwardsSelected: false,
      color: 'secondary',
      disableWeeks: [0],
    }      
  }

  onChange($event) {
    console.log($event);
  }

  onChangeMonth(event){
    console.log("cambio de mes: ", event);
    this.month = event;
    this.getAttendancesByMonth();
  }

  getDayConfigAttended(today): DayConfig {
    var date = new Date(today);
    return {
      date: date,
      marked: true,
      title: date.getDate().toString(),
      subTitle: "si",
      cssClass: "attended"
    }
  }

  getDayConfigNoAttended(today): DayConfig {
    var date = new Date(today);
    return {
      date: date,
      marked: true,
      title: date.getDate().toString(),
      subTitle: "no",
      cssClass: "no-attended"
    }
  }


}
