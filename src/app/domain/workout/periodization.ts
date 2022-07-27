export class Periodization {
    id: number;
    memberId: number;
    month: number;
    year: number;
    periodizationWeeks: PeriodizationWeek[] = [];
    goal?: string;
}

export class PeriodizationWeek {
    id: number;
    weekNumber: string;
    m: string;
    s: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    goal: string;
    planned: string;
    periodizationId: number;
    volume: string;
    trainingSystem: string;
    intensityType: IntensityType;
    intensity: number;


    constructor(week: Week) {
        if (week) {
            this.id = week.id;
            this.goal = week.goal;
            this.weekNumber = week.weekNumber;
            this.m = (week.m) ? week.m.replace("%", "") : "0";
            this.s = (week.s) ? week.s.replace("%", "") : "0";
            this.monday = week.monday;
            this.tuesday = week.tuesday;
            this.wednesday = week.wednesday;
            this.thursday = week.thursday;
            this.friday = week.friday;
            this.saturday = week.saturday;
            this.sunday = week.sunday;
            this.volume = week.volume;
            this.trainingSystem = week.trainingSystem;
            this.intensityType = week.intensityType;
            this.intensity = week.intensity;
        }
    }
}


export class Week {
    id: number;
    weekNumber?: string;
    m?: string;
    s?: string;
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
    goal?: string;
    volume: string;
    trainingSystem: string;
    intensityType: IntensityType;
    intensity: number;

}

export enum IntensityType {
    PSE = 1,
    PFM = 2
}
