import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StudentCard } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { CLASSES, SECTIONS } from "../types";

export function StudentListPage() {
  const { state } = useStore();
  const [className, setClassName] = useState("8");
  const [section, setSection] = useState("A");

  const list = useMemo(
    () =>
      state.students
        .filter((s) => s.className === className && s.section === section)
        .sort((a, b) => Number(a.rollNumber) - Number(b.rollNumber)),
    [state.students, className, section],
  );

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <h1 className="font-display text-3xl">Student list</h1>
        <Link to="/students/new" className="tap flex items-center gap-1 rounded-2xl bg-forest px-4 font-semibold text-white">
          <Plus className="size-4" /> Add
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <select className="tap rounded-2xl bg-paper px-3 ring-1 ring-black/10" value={className} onChange={(e) => setClassName(e.target.value)}>
          {CLASSES.map((c) => (
            <option key={c} value={c}>
              Class {c}
            </option>
          ))}
        </select>
        <select className="tap rounded-2xl bg-paper px-3 ring-1 ring-black/10" value={section} onChange={(e) => setSection(e.target.value)}>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>
              Section {s}
            </option>
          ))}
        </select>
      </div>
      <p className="text-sm text-slate">{list.length} students in {className}-{section}</p>
      <div className="space-y-2">
        {list.map((student) => {
          const n = state.records.filter((r) => r.studentId === student.id).length;
          return (
            <StudentCard
              key={student.id}
              student={student}
              to={`/students/${student.id}`}
              subtitle={n ? `${n} defaulter record${n === 1 ? "" : "s"}` : "No defaulter records"}
            />
          );
        })}
      </div>
    </div>
  );
}
