import { Exercise } from "./exercise";
import { Modality } from "./modality";

export class ExerciseItem {
    exercise: Exercise;
    modality: Modality;
    units: string;
    mode?: string;
    value?: string;
}

