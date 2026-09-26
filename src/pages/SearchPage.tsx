import { useMemo, useState } from "react";
import { StudentCard } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { matchesQuery } from "../lib/utils";
import { CLASSES, SECTIONS } from "../types";

export function SearchPage() {
  const { state } = useStore();
  const [q, setQ] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");

  const results = useMemo(() => {
    return state.students
      .filter((s) => matchesQuery(s, q))
      .filter((s) => !className || s.className === className)
      .filter((s) => !section || s.section === section)
      .slice(0, 40);
  }, [state.students, q, className, section]);

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Search student</h1>
      <div className="space-y-3 rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <input
          className="tap w-full rounded-2xl bg-cream px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-teal"
          placeholder="Name / roll / ID"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-2">
          <select
            className="tap rounded-2xl bg-cream px-3 ring-1 ring-black/10"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
          >
            <option value="">All classes</option>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <select
            className="tap rounded-2xl bg-cream px-3 ring-1 ring-black/10"
            value={section}
            onChange={(e) => setSection(e.target.value)}
          >
            <option value="">All sections</option>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-sm text-slate">{results.length} shown · {state.students.length} students in register</p>
      <div className="space-y-2">
        {results.map((student) => (
          <StudentCard key={student.id} student={student} to={`/students/${student.id}`} />
        ))}
      </div>
    </div>
  );
}
