export type SemesterQuery = {
  startYear?: number;
}

export type Semester = {
  id: number;
  startYear: number;
  endYear: number;
  semester: number;
  startAt: Date;
  endAt: Date;
}

export type SemesterDetail = Semester & {
  isCurrent: boolean;
  isPast: boolean;
  registerStartAt?: Date;
  registerEndAt?: Date;
}
