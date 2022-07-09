import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { AttendanceService } from 'src/app/services/attendance.service';






@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent implements OnInit {
  date: string;
  type: 'string';
  options: CalendarComponentOptions;
  attendance: DayConfig[] = [];
  month: number = 0;
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
          this.attendance.push(this.getDayConfigAttended(date.dateShift))
        }if(date.status == 4)
        this.attendance.push(this.getDayConfigNoAttended(date.dateShift))
      });
      this.setupAttendance();
    })
  }

  setupAttendance(){
    this.options = {
      color: "red",
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      showMonthPicker: true,
      daysConfig: this.attendance
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
