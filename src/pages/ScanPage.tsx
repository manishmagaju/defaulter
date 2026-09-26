import { Html5Qrcode } from "html5-qrcode";
import { Camera, Keyboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { findStudentByScan } from "../lib/utils";

export function ScanPage() {
  const { state } = useStore();
  const navigate = useNavigate();
  const [manual, setManual] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  function resolveCode(code: string) {
    const student = findStudentByScan(state.students, code);
    if (student) {
      navigate(`/students/${student.id}`);
      return;
    }
    setError(`Student not found for “${code.trim()}”.`);
  }

  useEffect(() => {
    return () => {
      scannerRef.current?.stop().catch(() => undefined);
    };
  }, []);

  async function startScan() {
    setError(null);
    setScanning(true);
    try {
      const scanner = new Html5Qrcode("pia-scanner");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 8, qrbox: { width: 240, height: 240 } },
        (text) => {
          scanner.stop().catch(() => undefined);
          setScanning(false);
          resolveCode(text);
        },
        () => undefined,
      );
    } catch {
      setScanning(false);
      setError("Camera could not start. Enter the student ID instead.");
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-3xl">Scan student ID</h1>
      <p className="text-slate">Point the camera at a student ID barcode or QR code. Demo IDs look like STU-0142.</p>

      <div id="pia-scanner" className="overflow-hidden rounded-3xl bg-ink/90" />

      {!scanning ? (
        <button
          className="tap flex w-full items-center justify-center gap-2 rounded-2xl bg-forest font-semibold text-white"
          onClick={startScan}
        >
          <Camera className="size-5" /> Open camera
        </button>
      ) : (
        <button
          className="tap w-full rounded-2xl bg-paper font-semibold ring-1 ring-black/10"
          onClick={async () => {
            await scannerRef.current?.stop().catch(() => undefined);
            setScanning(false);
          }}
        >
          Stop camera
        </button>
      )}

      <form
        className="space-y-3 rounded-3xl bg-paper p-4 ring-1 ring-black/5"
        onSubmit={(e) => {
          e.preventDefault();
          if (!manual.trim()) return;
          resolveCode(manual);
        }}
      >
        <p className="flex items-center gap-2 font-semibold">
          <Keyboard className="size-4" /> Enter ID
        </p>
        <input
          className="tap w-full rounded-2xl bg-cream px-4 outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-teal"
          placeholder="STU-0142"
          value={manual}
          onChange={(e) => setManual(e.target.value)}
        />
        <button className="tap w-full rounded-2xl bg-teal font-semibold text-white" type="submit">
          Fetch student
        </button>
      </form>

      {error && (
        <div className="space-y-3 rounded-2xl bg-coral/10 p-4 text-coral">
          <p className="font-medium">{error}</p>
          <button
            className="tap w-full rounded-2xl bg-forest font-semibold text-white"
            onClick={() => navigate(`/students/new?id=${encodeURIComponent(manual.trim())}`)}
          >
            Add student
          </button>
        </div>
      )}
    </div>
  );
}
