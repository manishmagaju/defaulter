import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { StoreProvider } from "./lib/store";
import { AddDefaulterPage } from "./pages/AddDefaulterPage";
import { AddStudentPage } from "./pages/AddStudentPage";
import { DashboardPage } from "./pages/DashboardPage";
import { LoginPage } from "./pages/LoginPage";
import { RecordActionPage } from "./pages/RecordActionPage";
import { ReportsPage } from "./pages/ReportsPage";
import { SearchPage } from "./pages/SearchPage";
import { StudentListPage } from "./pages/StudentListPage";
import { StudentProfilePage } from "./pages/StudentProfilePage";

const ScanPage = lazy(() => import("./pages/ScanPage").then((m) => ({ default: m.ScanPage })));

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAuth />}>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route
                path="scan"
                element={
                  <Suspense fallback={<p className="text-slate">Opening scanner…</p>}>
                    <ScanPage />
                  </Suspense>
                }
              />
              <Route path="search" element={<SearchPage />} />
              <Route path="students" element={<StudentListPage />} />
              <Route path="students/new" element={<AddStudentPage />} />
              <Route path="students/:studentId" element={<StudentProfilePage />} />
              <Route path="students/:studentId/defaulter" element={<AddDefaulterPage />} />
              <Route path="records/:recordId" element={<RecordActionPage />} />
              <Route path="reports" element={<ReportsPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
