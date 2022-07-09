import { TestExerciseMember } from './test-exercise-member';

export class TestMember {
    id: number;
    name: string;
    memberId: number;
    status: StatusTest;
    testExercisesMember: TestExerciseMember[];
}


export enum StatusTest {
    executed = 1,
    pending = 2
  }