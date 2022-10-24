import { ResultsWodGroupMemberExercise } from "./results-wod-group-member-exercise";

export class ResultsWodGroupMember{
    groupIndex: string;
    wodMemberId: number;
    modality: string;
    time: number;
    rounds: number;
    repetitions: number;
    resultsWodGroupMemberExercise: ResultsWodGroupMemberExercise[];
}