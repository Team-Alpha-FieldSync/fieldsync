import { useState } from "react";
import useLoginRedirect from "../../auth/LoginRedirect";

export default function Login() {
  const { handleLogin, loading, error } = useLoginRedirect();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h1>Login Page</h1>

      {error && (
        <p role="alert" className="mb-4 rounded bg-red-100 px-3 py-2 text-red-800">
          {error}
        </p>
      )}

      <input
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-amber-500 bg-slate-500 text-black"
        aria-invalid={!!error}
      />

      <input
        placeholder="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border border-amber-500 bg-slate-500 text-black"
        aria-invalid={!!error}
      />

      <button
        type="button"
        onClick={() => handleLogin(email, password)}
        disabled={loading}
        className="bg-amber-500 text-black px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </div>
  );
}