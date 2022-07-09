export class TestExerciseMember {
    id: number;
    name: string;
    testType: TestType;
    video: string;
    minutes: number;
    seconds: number;
    exerciseFmsId?: number
  }
  
  
  export enum TestType {
    HeartRate = 1,
    Repetition = 2,
    video = 3
  }