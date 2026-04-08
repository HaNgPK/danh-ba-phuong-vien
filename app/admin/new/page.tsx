"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function AdminNewVillagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: '',
    name: '',
    fullName: '',
    address: '',
    logoUrl: '',
    facebookUrl: '',
    zaloUrl: '',
    emergencyPolicePhone: '',
    emergencyHealthPhone: '',
  });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/villages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);

    if (!res.ok) {
      alert('Không tạo được làng mới.');
      return;
    }

    const village = await res.json();
    router.push(`/admin/${village.slug}/settings`);
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <section className="rounded-[32px] border border-slate-200 bg-white p-8 md:p-12 shadow-xl shadow-slate-200/50">
        <div className="mb-10 text-center md:text-left border-b border-slate-100 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-600 mb-3">
            System Initialization
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Khởi tạo router mới
          </h2>
          <p className="mt-3 text-slate-500 max-w-2xl font-medium">
            Điền các thông tin cơ bản để tạo không gian quản trị (Workspace) cho làng. 
            Bạn có thể cấu hình chi tiết hơn sau khi khởi tạo thành công.
          </p>
        </div>

        <form onSubmit={submit} className="grid gap-8">
          {/* Nhóm 1: Định danh */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-l-4 border-blue-500 pl-3">
              1. Định danh router
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Slug Route (URL)</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder="vd: phuong-vien" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Tên Rút Gọn</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="vd: Phương Viên" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" required />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Tên Đầy Đủ Của Làng</label>
                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="vd: Làng văn hóa Phương Viên" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" required />
              </div>
            </div>
          </div>

          {/* Nhóm 2: Thông tin liên hệ */}
          <div className="space-y-6">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 border-l-4 border-blue-500 pl-3">
              2. Thông tin liên hệ & Địa chỉ
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">Địa chỉ chi tiết</label>
                <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="vd: Xã Sơn Đồng, Huyện Hoài Đức, Hà Nội" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" required />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">SĐT Công An</label>
                <input value={form.emergencyPolicePhone} onChange={(e) => setForm({ ...form, emergencyPolicePhone: e.target.value })} placeholder="vd: 024.3322.1668" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700 ml-1">SĐT Y Tế</label>
                <input value={form.emergencyHealthPhone} onChange={(e) => setForm({ ...form, emergencyHealthPhone: e.target.value })} placeholder="vd: 098.7654.321" className="w-full rounded-2xl border-2 border-slate-100 bg-slate-50 px-5 py-4 text-slate-900 font-bold placeholder:text-slate-300 transition-all focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 outline-none" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col md:flex-row items-center gap-4 border-t border-slate-100 pt-10">
            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto min-w-[200px] rounded-2xl bg-blue-600 px-8 py-4 text-base font-black text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
            >
              {saving ? 'Đang khởi tạo...' : 'Khởi tạo làng ngay'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="w-full md:w-auto rounded-2xl bg-slate-100 px-8 py-4 text-base font-bold text-slate-600 transition-all hover:bg-slate-200"
            >
              Quay lại danh sách
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
