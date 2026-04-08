import React from 'react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav - chỉ hiện trên /admin index, không hiện bên trong AdminPanel */}
      <nav className="border-b border-slate-100 bg-white px-4 py-3 flex items-center justify-between">
        <Link href="/admin" className="text-sm font-bold text-slate-900 hover:text-blue-600 transition">
          ← Danh sách làng
        </Link>
        <div className="flex gap-2">
          <Link href="/admin/new" className="rounded-xl bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">
            + Làng mới
          </Link>
          <Link href="/" className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
            Trang chủ
          </Link>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
