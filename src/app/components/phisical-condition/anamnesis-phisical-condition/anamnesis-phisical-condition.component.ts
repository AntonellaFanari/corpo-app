import { Component, OnInit } from "@angular/core";
import { identity } from "rxjs";
import { Anamnesis } from "src/app/domain/anamnesis/anamnesis";
import { AnamnesisService } from "src/app/services/anamnesis.service";
import { CustomAlertService } from "src/app/services/custom-alert.service";
import { MemberService } from "src/app/services/member.service";
import { TestService } from "src/app/services/test.service";
 
@Component({
  selector: "app-anamnesis-phisical-condition",
  templateUrl: "./anamnesis-phisical-condition.component.html",
  styleUrls: ["./anamnesis-phisical-condition.component.scss"],
})
export class AnamnesisPhisicalConditionComponent implements OnInit {
  step = 1;
  previusStep: number;
  nextStep: number;
  currentQuestion = "";
  results = false;
 
  currentlyPhysicalActivity = null;
 
  competitiveCurrentlyPhysicalActivity = null;
  sportCurrentlyPhysicalActivity = "";
  numberTrainingSessionsWeekCompetitive = 0;
  hoursTrainingSessionsWeekCompetitive = 0;
  currentlyStrengthTrainingCompetitive = null;
  numberStrengthTrainingSessionsWeekCompetitive = 0;
  strengthTrainingInThePastCompetitive = null;
  timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive = "";
 
  spreadsheetCurrentlyPhysicalActivity = null;
  numberTrainingSessionsWeekSpreadsheet = 0;
  hoursTrainingSessionsWeekSpreadsheet = 0;
  currentlyStrengthTrainingSpreadsheet = null;
  numberStrengthTrainingSessionsWeekSpreadsheet = 0;
  strengthTrainingInThePastSpreadsheet = null;
  timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet = "";
  trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
 
  recreationalAndSporadicCurrentlyPhysicalActivity = null;
  numberTrainingSessionsWeekRecreational = 0;
  hoursTrainingSessionsWeekRecreational = 0;
  currentlyStrengthTrainingRecreational = null;
  numberStrengthTrainingSessionsWeekRecreational = 0;
  strengthTrainingInThePastRecreational = null;
  timeSinceLastTrainingCurrentlyPhysicalActivityRecreational = "";
  trainingTypeRecreationalCurrentlyPhysicalActivity = null;
 
  physicalActivityInThePast = null;
 
  competitivePhysicalActivityInThePast = null;
  sportPhysicalActivityInThePast = "";
  timeSinceLastTrainingPhysicalActivityInThePastCompetitive = "";
 
  spreadsheetPhysicalActivityInThePast = null;
  timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet = "";
  trainingTypePhysicalActivityInThePastSpreadsheet = null;
 
  recreationalAndSporadicPhysicalActivityInThePast = null;
  timeSinceLastTrainingPhysicalActivityInThePastRecreational = "";
  trainingTypePhysicalActivityInThePastRecreational = null;
 
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
 
  constructor(
    private anamnesisService: AnamnesisService,
    private customAlertService: CustomAlertService,
    private testService: TestService,
    private memberService: MemberService
  ) {}
 
  ngOnInit() {
    this.evaluationExists();
 
    this.requesting = true;
  }
 
  evaluationExists() {
    this.anamnesisService.getByMemberId().subscribe(
      (response) => {
        console.log("resultados: ", response.result);
        if (response.result != null) {
          this.results = true;
          this.getLevel();
          this.getExistsTestPending();
        } else {
          this.requesting = false;
        }
      },
      (error) => {
        console.error(error);
        this.requesting = false;
      }
    );
  }
 
  getLevel() {
    this.memberService.getLevel().subscribe(
      (response) => {
        this.requesting = false;
        console.log("nivel: ", response.result);
        this.level = response.result.level;
        
        this.displayResult = true;
      },
      (error) => {
        console.error(error);
        this.requesting = false;
      }
    );
  }
 
  getExistsTestPending() {
    this.testService.getExistsTestPending().subscribe(
      (response) => {
        console.log("existe test pendiente: ", response.result);
        if (response.result != null) {
          this.levelTestPending = response.result.level;
          this.testId = response.result.id;
          this.testPending = true;
        } else {
          this.testPending = false;
        }
      },
      (error) => console.error(error)
    );
  }
 
  clearStep(step) {
    if (step == 8) {
      this.numberTrainingSessionsWeekSpreadsheet = 0;
      this.hoursTrainingSessionsWeekSpreadsheet = 0;
      this.numberStrengthTrainingSessionsWeekSpreadsheet = 0;
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
    }
    if (step == 13) {
      this.numberTrainingSessionsWeekRecreational = 0;
      this.hoursTrainingSessionsWeekRecreational = 0;
      this.numberStrengthTrainingSessionsWeekRecreational = 0;
      this.trainingTypeRecreationalCurrentlyPhysicalActivity = null;
    }
    if (step == 3) {
      this.sportCurrentlyPhysicalActivity = "";
      this.numberTrainingSessionsWeekCompetitive = 0;
      this.hoursTrainingSessionsWeekCompetitive = 0;
      this.numberStrengthTrainingSessionsWeekCompetitive = 0;
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
      this.trainingTypeRecreationalCurrentlyPhysicalActivity = null;
    }
    if (step == 19) {
      this.sportPhysicalActivityInThePast = "";
      this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive =
        "";
    }
    if (step == 21) {
      this.trainingTypePhysicalActivityInThePastSpreadsheet = null;
      this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet =
        "";
    }
    if (step == 23) {
      this.trainingTypePhysicalActivityInThePastRecreational = null;
      this.timeSinceLastTrainingPhysicalActivityInThePastRecreational =
        "";
    }
  }
 
  validate() {
    console.log("llegue validation");
    switch (this.question) {
      case "currentlyStrengthTraining-competitive":
        if (
          this.sportCurrentlyPhysicalActivity.length == 0 ||
          this.numberTrainingSessionsWeekCompetitive == 0 ||
          this.numberTrainingSessionsWeekCompetitive == null ||
          this.hoursTrainingSessionsWeekCompetitive == 0 ||
          this.hoursTrainingSessionsWeekCompetitive == null
        ) {
          if (this.sportCurrentlyPhysicalActivity.length == 0) {
            let p = document.getElementsByClassName("sport")[0];
            console.log("p sport: ", p);
            this.addValidations(p);
            this.isError = true;
          }
          if (
            this.numberTrainingSessionsWeekCompetitive == 0 ||
            this.numberTrainingSessionsWeekCompetitive == null
          ) {
            let p = document.getElementsByClassName("times")[0];
            this.addValidations(p);
            this.isError = true;
          }
          if (
            this.hoursTrainingSessionsWeekCompetitive == 0 ||
            this.hoursTrainingSessionsWeekCompetitive == null
          ) {
            let p = document.getElementsByClassName("hours")[0];
            this.addValidations(p);
            this.isError = true;
          }
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step4":
        if (
          this.numberStrengthTrainingSessionsWeekCompetitive == 0 ||
          this.numberStrengthTrainingSessionsWeekCompetitive == null
        ) {
          let p = document.getElementsByClassName("times-strength")[0];
          console.log("p times-strength: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step6":
        if (
          this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive
            .length == 0 ||
          this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive ==
            ""
        ) {
          let p = document.getElementsByClassName("time-since-last")[0];
          console.log("p time-since-last: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step11":
        if (
          this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet
            .length == 0 ||
          this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet ==
            ""
        ) {
          let p = document.getElementsByClassName("time-since-last")[1];
          console.log("p time-since-last: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step12":
        if (
          this.numberStrengthTrainingSessionsWeekSpreadsheet == 0 ||
          this.numberStrengthTrainingSessionsWeekSpreadsheet == null
        ) {
          let p = document.getElementsByClassName("times-strength")[1];
          console.log("p times-strength: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step15":
        if (
          this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational
            .length == 0 ||
          this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational ==
            ""
        ) {
          let p = document.getElementsByClassName("time-since-last")[2];
          console.log("p time-since-last: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step16":
        if (
          this.numberStrengthTrainingSessionsWeekRecreational == 0 ||
          this.numberStrengthTrainingSessionsWeekRecreational == null
        ) {
          let p = document.getElementsByClassName("times-strength")[2];
          console.log("p times-strength: ", p);
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step19":
        if (
          this.sportPhysicalActivityInThePast.length == 0 ||
          this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive
            .length == 0 ||
          this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive ==
            ""
        ) {
          if (this.sportPhysicalActivityInThePast.length == 0) {
            let p = document.getElementsByClassName("sport")[1];
            console.log("p sport: ", p);
            this.addValidations(p);
            this.isError = true;
          }
          if (
            this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive
              .length == 0 ||
            this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive ==
              ""
          ) {
            let p = document.getElementsByClassName("time-since-last")[3];
            this.addValidations(p);
            this.isError = true;
          }
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step22":
        if (
          this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet
            .length == 0 ||
          this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet ==
            ""
        ) {
          let p = document.getElementsByClassName("time-since-last")[4];
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "step24":
        if (
          this.timeSinceLastTrainingPhysicalActivityInThePastRecreational
            .length == 0 ||
          this.timeSinceLastTrainingPhysicalActivityInThePastRecreational ==
            ""
        ) {
          let p = document.getElementsByClassName("time-since-last")[5];
          this.addValidations(p);
          this.isError = true;
        } else {
          this.isError = false;
        }
        break;
 
      case "trainingTypeSpreadsheet-currentlyPhysicalActivity":
        if (
          this.numberTrainingSessionsWeekSpreadsheet == 0 ||
          this.numberTrainingSessionsWeekSpreadsheet == null ||
          this.hoursTrainingSessionsWeekSpreadsheet == 0 ||
          this.hoursTrainingSessionsWeekSpreadsheet == null
        ) {
          if (
            this.numberTrainingSessionsWeekSpreadsheet == 0 ||
            this.numberTrainingSessionsWeekSpreadsheet == null
          ) {
            let p = document.getElementsByClassName("times")[1];
            this.addValidations(p);
            this.isError = true;
          }
          if (
            this.hoursTrainingSessionsWeekSpreadsheet == 0 ||
            this.hoursTrainingSessionsWeekSpreadsheet == null
          ) {
            let p = document.getElementsByClassName("hours")[1];
            this.addValidations(p);
            this.isError = true;
          }
        } else {
          this.isError = false;
        }
        break;
 
      case "trainingTypeRecreational-currentlyPhysicalActivity":
        if (
          this.numberTrainingSessionsWeekRecreational == 0 ||
          this.numberTrainingSessionsWeekRecreational == null ||
          this.hoursTrainingSessionsWeekRecreational == 0 ||
          this.hoursTrainingSessionsWeekRecreational == null
        ) {
          if (
            this.numberTrainingSessionsWeekRecreational == 0 ||
            this.numberTrainingSessionsWeekRecreational == null
          ) {
            let p = document.getElementsByClassName("times")[2];
            this.addValidations(p);
            this.isError = true;
          }
          if (
            this.hoursTrainingSessionsWeekRecreational == 0 ||
            this.hoursTrainingSessionsWeekRecreational == null
          ) {
            let p = document.getElementsByClassName("hours")[2];
            this.addValidations(p);
            this.isError = true;
          }
        } else {
          this.isError = false;
        }
        break;
 
      default:
        this.isError = false;
    }
  }
 
  addValidations(p) {
    p.classList.remove("d-none");
    p.classList.add("validators");
  }
 
  removeValidations() {
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
    this.currentlyPhysicalActivity == "yes"
      ? (anamnesis.currentlyPhysicalActivity = true)
      : (anamnesis.currentlyPhysicalActivity = false);
    this.physicalActivityInThePast == "yes"
      ? (anamnesis.physicalActivityInThePast = true)
      : (anamnesis.physicalActivityInThePast = false);
 
    if (this.currentlyPhysicalActivity == "yes") {
      if (this.competitiveCurrentlyPhysicalActivity == "yes") {
        anamnesis.competitive = true;
        anamnesis.sport = this.sportCurrentlyPhysicalActivity;
        anamnesis.numberTrainingSessionsWeek =
          this.numberTrainingSessionsWeekCompetitive;
        anamnesis.hoursTrainingSessionsWeek =
          this.hoursTrainingSessionsWeekCompetitive;
        anamnesis.numberStrengthTrainingSessionsWeek =
          this.numberStrengthTrainingSessionsWeekCompetitive;
        anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        this.currentlyStrengthTrainingCompetitive == "yes"
          ? (anamnesis.currentlyStrengthTraining = true)
          : (anamnesis.currentlyStrengthTraining = false);
        this.strengthTrainingInThePastCompetitive == "yes"
          ? (anamnesis.strengthTrainingInThePast = true)
          : (anamnesis.strengthTrainingInThePast = false);
        this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive)
          : (anamnesis.timeSinceLastTraining = null);
      }
 
      if (this.spreadsheetCurrentlyPhysicalActivity == "yes") {
        anamnesis.constantfollowUpSpreadsheet = true;
        this.currentlyStrengthTrainingSpreadsheet == "yes"
          ? (anamnesis.currentlyStrengthTraining = true)
          : (anamnesis.currentlyStrengthTraining = false);
        this.strengthTrainingInThePastSpreadsheet == "yes"
          ? (anamnesis.strengthTrainingInThePast = true)
          : (anamnesis.strengthTrainingInThePast = false);
        this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet)
          : (anamnesis.timeSinceLastTraining = null);
        anamnesis.trainingType =
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity;
        if (
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic"
        ) {
          anamnesis.numberTrainingSessionsWeek =
            this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekSpreadsheet;
          anamnesis.numberStrengthTrainingSessionsWeek = 0;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
        if (
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength"
        ) {
          anamnesis.numberTrainingSessionsWeek = 0;
          anamnesis.hoursTrainingSessionsWeek = 0;
          anamnesis.numberStrengthTrainingSessionsWeek =
            this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursStrengthTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekSpreadsheet;
        } else {
          anamnesis.numberTrainingSessionsWeek =
            this.numberTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekSpreadsheet;
          anamnesis.numberStrengthTrainingSessionsWeek =
            this.numberStrengthTrainingSessionsWeekSpreadsheet;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
      }
 
      if (this.recreationalAndSporadicCurrentlyPhysicalActivity == "yes") {
        anamnesis.recreationalAndSporadic = true;
        this.currentlyStrengthTrainingRecreational == "yes"
          ? (anamnesis.currentlyStrengthTraining = true)
          : (anamnesis.currentlyStrengthTraining = false);
        this.strengthTrainingInThePastRecreational == "yes"
          ? (anamnesis.strengthTrainingInThePast = true)
          : (anamnesis.strengthTrainingInThePast = false);
        this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational)
          : (anamnesis.timeSinceLastTraining = null);
        anamnesis.trainingType =
          this.trainingTypeRecreationalCurrentlyPhysicalActivity;
        if (
          this.trainingTypeRecreationalCurrentlyPhysicalActivity == "aerobic"
        ) {
          anamnesis.numberTrainingSessionsWeek =
            this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekRecreational;
          anamnesis.numberStrengthTrainingSessionsWeek = 0;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
        if (
          this.trainingTypeRecreationalCurrentlyPhysicalActivity == "strength"
        ) {
          anamnesis.numberTrainingSessionsWeek = 0;
          anamnesis.hoursTrainingSessionsWeek = 0;
          anamnesis.numberStrengthTrainingSessionsWeek =
            this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursStrengthTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekRecreational;
        } else {
          anamnesis.numberTrainingSessionsWeek =
            this.numberTrainingSessionsWeekRecreational;
          anamnesis.hoursTrainingSessionsWeek =
            this.hoursTrainingSessionsWeekRecreational;
          anamnesis.numberStrengthTrainingSessionsWeek =
            this.numberStrengthTrainingSessionsWeekRecreational;
          anamnesis.hoursStrengthTrainingSessionsWeek = 0;
        }
      }
    } else {
      if (this.competitivePhysicalActivityInThePast == "yes") {
        anamnesis.competitive = true;
        anamnesis.sport = this.sportPhysicalActivityInThePast;
        this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingPhysicalActivityInThePastCompetitive)
          : (anamnesis.timeSinceLastTraining = null);
      }
 
      if (this.spreadsheetPhysicalActivityInThePast == "yes") {
        anamnesis.constantfollowUpSpreadsheet = true;
        this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet)
          : (anamnesis.timeSinceLastTraining = null);
        anamnesis.trainingType =
          this.trainingTypePhysicalActivityInThePastSpreadsheet;
      }
 
      if (this.recreationalAndSporadicPhysicalActivityInThePast == "yes") {
        anamnesis.recreationalAndSporadic = true;
        this.timeSinceLastTrainingPhysicalActivityInThePastRecreational !=
        ""
          ? (anamnesis.timeSinceLastTraining =
              this.timeSinceLastTrainingPhysicalActivityInThePastRecreational)
          : (anamnesis.timeSinceLastTraining = null);
        anamnesis.trainingType =
          this.trainingTypePhysicalActivityInThePastRecreational;
      }
    }
 
    return anamnesis;
  }
 
  completed() {
    // let anamnesis = this.createAnamnesis();
    // console.log("anamnesis: ", anamnesis);
    this.displayNext = false;
    this.customAlertService.display(
      "Gestión de Anamnesis",
      ["¿Está seguro que desea finalizar la evaluación de condición física?"],
      () => {
        this.requesting = true;
        let anamnesis = this.createAnamnesis();
        this.anamnesisService.add(anamnesis).subscribe(
          (response) => {
            this.memberId = response.result.memberId;
            this.testId = response.result.testId;
            this.testPending = true;
            this.levelTestPending = response.result.level;
            this.displayResult = true;
            if (this.displayPreview) {
              this.displayPreview = false;
            }
            this.requesting = false;
          },
          (error) => {
            console.error(error);
            this.requesting = false;
            if (error.status === 400) {
              this.displayNext = false;
              this.customAlertService.display(
                "Gestión de Anamnesis",
                error.error.errores
              );
            }
            if (error.status === 500) {
              this.displayNext = false;
              this.customAlertService.display("Gestión de Anamnesis", [
                "Hubo un problema al guardar, contacte al administrador.",
              ]);
            }else{
              this.displayNext = false;
            }
            this.displayNext = false;
          }
 
        );
      },
      true
    );
  }
 
  selectOption(question) {
    this.question = question;
    switch (this.question) {
      case "currentlyPhysicalActivity":
        this.previusSteps = [1];
        this.displayNext = true;
        this.competitiveCurrentlyPhysicalActivity = null;
        this.physicalActivityInThePast = null;
        if (this.currentlyPhysicalActivity == "yes") {
          this.nextStep = 2;
          this.previusSteps.push(this.nextStep);
        } else {
          this.nextStep = 17;
          this.previusSteps.push(this.nextStep);
        }
 
        break;
 
      case "competitive-currentlyPhysicalActivity":
        if (this.competitiveCurrentlyPhysicalActivity != null) {
          this.previusSteps = [1, 2];
          this.removeValidations();
          this.displayNext = true;
          this.spreadsheetCurrentlyPhysicalActivity = null;
          if (this.competitiveCurrentlyPhysicalActivity == "yes") {
            this.nextStep = 3;
            console.log(
              "valor de fuerza: ",
              this.currentlyStrengthTrainingCompetitive
            );
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          } else if (this.competitiveCurrentlyPhysicalActivity == "no") {
            this.nextStep = 7;
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "currentlyStrengthTraining-competitive":
        console.log("valor: ", this.currentlyStrengthTrainingCompetitive);
        if (
          this.currentlyStrengthTrainingCompetitive == "yes" ||
          this.currentlyStrengthTrainingCompetitive == "no"
        ) {
          this.removeValidations();
          this.validate();
          if (!this.isError) {
            this.displayNext = true;
            this.currentlyStrengthTrainingSpreadsheet = null;
            this.currentlyStrengthTrainingRecreational = null;
            if (this.currentlyStrengthTrainingCompetitive == "yes") {
              this.previusSteps = [1, 2, 3];
              // this.validation();
              this.nextStep = 4;
              this.previusSteps.push(this.nextStep);
              this.question = "step4";
            } else if (this.currentlyStrengthTrainingCompetitive == "no") {
              this.previusSteps = [1, 2, 3];
              // this.validation();
              this.nextStep = 5;
              this.previusSteps.push(this.nextStep);
            }
          } else {
            this.currentlyStrengthTrainingCompetitive = Math.floor(
              Math.random()
            ).toString();
            console.log("fuerza: ", this.currentlyStrengthTrainingCompetitive);
          }
        } else {
          this.currentlyStrengthTrainingCompetitive = null;
        }
        break;
 
      case "strengthTrainingInThePast-competitive":
        this.previusSteps = [1, 2, 3, 5];
        this.displayNext = true;
        this.removeValidations();
        if (this.strengthTrainingInThePastCompetitive == "yes") {
          this.nextStep = 6;
          this.previusSteps.push(this.nextStep);
        } else if (this.strengthTrainingInThePastCompetitive == "no") {
          this.timeSinceLastTrainingCurrentlyPhysicalActivityCompetitive = "";
          this.nextStep = 25;
          this.previusSteps.push(this.nextStep);
        }
 
        break;
 
      case "spreadsheet-currentlyPhysicalActivity":
        if (this.spreadsheetCurrentlyPhysicalActivity != null) {
          this.recreationalAndSporadicCurrentlyPhysicalActivity = null;
          this.previusSteps = [1, 2, 7];
          this.removeValidations();
          this.displayNext = true;
          if (this.spreadsheetCurrentlyPhysicalActivity == "yes") {
            this.nextStep = 8;
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          } else if (this.spreadsheetCurrentlyPhysicalActivity == "no") {
            this.recreationalAndSporadicCurrentlyPhysicalActivity = "yes";
            this.nextStep = 13;
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "trainingTypeSpreadsheet-currentlyPhysicalActivity":
        if (
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic" ||
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength" ||
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity ==
            "aerobic-strength"
        ) {
          this.currentlyStrengthTrainingCompetitive = null;
          this.currentlyStrengthTrainingRecreational = null;
          this.removeValidations();
          this.validate();
          if (!this.isError) {
            this.displayNext = true;
            this.previusSteps = [1, 2, 7, 8];
            this.strengthTrainingInThePastSpreadsheet = null;
            this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet = "";
            if (
              this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "aerobic"
            ) {
              this.currentlyStrengthTrainingSpreadsheet = null;
              this.nextStep = 10;
              this.previusSteps.push(this.nextStep);
            } else if (
              this.trainingTypeSpreadsheetCurrentlyPhysicalActivity ==
              "strength"
            ) {
              this.currentlyStrengthTrainingSpreadsheet = "yes";
              this.nextStep = 25;
              this.previusSteps.push(this.nextStep);
            } else if (
              this.trainingTypeSpreadsheetCurrentlyPhysicalActivity ==
              "aerobic-strength"
            ) {
              this.currentlyStrengthTrainingSpreadsheet = "yes";
              this.nextStep = 12;
              this.previusSteps.push(this.nextStep);
              this.question = "step12";
            }
          } else {
            this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = Math.floor(
              Math.random()
            ).toString();
          }
        } else {
          this.trainingTypeSpreadsheetCurrentlyPhysicalActivity = null;
        }
 
        break;
 
      case "strengthTrainingInThePast-spreadsheet":
        if (this.strengthTrainingInThePastSpreadsheet != null) {
          this.previusSteps = [1, 2, 7, 8, 10];
          this.displayNext = true;
          this.removeValidations();
          if (this.strengthTrainingInThePastSpreadsheet == "yes") {
            this.nextStep = 11;
            this.previusSteps.push(this.nextStep);
          } else if (this.strengthTrainingInThePastSpreadsheet == "no") {
            this.timeSinceLastTrainingCurrentlyPhysicalActivitySpreadsheet = "";
            this.nextStep = 25;
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "trainingTypeRecreational-currentlyPhysicalActivity":
        if (
          this.trainingTypeRecreationalCurrentlyPhysicalActivity == "aerobic" ||
          this.trainingTypeRecreationalCurrentlyPhysicalActivity ==
            "strength" ||
          this.trainingTypeRecreationalCurrentlyPhysicalActivity ==
            "aerobic-strength"
        ) {
          this.currentlyStrengthTrainingCompetitive = null;
          this.currentlyStrengthTrainingSpreadsheet = null;
          this.removeValidations();
          this.validate();
          if (!this.isError) {
            this.previusSteps = [1, 2, 7, 13];
            this.displayNext = true;
            this.strengthTrainingInThePastRecreational = null;
            this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational =
              "";
            if (
              this.trainingTypeRecreationalCurrentlyPhysicalActivity ==
              "aerobic"
            ) {
              this.currentlyStrengthTrainingRecreational = undefined;
              this.nextStep = 14;
              this.previusSteps.push(this.nextStep);
            } else if (
              this.trainingTypeRecreationalCurrentlyPhysicalActivity ==
              "strength"
            ) {
              this.currentlyStrengthTrainingRecreational = "yes";
              this.nextStep = 25;
              this.previusSteps.push(this.nextStep);
            } else if (
              this.trainingTypeRecreationalCurrentlyPhysicalActivity ==
              "aerobic-strength"
            ) {
              this.currentlyStrengthTrainingRecreational = "yes";
              this.nextStep = 16;
              this.previusSteps.push(this.nextStep);
 
              this.question = "step16";
            }
          } else {
            this.trainingTypeRecreationalCurrentlyPhysicalActivity = Math.floor(
              Math.random()
            ).toString();
          }
        } else {
          this.trainingTypeRecreationalCurrentlyPhysicalActivity = null;
        }
 
        break;
 
      case "strengthTrainingInThePast-recreational":
        if (this.strengthTrainingInThePastRecreational != null) {
          this.previusSteps = [1, 2, 7, 13, 14];
          this.removeValidations();
          this.displayNext = true;
          if (this.strengthTrainingInThePastRecreational == "yes") {
            this.nextStep = 15;
            this.previusSteps.push(this.nextStep);
          } else if (this.strengthTrainingInThePastRecreational == "no") {
            this.timeSinceLastTrainingCurrentlyPhysicalActivityRecreational =
              "";
            this.nextStep = 25;
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "physicalActivityInThePast":
        if (this.physicalActivityInThePast != null) {
          this.previusSteps = [1, 17];
          this.displayNext = true;
          this.competitivePhysicalActivityInThePast = null;
          if (this.physicalActivityInThePast == "yes") {
            this.nextStep = 18;
            this.previusSteps.push(this.nextStep);
          } else {
            this.displayNext = true;
            this.nextStep = 25;
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "competitive-physicalActivityInThePast":
        if (this.competitivePhysicalActivityInThePast != null) {
          this.previusSteps = [1, 17, 18];
          this.removeValidations();
          this.displayNext = true;
          this.spreadsheetPhysicalActivityInThePast = null;
          if (this.competitivePhysicalActivityInThePast == "yes") {
            this.nextStep = 19;
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          } else if (this.competitivePhysicalActivityInThePast == "no") {
            this.nextStep = 20;
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "spreadsheet-physicalActivityInThePast":
        if (this.spreadsheetPhysicalActivityInThePast != null) {
          this.previusSteps = [1, 17, 18, 20];
          this.displayNext = true;
          this.recreationalAndSporadicPhysicalActivityInThePast = null;
          if (this.spreadsheetPhysicalActivityInThePast == "yes") {
            this.nextStep = 21;
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          } else if (this.spreadsheetPhysicalActivityInThePast == "no") {
            this.recreationalAndSporadicPhysicalActivityInThePast = "yes";
            this.nextStep = 23;
            this.clearStep(this.nextStep);
            this.previusSteps.push(this.nextStep);
          }
        }
 
        break;
 
      case "trainingTypeSpreadsheet-physicalActivityInThePast":
        if (this.trainingTypePhysicalActivityInThePastSpreadsheet != null) {
          this.previusSteps = [1, 17, 18, 20, 21];
          this.removeValidations();
          this.timeSinceLastTrainingPhysicalActivityInThePastSpreadsheet = "";
          this.displayNext = true;
          this.nextStep = 22;
          this.previusSteps.push(this.nextStep);
        }
 
        break;
 
      case "trainingTypeRecreational-physicalActivityInThePast":
        if (this.trainingTypePhysicalActivityInThePastRecreational != null) {
          this.previusSteps = [1, 17, 18, 20, 23];
          this.removeValidations();
          this.timeSinceLastTrainingPhysicalActivityInThePastRecreational = "";
          this.displayNext = true;
          this.nextStep = 24;
          this.previusSteps.push(this.nextStep);
        }
 
        break;
 
      default:
    }
  }
 
  goToNext() {
    this.displayNext = false;
    if (
      this.step == 4 ||
      this.step == 6 ||
      this.step == 11 ||
      this.step == 12 ||
      this.step == 15 ||
      this.step == 16 ||
      this.step == 19 ||
      this.step == 22 ||
      this.step == 24
    ) {
      this.question = "step" + this.step.toString();
      this.removeValidations();
      this.validate();
      if (!this.isError) {
        if (this.step == 4) this.previusSteps = [1, 2, 3, 4, 25];
        if (this.step == 6) this.previusSteps = [1, 2, 3, 5, 6, 25];
        if (this.step == 11) this.previusSteps = [1, 2, 7, 8, 10, 11, 25];
        if (this.step == 12) this.previusSteps = [1, 2, 7, 8, 12, 25];
        if (this.step == 15) this.previusSteps = [1, 2, 7, 13, 14, 15, 25];
        if (this.step == 16) this.previusSteps = [1, 2, 7, 13, 16, 25];
        if (this.step == 19) this.previusSteps = [1, 17, 18, 19, 25];
        if (this.step == 22) this.previusSteps = [1, 17, 18, 20, 21, 22, 25];
        if (this.step == 24) this.previusSteps = [1, 17, 18, 20, 23, 24, 25];
        this.step = 25;
      }
    } else if (this.nextStep != null) {
      this.step = this.nextStep;
      this.nextStep = null;
    } else {
      let index = this.previusSteps.indexOf(this.step);
      this.step = this.previusSteps[index + 1];
    }
 
    if (
      this.step == 6 ||
      this.step == 4 ||
      this.step == 11 ||
      this.step == 12 ||
      this.step == 15 ||
      this.step == 16 ||
      this.step == 19 ||
      this.step == 22 ||
      this.step == 24 ||
      (this.step == 5 && this.strengthTrainingInThePastCompetitive == "no") ||
      (this.step == 8 &&
        this.trainingTypeSpreadsheetCurrentlyPhysicalActivity == "strength") ||
      (this.step == 10 && this.strengthTrainingInThePastSpreadsheet == "no") ||
      (this.step == 13 &&
        this.trainingTypeRecreationalCurrentlyPhysicalActivity == "strength") ||
      (this.step == 14 && this.strengthTrainingInThePastRecreational == "no")
    ) {
      this.displayNext = true;
    }
 
    if (this.step == 1 && this.currentlyPhysicalActivity != null) {
      this.displayNext = true;
    }
    if (this.step == 2 && this.competitiveCurrentlyPhysicalActivity != null) {
      this.displayNext = true;
    }
    if (this.step == 3 && this.currentlyStrengthTrainingCompetitive != null) {
      this.displayNext = true;
    }
    if (
      this.step == 5 &&
      this.strengthTrainingInThePastCompetitive != null &&
      this.strengthTrainingInThePastCompetitive != "no"
    ) {
      this.displayNext = true;
    }
    if (this.step == 7 && this.spreadsheetCurrentlyPhysicalActivity != null) {
      this.displayNext = true;
    }
    if (
      this.step == 8 &&
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity != null &&
      this.trainingTypeSpreadsheetCurrentlyPhysicalActivity != "strength"
    ) {
      this.displayNext = true;
    }
    if (
      this.step == 10 &&
      this.strengthTrainingInThePastSpreadsheet != null &&
      this.strengthTrainingInThePastSpreadsheet != "no"
    ) {
      this.displayNext = true;
    }
    if (
      this.step == 13 &&
      this.trainingTypeRecreationalCurrentlyPhysicalActivity != null &&
      this.trainingTypeRecreationalCurrentlyPhysicalActivity != "strength"
    ) {
      this.displayNext = true;
    }
    if (
      this.step == 14 &&
      this.strengthTrainingInThePastRecreational != null &&
      this.strengthTrainingInThePastRecreational != "no"
    ) {
      this.displayNext = true;
    }
    if (this.step == 17 && this.physicalActivityInThePast != null) {
      this.displayNext = true;
    }
    if (this.step == 18 && this.competitivePhysicalActivityInThePast != null) {
      this.displayNext = true;
    }
    if (this.step == 20 && this.spreadsheetPhysicalActivityInThePast != null) {
      this.displayNext = true;
    }
    if (
      this.step == 21 &&
      this.trainingTypePhysicalActivityInThePastSpreadsheet != null
    ) {
      this.displayNext = true;
    }
    if (
      this.step == 23 &&
      this.trainingTypePhysicalActivityInThePastRecreational != null
    ) {
      this.displayNext = true;
    }
  }
 
  return() {
    this.removeValidations();
    console.log("paso actual: ", this.step);
    console.log("pasos anteriores: ", this.previusSteps);
    let index = this.previusSteps.indexOf(this.step);
    this.step = this.previusSteps[index - 1];
    console.log("paso anterior: ", this.step);
    this.displayNext = true;
    this.finish = false;
  }
 
  goToPreview() {
    this.displayNext = false;
    this.displayPreview = true;
    this.anamnesis = this.createAnamnesis();
    console.log("vista previa: ", this.anamnesis);
  }
 
  goToEvaluation() {
    this.displayNext = false;
    this.displayPreview = false;
    this.removeValidations();
  }
 
  increaseUnitNumberTraining(question) {
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekCompetitive++;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekSpreadsheet++;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekRecreational++;
        break;
      default:
        break;
    }
  }
 
  dencreaseUnitNumberTraining(question) {
    console.log("llegue");
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekCompetitive--;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekSpreadsheet--;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.numberTrainingSessionsWeekRecreational--;
        break;
      default:
        break;
    }
  }
 
  increaseUnitHourTraining(question) {
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekCompetitive++;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekSpreadsheet++;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekRecreational++;
        break;
      default:
        break;
    }
  }
 
  dencreaseUnitHourTraining(question) {
    console.log("llegue");
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekCompetitive--;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekSpreadsheet--;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.hoursTrainingSessionsWeekRecreational--;
        break;
      default:
        break;
    }
  }
 
  dencreaseUnitNumberTrainingStrength(question) {
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekCompetitive--;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekSpreadsheet--;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekRecreational--;
        break;
      default:
        break;
    }
  }
 
  increaseUnitNumberTrainingStrength(question) {
    switch (question) {
      case "competitive-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekCompetitive++;
        break;
      case "spreadsheet-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekSpreadsheet++;
        break;
      case "recreational-currentlyPhysicalActivity":
        this.numberStrengthTrainingSessionsWeekRecreational++;
        break;
      default:
        break;
    }
  }
}