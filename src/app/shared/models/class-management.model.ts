export interface ClassModel {
  id?: string;

  general: ClassGeneral;
  detail: ClassDetail;

  budget: Array<ClassBudget>;
  audit: Array<ClassAudit>;

  createdDate: Date | number;
  updatedDate: Date | number;

  budgetTotal: number;
  idNumber: any;
}

export interface LocationModel {
  id: string;
  name?: string;
  acronym?: string;
}

export interface ClassAdminModel {
  id: string;
  account?: string;
  email?: string;
}

export interface TrainerModel {
  id: string;
  account?: string;
  email?: string;
}

export interface ClassFilter {
  location: string;
  name: string;
  status: string;
  fromDate: Date;
  toDate: Date;
}
interface ClassGeneral {
  classCode: string; // Site_FR_Skill_YY_XX || Site_CP_Skill_YY_XX  auto gen - Block
  className: string; // auto gen - Block
  status: string;

  plannedTraineeNo: number;
  acceptedTraineeNo: string; // Block
  actualTraineeNo: string; // Block

  expectedStartDate: Date | number; // Cannot input past date
  expectedEndDate: Date | number; // Cannot input past date

  location: string; // drop down
  detailedLocation: string;

  budgetCode: string;
  estimatedBudget: number;

  classAdmin: Array<number>;
  learningPath: string;

  history: string;
}

interface ClassDetail {
  subjectType: number;
  subSubjectType: number;
  deliveryType: number;

  formatType: number;
  scope: number;
  supplier: string;

  actualStartDate: Date | number;
  actualEndDate: Date | number;

  masterTrainer: number;
  trainer: Array<string>;

  curriculumn: string;
  remarks: string;
}

export interface ClassBudget {
  total: number;
  // overBudget: number;

  item: string;
  unit: string;
  unitExpense: number;

  quantity: number;
  amount: number;
  tax: number;

  // sum: number;
  note: string;
}

export interface ClassAudit {
  date: Date | number;
  eventCategory: string;
  relatedPeople: string;

  action: number;
  pic: number;
  deadline: Date | number;

  note: string;
}
