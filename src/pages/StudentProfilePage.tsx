import { ClipboardPlus, Phone } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { StatusChip } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { classLabel, countsByStatus, formatDate, studentHistory } from "../lib/utils";

export function StudentProfilePage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { state } = useStore();
  const student = state.students.find((s) => s.id === studentId);

  if (!student) {
    return (
      <div className="space-y-4">
        <h1 className="font-display text-3xl">Student not found</h1>
        <p className="text-slate">No student matches this ID in the register.</p>
        <button className="tap w-full rounded-2xl bg-forest font-semibold text-white" onClick={() => navigate(`/students/new?id=${studentId}`)}>
          Add student
        </button>
      </div>
    );
  }

  const history = studentHistory(state.records, student.id);
  const counts = countsByStatus(history);

  return (
    <div className="space-y-4">
      <section className="rounded-3xl bg-forest p-5 text-white">
        <div className="flex items-center gap-4">
          <Avatar student={student} size={72} />
          <div>
            <p className="text-xs uppercase tracking-wide text-gold">{student.id}</p>
            <h1 className="font-display text-3xl leading-tight">{student.name}</h1>
            <p className="text-white/80">
              {classLabel(student)} · Roll {student.rollNumber}
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-white/60">Parent / Guardian</p>
            <p className="font-medium">{student.parentName}</p>
          </div>
          <a href={`tel:${student.contactNumber}`} className="rounded-2xl bg-white/10 p-3">
            <p className="flex items-center gap-1 text-white/60">
              <Phone className="size-3" /> Contact
            </p>
            <p className="font-medium">{student.contactNumber}</p>
          </a>
        </div>
      </section>

      <Link
        to={`/students/${student.id}/defaulter`}
        className="tap flex items-center justify-center gap-2 rounded-2xl bg-coral font-semibold text-white"
      >
        <ClipboardPlus className="size-5" /> Mark as defaulter
      </Link>

      <section className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-xl">Defaulter history</h2>
          <p className="text-sm text-slate">{history.length} records</p>
        </div>
        <div className="mb-4 grid grid-cols-3 gap-2 text-center text-sm">
          <div className="rounded-xl bg-amber-50 p-2">
            <p className="font-display text-xl">{counts.Pending}</p>
            <p className="text-xs text-slate">Pending</p>
          </div>
          <div className="rounded-xl bg-sky-50 p-2">
            <p className="font-display text-xl">{counts["Follow-up Required"]}</p>
            <p className="text-xs text-slate">Follow-up</p>
          </div>
          <div className="rounded-xl bg-emerald-50 p-2">
            <p className="font-display text-xl">{counts.Resolved}</p>
            <p className="text-xs text-slate">Resolved</p>
          </div>
        </div>
        {history.length === 0 ? (
          <p className="text-sm text-slate">No homework defaulter records yet.</p>
        ) : (
          <div className="space-y-3">
            {history.map((r) => {
              const subject = state.subjects.find((s) => s.id === r.subjectId);
              const teacher = state.staff.find((s) => s.id === r.teacherId);
              return (
                <Link key={r.id} to={`/records/${r.id}`} className="block rounded-2xl bg-cream p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold">{subject?.name}</p>
                      <p className="text-sm text-slate">{r.reason}</p>
                      {r.remark && <p className="mt-1 text-sm">“{r.remark}”</p>}
                      <p className="mt-1 text-xs text-slate">
                        {formatDate(r.createdAt)} · {teacher?.name}
                      </p>
                    </div>
                    <StatusChip status={r.status} />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
