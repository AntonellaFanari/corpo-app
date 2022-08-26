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

  competitiveCurrentlyPhysicalActivity = "";
  sportCurrentlyPhysicalActivity = "";
  numberTrainingSessionsWeekCompetitive = 0;
  hoursTrainingSessionsWeekCompetitive = 0;
  currentlyStrengthTrainingCompetitive = "";
  numberStrengthTrainingSessionsWeekCompetitive = 0;
  strengthTrainingInThePastCompetitive = "";
  timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive: string;

  spreadsheetCurrentlyPhysicalActivity = "";
  numberTrainingSessionsWeekSpreadsheet = 0;
  hoursTrainingSessionsWeekSpreadsheet = 0;
  currentlyStrengthTrainingSpreadsheet = "";
  numberStrengthTrainingSessionsWeekSpreadsheet = 0;
  strengthTrainingInThePastSpreadsheet = "";
  timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet: string;
  trainingTypeSpreadsheetCurrentlyPhysicalActivity = "";

  recreationalAndSporadicCurrentlyPhysicalActivity = "";
  numberTrainingSessionsWeekRecreational = 0;
  hoursTrainingSessionsWeekRecreational = 0;
  currentlyStrengthTrainingRecreational = "";
  numberStrengthTrainingSessionsWeekRecreational = 0;
  strengthTrainingInThePastRecreational = "";
  timeSinceLastTrainingCurrentlyPhysicalActivityRecreational: string;
  trainingTypeRecreationalCurrentlyPhysicalActivity = "";

  physicalActivityInThePast = "";

  competitivePhysicalActivityInThePast = "";
  sportPhysicalActivityInThePast = "";
  timeSinceLastTrainingPhysicalActivityInThePastCompetitive: string;

  spreadsheetPhysicalActivityInThePast = "";
  timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet: string;
  trainingTypePhysicalActivityInThePastSpreadsheet = "";

  recreationalAndSporadicPhysicalActivityInThePast = "";
  timeSinceLastTrainingPhysicalActivityInThePastRecreational: string;
  trainingTypePhysicalActivityInThePastRecreational = "";

  finish: boolean;
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

        } else {

          this.requesting = false;
        }
      },
      error => {
        console.error(error);
        this.requesting = false;
      }
    )
  }

  getLevel() {
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

  getExistsTestPending() {
    this.testService.getExistsTestPending().subscribe(
      response => {
        console.log("existe test pendiente: ", response.result);
        if (response.result != null) {
          this.levelTestPending = response.result.level;
          this.testId = response.result.id;
          this.testPending = true;
        }
        else {
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
        this.previusSteps = [1];
        this.displayNext = false;
        if (this.currentlyPhysicalActivity == "yes") {
          this.step = 2;
          this.previusSteps.push(this.step);
        } else {
          this.step = 17;
          this.previusSteps.push(this.step);
        }
        break;

      case 'competitive-currentlyPhysicalActivity':
        this.previusSteps = [1, 2];
        this.displayNext = false;
        this.spreadsheetCurrentlyPhysicalActivity = null;
        if (this.competitiveCurrentlyPhysicalActivity == "yes") {
          this.step = 3;
          this.clearStep(this.step);
          this.previusSteps.push(this.step);
        } else if (this.competitiveCurrentlyPhysicalActivity == "no") {
          this.step = 7;
          this.previusSteps.push(this.step);
          this.finish = false;
        }
        break;

      case 'currentlyStrengthTraining-competitive':
        if(this.currentlyStrengthTrainingCompetitive != null){
          // this.validation();
          // if(!this.isError){
            // this.removeValidators();
            this.currentlyStrengthTrainingSpreadsheet = null;
            this.currentlyStrengthTrainingRecreational= null;
            if (this.currentlyStrengthTrainingCompetitive == "yes") {
              this.previusSteps = [1, 2, 3];
              // this.validation();   
              this.displayNext = false;
              this.step = 4;
              this.previusSteps.push(this.step);
              this.finish = true;
            } else if (this.currentlyStrengthTrainingCompetitive == "no") {
              this.previusSteps = [1, 2, 3];
              // this.validation();
              this.displayNext = false;
              this.step = 5;
              this.previusSteps.push(this.step);
            }
          // }else{
          //   this.currentlyStrengthTrainingCompetitive = null;
          //   console.log("fuerza: ", this.currentlyStrengthTrainingCompetitive);
          // }
        }
      
        break;

      case 'strengthTrainingInThePast-competitive':
        this.previusSteps = [1, 2, 3, 5];
        this.finish = false;
        if (this.strengthTrainingInThePastCompetitive == "yes") {
          this.step = 6;
          this.previusSteps.push(this.step);
          this.finish = true;
        } else if (this.strengthTrainingInThePastCompetitive == "no") {
          this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive = undefined;
          this.displayNext = false;
          this.finish = true;
        }
        break;

      case 'spreadsheet-currentlyPhysicalActivity':
        if (this.spreadsheetCurrentlyPhysicalActivity != null) {
          this.recreationalAndSporadicCurrentlyPhysicalActivity = null;
          this.previusSteps = [1, 2, 7];
          this.displayNext = false;
          if (this.spreadsheetCurrentlyPhysicalActivity == "yes") {
            this.step = 8;            
          this.clearStep(this.step);
            this.previusSteps.push(this.step);
          } else if (this.spreadsheetCurrentlyPhysicalActivity == "no") {
            this.recreationalAndSporadicCurrentlyPhysicalActivity = "yes";
            this.step = 13;
            this.clearStep(this.step);
            this.previusSteps.push(this.step);
          }
        }
        break;

      case 'trainingTypeSpreadsheet-currentlyPhysicalActivity':        
        console.log("tipo de entrenamiento: ", this.trainingTypeSpreadsheetCurrentlyPhysicalActivity);  
        if(this.trainingTypeSpreadsheetCurrentlyPhysicalActivity != null){
          this.currentlyStrengthTrainingCompetitive = null;
          this.currentlyStrengthTrainingRecreational = null;
          // this.validation();
          // if(!this.isError){
            this.previusSteps = [1, 2, 7, 8];
            this.displayNext = false;
            this.strengthTrainingInThePastSpreadsheet = null;
            this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet = undefined;
            if (this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic") {
              this.currentlyStrengthTrainingSpreadsheet = null;
              this.step = 10;
              this.previusSteps.push(this.step);
              this.finish = false;
            } else if (this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength") {
              this.currentlyStrengthTrainingSpreadsheet = "yes";
              this.finish = true;
            } else if (this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic-strength") {
              this.currentlyStrengthTrainingSpreadsheet = "yes";
              this.step = 12;
              this.previusSteps.push(this.step);
              this.finish = true;
            }
          // }else{
          //   this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;  
          //   console.log("tipo de entrenamiento: ", this.trainingTypeSpreadsheetCurrentlyPhysicalActivity);          
          // }
        }
   
        break;

      case 'strengthTrainingInThePast-spreadsheet':
        if (this.strengthTrainingInThePastSpreadsheet != null) {
          this.previusSteps = [1, 2, 7, 8, 10];
          this.displayNext = false;
          this.finish = false;
          if (this.strengthTrainingInThePastSpreadsheet == "yes") {
            this.step = 11;
            this.previusSteps.push(this.step);
            this.finish = true;
          } else if (this.strengthTrainingInThePastSpreadsheet == "no") {
            this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet = undefined;
            this.finish = true;
          }
        }
        break;

      case 'trainingTypeRecreational-currentlyPhysicalActivity':
        if(this.trainingTypeRecreationalCurrentlyPhysicalActivity != null){
          this.currentlyStrengthTrainingCompetitive = null;
          this.currentlyStrengthTrainingSpreadsheet = null;
          this.previusSteps = [1, 2, 7, 13];
          this.displayNext = false;
          this.strengthTrainingInThePastRecreational = null;
          this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational = undefined;
          if (this.trainingTypeRecreationalCurrentlyPhysicalActivity == "aerobic") {
            this.currentlyStrengthTrainingRecreational = undefined;
            this.step = 14;
            this.previusSteps.push(this.step);
            this.finish = false;
          } else if (this.trainingTypeRecreationalCurrentlyPhysicalActivity == "strength") {
            this.currentlyStrengthTrainingRecreational = "yes";
            this.finish = true;
          } else if (this.trainingTypeRecreationalCurrentlyPhysicalActivity == "aerobic-strength") {
            this.currentlyStrengthTrainingRecreational = "yes";
            this.step = 16;
            this.previusSteps.push(this.step);
            this.finish = true;
          }
        }
        break;

      case 'strengthTrainingInThePast-recreational':
        if (this.strengthTrainingInThePastRecreational != null) {
          this.previusSteps = [1, 2, 7, 13, 14];
          this.displayNext = false;
          this.finish = false;
          if (this.strengthTrainingInThePastRecreational == "yes") {
            this.step = 15;
            this.previusSteps.push(this.step);
            this.finish = true;
          } else if (this.strengthTrainingInThePastRecreational == "no") {
            this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational = undefined;
            this.finish = true;
          }
        }

        break;

      case 'physicalActivityInThePast':
        this.previusSteps = [1, 17];
        this.displayNext = false;
        if (this.physicalActivityInThePast == "yes") {
          this.step = 18;
          this.previusSteps.push(this.step);
        } else {
          this.displayNext = false;
          this.finish = true;
        }
        break;

      case 'competitive-physicalActivityInThePast':
        this.previusSteps = [1, 17, 18];
        this.displayNext = false;
        this.spreadsheetPhysicalActivityInThePast = null;
        if (this.competitivePhysicalActivityInThePast == "yes") {
          this.step = 19;
          this.clearStep(this.step);
          this.previusSteps.push(this.step);
          this.finish = true;
        } else if (this.competitivePhysicalActivityInThePast == "no") {
          this.step = 20;
          this.previusSteps.push(this.step);
        }
        break;

      case 'spreadsheet-physicalActivityInThePast':
        if(this.spreadsheetPhysicalActivityInThePast != null){
          this.previusSteps = [1, 17, 18, 20];
          this.displayNext = false;
          this.recreationalAndSporadicPhysicalActivityInThePast = null;
          if (this.spreadsheetPhysicalActivityInThePast == "yes") {
            this.step = 21;
            this.clearStep(this.step);
            this.previusSteps.push(this.step);
          } else if (this.spreadsheetPhysicalActivityInThePast == "no") {
            this.recreationalAndSporadicPhysicalActivityInThePast = "yes";
            this.step = 23;
            this.clearStep(this.step)
            this.previusSteps.push(this.step);
          }
        }
        break;

      case 'trainingTypeSpreadsheet-physicalActivityInThePast':
        if(this.trainingTypePhysicalActivityInThePastSpreadsheet != null){
          this.previusSteps = [1, 17, 18, 20, 21];
          this.displayNext = false;
          this.step = 22;
          this.previusSteps.push(this.step);
          this.finish = true;
        }
        break;

      case 'trainingTypeRecreational-physicalActivityInThePast':
        if(this.trainingTypePhysicalActivityInThePastRecreational != null){
          this.previusSteps = [1, 17, 18, 20, 23];
          this.displayNext = false;
          this.step = 24;
          this.previusSteps.push(this.step);
          this.finish = true;
        }
        break;

      default:
    }
  }

  clearStep(step) {
    this.displayNext = false;
    if (this.step == 8) {
      this.numberTrainingSessionsWeekSpreadsheet = 0;
      this.hoursTrainingSessionsWeekSpreadsheet = 0;
      this.numberStrengthTrainingSessionsWeekSpreadsheet = 0;
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
    }if(this.step == 13){
      this.numberTrainingSessionsWeekRecreational = 0;
      this.hoursTrainingSessionsWeekRecreational = 0;
      this.numberStrengthTrainingSessionsWeekRecreational = 0;
      this.trainingTypeRecreationalCurrentlyPhysicalActivity = null;
    }if(this.step == 3){
      this.sportCurrentlyPhysicalActivity = "";
      this.numberTrainingSessionsWeekCompetitive = 0;
      this.hoursTrainingSessionsWeekCompetitive = 0;
      this.numberStrengthTrainingSessionsWeekCompetitive = 0
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
      this.trainingTypeRecreationalCurrentlyPhysicalActivity = null;
    }if(this.step == 19){
      this.sportPhysicalActivityInThePast = "";
      this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive = undefined;
    }
    if(this.step == 21){
      this.trainingTypePhysicalActivityInThePastSpreadsheet = null;
      this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet = undefined;
    }if(this.step == 23){
      this.trainingTypePhysicalActivityInThePastRecreational = null;
      this.timeSinceLastTrainingPhysicalActivityInThePastRecreational = undefined;
    }
  }

  // validation() {
  //   console.log("llegue validation");
  //   switch (this.question) {
  //     case 'currentlyStrengthTraining-competitive':
  //       if (this.sportCurrentlyPhysicalActivity.length == 0) {
  //         let p = document.getElementsByClassName('sport')[0];
  //         console.log("p sport: ", p);
  //         this.addValidators(p)
  //         this.isError = true;
  //       } if (this.numberTrainingSessionsWeekCompetitive == 0 || this.numberTrainingSessionsWeekCompetitive == null) {
  //         let p = document.getElementsByClassName('times')[0];
  //         this.addValidators(p)
  //         this.isError = true;
  //       } if (this.hoursTrainingSessionsWeekCompetitive == 0 || this.hoursTrainingSessionsWeekCompetitive == null) {
  //         let p = document.getElementsByClassName('hours')[0];
  //         this.addValidators(p);
  //         this.isError = true;
  //       } else {
  //         this.isError = false;
  //       }
  //       break;

  //       case 'trainingTypeSpreadsheet-currentlyPhysicalActivity':
  //        if (this.numberTrainingSessionsWeekSpreadsheet == 0 || this.numberTrainingSessionsWeekSpreadsheet == null) {
  //           let p = document.getElementsByClassName('times ')[1];
  //           this.addValidators(p)
  //           this.isError = true;
  //         } if (this.hoursTrainingSessionsWeekSpreadsheet == 0 || this.hoursTrainingSessionsWeekSpreadsheet == null) {
  //           let p = document.getElementsByClassName('hours')[1];
  //           this.addValidators(p);
  //           this.isError = true;
  //         } else {
  //           this.isError = false;
  //         }
  //         break;

  //     // case 'numberTimesStrength':
  //     //   if (this.numberStrengthTrainingSessionsWeek == 0) {
  //     //     let p = document.getElementsByClassName("timesStrength")[0];
  //     //     this.addValidators(p);
  //     //     this.isError = true;
  //     //   } else {
  //     //     this.isError = false;
  //     //   }
  //     //   break;
  //     // case 'timeSinceLastTraining':
  //     //   if (this.timeSinceLastTraining.length == 0) {
  //     //     let p = document.getElementsByClassName("timeSinceLast")[0];
  //     //     this.addValidators(p);
  //     //     this.isError = true;
  //     //   } else {
  //     //     this.isError = false;
  //     //   }
  //       default: this.isError = false;

  //   }
  // }

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

  createAnamnesis() {
    let anamnesis = new Anamnesis();
    (this.currentlyPhysicalActivity == "yes") ? anamnesis.currentlyPhysicalActivity = true : anamnesis.currentlyPhysicalActivity = false;
    (this.physicalActivityInThePast == "yes") ? anamnesis.physicalActivityInThePast = true : anamnesis.physicalActivityInThePast = false;

    if (this.currentlyPhysicalActivity == "yes") {
      if (this.competitiveCurrentlyPhysicalActivity == "yes") {
        anamnesis.competitive = true;
        anamnesis.sport = this.sportCurrentlyPhysicalActivity;
        anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeekCompetitive;
        anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeekCompetitive
        anamnesis.numberStrengthTrainingSessionsWeek = this.numberStrengthTrainingSessionsWeekCompetitive;
        anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        (this.currentlyStrengthTrainingCompetitive == "yes") ? anamnesis.currentlyStrengthTraining = true : anamnesis.currentlyStrengthTraining = false;
        (this.strengthTrainingInThePastCompetitive == "yes") ? anamnesis.strengthTrainingInThePast = true : anamnesis.strengthTrainingInThePast = false;
        (this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive : anamnesis.timeSinceLastTraining = null;
      }

      if (this.spreadsheetCurrentlyPhysicalActivity == "yes") {
        anamnesis.constantfollowUpSpreadsheet = true;
        (this.currentlyStrengthTrainingSpreadsheet == "yes") ? anamnesis.currentlyStrengthTraining = true : anamnesis.currentlyStrengthTraining = false;
        (this.strengthTrainingInThePastSpreadsheet == "yes") ? anamnesis.strengthTrainingInThePast = true : anamnesis.strengthTrainingInThePast = false;
        (this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet : anamnesis.timeSinceLastTraining = null;
        anamnesis.trainingType = this.trainingTypeSpreadsheetCurrentlyPhysicalActivity;
        if (this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic") {
          anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeekSpreadsheet;
          anamnesis.numberStrengthTrainingSessionsWeek = 0;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        } if (this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength") {
          anamnesis.numberTrainingSessionsWeek = 0;
          anamnesis.hoursTrainingSessionsWeek = 0;
          anamnesis.numberStrengthTrainingSessionsWeek = this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursStrengthTrainingSessionsWeek = this.hoursTrainingSessionsWeekSpreadsheet;
        } else {
          anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeekSpreadsheet;
          anamnesis.numberStrengthTrainingSessionsWeek = this.numberStrengthTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
      }

      if (this.recreationalAndSporadicCurrentlyPhysicalActivity == "yes") {
        anamnesis.recreationalAndSporadic = true;
        (this.currentlyStrengthTrainingRecreational == "yes") ? anamnesis.currentlyStrengthTraining = true : anamnesis.currentlyStrengthTraining = false;
        (this.strengthTrainingInThePastRecreational == "yes") ? anamnesis.strengthTrainingInThePast = true : anamnesis.strengthTrainingInThePast = false;
        (this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational : anamnesis.timeSinceLastTraining = null;
        anamnesis.trainingType = this.trainingTypeRecreationalCurrentlyPhysicalActivity;
        if (this.trainingTypeRecreationalCurrentlyPhysicalActivity == "aerobic") {
          anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeekRecreational;
          anamnesis.numberStrengthTrainingSessionsWeek = 0;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        } if (this.trainingTypeRecreationalCurrentlyPhysicalActivity == "strength") {
          anamnesis.numberTrainingSessionsWeek = 0;
          anamnesis.hoursTrainingSessionsWeek = 0;
          anamnesis.numberStrengthTrainingSessionsWeek = this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursStrengthTrainingSessionsWeek = this.hoursTrainingSessionsWeekRecreational;
        } else {
          anamnesis.numberTrainingSessionsWeek = this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursTrainingSessionsWeek = this.hoursTrainingSessionsWeekRecreational;
          anamnesis.numberStrengthTrainingSessionsWeek = this.numberStrengthTrainingSessionsWeekRecreational;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
      }
    } else {
      if (this.competitivePhysicalActivityInThePast == "yes") {
        anamnesis.competitive = true;
        anamnesis.sport = this.sportPhysicalActivityInThePast;
        (this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive : anamnesis.timeSinceLastTraining = null;
      }

      if (this.spreadsheetPhysicalActivityInThePast == "yes") {
        anamnesis.constantfollowUpSpreadsheet = true;
        (this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet : anamnesis.timeSinceLastTraining = null;
        anamnesis.trainingType = this.trainingTypePhysicalActivityInThePastSpreadsheet;
      }

      if (this.recreationalAndSporadicPhysicalActivityInThePast == "yes") {
        anamnesis.recreationalAndSporadic = true;
        (this.timeSinceLastTrainingPhysicalActivityInThePastRecreational != undefined) ? anamnesis.timeSinceLastTraining = this.timeSinceLastTrainingPhysicalActivityInThePastRecreational : anamnesis.timeSinceLastTraining = null;
        anamnesis.trainingType = this.trainingTypePhysicalActivityInThePastRecreational;
      }
    }

    return anamnesis;
  }

  completed() {
    // let anamnesis = this.createAnamnesis();
    // this.anamnesisService.add(anamnesis).subscribe(
    //   response => {
    //     this.memberId = response.result.memberId;
    //     this.testId = response.result.testId;
    //     this.testPending = true;
    //     this.levelTestPending = response.result.level;
    //     this.displayResult = true;
    //     if (this.displayPreview) {
    //       this.displayPreview = false;
    //     }
    //   }, error => {
    //     console.error(error);
    //     if (error.status === 400) {
    //       this.customAlertService.display("Gestión de Anamnesis", error.error.errores);
    //     }
    //     if (error.status === 500) {
    //       this.customAlertService.display("Gestión de Anamnesis", ["Hubo un problema al guardar, contacte al administrador."]);
    //     }
    //   })
  }


  goToNext() {
    let index = this.previusSteps.indexOf(this.step);
    this.step = this.previusSteps[index + 1];
    if (this.step == 6 || this.step == 4 || this.step == 11 || this.step == 12 ||
      this.step == 15 || this.step == 16 || this.step == 19 || this.step == 22 ||
      this.step == 24 || (this.step == 5 && this.strengthTrainingInThePastCompetitive == "no")
      || (this.step == 8 && this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength")
      || (this.step == 10 && this.strengthTrainingInThePastSpreadsheet == "no")
      || (this.step == 13 && this.trainingTypeRecreationalCurrentlyPhysicalActivity == "strength")
      || (this.step == 14 && this.strengthTrainingInThePastRecreational == "no")) {
      this.finish = true;
      this.displayNext = false;
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

    this.displayPreview = true;
    this.anamnesis = this.createAnamnesis();
    console.log("anamnesis: ", this.anamnesis);

  }

  goToEvaluation() {
    this.displayPreview = false;
    this.removeValidators();
  }

}
