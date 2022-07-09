import { TestHeartRateExercise } from './test-heart-rate-exercise';
import { TestRepetitionExercise } from './test-repetition-exercise';
import { TestVideoExercise } from './test-video-exercise';

export class TestResult{
    id: number;
    name: string;
    testType: TestType;
    video: string;
    minutes: number;
    seconds: number
    testHeartRateExercise?: TestHeartRateExercise;
    testRepetitionExercise?: TestRepetitionExercise;
    testVideoExercise?: TestVideoExercise;

    
}
export enum TestType {
    HeartRate = 1,
    Repetition = 2,
    video = 3
  }