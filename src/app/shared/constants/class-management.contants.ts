export const BudgetCodeList = [
  {
    id: 0,
    name: 'CTC_Project_ADP',
  },
  {
    id: 1,
    name: 'CTC_Fresher_Allowance',
  },
  {
    id: 2,
    name: 'CTC_Fresher_Training',
  },
  {
    id: 3,
    name: 'CTC_Specific_Fresher_Allowance',
  },
  {
    id: 4,
    name: 'CTC_Specific_Fresher_Training',
  },
  {
    id: 5,
    name: 'CTC_Specific_Fresher_Training_Award',
  },
  {
    id: 6,
    name: 'CTC_FU',
  },
  {
    id: 7,
    name: 'CTC_Uni',
  },
];

export const SubjectTypeList = [
  {
    id: 0,
    name: 'Organizational Overview & Culture',
  },
  {
    id: 1,
    name: 'Company Process',
  },
  {
    id: 2,
    name: 'Standard Process',
  },
  {
    id: 3,
    name: 'IT Technical',
  },
  {
    id: 4,
    name: 'Non-IT Technical',
  },
  {
    id: 5,
    name: 'Foreign Language',
  },
  {
    id: 6,
    name: 'Soft Skill',
  },
  {
    id: 7,
    name: 'Management',
  },
];

export const SubSubjectTypeList = [
  {
    id: 0,
    name: 'Cloud',
  },
  {
    id: 1,
    name: 'Big Data',
  },
  {
    id: 2,
    name: 'CAD',
  },
  {
    id: 3,
    name: 'CAE',
  },
  {
    id: 4,
    name: 'SAP',
  },
  {
    id: 5,
    name: 'IT General',
  },
  {
    id: 6,
    name: 'Test',
  },
  {
    id: 7,
    name: 'Others',
  },
];

export const DeliveryTypeList = [
  {
    id: 0,
    name: 'Class',
  },
  {
    id: 1,
    name: 'Seminar',
  },
  {
    id: 2,
    name: 'Exam',
  },
  {
    id: 3,
    name: 'Contest',
  },
  {
    id: 4,
    name: 'Certificate',
  },
  {
    id: 5,
    name: 'Club',
  },
  {
    id: 6,
    name: 'OJT',
  },
  {
    id: 7,
    name: 'Others',
  },
];

export const FormatTypeList = [
  {
    id: 0,
    name: 'Online',
  },
  {
    id: 1,
    name: 'Offline',
  },
  {
    id: 2,
    name: 'Blended',
  },
];

export const ScopeList = [
  {
    id: 0,
    name: 'Company',
  },
  {
    id: 1,
    name: 'Unit',
  },
  {
    id: 2,
    name: 'Outside',
  },
];

export const EventCategoryList = [
  {
    id: 0,
    name: 'Trainer',
  },
  {
    id: 1,
    name: 'Trainee',
  },
  {
    id: 2,
    name: 'Courseware',
  },
  {
    id: 3,
    name: 'Organization',
  },
  {
    id: 4,
    name: 'Logistics',
  },
  {
    id: 5,
    name: 'Management',
  },
  {
    id: 6,
    name: 'Calendar',
  },
  {
    id: 7,
    name: 'Others',
  },
];

export const ClassAdminList = [
  {
    id: 0,
    name: 'Extra cheese',
  },
  {
    id: 1,
    name: 'Mushroom',
  },
  {
    id: 2,
    name: 'Onion',
  },
  {
    id: 3,
    name: 'Pepperoni',
  },
  {
    id: 4,
    name: 'Sausage',
  },
  {
    id: 5,
    name: 'Tomato',
  },
];

export const ClassStatus: StatusType = {
  0: 'Planned',
  1: 'In-progress',
  2: 'Pending for review',
  3: 'Draft',
  4: 'Closed',
  5: 'Wating for more information',
  6: 'Rejected',
  7: 'Declined',
  8: 'Canceled',
};

type StatusType = {
  [key: number]: string;
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
