import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestHeartRateExercise } from 'src/app/domain/test/test-heart-rate-exercise';
import { TestRepetitionExercise } from 'src/app/domain/test/test-repetition-exercise';
import { TestVideoExercise } from 'src/app/domain/test/test-video-exercise';
import { TestExerciseMember } from 'src/app/domain/test/test-exercise-member';
import { TestService } from 'src/app/services/test.service';
import { ExerciseFms } from 'src/app/domain/test/exercise-fms';
import { StatusTest } from 'src/app/domain/test/test-member';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  id: number;
  testId: number;
  exercise: TestExerciseMember;
  time = "";
  initialHeartRate = 0;
  finalHeartRate = 0;
  repetitions = 0;
  resultExercise: {};
  type: number;
  fileVideo: File;
  fileImg: File;
  urlsVideo = [];
  urlsImg = [];
  requestingExercise: boolean;
  displayEvaluation: boolean;
  exerciseFms: ExerciseFms;
  urlBase: string;
  rate: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor(private testService: TestService,
    private route: ActivatedRoute,
    private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params['id']);
      this.type = parseInt(params['type']);
      this.testId = parseInt(params['testId']);
      this.getExerciseById();
      this.urlBase = this.testService.url;
    });
    // this.getExerciseById();
  }

  ngOnInit() {
  }

  getExerciseById() {
    this.requestingExercise = true;
    this.testService.getExerciseById(this.id).subscribe(
      response => {
        this.requestingExercise = false;
        console.log("Ejercicio: ", response);
        this.exercise = response.result;
      },
      error => console.error(error)
    )

  }

  createResultTestHeartRateExercise() {
    let exerciseResult = new TestHeartRateExercise();
    exerciseResult.initialHeartRate = this.initialHeartRate;
    exerciseResult.finalHeartRate = this.finalHeartRate;
    exerciseResult.time = this.time;
    exerciseResult.testMemberId = this.testId;
    exerciseResult.testExerciseMemberId = this.id;
    return exerciseResult;
  }

  createResultTestRepetitonExercise() {
    let exerciseResult = new TestRepetitionExercise();
    exerciseResult.repetitions = this.repetitions;
    exerciseResult.initialHeartRate = this.initialHeartRate;
    exerciseResult.finalHeartRate = this.finalHeartRate;
    exerciseResult.testMemberId = this.testId;
    exerciseResult.testExerciseMemberId = this.id;
    return exerciseResult;
  }

  createResultTestVideoExercise() {
    let exerciseResult = new TestVideoExercise();
    exerciseResult.fileVideo = this.fileVideo;
    exerciseResult.fileImg = this.fileImg;
    exerciseResult.rate = this.rate;
    exerciseResult.testMemberId = this.testId;
    exerciseResult.testExerciseMemberId = this.id;
    console.log("resultado video: ", exerciseResult);
    return exerciseResult;
  }

  save() {
    switch (this.type) {
      case 1:
        this.saveType1();
        break;
      case 2:
        this.saveType2();
        break;
      case 3:
        this.saveType3();
        break;
      default:
    }
  }

  saveType1() {
    this.testService.addResultTestHeartRateExercise(this.createResultTestHeartRateExercise()).subscribe(
      response => {
        console.log("resultado guardado tipo 1");
        this.getStatusTest();
      },
      error => console.error(error)
    )
  }

  saveType2() {
    this.testService.addResultTestRepetitionExercise(this.createResultTestRepetitonExercise()).subscribe(
      response => {
        console.log("resultado guardado tipo 2");
        this.getStatusTest();
      },
      error => console.error(error)
    )
  }

  saveType3() {
    this.testService.addResultTestVideoExercise(this.createResultTestVideoExercise()).subscribe(
      response => {
        console.log("resultado guardado tipo 3");
        this.getStatusTest();
      },
      error => console.error(error)
    )
  }

  getStatusTest(){
    this.testService.getById(this.testId).subscribe(
      response => {
        if(response.result.status == StatusTest.executed){
          window.location.href = '/mis-tests';
        }else{
          window.location.href = '/test?id=' + this.testId;
        }
      },
      error => console.error(error)
    )
  }

  public onFileSelectionVideo(event: any): void {
    this.urlsVideo = [];
    const files: FileList = event.target.files;
    this.fileVideo = <File>files.item(0);
    console.log(this.fileVideo);

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urlsVideo.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    console.log(this.urlsVideo);

  }

  public onFileSelectionImg(event: any): void {
    this.urlsImg = [];
    const files: FileList = event.target.files;
    this.fileImg = <File>files.item(0);
    console.log(this.fileImg);

    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urlsImg.push(event.target.result);
        }
        reader.readAsDataURL(event.target.files[i]);
      }
    }
    console.log(this.urlsImg);

  }

  viewEvaluation() {
    this.displayEvaluation = true;
    this.getExerciseFms(this.exercise.exerciseFmsId);
  }

  hideEvaluation() {
    this.displayEvaluation = false;
  }


  getExerciseFms(id) {
    this.testService.getExerciseFms(id).subscribe(
      response => {
        console.log("ejercicio fms: ", response.result);
        this.exerciseFms = response.result;
      },
      error => console.error(error)
    )
  }

  selectRate(rate, j) {
    console.log("calificación: ", rate);
    console.log("indece: ", j);
    this.rate = rate;
    var divsRates = document.getElementsByClassName("div-rate");
    for (let i = 0; i < divsRates.length; i++) {
      const div = divsRates[i];
      if (i == j) {
        div.classList.remove("rate-deselected");
        div.classList.add("rate-selected");
      } else {
        div.classList.remove("rate-selected");
        div.classList.add("rate-deselected");
      }

    }
  }

}
