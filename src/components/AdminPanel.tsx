"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  ChevronDown,
  Eye,
  Pencil,
  Phone,
  Plus,
  Save,
  Trash2,
  Users,
  X,
  Link as LinkIcon,
  Camera,
  Upload,
} from "lucide-react";
import DirectoryClient from "@/src/components/DirectoryClient";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/src/utils/cropImage";

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = "cau-hinh" | "thon-xom" | "danh-ba" | "xem-truoc";
type InitialTab = Tab | "settings";

interface Village {
  id: string;
  slug: string;
  name: string;
  fullName: string;
  address: string;
  logoUrl?: string;
  facebookUrl?: string;
  zaloUrl?: string;
  emergencyPolicePhone?: string;
  emergencyHealthPhone?: string;
}

interface Scope {
  id?: string;
  code: string;
  name: string;
  message?: string;
  disabled: boolean;
  order: number;
  villageId?: string;
}

interface Contact {
  id: string;
  scope: string;
  category: string;
  categoryDesc?: string;
  fullName: string;
  role: string;
  phone: string;
  address?: string;
  avatarUrl?: string;
  displayType: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "cau-hinh", label: "Cấu hình làng", icon: <Building2 size={15} /> },
  { key: "danh-ba", label: "Danh bạ", icon: <Phone size={15} /> },
  { key: "xem-truoc", label: "Xem trước", icon: <Eye size={15} /> },
];

const CATEGORY_PRESETS = [
  { value: "Cấp ủy chi bộ", desc: "Cơ quan lãnh đạo toàn diện" },
  { value: "Ban lãnh đạo thôn", desc: "Cơ quan quản lý hành chính nhà nước tại cơ sở" },
  { value: "An ninh trật tự", desc: "Lực lượng nòng cốt bảo vệ bình yên xóm làng" },
  { value: "Trưởng các chi hội đoàn thể", desc: "Hệ thống chính trị – xã hội" },
  { value: "Ban trị sự", desc: "Quản lý di tích văn hóa tín ngưỡng" },
  { value: "Trưởng các xóm", desc: "Cánh tay nối dài của chính quyền thôn" },
];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ─── Input & Label Components ─────────────────────────────────────────────────
function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

const inputCls =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none disabled:bg-slate-50 disabled:text-slate-500";

const selectCls =
  "w-full rounded-xl border-2 border-slate-200 bg-white px-3.5 py-3 text-sm font-semibold text-slate-900 transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none";

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminPanel({
  village,
  initialContacts,
  initialScopes,
  initialButtons,
  initialTab,
}: {
  village?: Village;
  initialContacts: Contact[];
  initialScopes?: Scope[];
  initialButtons?: any[];
  initialTab?: InitialTab;
}) {
  const router = useRouter();
  const defaultTab: Tab = initialTab === "settings" ? "cau-hinh" : initialTab ?? "danh-ba";

  // Default scope nếu chưa có thôn nào
  const defaultScopeList: Scope[] =
    initialScopes && initialScopes.length > 0
      ? initialScopes
      : [{ code: "chung", name: "Toàn làng / Chung", message: "", disabled: false, order: 0 }];

  const [tab, setTab] = useState<Tab>(defaultTab);
  const [saving, setSaving] = useState<string>("");
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [scopes, setScopes] = useState<Scope[]>(defaultScopeList);
  const [editingContactId, setEditingContactId] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [avatarMethod, setAvatarMethod] = useState<"url" | "upload" | "camera">("url");
  const [cropState, setCropState] = useState<{ imageSrc: string | null; pixelCrop: any; targetField: "logo" | "avatar" | null }>({ imageSrc: null, pixelCrop: null, targetField: null });
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [villageForm, setVillageForm] = useState<Village>({
    id: village?.id ?? "",
    slug: village?.slug ?? "",
    name: village?.name ?? "",
    fullName: village?.fullName ?? "",
    address: village?.address ?? "",
    logoUrl: village?.logoUrl ?? "",
    facebookUrl: village?.facebookUrl ?? "",
    zaloUrl: village?.zaloUrl ?? "",
    emergencyPolicePhone: village?.emergencyPolicePhone ?? "",
    emergencyHealthPhone: village?.emergencyHealthPhone ?? "",
  });

  const blankContact = {
    id: "",
    scope: scopes[0]?.code ?? "chung",
    category: "Chung",
    categoryDesc: "",
    fullName: "",
    role: "",
    phone: "",
    address: "",
    avatarUrl: "",
    displayType: "normal",
  };
  const [contactForm, setContactForm] = useState<typeof blankContact>(blankContact);

  const previewButtons = useMemo(
    () => (initialButtons ?? []).filter((b: any) => b.type !== "emergency"),
    [initialButtons],
  );

  // ── Helpers ──────────────────────────────────────────────────────────────
  const handleFileSelectForCrop = (e: React.ChangeEvent<HTMLInputElement>, targetField: "logo" | "avatar") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCropState({ imageSrc: url, pixelCrop: null, targetField });
    e.target.value = "";
  };

  const handleApproveCrop = async () => {
    if (!cropState.imageSrc || !cropState.pixelCrop) return;
    try {
      const croppedBlob = await getCroppedImg(cropState.imageSrc, cropState.pixelCrop);
      if (!croppedBlob) throw new Error("Cắt ảnh thất bại.");
      const formData = new FormData();
      formData.append("file", croppedBlob, "cropped.jpg");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (data.success) {
        if (cropState.targetField === "avatar") {
          setContactForm({ ...contactForm, avatarUrl: data.url });
        } else if (cropState.targetField === "logo") {
          setVillageForm({ ...villageForm, logoUrl: data.url });
        }
        setCropState({ imageSrc: null, pixelCrop: null, targetField: null });
      }
    } catch {
      alert("Lỗi tải lên ảnh sau khi cắt.");
    }
  };

  const resetContactForm = () => {
    setEditingContactId("");
    setContactForm({ ...blankContact, scope: scopes[0]?.code ?? "chung" });
  };

  const filteredContacts = contacts.filter((c) => {
    const matchSearch = searchKeyword
      ? c.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        c.role.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        c.phone.includes(searchKeyword)
      : true;
    return matchSearch;
  });

  // ── API Calls ─────────────────────────────────────────────────────────────
  async function saveVillage() {
    setSaving("cau-hinh");
    try {
      const res = await fetch(`/api/villages/${villageForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(villageForm),
      });
      if (!res.ok) throw new Error();
      router.refresh();
      alert("Đã lưu cấu hình làng.");
    } catch {
      alert("Không lưu được cấu hình, vui lòng thử lại.");
    } finally {
      setSaving("");
    }
  }

  async function saveScopes() {
    setSaving("thon-xom");
    try {
      const saved: Scope[] = [];
      for (const scope of scopes) {
        const res = await fetch(
          scope.id ? `/api/group-scopes/${scope.id}` : "/api/group-scopes",
          {
            method: scope.id ? "PUT" : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...scope, villageId: villageForm.id }),
          },
        );
        if (!res.ok) throw new Error();
        saved.push(await res.json());
      }
      setScopes(saved);
      router.refresh();
      alert("Đã lưu danh sách thôn/xóm.");
    } catch {
      alert("Không lưu được thôn/xóm, vui lòng thử lại.");
    } finally {
      setSaving("");
    }
  }

  async function submitContact(e: React.FormEvent) {
    e.preventDefault();
    setSaving("danh-ba");
    try {
      const endpoint = editingContactId
        ? `/api/contacts/${editingContactId}`
        : "/api/contacts";
      const method = editingContactId ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...contactForm, villageId: villageForm.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Lỗi không xác định");
      }
      const saved: Contact = await res.json();
      setContacts((prev) =>
        editingContactId
          ? prev.map((c) => (c.id === saved.id ? saved : c))
          : [saved, ...prev],
      );
      resetContactForm();
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setSaving("");
    }
  }

  async function deleteContact(id: string) {
    if (!confirm("Xác nhận xóa liên hệ này?")) return;
    try {
      const res = await fetch(`/api/contacts/${id}?villageId=${villageForm.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      setContacts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Không xóa được liên hệ.");
    }
  }

  function startEditContact(c: Contact) {
    setEditingContactId(c.id);
    setContactForm({
      id: c.id,
      scope: c.scope,
      category: c.category,
      categoryDesc: c.categoryDesc ?? "",
      fullName: c.fullName,
      role: c.role,
      phone: c.phone,
      address: c.address ?? "",
      avatarUrl: c.avatarUrl ?? "",
      displayType: c.displayType,
    });
    setTab("danh-ba");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── UI Render ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            /admin/{villageForm.slug}
          </p>
          <h1 className="mt-1 text-xl md:text-2xl font-black text-slate-900 break-words">
            {villageForm.fullName || "Quản trị danh bạ"}
          </h1>
          {/* Tabs */}
          <div className="mt-4 flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`shrink-0 inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  tab === t.key
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 md:px-6">
        {/* ══════════════════════════════════════════════════
            TAB 1 — CẤU HÌNH LÀNG
        ══════════════════════════════════════════════════ */}
        {tab === "cau-hinh" && (
          <div className="space-y-6">
            <Card
              title="Thông tin cơ bản"
              desc="Tên làng, slug URL và địa chỉ hiển thị trên giao diện người dùng."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tên rút gọn (hiển thị header)" required>
                  <input
                    value={villageForm.name}
                    onChange={(e) => setVillageForm({ ...villageForm, name: e.target.value })}
                    placeholder="vd: Phương Viên"
                    className={inputCls}
                  />
                </Field>
                <Field label="Slug URL (tự động tạo)">
                  <input
                    value={villageForm.slug}
                    onChange={(e) => setVillageForm({ ...villageForm, slug: slugify(e.target.value) })}
                    placeholder="vd: phuong-vien"
                    className={inputCls}
                  />
                </Field>
                <Field label="Tên đầy đủ (hiển thị hero section)" required className="sm:col-span-2">
                  <input
                    value={villageForm.fullName}
                    onChange={(e) => setVillageForm({ ...villageForm, fullName: e.target.value })}
                    placeholder="vd: Làng văn hóa Phương Viên"
                    className={inputCls}
                  />
                </Field>
                <Field label="Địa chỉ" required className="sm:col-span-2">
                  <input
                    value={villageForm.address}
                    onChange={(e) => setVillageForm({ ...villageForm, address: e.target.value })}
                    placeholder="vd: Xã Sơn Đồng, Huyện Hoài Đức, Hà Nội"
                    className={inputCls}
                  />
                </Field>
                <Field label="Logo làng (URL hoặc Tải lên cắt vuông)" className="sm:col-span-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        value={villageForm.logoUrl || ""}
                        onChange={(e) => setVillageForm({ ...villageForm, logoUrl: e.target.value })}
                        placeholder="https://..."
                        className={`flex-1 ${inputCls}`}
                      />
                      <label className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer hover:bg-slate-200 flex items-center justify-center gap-2 border-2 border-slate-200 transition shrink-0">
                        <Upload size={18} />
                        <span className="hidden sm:inline">Tải lên & Cắt</span>
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelectForCrop(e, "logo")} />
                      </label>
                    </div>
                    {villageForm.logoUrl && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-4">
                        <img 
                          src={villageForm.logoUrl} 
                          alt="Logo Preview" 
                          className="w-16 h-16 rounded-xl object-cover border-2 border-slate-100 shadow-sm shrink-0 bg-slate-50" 
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Logo đang dùng</span>
                          <span className="text-sm font-semibold text-green-700 truncate mt-0.5">
                            {villageForm.logoUrl}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
              </div>
            </Card>

            <Card
              title="Số điện thoại khẩn cấp"
              desc="Hiển thị nổi bật trên giao diện để người dân gọi nhanh khi cần."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="SĐT Công an / Cảnh sát khu vực">
                  <input
                    value={villageForm.emergencyPolicePhone}
                    onChange={(e) => setVillageForm({ ...villageForm, emergencyPolicePhone: e.target.value })}
                    placeholder="vd: 024.3322.1668"
                    className={inputCls}
                  />
                </Field>
                <Field label="SĐT Trạm y tế">
                  <input
                    value={villageForm.emergencyHealthPhone}
                    onChange={(e) => setVillageForm({ ...villageForm, emergencyHealthPhone: e.target.value })}
                    placeholder="vd: 098.765.4321"
                    className={inputCls}
                  />
                </Field>
              </div>
            </Card>

            <Card
              title="Kênh thông tin mạng xã hội"
              desc="Link tham gia nhóm Zalo và Fanpage Facebook của làng."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Link nhóm Zalo cư dân">
                  <input
                    value={villageForm.zaloUrl}
                    onChange={(e) => setVillageForm({ ...villageForm, zaloUrl: e.target.value })}
                    placeholder="https://zalo.me/g/..."
                    className={inputCls}
                  />
                </Field>
                <Field label="Link Fanpage Facebook">
                  <input
                    value={villageForm.facebookUrl}
                    onChange={(e) => setVillageForm({ ...villageForm, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/..."
                    className={inputCls}
                  />
                </Field>
              </div>
            </Card>

            <div className="flex justify-end">
              <SaveButton onClick={saveVillage} loading={saving === "cau-hinh"}>
                Lưu cấu hình làng
              </SaveButton>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 2 — THÔN / XÓM (SCOPES)
        ══════════════════════════════════════════════════ */}
        {tab === "thon-xom" && (
          <div className="space-y-4">
            <Card
              title="Quản lý Thôn / Xóm"
              desc={
                scopes.length === 1 && scopes[0].code === "chung"
                  ? "Làng chỉ có 1 đơn vị (toàn làng). Nếu làng gồm nhiều thôn, hãy thêm thôn tương ứng bên dưới."
                  : `Hiện có ${scopes.length} thôn/xóm. Nhấn "+ Thêm thôn" để thêm mới.`
              }
            >
              <div className="space-y-3">
                {scopes.map((scope, idx) => (
                  <div
                    key={scope.id ?? `s-${idx}`}
                    className="rounded-xl border-2 border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-black text-slate-800">
                        {scope.name || "Thôn mới"}
                        {scope.disabled && (
                          <span className="ml-2 text-xs font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                            Đang khoá
                          </span>
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (scope.id) {
                            const res = await fetch(`/api/group-scopes/${scope.id}`, {
                              method: "DELETE",
                            });
                            if (!res.ok) return alert("Không xóa được thôn.");
                          }
                          setScopes((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="text-rose-500 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-50 transition"
                        title="Xóa thôn này"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Mã thôn (slug code)">
                        <input
                          value={scope.code}
                          onChange={(e) =>
                            setScopes((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, code: slugify(e.target.value) } : s,
                              ),
                            )
                          }
                          placeholder="vd: thon1"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Tên hiển thị">
                        <input
                          value={scope.name}
                          onChange={(e) =>
                            setScopes((prev) =>
                              prev.map((s, i) => (i === idx ? { ...s, name: e.target.value } : s)),
                            )
                          }
                          placeholder="vd: Thôn Phương Viên 1"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Thứ tự hiển thị">
                        <input
                          type="number"
                          value={scope.order}
                          onChange={(e) =>
                            setScopes((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, order: Number(e.target.value) } : s,
                              ),
                            )
                          }
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Thông báo khi khoá (tùy chọn)">
                        <input
                          value={scope.message ?? ""}
                          onChange={(e) =>
                            setScopes((prev) =>
                              prev.map((s, i) =>
                                i === idx ? { ...s, message: e.target.value } : s,
                              ),
                            )
                          }
                          placeholder="vd: Đang cập nhật dữ liệu..."
                          className={inputCls}
                        />
                      </Field>
                      <div className="sm:col-span-2">
                        <label className="flex items-center gap-2.5 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={Boolean(scope.disabled)}
                            onChange={(e) =>
                              setScopes((prev) =>
                                prev.map((s, i) =>
                                  i === idx ? { ...s, disabled: e.target.checked } : s,
                                ),
                              )
                            }
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-semibold text-slate-700">
                            Khoá thôn này (không hiển thị danh bạ cho người dân)
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setScopes((prev) => [
                      ...prev,
                      {
                        code: `thon${prev.length + 1}`,
                        name: `Thôn ${prev.length + 1}`,
                        message: "",
                        disabled: false,
                        order: prev.length,
                        villageId: villageForm.id,
                      },
                    ])
                  }
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:text-blue-600 transition"
                >
                  <Plus size={16} />
                  Thêm thôn / xóm
                </button>
                <SaveButton onClick={saveScopes} loading={saving === "thon-xom"}>
                  Lưu danh sách thôn
                </SaveButton>
              </div>

              <p className="mt-3 text-xs text-slate-400 font-medium">
                💡 Nếu làng chỉ có 1 đơn vị, giữ nguyên "Toàn làng / Chung" là đủ — không cần thêm thôn.
              </p>
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 3 — DANH BẠ
        ══════════════════════════════════════════════════ */}
        {tab === "danh-ba" && (
          <div className="space-y-6">
            {/* Form thêm / sửa */}
            <Card
              title={editingContactId ? "✏️ Chỉnh sửa liên hệ" : "+ Thêm liên hệ mới"}
              desc="Điền đầy đủ thông tin. Ảnh đại diện có thể để trống (hệ thống tự tạo từ tên)."
            >
              <form onSubmit={submitContact} className="grid gap-4 sm:grid-cols-2">
                {/* Tên */}
                <Field label="Họ và tên" required>
                  <input
                    value={contactForm.fullName}
                    onChange={(e) => setContactForm({ ...contactForm, fullName: e.target.value })}
                    placeholder="vd: Nguyễn Văn An"
                    className={inputCls}
                    required
                  />
                </Field>

                {/* Chức vụ */}
                <Field label="Chức vụ / Chức danh" required>
                  <input
                    value={contactForm.role}
                    onChange={(e) => setContactForm({ ...contactForm, role: e.target.value })}
                    placeholder="vd: Bí thư Chi bộ"
                    className={inputCls}
                    required
                  />
                </Field>

                {/* SĐT */}
                <Field label="Số điện thoại" required>
                  <input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder="vd: 0912 345 678"
                    className={inputCls}
                    required
                    inputMode="tel"
                  />
                </Field>

                {/* Địa chỉ nhà */}
                <Field label="Địa chỉ nhà (tùy chọn)" className="sm:col-span-2">
                  <input
                    value={contactForm.address || ""}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    placeholder="Số nhà, đường, phân khu..."
                    className={inputCls}
                  />
                </Field>

                {/* Avatar (enhanced) */}
                <Field label="Ảnh đại diện (tùy chọn)" className="sm:col-span-2">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
                      {["url", "upload", "camera"].map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setAvatarMethod(m as "url"|"upload"|"camera")}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition ${avatarMethod === m ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                        >
                          {m === "url" && <><LinkIcon size={14}/> URL</>}
                          {m === "upload" && <><Upload size={14}/> Tải lên</>}
                          {m === "camera" && <><Camera size={14}/> Chụp ảnh</>}
                        </button>
                      ))}
                    </div>
                    {avatarMethod === "url" && (
                      <input
                        value={contactForm.avatarUrl}
                        onChange={(e) => setContactForm({ ...contactForm, avatarUrl: e.target.value })}
                        placeholder="https://..."
                        className={inputCls}
                      />
                    )}
                    {avatarMethod === "upload" && (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelectForCrop(e, "avatar")}
                        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3.5 py-6 text-sm font-medium text-slate-600 transition hover:border-blue-500"
                      />
                    )}
                    {avatarMethod === "camera" && (
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={(e) => handleFileSelectForCrop(e, "avatar")}
                        className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3.5 py-6 text-sm font-medium text-slate-600 transition hover:border-blue-500"
                      />
                    )}
                    {contactForm.avatarUrl && (
                      <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-center gap-4 mt-2">
                        <img 
                          src={contactForm.avatarUrl} 
                          alt="Avatar Preview" 
                          className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm shrink-0 bg-slate-50" 
                        />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ảnh đang dùng</span>
                          <span className="text-sm font-semibold text-green-700 truncate mt-0.5">
                            {contactForm.avatarUrl}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </Field>

                {/* Kiểu hiển thị */}
                <Field label="Kiểu hiển thị">
                  <select
                    value={contactForm.displayType}
                    onChange={(e) => setContactForm({ ...contactForm, displayType: e.target.value })}
                    className={selectCls}
                  >
                    <option value="normal">Bình thường</option>
                    <option value="highlight">Nổi bật (viền màu)</option>
                  </select>
                </Field>

                {/* Loại bỏ nhóm chức năng theo yêu cầu */}

                {/* Buttons */}
                <div className="sm:col-span-2 flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving === "danh-ba"}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition"
                  >
                    <Save size={16} />
                    {saving === "danh-ba"
                      ? "Đang lưu..."
                      : editingContactId
                      ? "Cập nhật liên hệ"
                      : "Thêm liên hệ"}
                  </button>
                  {editingContactId && (
                    <button
                      type="button"
                      onClick={resetContactForm}
                      className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200 transition"
                    >
                      <X size={16} />
                      Huỷ chỉnh sửa
                    </button>
                  )}
                </div>
              </form>
            </Card>

            {/* Danh sách liên hệ */}
            <Card
              title={`Danh sách liên hệ (${contacts.length})`}
              desc="Tìm kiếm, lọc theo thôn và chỉnh sửa từng liên hệ."
            >
              <div className="flex mb-4">
                <input
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="Tìm theo tên, chức vụ, SĐT..."
                  className="flex-1 min-w-[180px] rounded-xl border-2 border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>

              {filteredContacts.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Users size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-semibold">Chưa có liên hệ nào</p>
                  <p className="text-sm mt-1">Điền form bên trên để thêm người đầu tiên.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredContacts.map((c) => {
                    const scopeLabel = scopes.find((s) => s.code === c.scope)?.name ?? c.scope;
                    const avatarSrc =
                      c.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(c.fullName)}&background=1d4ed8&color=fff&size=64`;
                    return (
                      <div
                        key={c.id}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 transition ${
                          editingContactId === c.id
                            ? "border-blue-400 bg-blue-50"
                            : "border-slate-100 bg-white hover:border-slate-200"
                        }`}
                      >
                        <img
                          src={avatarSrc}
                          alt={c.fullName}
                          className="w-10 h-10 rounded-full object-cover shrink-0 border-2 border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 text-sm truncate">{c.fullName}</p>
                          <p className="text-xs text-slate-500 truncate">
                            {c.role} {scopeLabel !== "Toàn làng / Chung" && `· ${scopeLabel}`}
                          </p>
                          {c.address && (
                            <p className="text-xs text-slate-400 mt-0.5 truncate">{c.address}</p>
                          )}
                          <p className="text-xs text-slate-400 font-mono">{c.phone}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => startEditContact(c)}
                            className="p-2 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition"
                            title="Chỉnh sửa"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => deleteContact(c.id)}
                            className="p-2 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                            title="Xóa"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ══════════════════════════════════════════════════
            TAB 4 — XEM TRƯỚC
        ══════════════════════════════════════════════════ */}
        {tab === "xem-truoc" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Giao diện người dân sẽ thấy tại{" "}
                <span className="text-blue-600">/{villageForm.slug}</span>
              </p>
              <a
                href={`/${villageForm.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white"
              >
                <Eye size={14} />
                Mở trang thật
              </a>
            </div>
            <div className="rounded-2xl border-2 border-slate-200 overflow-hidden">
              <DirectoryClient
                village={villageForm}
                contacts={contacts}
                scopes={scopes}
                buttons={previewButtons}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cropper Modal */}
      {cropState.imageSrc && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Cắt ảnh chuẩn vuông</h3>
              <button type="button" onClick={() => setCropState({ imageSrc: null, pixelCrop: null, targetField: null })} className="p-2 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition">
                <X size={18} />
              </button>
            </div>
            <div className="relative w-full h-[400px] bg-slate-900">
              <Cropper
                image={cropState.imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={(croppedArea, croppedAreaPixels) => setCropState(prev => ({ ...prev, pixelCrop: croppedAreaPixels }))}
              />
            </div>
            <div className="p-4">
              <button type="button" onClick={handleApproveCrop} className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl active:scale-95 transition hover:bg-blue-700">
                Xác nhận & Tải lên
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Sub-Components ────────────────────────────────────────────────────────────
function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border-2 border-slate-100 bg-white p-5 md:p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-black text-slate-900">{title}</h2>
        {desc && <p className="mt-1 text-sm text-slate-500">{desc}</p>}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  children,
  className,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function SaveButton({
  onClick,
  loading,
  children,
}: {
  onClick: () => void;
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 transition"
    >
      <Save size={16} />
      {loading ? "Đang lưu..." : children}
    </button>
  );
}
