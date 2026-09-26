import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { nextStudentId, useStore } from "../lib/store";
import { findStudentByScan } from "../lib/utils";
import { CLASSES, SECTIONS, type Student } from "../types";

export function AddStudentPage() {
  const { state, addStudent } = useStore();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const presetId = params.get("id") ?? "";
  const [scan, setScan] = useState(presetId);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    id: presetId || nextStudentId(state.students),
    name: "",
    className: "8",
    section: "A",
    rollNumber: "",
    parentName: "",
    contactNumber: "",
    photoUrl: "",
    gender: "Male" as Student["gender"],
    address: "",
  });

  const found = useMemo(() => (scan ? findStudentByScan(state.students, scan) : undefined), [scan, state.students]);

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Add student</h1>

      <section className="space-y-3 rounded-3xl bg-paper p-4 ring-1 ring-black/5">
        <p className="font-semibold">Method 1 — Scan or enter ID</p>
        <input
          className="tap w-full rounded-2xl bg-cream px-4 ring-1 ring-black/10"
          placeholder="Scan or type student ID"
          value={scan}
          onChange={(e) => {
            setScan(e.target.value);
            setMessage(null);
          }}
        />
        <button
          className="tap w-full rounded-2xl bg-teal font-semibold text-white"
          onClick={() => {
            if (!scan.trim()) return;
            const student = findStudentByScan(state.students, scan);
            if (student) {
              setMessage("Student found");
              navigate(`/students/${student.id}`);
            } else {
              setMessage("Student not found — complete the form below.");
              set("id", scan.trim().toUpperCase());
            }
          }}
        >
          Check ID
        </button>
        {found && <p className="text-sm text-sage">Student found ✓ {found.name}</p>}
        {message && <p className="text-sm text-slate">{message}</p>}
      </section>

      <form
        className="space-y-3 rounded-3xl bg-paper p-4 ring-1 ring-black/5"
        onSubmit={(e) => {
          e.preventDefault();
          const result = addStudent({
            id: form.id.trim().toUpperCase(),
            name: form.name.trim(),
            className: form.className,
            section: form.section,
            rollNumber: form.rollNumber.trim(),
            parentName: form.parentName.trim(),
            contactNumber: form.contactNumber.trim(),
            photoUrl: form.photoUrl.trim() || undefined,
            gender: form.gender,
            address: form.address.trim() || undefined,
          });
          if (!result.ok) {
            setMessage(result.error ?? "Could not save.");
            return;
          }
          navigate(`/students/${form.id.trim().toUpperCase()}`);
        }}
      >
        <p className="font-semibold">Method 2 — Manual entry</p>
        {[
          ["id", "Student ID"],
          ["name", "Student name"],
          ["rollNumber", "Roll number"],
          ["parentName", "Parent / guardian"],
          ["contactNumber", "Contact number"],
          ["photoUrl", "Photo URL (optional)"],
        ].map(([key, label]) => (
          <label key={key} className="block text-sm font-medium">
            {label}
            <input
              className="tap mt-1 w-full rounded-2xl bg-cream px-4 ring-1 ring-black/10"
              value={form[key as keyof typeof form] as string}
              onChange={(e) => set(key as keyof typeof form, e.target.value)}
              required={key !== "photoUrl"}
            />
          </label>
        ))}
        <div className="grid grid-cols-2 gap-2">
          <select className="tap rounded-2xl bg-cream px-3 ring-1 ring-black/10" value={form.className} onChange={(e) => set("className", e.target.value)}>
            {CLASSES.map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>
          <select className="tap rounded-2xl bg-cream px-3 ring-1 ring-black/10" value={form.section} onChange={(e) => set("section", e.target.value)}>
            {SECTIONS.map((s) => (
              <option key={s} value={s}>
                Section {s}
              </option>
            ))}
          </select>
        </div>
        <button className="tap w-full rounded-2xl bg-forest font-semibold text-white" type="submit">
          Save student
        </button>
      </form>
    </div>
  );
}
