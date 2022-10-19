import { CANDIDATE_TYPE_RESULT } from "../utils/candidate.const";
import { IFirebaseDate } from "./candidate.interface";

export interface IResult<T> {
  id: string;
  Date: T;
  employeeId: string;
  languageValuator: string;
  languagePoint: number;
  technicalValuator: string;
  technicalPoint: number;
  time: T;
  type: CANDIDATE_TYPE_RESULT;
  result: string;
}

export interface IInterviewResult<T>
  extends Pick<IResult<T>, "Date" | "time" | "result" | "id" | "employeeId"> {
  interview: string;
  comment: string;
}

export const TEST_STATUS = {
  pass: "Test - Pass",
  fail: "Test - Fail",
};
