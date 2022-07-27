import { StatusTest } from './test-member';

export class TestExerciseMember {
    id: number;
    name: string;
    testType: TestType;
    video: string;
    minutes: number;
    seconds: number;
    exerciseFmsId?: number;
    status: StatusTest;
  }
  
  
  export enum TestType {
    HeartRate = 1,
    Repetition = 2,
    video = 3
  }