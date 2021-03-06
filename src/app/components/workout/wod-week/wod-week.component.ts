import { Component, OnInit } from '@angular/core';
import { CalendarComponentOptions, CalendarModalOptions, DayConfig } from 'ion2-calendar';
import * as moment from 'moment';
import { Wod, WodGroup } from 'src/app/domain/workout/wod';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-wod-week',
  templateUrl: './wod-week.component.html',
  styleUrls: ['./wod-week.component.scss'],
})
export class WodWeekComponent implements OnInit {


  date: string;
  type: 'string';
  options: CalendarModalOptions;
  // wods: DayConfig[] = [];
  wods: any[] = [];
  wod: any;
  result: any;
  requesting: boolean;
  days: string[] = [];
  wodDates: string[] = [];
  weekNumber: number;

  constructor(private wodService: WodService) { }

  ngOnInit() {
    this.getAllWod();

  }

  getAllWod() {
    this.wods = [];
    this.requesting = true;
    this.wodService.getAll().subscribe((data: any) => {
      this.requesting = false;
      if(data.result != null){
        this.result = data.result;
        console.log(this.result);
        var wodMembers = data.result;
        wodMembers.forEach(w => {
          this.wods.push({
            wod: this.getWodMember(w),
            date: "",
            wodNumber: w.wodNumber
          });
          console.log("wodMember:", w)
          //   this.wods.push(this.getDayConfig(wod.date))
          //   this.wodDates.push(moment(wod.date).locale('es').format("dddd DD"));
  
  
        });
      }     
      // this.days = this.getCurrentWeek();

      // this.setupWods();
    }, error => {
      this.requesting = false;
    })
  }

  setupWods() {
    this.options = {
      color: "red",
      weekdays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
      // daysConfig: this.wods,
      canBackwardsSelected: true,
      showAdjacentMonthDay: false

    }
  }

  onChange($event) {
    var res = this.result.find(x => (moment(x.date,)).format('DD-MM-YYYY') == $event.format('DD-MM-YYYY'));
    console.log(res)
    this.wod = this.getWodMember(res);
  }

  getWodMember(wodMember): Wod {
    this.weekNumber = wodMember.weekNumber;
    var wod = new Wod();
    wod.id = wodMember.id;
    var indexes = wodMember.wodGroupsMember.map(x => x.groupIndex);
    indexes = indexes.filter((x, i, a) => a.indexOf(x) == i)
    wod.goal = wodMember.goal;
    wod.intensityType = wodMember.intensityType;
    wod.intensity = wodMember.intensity;
    wod.rate = wodMember.rate;
    wod.weekNumber = wodMember.weekNumber;
    wod.rest = wodMember.rest;

    indexes.forEach(i => {
      var wodGroup = new WodGroup();
      var exercises = wodMember.wodGroupsMember.filter(x => x.groupIndex == i).map(e => {
        return {

          exercise: e.exercise,
          modality: e.modality,
          units: e.units,
          mode: e.mode,
          value: e.value
        }
      });
      wodGroup.exercises = exercises;
      wodGroup.detail = wodMember.wodGroupsMember.find(x => x.groupIndex == i).detail;
      wod.addGroup(wodGroup)
      // wod.wodNumber = wodMember.wodNumber;

    })
    return wod;
  }

  // getWod(wodResponse): Wod {

  //   console.log("wodResponse",wodResponse)
  //   var wod = new Wod();
  //   var indexes = wodResponse.wodGroupsMember.map(x => x.groupIndex);
  //   wod.goal = wodResponse.goal;

  //   //indexes.filter((x, i, a) => a.indexOf(x) == i)
  //   indexes = [...new Set(indexes)]

  //   indexes.forEach(i => {
  //     var wodGroup = new WodGroup();
  //     var exercises = wodResponse.wodGroupsMember.filter(x => x.groupIndex == i).map(e => {


  //       return {
  //         exercise: e.exercise,
  //         modality: e.modality,
  //         units: e.units,
  //         detail: e.detail,
  //         mode: e.mode,
  //         value: e.value
  //       }
  //     });
  //     console.log("exercise", exercises)
  //     wodGroup.exercises = exercises;
  //     wodGroup.detail = wodResponse.wodGroupsMember.find(x => x.groupIndex == i).detail;
  //     wod.addGroup(wodGroup)
  //     wod.goal

  //   })
  //   return wod;
  // }

  closeWod() {
    this.wod = null;
    this.getAllWod();
  }

  getDayConfig(today): DayConfig {
    var date = new Date(today);
    return {
      date: date,
      marked: true,
      title: date.getDate().toString(),
      subTitle: "",
      cssClass: "attended"
    }
  }

  getCurrentWeek() {
    var currentDate = moment();

    var weekStart = currentDate.clone().startOf('isoWeek');
    var weekEnd = currentDate.clone().endOf('isoWeek');

    var days: string[] = [];
    console.log("wodDates", this.wodDates)

    for (var i = 0; i <= 6; i++) {
      var date = moment(weekStart).add(i, 'days').locale('es').format("dddd DD");
      console.log("date", date)
      if (this.wodDates.includes(date)) {
        console.log("si")
        days.push(date);

      }
    }
    console.log("days", days)
    return days;
  }

  getActiveDay() {
    return moment().locale('es').format("dddd DD");
  }

  viewWod(i) {
    // console.log("date",date)
    // var res = this.result.find(x => (moment(x.date,)).locale('es').format("dddd DD") == date);
    // console.log(res)
    console.log("wod seleccionado: ", this.wods[i].wod);
    this.wod = this.wods[i];
  }
}


