import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultsWodGroupMember } from 'src/app/domain/workout/results-wod-group-member';
import { Wod, WodGroup } from 'src/app/domain/workout/wod';
import { ResultsWodGroupMemberService } from 'src/app/services/results-wod-group-member.service';
import { WodService } from 'src/app/services/wod.service';

@Component({
  selector: 'app-wod-results',
  templateUrl: './wod-results.component.html',
  styleUrls: ['./wod-results.component.scss'],
})
export class WodResultsComponent implements OnInit {
  wodId: number;
  wod: Wod;
  results: ResultsWodGroupMember[] = [];
  requesting = false;

  constructor(private resultsWodGroupService: ResultsWodGroupMemberService,
    private route: ActivatedRoute,
    private wodService: WodService) {
    this.route.queryParams.subscribe(params => {
      this.wodId = parseInt(params['id'])
      console.log("id: ", this.wodId);
    });
  }

  ngOnInit() {
    this.getAllWod();
  }




  getAllWod() {    
    this.requesting = true;
    this.wodService.getById(this.wodId).subscribe((data: any) => {
      if (data.result != null) {
        console.log("wod recibido: ", data.result);
        this.wod = this.getWodMember(data.result);
        console.log("wod transformado: ", this.wod);
      }
      this.getAll();

    }, error => {
      console.error(error);
      this.requesting = false;
    })
  }

  getAll() {
    this.resultsWodGroupService.getByWodId(this.wodId).subscribe(
      (response) => {
        this.requesting = false;
        console.log("resultados: ", response.result);
        this.results = response.result;
      },
      (error) => {
        console.error(error);
        this.requesting = false;
      }
    );
  }


  getWodMember(wodMember): Wod {
    console.log("wod a transformar: ", wodMember);
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
    wod.wodNumber = wodMember.wodNumber;

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

  getGoals(goals) {
    return goals.split("-");
  }

  getResultGroup(groupIndex, data) {

    let result = this.results.find(x => x.groupIndex == groupIndex);

    if(result){
      switch (data) {
        case 'rounds':
          return result.rounds;
          break;
        case 'repetitions':
          return result.repetitions;
          break;
        case 'time':
          return result.time;
          break;
        default:
      }
    }

  }

  getResultExercise(groupIndex, exerciseId, data, round) {
    let result = this.results.find(x => x.groupIndex == groupIndex);

    if(result){
      let resultExercise = result.resultsWodGroupMemberExercise.find(x => x.wodGroupMemberId == exerciseId);
      switch (data) {
        case 'rounds':
          return resultExercise.rounds;
          break;
        case 'amount':
          return resultExercise.amount;
          break;
        case 'time':
          return this.getTimeByRound(resultExercise.times, round);
          break;
        default:
      }
    }
    
  }

  getRounds(rounds) {
    let roundList = [];
    for (let i = 0; i < rounds; i++) {
      roundList.push(i + 1);
    }
    return roundList;
  }

  getTimeByRound(times, round) {
    return times[round - 1];
  }
}
