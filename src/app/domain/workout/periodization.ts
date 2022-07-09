export class Periodization {
    id: number;
    memberId: number;
    month: number;
    year: number;
    periodizationWeeks: PeriodizationWeek[] = [];
    goal?: string;
}

export class PeriodizationWeek {
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


    constructor(week: Week) {
        if (week) {
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
        }
    }
}


export class Week {
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
}

export enum IntensityType {
    PSE = 1,
    PFM = 2
  }
