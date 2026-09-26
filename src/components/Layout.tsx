import {
  BarChart3,
  LayoutDashboard,
  LogOut,
  QrCode,
  Search,
  Users,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";

const nav = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/scan", label: "Scan", icon: QrCode },
  { to: "/search", label: "Search", icon: Search },
  { to: "/students", label: "Students", icon: Users },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export function Layout() {
  const { currentUser, logout } = useStore();
  const navigate = useNavigate();

  return (
    <div className="mx-auto min-h-svh max-w-6xl">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-forest text-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="font-display text-lg leading-tight tracking-tight">Proxima International Academy</p>
            <p className="text-xs text-white/70">Homework Defaulter Module</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{currentUser?.name}</p>
              <p className="text-[11px] uppercase tracking-wide text-gold">{currentUser?.title}</p>
            </div>
            <button
              className="grid size-11 place-items-center rounded-xl bg-white/10"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              aria-label="Log out"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed top-[4.6rem] bottom-0 left-[max(0px,calc(50%-36rem))] z-10 hidden w-52 border-r border-black/5 bg-paper/80 p-3 backdrop-blur md:block">
        <nav className="space-y-1">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium ${
                  isActive ? "bg-forest text-white" : "text-slate hover:bg-cream"
                }`
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="safe-bottom px-4 py-4 md:ml-52 md:pb-8">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-paper/95 px-2 pt-2 backdrop-blur md:hidden" style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}>
        <div className="mx-auto grid max-w-lg grid-cols-5">
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 rounded-xl py-1 text-[11px] font-medium ${
                  isActive ? "text-teal" : "text-slate"
                }`
              }
            >
              <item.icon className="size-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
