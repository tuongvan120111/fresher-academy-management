export interface ICandidate<E, F> {
  id?: string;
  employeeId: string;
  account: string;
  name: string;
  dob: E;
  gender: GENDER;
  university: string;
  faculty: string;
  phone: string;
  email: string;
  status: F;
  skill: string;
  language: string;
  level: string;
  graduateYear: E;
  channel: string;
  site: string;
  history: any;
  applicationDate: E;
  note: string;
}

export type GENDER = "male" | "female";

export interface IFirebaseDate {
  seconds: number;
  nanoseconds: number;
}

export enum STATUS {
  INTERVIEW_PASS,
  INTERVIEW_FAILED,
  NEW,
  TEST_PASS,
  TEST_FAILED
}

export const STATUS_ARRAY = ["interview - pass", "interview - failed", "new", "test - pass", "test - failed"]

