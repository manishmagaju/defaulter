import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { REASONS } from "../types";

export function AddDefaulterPage() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { state, currentUser, allowedSubjects, addRecord } = useStore();
  const student = state.students.find((s) => s.id === studentId);
  const [subjectId, setSubjectId] = useState(allowedSubjects[0]?.id ?? "");
  const [reason, setReason] = useState(REASONS[0]);
  const [remark, setRemark] = useState("");

  if (!student) return <p>Student not found.</p>;
  if (!currentUser) return null;

  const blocked = allowedSubjects.length === 0;

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate">
        <Link to={`/students/${student.id}`} className="text-teal">
          {student.name}
        </Link>{" "}
        · Class {student.className}-{student.section}
      </p>
      <h1 className="font-display text-3xl">Mark as defaulter</h1>
      <p className="text-slate">A new history record will be created. Previous incidents stay on file.</p>

      {blocked ? (
        <p className="rounded-2xl bg-coral/10 p-4 text-coral">No subjects are assigned to this teacher.</p>
      ) : (
        <form
          className="space-y-4 rounded-3xl bg-paper p-4 ring-1 ring-black/5"
          onSubmit={(e) => {
            e.preventDefault();
            addRecord({
              studentId: student.id,
              subjectId,
              teacherId: currentUser.id,
              reason,
              remark: remark.trim(),
            });
            navigate(`/students/${student.id}`);
          }}
        >
          <label className="block text-sm font-medium">
            Subject
            <select
              className="tap mt-1 w-full rounded-2xl bg-cream px-3 ring-1 ring-black/10"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
            >
              {allowedSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Reason
            <select
              className="tap mt-1 w-full rounded-2xl bg-cream px-3 ring-1 ring-black/10"
              value={reason}
              onChange={(e) => setReason(e.target.value as typeof reason)}
            >
              {REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm font-medium">
            Remarks
            <textarea
              className="mt-1 min-h-28 w-full rounded-2xl bg-cream px-3 py-3 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-teal"
              placeholder="Student did not complete Exercise 5.2"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
            />
          </label>
          <p className="text-xs text-slate">
            Added by {currentUser.title} · {new Date().toLocaleString()}
          </p>
          <button className="tap w-full rounded-2xl bg-coral font-semibold text-white" type="submit">
            Save record
          </button>
        </form>
      )}
    </div>
  );
}
