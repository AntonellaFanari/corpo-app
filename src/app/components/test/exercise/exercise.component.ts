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
  minutes = 0;
  seconds = 0;
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
  displayEvaluation = false;
  exerciseFms: ExerciseFms;
  urlBase: string;
  rate: number;
  hours: number;
  selectedRate: boolean;

  constructor(private testService: TestService,
    private route: ActivatedRoute,
    private router: Router) {
      
    this.displayEvaluation = false;
    this.route.queryParams.subscribe(params => {
      this.id = parseInt(params['id']);
      this.type = parseInt(params['type']);
      this.testId = parseInt(params['testId']);
      this.requestingExercise = true;
      this.exercise = null;
      this.resultExercise = null;
      this.getExerciseById();
    });
  }

  ngOnInit() {
    this.requestingExercise = true;
    this.getExerciseById();
    this.urlBase = this.testService.url;

  }


  ionViewWillEnter() {
    
    this.displayEvaluation = false;
    this.requestingExercise = true;
    this.getExerciseById();
    this.urlBase = this.testService.url;
  }

  getExerciseById() {
    this.displayEvaluation = false;
    this.requestingExercise = true;
    this.testService.getExerciseById(this.id).subscribe(
      response => {
        console.log("Ejercicio: ", response);
        this.exercise = response.result;
        this.requestingExercise = false;
      },
      error => this.requestingExercise = false
    )

  }

  createResultTestHeartRateExercise() {
    let exerciseResult = new TestHeartRateExercise();
    exerciseResult.initialHeartRate = this.initialHeartRate;
    exerciseResult.finalHeartRate = this.finalHeartRate;
    exerciseResult.minutes = this.minutes;
    exerciseResult.seconds = this.seconds;
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
    this.requestingExercise = true;
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
      error => this.requestingExercise = false
    )
  }

  saveType2() {
    this.testService.addResultTestRepetitionExercise(this.createResultTestRepetitonExercise()).subscribe(
      response => {
        console.log("resultado guardado tipo 2");
        this.getStatusTest();
      },
      error => this.requestingExercise = false
    )
  }

  saveType3() {
    this.testService.addResultTestVideoExercise(this.createResultTestVideoExercise()).subscribe(
      response => {
        console.log("resultado guardado tipo 3");
        this.getStatusTest();
      },
      error => this.requestingExercise = false
    )
  }

  getStatusTest() {
    this.testService.getById(this.testId).subscribe(
      response => {
        if (response.result.status == StatusTest.executed) {
          this.router.navigate(['/mis-tests']);
        } else {
          this.router.navigate(['/test'], { queryParams: { id: this.testId } });
        }
        this.requestingExercise = false;
      },
      error => this.requestingExercise = false
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
    this.requestingExercise = true;
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
        this.requestingExercise = false;
      },
      error => this.requestingExercise = false
    )
  }

  selectRate(rate, j) {
    this.selectedRate = true;
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


  dencreaseUnit(type) {
    switch (type) {
      case 'minutes':
        if (this.minutes > 0) {
          this.minutes--;
        }
        break;
      case 'seconds':
        if (this.seconds > 0) {
          this.seconds--;
        }
        break;
      case 'initialHeartRate':
        if (this.initialHeartRate > 0) {
          this.initialHeartRate--;
        }
        break;
      case 'finalHeartRate':
        if (this.finalHeartRate > 0) {
          this.finalHeartRate--;
        }
        break;
      case 'repetitions':
        if (this.repetitions > 0) {
          this.repetitions--;
        }
        break;
      default:
        break;
    }

  }

  increaseUnit(type) {
    switch (type) {
      case 'minutes':
        this.minutes++;
        break;
      case 'seconds':
        this.seconds++;
        break;
      case 'initialHeartRate':
        this.initialHeartRate++;
        break;
      case 'finalHeartRate':
        this.finalHeartRate++;
        break;
        case 'repetitions':
        this.repetitions++;
        break;
      default:
        break;
    }
  }

}
