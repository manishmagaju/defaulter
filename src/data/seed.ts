import type { AppState, DefaulterRecord, Staff, Student, Subject } from "../types";

const FIRST = [
  "Manish", "Aayush", "Prabin", "Sita", "Anjali", "Ramesh", "Bina", "Kritika",
  "Nabin", "Prakash", "Suman", "Aasha", "Dipesh", "Kabita", "Hari", "Gita",
  "Sandesh", "Puja", "Rabin", "Sunita", "Kiran", "Nisha", "Bikash", "Sneha",
  "Rohit", "Poonam", "Sagar", "Ritu", "Anish", "Meena", "Yogesh", "Laxmi",
  "Bijay", "Sarita", "Deepak", "Aarati", "Ujjwal", "Shristi", "Kamal", "Barsha",
];

const LAST = [
  "Magaju", "Sharma", "Thapa", "Adhikari", "Gurung", "Karki", "Shrestha",
  "Tamang", "Rai", "Poudel", "Basnet", "KC", "Maharjan", "Bhandari", "Dahal",
  "Khadka", "Limbu", "Acharya", "Ghimire", "Neupane",
];

const PARENT_FIRST = ["Ram", "Sita", "Hari", "Maya", "Krishna", "Gita", "Bhim", "Kamala"];

function pad(n: number, w = 3) {
  return String(n).padStart(w, "0");
}

export const SUBJECTS: Subject[] = [
  { id: "SUB-MATH", name: "Mathematics", code: "MATH", active: true },
  { id: "SUB-SCI", name: "Science", code: "SCI", active: true },
  { id: "SUB-ENG", name: "English", code: "ENG", active: true },
  { id: "SUB-NEP", name: "Nepali", code: "NEP", active: true },
  { id: "SUB-SOC", name: "Social Studies", code: "SOC", active: true },
  { id: "SUB-CMP", name: "Computer", code: "CMP", active: true },
  { id: "SUB-HPE", name: "Health & Physical Education", code: "HPE", active: true },
  { id: "SUB-MOR", name: "Moral Education", code: "MOR", active: true },
];

export const STAFF: Staff[] = [
  {
    id: "T-MATH",
    name: "Mr. Aakash Sharma",
    username: "teacher",
    password: "teacher123",
    role: "teacher",
    subjectIds: ["SUB-MATH"],
    title: "Mathematics Teacher",
  },
  {
    id: "T-SCI",
    name: "Ms. Bina Thapa",
    username: "science",
    password: "teacher123",
    role: "teacher",
    subjectIds: ["SUB-SCI"],
    title: "Science Teacher",
  },
  {
    id: "T-ENG",
    name: "Mr. Sagar Poudel",
    username: "english",
    password: "teacher123",
    role: "teacher",
    subjectIds: ["SUB-ENG"],
    title: "English Teacher",
  },
  {
    id: "T-NEP",
    name: "Mrs. Gita Adhikari",
    username: "nepali",
    password: "teacher123",
    role: "teacher",
    subjectIds: ["SUB-NEP", "SUB-MOR"],
    title: "Nepali Teacher",
  },
  {
    id: "T-CMP",
    name: "Mr. Dipesh Karki",
    username: "computer",
    password: "teacher123",
    role: "teacher",
    subjectIds: ["SUB-CMP"],
    title: "Computer Teacher",
  },
  {
    id: "IC-01",
    name: "Mrs. Rekha Adhikari",
    username: "incharge",
    password: "admin123",
    role: "incharge",
    subjectIds: SUBJECTS.map((s) => s.id),
    title: "School In-Charge",
  },
];

export function buildStudents(): Student[] {
  const students: Student[] = [];
  const classes = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  const sections = ["A", "B", "C", "D"];
  let n = 1;

  function countFor(className: string, section: string) {
    if (className === "8" && section === "A") return 15;
    if (className === "9") return 9;
    return 10;
  }

  for (const className of classes) {
    for (const section of sections) {
      const perSection = countFor(className, section);
      for (let roll = 1; roll <= perSection; roll++) {
        if (n > 400) break;
        const first = FIRST[(n + roll) % FIRST.length];
        const last = LAST[(n * 3 + roll) % LAST.length];
        const gender = n % 2 === 0 ? "Female" : "Male";
        const parent = `${PARENT_FIRST[n % PARENT_FIRST.length]} ${last}`;
        students.push({
          id: `STU-${String(n).padStart(4, "0")}`,
          name: `${first} ${last}`,
          rollNumber: String(roll),
          className,
          section,
          parentName: parent,
          contactNumber: `98${pad(10000000 + n * 17, 8).slice(-8)}`,
          gender,
          address: "Kathmandu, Nepal",
        });
        n += 1;
      }
    }
  }

  const demo = students.find((s) => s.className === "8" && s.section === "A" && s.rollNumber === "15");
  if (demo) {
    demo.name = "Manish Magaju";
    demo.parentName = "Ram Magaju";
    demo.contactNumber = "9841000142";
    for (const other of students) {
      if (other.id !== demo.id && other.name === "Manish Magaju") {
        other.name = "Manish Magar";
      }
    }
  }

  return students.slice(0, 400);
}

function iso(daysAgo: number, hour = 10) {
  const d = new Date(2026, 8, 23, hour, 12, 0);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}

export function buildRecords(students: Student[]): DefaulterRecord[] {
  const byKey = (c: string, sec: string, roll: string) =>
    students.find((s) => s.className === c && s.section === sec && s.rollNumber === roll);

  const manish = byKey("8", "A", "15") ?? students[0];
  const picks = [
    manish,
    byKey("8", "A", "4"),
    byKey("8", "B", "2"),
    byKey("9", "A", "1"),
    byKey("7", "C", "6"),
    byKey("10", "A", "3"),
    byKey("6", "B", "8"),
    byKey("5", "A", "9"),
    byKey("8", "A", "7"),
    byKey("9", "C", "5"),
  ].filter(Boolean) as Student[];

  const extra = students.filter((s) => !picks.includes(s)).slice(20, 55);
  const all = [...picks, ...extra];

  const specs: Array<Omit<DefaulterRecord, "id">> = [];

  specs.push(
    {
      studentId: manish.id,
      subjectId: "SUB-MATH",
      teacherId: "T-MATH",
      reason: "Homework Not Completed",
      remark: "Did not complete Chapter 5 exercise.",
      createdAt: iso(0, 9),
      status: "Pending",
    },
    {
      studentId: manish.id,
      subjectId: "SUB-SCI",
      teacherId: "T-SCI",
      reason: "Homework Not Submitted",
      remark: "Lab worksheet missing.",
      createdAt: iso(5, 11),
      status: "Resolved",
      action: {
        action: "Parent Informed",
        remark: "Parent was informed about repeated incomplete homework.",
        date: iso(4, 15),
        byStaffId: "IC-01",
      },
    },
    {
      studentId: manish.id,
      subjectId: "SUB-MATH",
      teacherId: "T-MATH",
      reason: "Homework Partially Completed",
      remark: "Incomplete homework — Exercise 4.1 only.",
      createdAt: iso(13, 10),
      status: "Resolved",
      action: {
        action: "Homework Reassigned",
        remark: "Asked to finish remaining sums.",
        date: iso(12, 16),
        byStaffId: "T-MATH",
      },
    },
  );

  const reasons = [
    "Homework Not Completed",
    "Homework Not Submitted",
    "Forgot Homework Copy",
    "Repeatedly Missing Homework",
    "Homework Partially Completed",
  ] as const;
  const subjects = ["SUB-MATH", "SUB-SCI", "SUB-ENG", "SUB-NEP", "SUB-SOC", "SUB-CMP"];
  const teachers: Record<string, string> = {
    "SUB-MATH": "T-MATH",
    "SUB-SCI": "T-SCI",
    "SUB-ENG": "T-ENG",
    "SUB-NEP": "T-NEP",
    "SUB-CMP": "T-CMP",
    "SUB-SOC": "T-NEP",
  };

  all.forEach((student, i) => {
    if (student.id === manish.id) return;
    const count = i % 7 === 0 ? 3 : i % 4 === 0 ? 2 : 1;
    for (let k = 0; k < count; k++) {
      const subjectId = subjects[(i + k) % subjects.length];
      const days = (i * 2 + k * 3) % 18;
      const pending = days <= 1 || k === 0 && i % 3 === 0;
      specs.push({
        studentId: student.id,
        subjectId,
        teacherId: teachers[subjectId],
        reason: reasons[(i + k) % reasons.length],
        remark: k === 0 ? "Homework not brought to class." : "Follow-up from previous incomplete work.",
        createdAt: iso(days, 8 + (k % 6)),
        status: pending ? (days === 0 ? "Pending" : "Follow-up Required") : "Resolved",
        action: pending
          ? undefined
          : {
              action: i % 2 === 0 ? "Warning Given" : "Student Counseled",
              remark: "Discussed with student in class.",
              date: iso(Math.max(0, days - 1), 14),
              byStaffId: teachers[subjectId],
            },
      });
    }
  });

  return specs.map((r, i) => ({ ...r, id: `DEF-${String(i + 1).padStart(4, "0")}` }));
}

export function createInitialState(): AppState {
  const students = buildStudents();
  return {
    students,
    subjects: SUBJECTS,
    staff: STAFF,
    records: buildRecords(students),
  };
}
