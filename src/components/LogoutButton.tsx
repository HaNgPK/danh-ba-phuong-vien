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
      className="flex items-center gap-1.5 rounded-xl bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 text-xs font-bold hover:bg-red-100 transition-colors disabled:opacity-50 whitespace-nowrap"
    >
      <LogOut className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
      <span className="hidden sm:inline">
        {loading ? 'Đang xuất...' : 'Đăng xuất'}
      </span>
    </button>
  );
}
