import { Component, OnInit } from '@angular/core';
import { identity } from 'rxjs';
import { Anamnesis } from 'src/app/domain/anamnesis/anamnesis';
import { AnamnesisService } from 'src/app/services/anamnesis.service';
import { CustomAlertService } from 'src/app/services/custom-alert.service';

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

  constructor(private anamnesisService: AnamnesisService,
    private customAlertService: CustomAlertService) { }

  ngOnInit() {
    this.evaluationExists();
  }

  evaluationExists() {
    this.anamnesisService.getByMemberId().subscribe(
      response => {
        console.log("resultados: ", response.result);
        if (response.result != null) {
          this.level = response.result.level;
          this.displayResult = true;
        }
      },
      error => console.error(error)
    )
  }


  selectOption(question, value) {
    this.question = question;
    switch (question) {
      case 'currentlyPhysicalActivity':
        this.competitive = "";
        this.constantfollowUpSpreadsheet = "";
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
          } else {
            this.step = 7;
            this.previusSteps.push(this.step);
            this.finish = false;
          }
        } else {
          if (this.competitive == "yes") {
            this.step = 10;
            this.previusSteps.push(this.step);
            this.finish = true;
          } else {
            this.step = 7;
            this.previusSteps.push(this.step);
          }
        }
        break;

      case 'currentlyStrengthTraining':
        if (this.currentlyStrengthTraining != "") { this.previusSteps = [1, 2, 3]; this.displayNext = false };
        this.validation();
        if (this.isError) {
          this.currentlyStrengthTraining = "yy";
          console.log("llegue");
        } else {
          this.removeValidators();
          if (this.currentlyStrengthTraining == "yes") {
            this.step = 4;
            this.question = "numberTimesStrength";
            this.previusSteps.push(this.step);
            this.finish = true;

          } else {
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
          } else {
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
          } else {
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
        } else {
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
        } if (this.numberTrainingSessionsWeek == 0) {
          let p = document.getElementsByClassName('times ')[0];
          this.addValidators(p)
          this.isError = true;
        } if (this.hoursTrainingSessionsWeek == 0) {
          let p = document.getElementsByClassName('hours')[0];
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
    this.strengthTrainingInThePast = "";
  }

  selectTrainingType(value) {
    console.log("tipo: ", value);
    this.trainingType = value
    if (value != "") {
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
        this.level = response.result.level;
        this.memberId = response.result.memberId;
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
          this.customAlertService.display("Gestión de Anamnesis", ["Hubo un problema al guardar."]);
        }
      })
  }


  goToNext() {
    let index = this.previusSteps.indexOf(this.step);
    this.step = this.previusSteps[index + 1];
    if (this.step == 6 || this.step == 4 || this.step == 10 || (this.step == 5 && this.strengthTrainingInThePast == "no")) {
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
