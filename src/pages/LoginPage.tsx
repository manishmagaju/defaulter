import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";

export function LoginPage() {
  const { login } = useStore();
  const navigate = useNavigate();
  const [username, setUsername] = useState("teacher");
  const [password, setPassword] = useState("teacher123");
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="mx-auto flex min-h-svh max-w-md flex-col justify-center px-5 py-10">
      <div className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">Proxima International Academy</p>
        <h1 className="mt-2 font-display text-4xl text-ink">Homework Defaulters</h1>
        <p className="mt-2 text-slate">Sign in to scan, record, and follow up on incomplete homework.</p>
      </div>

      <form
        className="space-y-4 rounded-3xl bg-paper p-5 shadow-[0_20px_50px_rgba(16,39,52,0.08)] ring-1 ring-black/5"
        onSubmit={(e) => {
          e.preventDefault();
          const msg = login(username, password);
          if (msg) setError(msg);
          else navigate("/");
        }}
      >
        <label className="block text-sm font-medium">
          Username
          <input
            className="tap mt-1 w-full rounded-2xl border-0 bg-cream px-4 text-base outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-teal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            className="tap mt-1 w-full rounded-2xl border-0 bg-cream px-4 text-base outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-teal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>
        {error && <p className="text-sm text-coral">{error}</p>}
        <button className="tap w-full rounded-2xl bg-forest text-base font-semibold text-white" type="submit">
          Continue
        </button>
      </form>

      <div className="mt-6 space-y-2 rounded-2xl bg-white/50 p-4 text-sm text-slate ring-1 ring-black/5">
        <p className="font-semibold text-ink">Demo accessssssssssss</p>  
        <p>Teacher (Math): <span className="font-medium text-ink">teacher / teacher123</span></p>
        <p>Science teacher: <span className="font-medium text-ink">science / teacher123</span></p>
        <p>In-charge: <span className="font-medium text-ink">incharge / admin123</span></p>
      </div>
    </div>
  );
}
