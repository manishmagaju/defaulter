import { AlertTriangle, CheckCircle2, ClipboardList, QrCode, Repeat, Search, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { StatusChip } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { formatDate, isSameDay, repeatedStudentIds } from "../lib/utils";

export function DashboardPage() {
  const { state, currentUser } = useStore();
  const today = state.records.filter((r) => isSameDay(r.createdAt));
  const pending = state.records.filter((r) => r.status === "Pending");
  const resolved = state.records.filter((r) => r.status === "Resolved");
  const repeated = repeatedStudentIds(state.records);
  const recent = [...state.records].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 8);

  const stats = [
    { label: "Total Students", value: state.students.length, icon: Users, tone: "bg-forest text-white" },
    { label: "Today's Defaulters", value: today.length, icon: ClipboardList, tone: "bg-gold text-ink" },
    { label: "Pending Cases", value: pending.length, icon: AlertTriangle, tone: "bg-coral text-white" },
    { label: "Resolved Cases", value: resolved.length, icon: CheckCircle2, tone: "bg-sage text-white" },
    { label: "Repeated Defaulters", value: repeated.length, icon: Repeat, tone: "bg-teal text-white" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm text-slate">Namaste, {currentUser?.name.split(" ")[1] ?? currentUser?.name}</p>
        <h1 className="font-display text-3xl text-ink">Defaulter dashboard</h1>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-3xl p-4 ${s.tone}`}>
            <s.icon className="mb-3 size-5 opacity-80" />
            <p className="font-display text-3xl leading-none">{s.value}</p>
            <p className="mt-1 text-xs font-medium opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Link to="/scan" className="tap flex items-center justify-center gap-2 rounded-2xl bg-forest font-semibold text-white">
          <QrCode className="size-5" /> Scan ID
        </Link>
        <Link to="/search" className="tap flex items-center justify-center gap-2 rounded-2xl bg-paper font-semibold text-ink ring-1 ring-black/10">
          <Search className="size-5" /> Search student
        </Link>
      </div>

      <section className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl">Recent records</h2>
          <Link to="/reports" className="text-sm font-medium text-teal">View all</Link>
        </div>
        <div className="space-y-3">
          {recent.map((r) => {
            const student = state.students.find((s) => s.id === r.studentId);
            const subject = state.subjects.find((s) => s.id === r.subjectId);
            return (
              <Link key={r.id} to={`/students/${r.studentId}`} className="block border-b border-black/5 pb-3 last:border-0 last:pb-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold">{student?.name}</p>
                    <p className="text-sm text-slate">
                      {subject?.name} · {r.reason}
                    </p>
                    <p className="text-xs text-slate/80">{formatDate(r.createdAt)}</p>
                  </div>
                  <StatusChip status={r.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
