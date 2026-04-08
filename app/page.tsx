import Link from 'next/link';
import { getAllVillages } from '@/src/lib/villages';

export const revalidate = 0;

export default async function HomePage() {
  let villages: Awaited<ReturnType<typeof getAllVillages>> = [];

  try {
    villages = await getAllVillages();
  } catch (error) {
    console.error(error);
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Danh bạ điện tử
          </p>
          <h1 className="text-4xl font-black tracking-tight">
            Chọn làng để truy cập
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-slate-600">
            Hệ thống đang được tách theo từng làng. Mỗi làng có route công khai
            và khu quản trị riêng.
          </p>
        </div>

        {villages.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-base font-semibold">Chưa có làng nào trong hệ thống.</p>
            <p className="mt-2 text-sm text-slate-500">
              Bạn có thể tạo dữ liệu mẫu qua API seed sau khi migration xong.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {villages.map((village: any) => (
              <article
                key={village.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                  /{village.slug}
                </p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {village.fullName}
                </h2>
                <p className="mt-2 text-sm text-slate-600">{village.address}</p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/${village.slug}`}
                    className="flex-1 text-center whitespace-nowrap rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                  >
                    Xem công khai
                  </Link>
                  <Link
                    href={`/admin/${village.slug}`}
                    className="flex-1 text-center whitespace-nowrap rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                  >
                    Quản trị
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
