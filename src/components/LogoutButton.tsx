'use client';

import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import React, { useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error(e);
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50"
    >
      <LogOut className="w-3.5 h-3.5" />
      {loading ? 'Đang xuất...' : 'Đăng xuất'}
    </button>
  );
}
