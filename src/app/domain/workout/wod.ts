import { Exercise } from "./exercise";
import { Modality } from './modality';
import { IntensityType } from './periodization';


export class WodGroup {
  id: number;
  groupIndex: string;
  exercises: ExerciseItem[] = [];
  detail: string;
  rounds?: number;
  series?: number;
  modality: string;
  modalityId: number;
  time?: number;
  staggeredType: string;
  staggeredValue?: number;
  pauseBetweenRounds?: number;
  pauseBetweenExercises?: number;

  constructor(index = null, detail: string = null, modality: string = null,
    modalityId: number = null, rounds: number = null, series: number = null, time: number = null,
    staggeredType: string = null, staggeredValue: number = null,
    pauseBetweenRounds: number = null, pauseBetweenExercises: number = null) {
    this.groupIndex = index ? index : this.createGuid();
    this.detail = detail;
    this.modality = modality;
    this.modalityId = modalityId,
    this.rounds = rounds;
    this.series = series;
    this.time = time;
    this.staggeredType = staggeredType;
    this.staggeredValue = staggeredValue;
    this.pauseBetweenRounds = pauseBetweenRounds;
    this.pauseBetweenExercises = pauseBetweenExercises;
  }

  addExercise(exercise: ExerciseItem) {
    this.exercises.push(exercise);
  }

  createGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}

export class ExerciseItem {
  id?: number;
  exercise: Exercise;
  modality: Modality;
  unitType: string;
  units: string;
  intensityType: string;
  intensityValue?: number;
  timeWork?: number;
  timeRest?: number;
}

export class Wod {
  id: number;
  name: string;
  goal: string;
  wodGroups: WodGroup[] = [];
  mode: string;
  intensityType: IntensityType;
  intensity: number;
  rate?: number;
  weekNumber?: number;
  wodNumber?: number;
  rest?: number;
  attended: string;

  addGroup(wodGroup: WodGroup) {

    this.wodGroups.push(wodGroup);
  }
}

export interface IWod {
  wodGroups: WodGroup[];
  addGroup(wodGroup: WodGroup);
}

export class WodTemplate {
  id: number;
  name: string;
  goal: string;
  intensityType: IntensityType;
  intensity: number;
  wodGroups: wodTemplateGroup[] = [];

  constructor(wod: Wod) {
    this.id = wod.id;
    wod.wodGroups.forEach(g => {
      g.exercises.forEach(e => {
        this.wodGroups.push({
          detail: g.detail,
          rounds: g.rounds,
          series: g.series,
          time: g.time,
          groupIndex: g.groupIndex,
          exerciseId: e.exercise.id,
          modalityId: g.modalityId,
          unitType: e.unitType,
          units: e.units,
          intensityType: e.intensityType,
          intensityValue: e.intensityValue,
          staggeredType: g.staggeredType,
          staggeredValue: g.staggeredValue,
          pauseBetweenRounds: g.pauseBetweenRounds,
          pauseBetweenExercises: g.pauseBetweenRounds,
          timeWork: e.timeWork,
          timeRest: e.timeRest
        })
      })
    })
  }
}


export class wodTemplateResponse {
  name: string;
  goal?: string;
  intensityType: IntensityType;
  intensity: number;
  wodGroups: wodTemplateGroupResponse[] = [];
  id: number;
  getWod(): Wod {
    var wod = new Wod();
    var indexes = this.wodGroups.map(x => x.groupIndex);
    indexes.filter((x, i, a) => a.indexOf(x) == i)


    indexes.forEach(i => {
      var wodGroup = new WodGroup();
      var exercises = this.wodGroups.filter(x => x.groupIndex == i).map(e => {
        return {
          exercise: e.exercise,
          modality: e.modality,
          unitType: e.unitType,
          units: e.units,
          intensityType: e.intensityType,
          intensityValue: e.intensityValue,
          timeWork: e.timeWork,
          timeRest: e.timeRest
        }
      });
      wodGroup.exercises = exercises;
      wod.addGroup(wodGroup)

    })
    return {
      wodGroups: this.wodGroups.map(g => new WodGroup())
    } as Wod;
  }


}

export class wodTemplateGroup {
  exerciseId: number;
  modalityId: number;
  unitType: string;
  units: string;
  groupIndex: string;
  detail: string;
  rounds?: number;
  series?: number;
  time?: number;
  intensityType?: string;
  intensityValue?: number;
  staggeredType?: string;
  staggeredValue?: number;
  pauseBetweenRounds?: number;
  pauseBetweenExercises?: number;
  timeWork?: number;
  timeRest?: number;
}

export class wodTemplateGroupResponse {
  exercise: Exercise;
  modality: Modality;
  rounds?: number;
  series?: number;
  time?: number;
  unitType: string;
  units: string;
  groupIndex: string;
  detail: string;
  intensityType?: string;
  intensityValue?: number;
  staggeredType?: string;
  staggeredValue?: number;
  pauseBetweenRounds?: number;
  pauseBetweenExercises?: number;
  timeWork?: number;
  timeRest?: number;
}

