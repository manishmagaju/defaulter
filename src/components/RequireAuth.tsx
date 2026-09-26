import { Navigate, Outlet } from "react-router-dom";
import { useStore } from "../lib/store";

export function RequireAuth() {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/login" replace />;
  return <Outlet />;
}
