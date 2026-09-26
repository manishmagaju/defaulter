import type { DefaulterRecord, DefaulterStatus, Student } from "../types";

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isSameDay(iso: string, date = new Date()) {
  const d = new Date(iso);
  return (
    d.getFullYear() === date.getFullYear() &&
    d.getMonth() === date.getMonth() &&
    d.getDate() === date.getDate()
  );
}

export function classLabel(student: Pick<Student, "className" | "section">) {
  return `Class ${student.className}-${student.section}`;
}

export function hueFromId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

export function studentHistory(records: DefaulterRecord[], studentId: string) {
  return records
    .filter((r) => r.studentId === studentId)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function countsByStatus(records: DefaulterRecord[]) {
  return records.reduce(
    (acc, r) => {
      acc[r.status] += 1;
      return acc;
    },
    { Pending: 0, Resolved: 0, "Follow-up Required": 0 } as Record<DefaulterStatus, number>,
  );
}

export function repeatedStudentIds(records: DefaulterRecord[], min = 2) {
  const map = new Map<string, number>();
  for (const r of records) map.set(r.studentId, (map.get(r.studentId) ?? 0) + 1);
  return [...map.entries()].filter(([, n]) => n >= min).map(([id]) => id);
}

export function matchesQuery(student: Student, q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return true;
  return (
    student.name.toLowerCase().includes(s) ||
    student.id.toLowerCase().includes(s) ||
    student.rollNumber.toLowerCase() === s ||
    student.contactNumber.includes(s)
  );
}

export function findStudentByScan(students: Student[], code: string) {
  const raw = code.trim().toUpperCase();
  return (
    students.find((s) => s.id.toUpperCase() === raw) ||
    students.find((s) => s.id.replace("-", "").toUpperCase() === raw.replace("-", ""))
  );
}
