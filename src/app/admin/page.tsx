"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/admin/leads");
      } else {
        const data = await res.json();
        setError(data.error || "Đăng nhập thất bại.");
      }
    } catch {
      setError("Không thể kết nối máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
              🔒
            </div>
            <h1 className="text-xl font-bold text-white">Admin Panel</h1>
            <p className="text-slate-400 text-sm mt-1">Du Học Bình Dương</p>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="admin-password" className="block text-sm font-medium text-slate-300 mb-2">
              Mật khẩu
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
              placeholder="Nhập mật khẩu admin"
              autoFocus
            />

            {error && (
              <p className="mt-3 text-sm text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full mt-6 px-4 py-3 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
