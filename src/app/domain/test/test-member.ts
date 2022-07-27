import { TestExerciseMember } from './test-exercise-member';

export class TestMember {
    id: number;
    date: string;
    name: string;
    memberId: number;
    status: StatusTest;
    testExercisesMember: TestExerciseMember[];
    level: number;
}


export enum StatusTest {
    executed = 1,
    pending = 2
  }