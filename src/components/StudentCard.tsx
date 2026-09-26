import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { classLabel } from "../lib/utils";
import type { Student } from "../types";
import { Avatar } from "./Avatar";

export function StudentCard({
  student,
  subtitle,
  to,
}: {
  student: Student;
  subtitle?: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-2xl bg-paper p-3 shadow-[0_8px_24px_rgba(16,39,52,0.06)] ring-1 ring-black/5"
    >
      <Avatar student={student} />
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-semibold text-ink">{student.name}</p>
        <p className="text-sm text-slate">
          {classLabel(student)} · Roll {student.rollNumber}
        </p>
        <p className="truncate text-xs text-slate/80">{subtitle ?? student.id}</p>
      </div>
      <ChevronRight className="size-5 text-slate/50" />
    </Link>
  );
}

export function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    Pending: "bg-amber-100 text-amber-900",
    Resolved: "bg-emerald-100 text-emerald-900",
    "Follow-up Required": "bg-sky-100 text-sky-900",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${map[status] ?? "bg-stone-100 text-stone-700"}`}>
      {status}
    </span>
  );
}
