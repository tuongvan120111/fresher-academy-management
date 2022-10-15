export const BudgetCodeList = {
  CTC_Project_ADP: 'CTC_Project_ADP',
  CTC_Fresher_Allowance: 'CTC_Fresher_Allowance',
  CTC_Fresher_Training: 'CTC_Fresher_Training',
  CTC_Specific_Fresher_Allowance: 'CTC_Specific_Fresher_Allowance',
  CTC_Specific_Fresher_Training: 'CTC_Specific_Fresher_Training',
  CTC_Specific_Fresher_Training_Award: 'CTC_Specific_Fresher_Training_Award',
  CTC_FU: 'CTC_FU',
  CTC_Uni: 'CTC_Uni',
};

export const SubjectTypeList = {
  OrganizationalOverviewCulture: 'Organizational Overview & Culture',
  CompanyProcess: 'Company Process',
  StandardProcess: 'Standard Process',
  ITTechnical: 'IT Technical',
  NonITTechnical: 'Non-IT Technical',
  ForeignLanguage: 'Foreign Language',
  SoftSkill: 'Soft Skill',
  Management: 'Management',
};

export const SubSubjectTypeList = {
  Cloud: 'Cloud',
  BigData: 'Big Data',
  CAD: 'CAD',
  CAE: 'CAE',
  SAP: 'SAP',
  ITGeneral: 'IT General',
  Test: 'Test',
  Others: 'Others',
};

export const DeliveryTypeList = {
  Class: 'Class',
  Seminar: 'Seminar',
  Exam: 'Exam',
  Contest: 'Contest',
  Certificate: 'Certificate',
  Club: 'Club',
  OJT: 'OJT',
  Others: 'Others',
};

export const FormatTypeList = {
  Online: 'Online',
  Offline: 'Offline',
  Blended: 'Blended',
};
export const ScopeList = {
  Company: 'Company',
  Unit: 'Unit',
  Outside: 'Outside',
};

export const EventCategoryList = {
  Trainer: 'Trainer',
  Trainee: 'Trainee',
  Courseware: 'Courseware',
  Organization: 'Organization',
  Logistics: 'Logistics',
  Management: 'Management',
  Calendar: 'Calendar',
  Others: 'Others',
};

export const ClassAdminList = {
  ExtraCheese: 'Extra cheese',
};

// export enum ClassStatus {
//   Planning = 0,
//   Planned,
//   InProgress,
//   Pending,
//   Draft,
//   Submitted,
//   Closed,
//   Wating,
//   Rejected,
//   Declined,
//   Canceled,
//   Approved,
// }

export const ClassStatusString = {
  Planning: 'Planning',
  Planned: 'Planned',
  InProgress: 'In-progress',
  Pending: 'Pending for review',
  Draft: 'Draft',
  Closed: 'Closed',
  Wating: 'Wating for more information',
  Rejected: 'Rejected',
  Declined: 'Declined',
  Canceled: 'Canceled',
  Submitted: 'Submitted',
  Approved: 'Approved',
  Started: 'Started',
  Requested: 'Requested',
  Finished: 'Finished',
  Updated: 'Updated',
};

export const ClassManagementColumns: string[] = [
  'select',
  'id',
  'classCode',
  'className',
  'actualStartDate',
  'actualEndDate',
  'location',
  'status',
];

export const BudgetDisplayedColumns: string[] = [
  'add',
  'item',
  'unit',
  'unitExpense',
  'quantity',
  'amount',
  'tax',
  'sum',
  'note',
];

export const AuditDisplayedColumns: string[] = [
  'add',
  'date',
  'eventCategory',
  'relatedPeople',
  'action',
  'pic',
  'deadline',
  'note',
];

export enum ButtonType {
  Submit = 0,
  Start,
  Finish,
  Cancel,
  Approve,
  Reject,
  Close,
  Request,
  Accept,
  Decline,
}

export const FileFormats = ['.xlx', '.xlsx'];
