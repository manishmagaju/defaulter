import { hueFromId } from "../lib/utils";
import type { Student } from "../types";

export function Avatar({ student, size = 56 }: { student: Pick<Student, "id" | "name" | "photoUrl">; size?: number }) {
  const hue = hueFromId(student.id);
  const initials = student.name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  if (student.photoUrl) {
    return (
      <img
        src={student.photoUrl}
        alt={student.name}
        className="rounded-2xl object-cover shadow-sm ring-2 ring-white"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="grid place-items-center rounded-2xl font-semibold text-white shadow-sm ring-2 ring-white"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        background: `linear-gradient(145deg, hsl(${hue} 42% 38%), hsl(${(hue + 28) % 360} 48% 28%))`,
      }}
    >
      {initials}
    </div>
  );
}
