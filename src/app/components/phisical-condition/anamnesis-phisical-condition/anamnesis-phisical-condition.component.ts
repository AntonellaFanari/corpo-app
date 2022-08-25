import { Component, OnInit } from '@angular/core';
import { identity } from 'rxjs';
import { Anamnesis } from 'src/app/domain/anamnesis/anamnesis';
import { AnamnesisService } from 'src/app/services/anamnesis.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';
import { MemberService } from 'src/app/services/member.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-anamnesis-phisical-condition',
  templateUrl: './anamnesis-phisical-condition.component.html',
  styleUrls: ['./anamnesis-phisical-condition.component.scss'],
})
export class AnamnesisPhisicalConditionComponent implements OnInit {
  step = 1;
  previusStep: number;
  nextStep = 2;
  currentQuestion = "";
  currentlyPhysicalActivity = "";
  competitive = "";
  sport = "";
  numberTrainingSessionsWeek = 0;
  hoursTrainingSessionsWeek = 0;
  currentlyStrengthTraining = "";
  numberStrengthTrainingSessionsWeek = 0;
  strengthTrainingInThePast = "";
  constantfollowUpSpreadsheet = "";
  timeSinceLastTraining: string;
  recreationalAndSporadic = "";
  physicalActivityInThePast = "";
  trainingType = "";
  finish: boolean;
  hoursStrengthTrainingSessionsWeek = 0;
  previusSteps = [1];
  level: number;
  memberId: number;
  displayResult: boolean;
  anamnesis: Anamnesis;
  displayPreview: boolean;
  displayNext: boolean;
  cuurrenthlyStrengthChecked: boolean;
  isError: boolean;
  question = "";
  testId: number;
  testPending: boolean;
  levelTestPending: number;
  requesting: boolean;

  constructor(private anamnesisService: AnamnesisService,
    private customAlertService: CustomAlertService,
    private testService: TestService,
    private memberService: MemberService) { }

  ngOnInit() {
    this.evaluationExists();
    
    this.requesting = true;
  }

  evaluationExists() {
    this.anamnesisService.getByMemberId().subscribe(
      response => {
        console.log("resultados: ", response.result);
        if (response.result != null) {
          this.displayResult = true;          
          this.getLevel();
          this.getExistsTestPending();
      
        }else{
          
        this.requesting = false;
        }
      },
      error => {
        console.error(error);
        this.requesting = false;
      }
    )
  }

  getLevel(){
    this.memberService.getLevel().subscribe(
      response => {
        this.requesting = false;
        console.log("nivel: ", response.result);
        this.level = response.result.level;
      },
      error => {
        console.error(error);
        this.requesting = false;
      }
    )
  }

  getExistsTestPending(){
    this.testService.getExistsTestPending().subscribe(
      response => {
        console.log("existe test pendiente: ", response.result);
        if(response.result != null) {
          this.levelTestPending = response.result.level;
          this.testId = response.result.id;
          this.testPending = true;
        }
        else{
         this.testPending = false;
        }
      },
      error => console.error(error)
    )
  }


  selectOption(question) {
    this.question = question;
    switch (question) {
      case 'currentlyPhysicalActivity':
        this.competitive = "";
        this.constantfollowUpSpreadsheet = "";
        this.physicalActivityInThePast = "";
        this.previusSteps = [1];
        this.displayNext = false;
        this.clearQuestions();
        if (this.currentlyPhysicalActivity == "yes") {
          this.step = 2;
          this.previusSteps.push(this.step);
        } else {
          this.step = 9;
          this.previusSteps.push(this.step);
        }
        break;

      case 'competitive':
        this.previusSteps = [1, 2];
        this.displayNext = false;
        this.clearQuestions();
        this.clearQuestionsStrength();
        console.log("actividad fisica actual: ", this.currentlyPhysicalActivity);
        if (this.currentlyPhysicalActivity == "yes") {
          if (this.competitive == "yes") {
            this.step = 3;
            this.previusSteps.push(this.step);
          } else if(this.competitive == "no"){
            this.constantfollowUpSpreadsheet = "";
            this.step = 7;
            this.previusSteps.push(this.step);
            this.finish = false;
          }
        } else {
          if (this.competitive == "yes") {
            this.step = 10;
            this.previusSteps.push(this.step);
            this.finish = true;
          } else if(this.competitive == "no") {
            this.step = 7;
            this.previusSteps.push(this.step);
          }
        }
        break;

      case 'currentlyStrengthTraining':
        if (this.currentlyStrengthTraining == "yes" && this.trainingType == "")
         { this.previusSteps = [1, 2, 3];  
          this.validation();        
          if(!this.isError){
            this.displayNext = false;
            this.step = 4;
            this.previusSteps.push(this.step);
            this.finish = true;
          } 
         }else if(this.currentlyStrengthTraining == "no" && this.trainingType == ""){
          this.previusSteps = [1, 2, 3];           
          this.validation();
          if(!this.isError){
            this.displayNext = false;
            this.step = 5;
            this.previusSteps.push(this.step);
          }
         }else if(this.currentlyStrengthTraining != "" && this.trainingType != "")
         {
          this.validation();
          if(!this.isError){
            this.displayNext = false;
            this.finish = false;
          }
         };
       
        if (this.isError) {
          this.currentlyStrengthTraining = "yy";
          console.log("llegue");
        } else {
          this.removeValidators();
          if (this.currentlyStrengthTraining == "yes" && this.trainingType =="aerobic-strength") {
            this.step = 4;
            this.question = "numberTimesStrength";
            this.previusSteps.push(this.step);
            this.finish = true;

          } else if(this.currentlyStrengthTraining == "yes" && this.trainingType =="aerobic"){
            this.step = 5;
            this.previusSteps.push(this.step);
          }
        }
        break;

      case 'strengthTrainingInThePast':
        if (this.strengthTrainingInThePast != "") {
          if (this.competitive == "yes") {
            this.previusSteps = [1, 2, 3, 5];
            this.displayNext = false
          } else {
            this.previusSteps = [1, 2, 7, 8, 5];
            this.displayNext = false
          };

          if (this.strengthTrainingInThePast == "yes") {
            this.step = 6;
            this.question = "timeSinceLastTraining";
            this.previusSteps.push(this.step);
            this.displayNext = false;
            this.finish = true
          } else {
            this.timeSinceLastTraining = "";
            this.displayNext = false;
            this.finish = true
          };
        }
       
        break;

      case 'constantfollowUpSpreadsheet':
        this.previusSteps = [1, 2, 7];
        this.displayNext = false;
        if (this.currentlyPhysicalActivity == "yes") {
          this.clearQuestions();
          if (this.constantfollowUpSpreadsheet == "yes") {
            this.step = 8;
            this.previusSteps.push(this.step);
          } else if(this.constantfollowUpSpreadsheet == "no") {
            this.previusSteps = [1, 2, 7];
            this.displayNext = false;
            this.recreationalAndSporadic = "yes";
            this.step = 8;
            this.previusSteps.push(this.step);
          }
        } else {
          this.clearQuestions();
          if (this.constantfollowUpSpreadsheet == "yes") {
            this.step = 11;
            this.previusSteps.push(this.step);
            this.displayNext = false;
          } else if(this.constantfollowUpSpreadsheet == "no"){
            this.recreationalAndSporadic = "yes"
            this.step = 11;
            this.previusSteps.push(this.step);
            this.displayNext = false;
          }
        }
        break;

      case 'physicalActivityInThePast':
        if (this.currentlyStrengthTraining != "") { this.previusSteps = [1]; this.displayNext = false };
        if (this.physicalActivityInThePast == "yes") {
          this.step = 2;
          this.previusSteps.push(this.step);
        } else if(this.physicalActivityInThePast == "no"){
          this.displayNext = false;
          this.finish = true;
        }
        break;

      default:
    }
  }

  validation() {
    console.log("llegue validation");
    switch (this.question) {
      case 'currentlyStrengthTraining':
        if (this.sport.length == 0) {
          let p = document.getElementsByClassName('sport')[0];
          console.log("p sport: ", p);
          this.addValidators(p)
          this.isError = true;
        } if (this.numberTrainingSessionsWeek == 0 || this.numberTrainingSessionsWeek == null) {
          let p = document.getElementsByClassName('times ')[0];
          this.addValidators(p)
          this.isError = true;
        } if (this.hoursTrainingSessionsWeek == 0 || this.hoursTrainingSessionsWeek == null) {
          let p = document.getElementsByClassName('hours')[0];
          this.addValidators(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;

        case 'constantfollowUpSpreadsheet':
         if (this.numberTrainingSessionsWeek == 0 || this.numberTrainingSessionsWeek == null) {
            let p = document.getElementsByClassName('times ')[1];
            this.addValidators(p)
            this.isError = true;
          } if (this.hoursTrainingSessionsWeek == 0 || this.hoursTrainingSessionsWeek == null) {
            let p = document.getElementsByClassName('hours')[1];
            this.addValidators(p);
            this.isError = true;
          } else {
            this.isError = false;
          }
          break;
        
      case 'numberTimesStrength':
        if (this.numberStrengthTrainingSessionsWeek == 0) {
          let p = document.getElementsByClassName("timesStrength")[0];
          this.addValidators(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
      case 'timeSinceLastTraining':
        if (this.timeSinceLastTraining.length == 0) {
          let p = document.getElementsByClassName("timeSinceLast")[0];
          this.addValidators(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        // default: this.isError = false;

    }
  }

  addValidators(p) {
    p.classList.remove("d-none");
    p.classList.add("validators");
  }

  removeValidators() {
    let p = document.getElementsByTagName("p");
    console.log("colección p: ", p);
    for (let i = 0; i < p.length; i++) {
      const x = p[i];
      x.classList.remove("validators");
      x.classList.add("d-none");
    }
  }

  clearQuestions() {
    this.sport = "";
    this.numberTrainingSessionsWeek = 0;
    this.numberStrengthTrainingSessionsWeek = 0;
    this.hoursStrengthTrainingSessionsWeek = 0;
    this.hoursTrainingSessionsWeek = 0;
    this.timeSinceLastTraining = "";
    this.trainingType = "";
  }

  clearQuestionsStrength() {
    this.numberStrengthTrainingSessionsWeek = 0;
    this.hoursStrengthTrainingSessionsWeek = 0;
    this.timeSinceLastTraining = "";
    this.currentlyStrengthTraining = "";
    this.strengthTrainingInThePast = "";
  }

  selectTrainingType() {
    console.log("tipo: ", this.trainingType);
    if (this.trainingType != "") {
      this.validation();
      if(!this.isError){
        this.previusSteps = [];
        if (this.currentlyPhysicalActivity == "yes") {
          this.previusSteps = [1, 2, 7, 8];
          if (this.trainingType == "aerobic") {
            this.clearQuestionsStrength();
            this.step = 5;
            this.previusSteps.push(this.step);
            this.currentlyStrengthTraining = "no";
          } else {
            this.clearQuestionsStrength();
            if (this.trainingType == "strength") {          
              this.displayNext = false;
              this.finish = true;
            } else {
              this.step = 4;
              this.previusSteps.push(this.step);
              this.displayNext = false;
              this.finish = true;
            }
            this.currentlyStrengthTraining = "yes";
          }
        } else {
          this.previusSteps = [1, 9, 2, 7, 11];
          this.clearQuestionsStrength();
          this.step = 6;
          this.previusSteps.push(this.step);
          this.finish = true;
          this.displayNext = false;
        }
      } else {
        this.trainingType = "yy";
      }    

    }else{
      this.finish = false;
    }
  }

  createAnamnesis() {
    let anamnesis = new Anamnesis();
    (this.currentlyPhysicalActivity == "yes") ? anamnesis.currentlyPhysicalActivity = true : anamnesis.currentlyPhysicalActivity = false;
    (this.physicalActivityInThePast == "yes") ? anamnesis.physicalActivityInThePast = true : anamnesis.physicalActivityInThePast = false;
    (this.competitive == "yes") ? anamnesis.competitive = true : anamnesis.competitive = false;
    (this.constantfollowUpSpreadsheet == "yes") ? anamnesis.constantfollowUpSpreadsheet = true : anamnesis.constantfollowUpSpreadsheet = false;
    (this.recreationalAndSporadic == "yes") ? anamnesis.recreationalAndSporadic = true : anamnesis.recreationalAndSporadic = false;
    anamnesis.sport = this.sport;
    if (this.trainingType == "aerobic") {
      anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeek;
      anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeek;
    } if (this.trainingType == "strength") {
      anamnesis.numberTrainingSessionsWeek = 0;
      anamnesis.hoursTrainingSessionsWeek = 0;
      anamnesis.numberStrengthTrainingSessionsWeek = this.numberTrainingSessionsWeek;
      anamnesis.hoursStrengthTrainingSessionsWeek = this.hoursTrainingSessionsWeek;
    } else {
      anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeek;
      anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeek;
      anamnesis.numberStrengthTrainingSessionsWeek = this.numberStrengthTrainingSessionsWeek;
      (this.hoursStrengthTrainingSessionsWeek != undefined) ? anamnesis.hoursStrengthTrainingSessionsWeek = this.hoursStrengthTrainingSessionsWeek : anamnesis.hoursStrengthTrainingSessionsWeek = 0;
    }
    (this.currentlyStrengthTraining == "yes") ? anamnesis.currentlyStrengthTraining = true : anamnesis.currentlyStrengthTraining = false;
    (this.strengthTrainingInThePast == "yes") ? anamnesis.strengthTrainingInThePast = true : anamnesis.strengthTrainingInThePast = false;
    (this.timeSinceLastTraining != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTraining : anamnesis.timeSinceLastTraining = null;

    anamnesis.timeSinceLastTraining = this.timeSinceLastTraining;
    anamnesis.trainingType = this.trainingType;
    return anamnesis;
  }

  completed() {
    let anamnesis = this.createAnamnesis();
    this.anamnesisService.add(anamnesis).subscribe(
      response => {
        this.memberId = response.result.memberId;
        this.testId = response.result.testId;
        this.testPending = true;
        this.levelTestPending = response.result.level;
        this.displayResult = true;
        if (this.displayPreview) {
          this.displayPreview = false;
        }
      }, error => {
        console.error(error);
        if (error.status === 400) {
          this.customAlertService.display("Gestión de Anamnesis", error.error.errores);
        }
        if (error.status === 500) {
          this.customAlertService.display("Gestión de Anamnesis", ["Hubo un problema al guardar, contacte al administrador."]);
        }
      })
  }


  goToNext() {
    this.validation();
    if(!this.isError){
      let index = this.previusSteps.indexOf(this.step);
      this.step = this.previusSteps[index + 1];
      if (this.step == 6 || this.step == 4 || this.step == 10 || (this.step == 5 && this.strengthTrainingInThePast == "no") || (this.step == 8 && this.currentlyStrengthTraining == "yes" && this.trainingType =="strength")) {
        this.finish = true;
        this.displayNext = false;
      }else if((this.step == 3 && (this.currentlyStrengthTraining == ""  || this.strengthTrainingInThePast == "")) || (this.step == 8  && this.trainingType == "")){
        this.finish = false;
        this.displayNext = false;
      }
      this.removeValidators();
    }
   

  }

  return() {
    console.log("paso actual: ", this.step);
    console.log("pasos anteriores: ", this.previusSteps);
    let index = this.previusSteps.indexOf(this.step);
    this.step = this.previusSteps[index - 1];
    console.log("paso anterior: ", this.step);
    this.displayNext = true;
    this.finish = false;
  }

  goToPreview() {

    this.validation();
    if (!this.isError) {

      this.displayPreview = true;
      this.anamnesis = this.createAnamnesis();
    }
  }

  goToEvaluation() {
    this.displayPreview = false;
    this.removeValidators();
  }

}
