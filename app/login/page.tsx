'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LockKeyhole, User, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirection should be fast
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.message || 'Xác thực thất bại');
        setLoading(false);
      }
    } catch (err) {
      setError('Lỗi kết nối. Vui lòng thử lại.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-[#0B0F19] relative overflow-hidden">
      {/* Background aesthetic blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/30 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md p-8 m-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-2xl shadow-2xl relative z-10"
      >
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(59,130,246,0.5)]"
          >
            <LockKeyhole className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Hệ Thống Quản Trị</h1>
          <p className="text-slate-400 text-sm">Vui lòng đăng nhập để tiếp tục</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-xl text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 focus:bg-black/40 rounded-xl outline-none text-white transition-all placeholder:text-slate-500"
                placeholder="Tài khoản admin"
                required
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <LockKeyhole className="h-5 w-5 text-slate-400 group-focus-within:text-blue-400 transition-colors" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-white/[0.08] hover:border-white/[0.15] focus:border-blue-500 focus:bg-black/40 rounded-xl outline-none text-white transition-all placeholder:text-slate-500"
                placeholder="Mật khẩu"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white text-black hover:bg-slate-200 focus:ring-4 focus:ring-white/20 font-bold rounded-xl outline-none transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-8 relative overflow-hidden group"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Đăng Nhập</span>
                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
