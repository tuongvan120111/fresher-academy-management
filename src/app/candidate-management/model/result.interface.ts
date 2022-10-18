import { CANDIDATE_TYPE_RESULT } from "../utils/candidate.const";

export interface IResult<T> {
  id: string;
  Date: T;
  employeeId: string;
  languageValuator: string;
  languagePoint: number;
  technicalValuator: string;
  technicalPoint: number;
  time: T,
  type: CANDIDATE_TYPE_RESULT;
  result: string;
}

export const TEST_STATUS = {
  pass: 'Test - Pass',
  fail: 'Test - Fail',
}