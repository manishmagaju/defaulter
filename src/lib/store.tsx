import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createInitialState } from "../data/seed";
import type {
  ActionTaken,
  AppState,
  DefaulterRecord,
  DefaulterStatus,
  Staff,
  Student,
  Subject,
} from "../types";

const STORAGE = "pia-homework-defaulters-v3";
const SESSION = "pia-homework-session";

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed.students?.length && parsed.subjects?.length) return parsed;
    }
  } catch {
    /* fall through */
  }
  return createInitialState();
}

function persist(state: AppState) {
  localStorage.setItem(STORAGE, JSON.stringify(state));
}

interface StoreValue {
  state: AppState;
  currentUser: Staff | null;
  login: (username: string, password: string) => string | null;
  logout: () => void;
  addStudent: (student: Student) => { ok: boolean; error?: string };
  updateStudent: (student: Student) => void;
  addRecord: (input: Omit<DefaulterRecord, "id" | "createdAt" | "status"> & { status?: DefaulterStatus }) => DefaulterRecord;
  updateRecord: (id: string, patch: Partial<DefaulterRecord>) => void;
  setRecordAction: (id: string, action: ActionTaken, status?: DefaulterStatus) => void;
  setRecordStatus: (id: string, status: DefaulterStatus) => void;
  upsertSubject: (subject: Subject) => void;
  resetDemo: () => void;
  allowedSubjects: Subject[];
}

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const s = loadState();
    persist(s);
    return s;
  });
  const [currentUser, setCurrentUser] = useState<Staff | null>(() => {
    const id = sessionStorage.getItem(SESSION);
    if (!id) return null;
    return loadState().staff.find((s) => s.id === id) ?? null;
  });

  const commit = useCallback((updater: (prev: AppState) => AppState) => {
    setState((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const login = useCallback((username: string, password: string) => {
    const staff = state.staff.find(
      (s) => s.username.toLowerCase() === username.trim().toLowerCase() && s.password === password,
    );
    if (!staff) return "Invalid username or password.";
    setCurrentUser(staff);
    sessionStorage.setItem(SESSION, staff.id);
    return null;
  }, [state.staff]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem(SESSION);
  }, []);

  const addStudent = useCallback((student: Student) => {
    let error: string | undefined;
    commit((prev) => {
      if (prev.students.some((s) => s.id === student.id)) {
        error = "A student with this ID already exists.";
        return prev;
      }
      const clash = prev.students.find(
        (s) =>
          s.className === student.className &&
          s.section === student.section &&
          s.rollNumber === student.rollNumber,
      );
      if (clash) {
        error = `Roll ${student.rollNumber} is already used in Class ${student.className}-${student.section}.`;
        return prev;
      }
      return { ...prev, students: [...prev.students, student] };
    });
    return error ? { ok: false, error } : { ok: true };
  }, [commit]);

  const updateStudent = useCallback((student: Student) => {
    commit((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === student.id ? student : s)),
    }));
  }, [commit]);

  const addRecord = useCallback(
    (input: Omit<DefaulterRecord, "id" | "createdAt" | "status"> & { status?: DefaulterStatus }) => {
      const record: DefaulterRecord = {
        ...input,
        id: `DEF-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: input.status ?? "Pending",
      };
      commit((prev) => ({ ...prev, records: [record, ...prev.records] }));
      return record;
    },
    [commit],
  );

  const updateRecord = useCallback((id: string, patch: Partial<DefaulterRecord>) => {
    commit((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));
  }, [commit]);

  const setRecordAction = useCallback(
    (id: string, action: ActionTaken, status?: DefaulterStatus) => {
      commit((prev) => ({
        ...prev,
        records: prev.records.map((r) =>
          r.id === id
            ? { ...r, action, status: status ?? (action.action === "No Action Yet" ? r.status : "Follow-up Required") }
            : r,
        ),
      }));
    },
    [commit],
  );

  const setRecordStatus = useCallback((id: string, status: DefaulterStatus) => {
    commit((prev) => ({
      ...prev,
      records: prev.records.map((r) => (r.id === id ? { ...r, status } : r)),
    }));
  }, [commit]);

  const upsertSubject = useCallback((subject: Subject) => {
    commit((prev) => {
      const exists = prev.subjects.some((s) => s.id === subject.id);
      const subjects = exists
        ? prev.subjects.map((s) => (s.id === subject.id ? subject : s))
        : [...prev.subjects, subject];
      const staff = prev.staff.map((member) =>
        member.role === "incharge"
          ? { ...member, subjectIds: subjects.filter((s) => s.active).map((s) => s.id) }
          : member,
      );
      return { ...prev, subjects, staff };
    });
  }, [commit]);

  const resetDemo = useCallback(() => {
    const fresh = createInitialState();
    persist(fresh);
    setState(fresh);
  }, []);

  const allowedSubjects = useMemo(() => {
    if (!currentUser) return [];
    const live = state.staff.find((s) => s.id === currentUser.id) ?? currentUser;
    if (live.role === "incharge") return state.subjects.filter((s) => s.active);
    return state.subjects.filter((s) => s.active && live.subjectIds.includes(s.id));
  }, [currentUser, state.subjects, state.staff]);

  const value = useMemo(
    () => ({
      state,
      currentUser,
      login,
      logout,
      addStudent,
      updateStudent,
      addRecord,
      updateRecord,
      setRecordAction,
      setRecordStatus,
      upsertSubject,
      resetDemo,
      allowedSubjects,
    }),
    [
      state,
      currentUser,
      login,
      logout,
      addStudent,
      updateStudent,
      addRecord,
      updateRecord,
      setRecordAction,
      setRecordStatus,
      upsertSubject,
      resetDemo,
      allowedSubjects,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function nextStudentId(students: Student[]) {
  const nums = students.map((s) => Number(s.id.replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  return `STU-${String(max + 1).padStart(4, "0")}`;
}
