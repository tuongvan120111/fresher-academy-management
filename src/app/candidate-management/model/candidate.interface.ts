export interface ICandidate<E, F> {
  employeeId: string;
  account: string;
  name: string;
  dob: E;
  gender: GENDER;
  university: string;
  faculty: string | number;
  phone: string;
  email: string;
  status: F;
}

export type GENDER = "male" | "female";

export interface IFirebaseDate {
  seconds: number;
  nanoseconds: number;
}

export enum STATUS {
  PASS,
  FAILED,
}

