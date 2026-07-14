import React, { useState } from "react";
import { signIn } from "next-auth/react";

const inputClass =
  "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-zinc-100 placeholder-zinc-500 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40";

const labelClass = "mb-1 block text-xs font-medium uppercase tracking-wide text-zinc-400";

const LoginModal: React.FC = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Não foi possível criar a conta.");
          setLoading(false);
          return;
        }
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("E-mail ou senha inválidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-fade-in rounded-2xl border border-white/10 bg-zinc-900/70 p-8 shadow-2xl backdrop-blur-xl">
        <h2 className="font-display text-center text-3xl text-amber-300">
          {mode === "login" ? "Bem-vindo de volta" : "Criar conta"}
        </h2>
        <p className="mb-6 mt-1 text-center text-sm text-zinc-400">
          {mode === "login"
            ? "Entre para participar dos leilões ao vivo"
            : "Cadastre-se para dar seus lances"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className={labelClass}>Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className={inputClass}
              />
            </div>
          )}
          <div>
            <label className={labelClass}>E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@exemplo.com"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gradient-to-r from-amber-500 to-amber-400 py-2.5 font-semibold text-zinc-950 shadow-gold transition hover:from-amber-400 hover:to-amber-300 disabled:opacity-50"
          >
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar conta e entrar"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setError("");
            setMode(mode === "login" ? "register" : "login");
          }}
          className="mt-4 w-full text-center text-sm text-amber-400/80 transition hover:text-amber-300 hover:underline"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
