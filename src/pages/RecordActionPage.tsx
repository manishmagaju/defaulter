import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StatusChip } from "../components/StudentCard";
import { useStore } from "../lib/store";
import { formatDateTime } from "../lib/utils";
import { ACTIONS, STATUSES, type ActionCode, type DefaulterStatus } from "../types";

export function RecordActionPage() {
  const { recordId } = useParams();
  const navigate = useNavigate();
  const { state, currentUser, setRecordAction, setRecordStatus } = useStore();
  const record = state.records.find((r) => r.id === recordId);
  const student = record ? state.students.find((s) => s.id === record.studentId) : undefined;
  const subject = record ? state.subjects.find((s) => s.id === record.subjectId) : undefined;
  const teacher = record ? state.staff.find((s) => s.id === record.teacherId) : undefined;

  const [action, setAction] = useState<ActionCode>(record?.action?.action ?? "No Action Yet");
  const [remark, setRemark] = useState(record?.action?.remark ?? "");
  const [status, setStatus] = useState<DefaulterStatus>(record?.status ?? "Pending");

  if (!record || !student || !currentUser) return <p>Record not found.</p>;

  const canResolve = currentUser.role === "incharge" || currentUser.id === record.teacherId;

  return (
    <div className="space-y-4">
      <Link to={`/students/${student.id}`} className="text-sm font-medium text-teal">
        ← {student.name}
      </Link>
      <h1 className="font-display text-3xl">Action taken</h1>

      <section className="rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold">{student.name}</p>
            <p className="text-sm text-slate">
              Class {student.className}-{student.section} · Roll {student.rollNumber}
            </p>
          </div>
          <StatusChip status={record.status} />
        </div>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-slate">Subject</dt>
            <dd>{subject?.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate">Reason</dt>
            <dd className="text-right">{record.reason}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate">Added by</dt>
            <dd className="text-right">{teacher?.name}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-slate">Date</dt>
            <dd>{formatDateTime(record.createdAt)}</dd>
          </div>
        </dl>
        {record.remark && <p className="mt-3 rounded-xl bg-cream p-3 text-sm">“{record.remark}”</p>}
      </section>

      <form
        className="space-y-4 rounded-3xl bg-paper p-4 ring-1 ring-black/5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canResolve) return;
          setRecordAction(
            record.id,
            {
              action,
              remark: remark.trim(),
              date: new Date().toISOString(),
              byStaffId: currentUser.id,
            },
            status,
          );
          navigate(`/students/${student.id}`);
        }}
      >
        <label className="block text-sm font-medium">
          Action taken
          <select
            className="tap mt-1 w-full rounded-2xl bg-cream px-3 ring-1 ring-black/10"
            value={action}
            onChange={(e) => setAction(e.target.value as ActionCode)}
            disabled={!canResolve}
          >
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-medium">
          Action remark
          <textarea
            className="mt-1 min-h-24 w-full rounded-2xl bg-cream px-3 py-3 outline-none ring-1 ring-black/10"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            disabled={!canResolve}
            placeholder="Parent was informed about repeated incomplete homework."
          />
        </label>
        <label className="block text-sm font-medium">
          Status
          <select
            className="tap mt-1 w-full rounded-2xl bg-cream px-3 ring-1 ring-black/10"
            value={status}
            onChange={(e) => setStatus(e.target.value as DefaulterStatus)}
            disabled={currentUser.role !== "incharge"}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        {currentUser.role !== "incharge" && (
          <p className="text-xs text-slate">Only the in-charge can mark a case resolved. Teachers can record the action taken.</p>
        )}
        {canResolve && (
          <button className="tap w-full rounded-2xl bg-forest font-semibold text-white" type="submit">
            Save follow-up
          </button>
        )}
      </form>

      {record.action && (
        <p className="text-sm text-slate">
          Last action {formatDateTime(record.action.date)} by{" "}
          {state.staff.find((s) => s.id === record.action?.byStaffId)?.name}
        </p>
      )}

      {currentUser.role === "incharge" && (
        <button
          className="tap w-full rounded-2xl bg-sage font-semibold text-white"
          onClick={() => {
            setRecordStatus(record.id, "Resolved");
            navigate(`/students/${student.id}`);
          }}
        >
          Mark resolved
        </button>
      )}
    </div>
  );
}
