import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { ResultsWodGroupMember } from 'src/app/domain/workout/results-wod-group-member';
import { ResultsWodGroupMemberExercise } from 'src/app/domain/workout/results-wod-group-member-exercise';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { ResultsWodGroupMemberService } from 'src/app/services/results-wod-group-member.service';
import { WodService } from 'src/app/services/wod.service';
import { PeriodizationService } from '../../../services/periodization.service';
import { StopwatchComponent } from '../../stopwatch/stopwatch.component';

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
  time: number;
  rounds: number;
  repetitions: number;
  displayStopwatch = false;
  stopwatchTime: number;
  wodGroupId: number;
  groupIndex: string;
  exerciseId: number;
  resultsWodGroup: ResultsWodGroupMember[] = [];
  resultsWodGroupExercise: ResultsWodGroupMemberExercise[] = [];
  countdownTime: number;
  @ViewChild(StopwatchComponent, { static: false }) stopWatch: StopwatchComponent;
  timeIndex: number;
  countdown = false;
  requesting = false;
  // @ViewChild( StopwatchComponent, {static: false}) stopwatchComponent: StopwatchComponent;

  constructor(private wodService: WodService,
    private customAlertService: CustomAlertService,
    private router: Router,
    public modalController: ModalController,
    private resultsWodGroupService: ResultsWodGroupMemberService) { }

  ngOnInit() {




    // this.createResultsWodGroup();

  }

  createResultsWodGroup() {
    this.wod.wod.wodGroups.forEach(x => {
      let result = new ResultsWodGroupMember();
      result.groupIndex = x.groupIndex;
      result.wodMemberId = this.wod.wod.id;
      result.modality = x.modality;
      result.time = 0;
      result.rounds = 0;
      result.repetitions = 0;
      result.resultsWodGroupMemberExercise = [];
      this.resultsWodGroupExercise.forEach(y => {
        if (y.groupIndex == x.groupIndex) {
          result.resultsWodGroupMemberExercise.push(y);
        }
      });
      this.resultsWodGroup.push(result);
    });

    console.log("resultados por bloque: ", this.resultsWodGroup);
  }

  createResultsWodGroupExercise() {
    for (let i = 0; i < this.wod.wod.wodGroups.length; i++) {
      const group = this.wod.wod.wodGroups[i];
      for (let j = 0; j < group.exercises.length; j++) {
        const exercise = group.exercises[j];
        console.log("exercise: ", exercise)
        var result = new ResultsWodGroupMemberExercise();
        result.exerciseId = exercise.id;
        result.wodGroupMemberId = exercise.id;
        result.groupIndex = group.groupIndex;
        result.times = [];
        result.rounds = 0;
        result.amount = 0;
        this.resultsWodGroupExercise.push(result);
      }

    };

    this.createResultsWodGroup();
    console.log("resultados por ejercicio: ", this.resultsWodGroupExercise);

  }

  ngOnChanges(changes: SimpleChanges) {
    console.log("wod recibido:", this.wod);
    if (this.wod) {
      this.createResultsWodGroupExercise();
    }
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

  restDisplay() {
    this.displayRest = true;
  }

  cancelRest() {
    this.displayRest = false;
  }

  save() {
    this.requesting = true;
    console.log("resultados por grupo: ", this.resultsWodGroup);
    console.log("resultados por ejercicios: ", this.resultsWodGroupExercise);
    this.resultsWodGroupService.add(this.resultsWodGroup).subscribe(
      response => {
        this.router.navigate(['/workout-rating'], { queryParams: { id: this.wod.wod.id } })
      },
      error => this.requesting = false
    )
  }

  saveRest() {
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

  getResultsTime(result, exerciseId, groupIndex) {
    let resultsExercise = this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId);
    resultsExercise.times = [];
    result.times.forEach(x => {
      resultsExercise.times.push(x.time);
    });
    let resultGroup = this.resultsWodGroup.find(x => x.groupIndex == groupIndex);
    let timeGroup = resultGroup.time;
    resultGroup.time = timeGroup - result.registeredTime + result.time;
    this.getTimeGroup(groupIndex);
  }

  getResultsAmrap(result, exerciseId, groupIndex) {
    if (result.type == 'repetitions') {
      this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId).amount = parseInt(result.units);
    } else {
      this.resultsWodGroup.find(x => x.groupIndex == groupIndex).rounds = parseInt(result.units);
    }
    console.log("ejercicio: ", this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId));
    console.log("grupo: ", this.resultsWodGroup.find(x => x.groupIndex == groupIndex));
  }

  getTimeGroup(groupIndex) {
    return this.resultsWodGroup.find(x => x.groupIndex == groupIndex).time;
  }

  getRepetitionsGroup(groupIndex) {
    return this.resultsWodGroup.find(x => x.groupIndex == groupIndex).repetitions;
  }

  getResultsStaggered(result, groupIndex) {
    this.resultsWodGroup.find(x => x.groupIndex == groupIndex).time = parseInt(result);
    console.log("grupo: ", this.resultsWodGroup.find(x => x.groupIndex == groupIndex))
  }

  getResultsTimers(result, exerciseId, groupIndex) {
    let resultGroup = this.resultsWodGroup.find(x => x.groupIndex == groupIndex);
    if (result.operation == '++') {
      this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId).amount++;
      resultGroup.repetitions++;
      this.getRepetitionsGroup(groupIndex);
    } else if (result.operation == '--') {
      this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId).amount--;
      resultGroup.repetitions--;
      this.getRepetitionsGroup(groupIndex);
    } else {
      let resultsExercise = this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId);
      resultGroup.repetitions = resultGroup.repetitions - resultsExercise.amount + parseInt(result.units);
      resultsExercise.amount = parseInt(result.units);
      this.getRepetitionsGroup(groupIndex);
    }
    console.log("ejercicio: ", this.resultsWodGroupExercise.find(x => x.exerciseId == exerciseId));
    console.log("grupo: ", this.resultsWodGroup.find(x => x.groupIndex == groupIndex))

  }

  getResultsEmom(result, groupIndex) {
    this.resultsWodGroup.find(x => x.groupIndex == groupIndex).rounds = parseInt(result);
    console.log("grupo: ", this.resultsWodGroup.find(x => x.groupIndex == groupIndex))
  }

}
