import React from 'react';
import Link from 'next/link';
import LogoutButton from '@/src/components/LogoutButton';
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav - chỉ hiện trên /admin index, không hiện bên trong AdminPanel */}
      <nav className="border-b border-slate-100 bg-white px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
          ← Danh sách làng
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/admin/new" className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white whitespace-nowrap">
            + Làng mới
          </Link>
          <Link href="/" className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition whitespace-nowrap">
            Trang chủ
          </Link>
          <LogoutButton />
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
