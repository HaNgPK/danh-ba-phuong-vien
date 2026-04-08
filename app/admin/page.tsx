import Link from 'next/link';
import { getAllVillages } from '@/src/lib/villages';

export const revalidate = 0;

export default async function AdminIndexPage() {
  let villages: Awaited<ReturnType<typeof getAllVillages>> = [];

  try {
    villages = await getAllVillages();
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="space-y-8 px-4">
      <section className="rounded-[24px] md:rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
          Admin hub
        </p>
        <h2 className="mt-2 text-2xl md:text-3xl font-black text-slate-900">
          Quản lý router và làng
        </h2>
        <p className="mt-2 max-w-3xl text-sm text-slate-500">
          /admin là trang quản lý các router của từng làng. Từ đây bạn chọn
          vào settings để sửa cấu hình route, scope, thông tin làng, hoặc vào
          workspace để sửa danh bạ và xem preview.
        </p>
        <div className="mt-5">
          <Link
            href="/admin/new"
            className="inline-flex rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Tạo làng mới
          </Link>
        </div>
      </section>

      {villages.length === 0 ? (
        <section className="rounded-[24px] md:rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <h3 className="text-xl font-black text-slate-900">Chưa có làng nào</h3>
          <p className="mt-2 text-sm text-slate-500">
            Bạn chưa tạo router/làng nào trong hệ thống. Bấm nút bên dưới để khởi tạo làng đầu tiên.
          </p>
          <div className="mt-6">
            <Link
              href="/admin/new"
              className="inline-flex rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
            >
              Tạo làng đầu tiên
            </Link>
          </div>
        </section>
      ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {villages.map((village: any) => (
          <article
            key={village.id}
            className="rounded-[24px] md:rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              /{village.slug}
            </p>
            <h3 className="mt-3 text-xl md:text-2xl font-black text-slate-900 break-words">
              {village.fullName}
            </h3>
            <p className="mt-2 text-sm text-slate-500">{village.address}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={`/admin/${village.slug}/settings`}
                className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white"
              >
                Settings route
              </Link>
              <Link
                href={`/admin/${village.slug}`}
                className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-700"
              >
                Workspace
              </Link>
              <Link
                href={`/${village.slug}`}
                className="rounded-2xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700"
              >
                Xem public
              </Link>
            </div>
          </article>
        ))}
      </div>
      )}
    </div>
  );
}
