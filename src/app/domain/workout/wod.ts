import { Exercise } from "./exercise";
import { Modality } from './modality';
import { IntensityType } from './periodization';


export class WodGroup {
  groupIndex: string;
  exercises: ExerciseItem[] = [];
  detail: string;
  mode?: string;
  value?: number

  constructor(index = null, detail: string = null) {
    this.groupIndex = index ? index : this.createGuid();
    this.detail = detail;
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
  exercise: Exercise;
  modality: Modality;
  units: string;
  mode?: string;
  value?: number;
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
          groupIndex: g.groupIndex,
          exerciseId: e.exercise.id,
          modalityId: e.modality.id,
          units: e.units,
          mode: e.mode,
          value: e.value
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
          units: e.units,
          mode: e.mode,
          value: e.value
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
  units: string;
  groupIndex: string;
  detail: string;
  mode?: string;
  value?: number
}

export class wodTemplateGroupResponse {
  exercise: Exercise;
  modality: Modality;
  units: string;
  groupIndex: string;
  detail: string;
  mode?: string;
  value?: number
}

