import { Component, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalendarComponentOptions, CalendarModalOptions, DayConfig } from 'ion2-calendar';
import * as moment from 'moment';
import { Wod, WodGroup } from 'src/app/domain/workout/wod';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
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
  displayWod = false;
  displayRest: boolean;
  rest = 0;
  wodId: number;

  constructor(private wodService: WodService,
    private route: ActivatedRoute,
    private customAlertService: CustomAlertService) {
    this.route.queryParams.subscribe(params => {
      let display = params['displayWod']
      this.displayWod = (display == 'false') ? false : true;
      console.log("display wod: ", this.displayWod);

      this.getAllWod();
    })
  }

  ngOnInit() {

  }


  getAllWod() {
    this.wods = [];
    this.requesting = true;
    this.wodService.getAll().subscribe((data: any) => {
      this.requesting = false;
      if (data.result != null) {
        this.result = data.result;
        console.log("wod recibidos: ", this.result);
        var wodMembers = data.result;
        wodMembers.forEach(w => {
          this.wods.push({
            wod: this.getWodMember(w),
            date: "",
            wodNumber: w.wodNumber,
            rest: w.rest
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
    console.log("wod a transformar: ", wodMember);
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
    wod.attended = wodMember.attended;

    indexes.forEach(i => {
      var wodGroup = new WodGroup();
      var exercises = wodMember.wodGroupsMember.filter(x => x.groupIndex == i).map(e => {
        return {
          id: e.id,
          exercise: e.exercise,
          modality: e.modality.name,
          unitType: e.unitType,
          units: e.units,
          intensityType: e.intensityType,
          intensityValue: e.intensityValue,
          timeWork: e.timeWork,
          timeRest: e.timeRest
        }
      });
      wodGroup.exercises = exercises;
      wodGroup.id = wodMember.wodGroupsMember.find(x => x.groupIndex == i).id;
      wodGroup.groupIndex = i,
        wodGroup.detail = wodMember.wodGroupsMember.find(x => x.groupIndex == i).detail;
      wodGroup.rounds = wodMember.wodGroupsMember.find(x => x.groupIndex == i).rounds;
      wodGroup.series = wodMember.wodGroupsMember.find(x => x.groupIndex == i).series;
      wodGroup.modality = wodMember.wodGroupsMember.find(x => x.groupIndex == i).modality.name;
      wodGroup.modalityId = wodMember.wodGroupsMember.find(x => x.groupIndex == i).modality.id;
      wodGroup.staggeredType = wodMember.wodGroupsMember.find(x => x.groupIndex == i).staggeredType;
      wodGroup.staggeredValue = wodMember.wodGroupsMember.find(x => x.groupIndex == i).staggeredValue;
      wodGroup.time = wodMember.wodGroupsMember.find(x => x.groupIndex == i).time;
      wodGroup.pauseBetweenRounds = wodMember.wodGroupsMember.find(x => x.groupIndex == i).pauseBetweenRounds;
      wodGroup.pauseBetweenExercises = wodMember.wodGroupsMember.find(x => x.groupIndex == i).pauseBetweenExercises;
      wod.addGroup(wodGroup)
      // wod.wodNumber = wodMember.wodNumber;

    })
    console.log("wod transformado: ", wod);
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
    this.displayWod = false;
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
    this.displayWod = true;
  }

  restDisplay(id) {
    this.displayRest = true;
    this.wodId = id;
  }

  cancelRest() {
    this.displayRest = false;
  }

  saveRest() {
    this.wodService.updateRest(this.wodId, this.rest).subscribe(
      response => {
        console.log("hs de descanso guardadas");
        this.displayRest = false;
        this.getAllWod();
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

  increaseUnit(){
    this.rest ++;
  }

  dencreaseUnit(){
    if(this.rest > 0){

      this.rest --;
    }
  }

}


