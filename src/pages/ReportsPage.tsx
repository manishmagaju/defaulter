import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { StatusChip } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { formatDate, isSameDay, repeatedStudentIds } from "../lib/utils";
import { CLASSES, SECTIONS, STATUSES } from "../types";

export function ReportsPage() {
  const { state, currentUser, upsertSubject, resetDemo } = useStore();
  const [filters, setFilters] = useState({
    className: "",
    section: "",
    subjectId: "",
    teacherId: "",
    status: "",
    student: "",
    date: "",
  });
  const [newSubject, setNewSubject] = useState("");

  const filtered = useMemo(() => {
    return state.records.filter((r) => {
      const student = state.students.find((s) => s.id === r.studentId);
      if (!student) return false;
      if (filters.className && student.className !== filters.className) return false;
      if (filters.section && student.section !== filters.section) return false;
      if (filters.subjectId && r.subjectId !== filters.subjectId) return false;
      if (filters.teacherId && r.teacherId !== filters.teacherId) return false;
      if (filters.status && r.status !== filters.status) return false;
      if (filters.student) {
        const q = filters.student.toLowerCase();
        if (!student.name.toLowerCase().includes(q) && !student.id.toLowerCase().includes(q)) return false;
      }
      if (filters.date) {
        const d = new Date(filters.date);
        if (!isSameDay(r.createdAt, d)) return false;
      }
      return true;
    });
  }, [state, filters]);

  const byClass = CLASSES.map((c) => ({
    label: `Class ${c}`,
    n: state.records.filter((r) => state.students.find((s) => s.id === r.studentId)?.className === c).length,
  }));
  const bySubject = state.subjects.map((s) => ({
    label: s.name,
    n: state.records.filter((r) => r.subjectId === s.id).length,
    active: s.active,
    id: s.id,
  }));
  const byTeacher = state.staff
    .filter((s) => s.role === "teacher")
    .map((t) => ({
      label: t.name,
      n: state.records.filter((r) => r.teacherId === t.id).length,
    }));
  const repeated = repeatedStudentIds(state.records);

  return (
    <div className="space-y-5">
      <h1 className="font-display text-3xl">Defaulter reports</h1>

      <div className="grid gap-2 rounded-3xl bg-paper p-4 ring-1 ring-black/5 sm:grid-cols-2 lg:grid-cols-4">
        <select className="tap rounded-2xl bg-cream px-3" value={filters.className} onChange={(e) => setFilters({ ...filters, className: e.target.value })}>
          <option value="">All classes</option>
          {CLASSES.map((c) => (
            <option key={c} value={c}>Class {c}</option>
          ))}
        </select>
        <select className="tap rounded-2xl bg-cream px-3" value={filters.section} onChange={(e) => setFilters({ ...filters, section: e.target.value })}>
          <option value="">All sections</option>
          {SECTIONS.map((s) => (
            <option key={s} value={s}>Section {s}</option>
          ))}
        </select>
        <select className="tap rounded-2xl bg-cream px-3" value={filters.subjectId} onChange={(e) => setFilters({ ...filters, subjectId: e.target.value })}>
          <option value="">All subjects</option>
          {state.subjects.filter((s) => s.active).map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select className="tap rounded-2xl bg-cream px-3" value={filters.teacherId} onChange={(e) => setFilters({ ...filters, teacherId: e.target.value })}>
          <option value="">All teachers</option>
          {state.staff.filter((s) => s.role === "teacher").map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select className="tap rounded-2xl bg-cream px-3" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input className="tap rounded-2xl bg-cream px-3" type="date" value={filters.date} onChange={(e) => setFilters({ ...filters, date: e.target.value })} />
        <input
          className="tap rounded-2xl bg-cream px-3 sm:col-span-2"
          placeholder="Student name or ID"
          value={filters.student}
          onChange={(e) => setFilters({ ...filters, student: e.target.value })}
        />
      </div>

      <p className="text-sm text-slate">{filtered.length} matching records</p>
      <div className="space-y-2">
        {filtered.slice(0, 50).map((r) => {
          const student = state.students.find((s) => s.id === r.studentId)!;
          const subject = state.subjects.find((s) => s.id === r.subjectId);
          return (
            <Link key={r.id} to={`/records/${r.id}`} className="block rounded-2xl bg-paper p-3 ring-1 ring-black/5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold">{student.name}</p>
                  <p className="text-sm text-slate">
                    {subject?.name} · Class {student.className}-{student.section} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <StatusChip status={r.status} />
              </div>
            </Link>
          );
        })}
      </div>

      <section className="grid gap-3 md:grid-cols-3">
        <StatBlock title="Class-wise" rows={byClass} />
        <StatBlock title="Subject-wise" rows={bySubject} />
        <StatBlock title="Teacher-wise" rows={byTeacher} />
      </section>

      <section className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <h2 className="font-display text-xl">Repeated defaulters</h2>
        <p className="mb-3 text-sm text-slate">Students with 2 or more homework incidents</p>
        <div className="space-y-2">
          {repeated.map((id) => {
            const student = state.students.find((s) => s.id === id);
            if (!student) return null;
            const n = state.records.filter((r) => r.studentId === id).length;
            return (
              <Link key={id} to={`/students/${id}`} className="flex items-center justify-between rounded-xl bg-cream px-3 py-2">
                <span className="font-medium">{student.name}</span>
                <span className="text-sm text-coral">{n} records</span>
              </Link>
            );
          })}
        </div>
      </section>

      {currentUser?.role === "incharge" && (
        <section className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
          <h2 className="font-display text-xl">Subjects</h2>
          <p className="mb-3 text-sm text-slate">Subjects are stored separately and can be added or retired without changing history.</p>
          <div className="mb-3 space-y-2">
            {bySubject.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-2 rounded-xl bg-cream px-3 py-2">
                <span>{s.label}</span>
                <button
                  className="text-sm font-medium text-teal"
                  onClick={() =>
                    upsertSubject({
                      id: s.id,
                      name: s.label,
                      code: s.id.replace("SUB-", ""),
                      active: !s.active,
                    })
                  }
                >
                  {s.active ? "Retire" : "Restore"}
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              className="tap flex-1 rounded-2xl bg-cream px-3"
              placeholder="New subject name"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />
            <button
              className="tap rounded-2xl bg-forest px-4 font-semibold text-white"
              onClick={() => {
                const name = newSubject.trim();
                if (!name) return;
                upsertSubject({
                  id: `SUB-${name.slice(0, 8).toUpperCase().replace(/\s+/g, "")}-${Date.now()}`,
                  name,
                  code: name.slice(0, 4).toUpperCase(),
                  active: true,
                });
                setNewSubject("");
              }}
            >
              Add
            </button>
          </div>
          <button className="mt-4 text-sm text-slate underline" onClick={resetDemo}>
            Reset demo data
          </button>
        </section>
      )}
    </div>
  );
}

function StatBlock({ title, rows }: { title: string; rows: { label: string; n: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <div className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
      <h2 className="mb-3 font-display text-xl">{title}</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label}>
            <div className="mb-0.5 flex justify-between text-sm">
              <span>{r.label}</span>
              <span className="font-semibold">{r.n}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-cream">
              <div className="h-full bg-teal" style={{ width: `${(r.n / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
