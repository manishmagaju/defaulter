export type UserRole = "teacher" | "incharge";

export type DefaulterStatus = "Pending" | "Resolved" | "Follow-up Required";

export type ReasonCode =
  | "Homework Not Completed"
  | "Homework Partially Completed"
  | "Homework Not Submitted"
  | "Forgot Homework Copy"
  | "Repeatedly Missing Homework"
  | "Other";

export type ActionCode =
  | "Warning Given"
  | "Homework Reassigned"
  | "Parent Informed"
  | "Student Counseled"
  | "Detention"
  | "Referred to Class Teacher"
  | "Referred to In-Charge"
  | "No Action Yet"
  | "Other";

export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  className: string;
  section: string;
  photoUrl?: string;
  parentName: string;
  contactNumber: string;
  gender: "Male" | "Female";
  address?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  active: boolean;
}

export interface Staff {
  id: string;
  name: string;
  username: string;
  password: string;
  role: UserRole;
  subjectIds: string[];
  title: string;
}

export interface ActionTaken {
  action: ActionCode;
  remark: string;
  date: string;
  byStaffId: string;
}

export interface DefaulterRecord {
  id: string;
  studentId: string;
  subjectId: string;
  teacherId: string;
  reason: ReasonCode;
  remark: string;
  createdAt: string;
  status: DefaulterStatus;
  action?: ActionTaken;
}

export interface AppState {
  students: Student[];
  subjects: Subject[];
  staff: Staff[];
  records: DefaulterRecord[];
}

export const REASONS: ReasonCode[] = [
  "Homework Not Completed",
  "Homework Partially Completed",
  "Homework Not Submitted",
  "Forgot Homework Copy",
  "Repeatedly Missing Homework",
  "Other",
];

export const ACTIONS: ActionCode[] = [
  "Warning Given",
  "Homework Reassigned",
  "Parent Informed",
  "Student Counseled",
  "Detention",
  "Referred to Class Teacher",
  "Referred to In-Charge",
  "No Action Yet",
  "Other",
];

export const STATUSES: DefaulterStatus[] = [
  "Pending",
  "Follow-up Required",
  "Resolved",
];

export const CLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const SECTIONS = ["A", "B", "C", "D"];
