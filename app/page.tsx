// src/app/page.tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Drawer } from "vaul";
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  MessageCircle,
  Facebook,
  Building2,
  ChevronRight,
  ChevronDown,
  MapPin,
  Flag,
  Shield,
  Users,
  Landmark,
  Building,
  Phone,
  ExternalLink,
  Lock as LockIcon,
} from "lucide-react";
import { ContactCard } from "@/src/components/ContactCard";

// 1. CẤU TRÚC CÁC CẤP THÔN (Toàn làng bị Disabled như đã fix)
const SECTIONS = [
  {
    id: "lang",
    label: "Cấp Toàn Làng Phương Viên",
    disabled: true,
    message: "Đang cập nhật",
  },
  { id: "thon1", label: "Thôn Phương Viên 1" },
  { id: "thon2", label: "Thôn Phương Viên 2" },
  { id: "thon3", label: "Thôn Phương Viên 3" },
  { id: "thon4", label: "Thôn Phương Viên 4" },
];

// 2. CẤU HÌNH MÀU SẮC & ICON
const CATEGORY_STYLES: Record<string, any> = {
  "Cấp ủy chi bộ": {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-600",
    icon: Flag,
  },
  "Ban lãnh đạo thôn": {
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: Building,
  },
  "An ninh trật tự": {
    bg: "bg-red-50/50",
    border: "border-red-200",
    text: "text-red-800",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: Shield,
  },
  "Trưởng các chi hội đoàn thể": {
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: Users,
  },
  "Ban trị sự": {
    bg: "bg-teal-50/50",
    border: "border-teal-200",
    text: "text-teal-800",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    icon: Landmark,
  },
  "Trưởng các xóm": {
    bg: "bg-sky-50/50",
    border: "border-sky-200",
    text: "text-sky-800",
    iconBg: "bg-sky-100",
    iconColor: "text-sky-600",
    icon: MapPin,
  },
  default: {
    bg: "bg-gray-50",
    border: "border-gray-200",
    text: "text-gray-800",
    iconBg: "bg-gray-200",
    iconColor: "text-gray-600",
    icon: Users,
  },
};

// 3. MOCK DATA
const mockContacts = [
  {
    id: "L1",
    scope: "lang",
    category: "Ban Lãnh đạo chung",
    categoryDesc: "Cơ quan quản lý cấp Làng",
    fullName: "Ban tổ chức Làng Phương Viên",
    role: "Ban quản lý",
    phone: "0987654321",
    displayType: "highlight",
  },

  {
    id: "T4_1",
    scope: "thon4",
    category: "Cấp ủy chi bộ",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    fullName: "Ông Nguyễn Chí Luận",
    role: "Bí thư Chi bộ",
    phone: "0904358480",
    displayType: "highlight",
  },
  {
    id: "T4_2",
    scope: "thon4",
    category: "Cấp ủy chi bộ",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    fullName: "Ông Đàm Thế Việt",
    role: "Phó Bí thư Chi bộ",
    phone: "0705745216",
    displayType: "highlight",
  },
  {
    id: "T4_3",
    scope: "thon4",
    category: "Cấp ủy chi bộ",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    fullName: "Bà Đàm Thị Đông Hà",
    role: "Chi ủy viên",
    phone: "0911223344",
    displayType: "normal",
  },

  {
    id: "T4_4",
    scope: "thon4",
    category: "Ban lãnh đạo thôn",
    categoryDesc: "Cơ quan quản lý hành chính nhà nước tại cơ sở",
    fullName: "Ông Nguyễn Văn Trưởng",
    role: "Trưởng thôn Phương Viên 4",
    phone: "0912111222",
    displayType: "highlight",
  },

  {
    id: "T4_5",
    scope: "thon4",
    category: "An ninh trật tự",
    categoryDesc: "Lực lượng bảo vệ bình yên xóm làng",
    fullName: "Ông Hoàng Văn An",
    role: "Trưởng ban An ninh",
    phone: "0988777666",
    displayType: "highlight",
  },

  {
    id: "T4_6",
    scope: "thon4",
    category: "Trưởng các chi hội đoàn thể",
    categoryDesc: "Hệ thống chính trị - xã hội",
    fullName: "Ông Đàm Thế Việt",
    role: "Trưởng Ban CT Mặt trận",
    phone: "0705745216",
    displayType: "normal",
  },
  {
    id: "T4_7",
    scope: "thon4",
    category: "Trưởng các chi hội đoàn thể",
    categoryDesc: "Hệ thống chính trị - xã hội",
    fullName: "Nguyễn Phạm Khắc Hà",
    role: "Bí thư Chi đoàn",
    phone: "0966778899",
    displayType: "highlight",
  },
  {
    id: "T4_8",
    scope: "thon4",
    category: "Trưởng các chi hội đoàn thể",
    categoryDesc: "Hệ thống chính trị - xã hội",
    fullName: "Ông Đàm Phượng Sào",
    role: "Chi hội trưởng Hội NCT",
    phone: "0933445566",
    displayType: "normal",
  },

  {
    id: "T4_10",
    scope: "thon4",
    category: "Ban trị sự",
    categoryDesc: "Quản lý di tích văn hóa tín ngưỡng",
    fullName: "Ông Nguyễn Văn Tín",
    role: "Trưởng ban Trị sự",
    phone: "0933222111",
    displayType: "normal",
  },
  {
    id: "T4_11",
    scope: "thon4",
    category: "Trưởng các xóm",
    categoryDesc: "Cánh tay nối dài của chính quyền thôn",
    fullName: "Ông Trần Văn Xóm",
    role: "Trưởng xóm 1",
    phone: "0922111000",
    displayType: "normal",
  },

  {
    id: "T1_1",
    scope: "thon1",
    category: "Cấp ủy chi bộ",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    fullName: "Bà Lê Thị C",
    role: "Bí thư Chi bộ Thôn 1",
    phone: "0933445566",
    displayType: "highlight",
  },
];

export default function DirectoryLandingPage() {
  const [expandedThon, setExpandedThon] = useState<string>("thon4");

  // SỬA ĐỔI 1: Đổi State thành string để chỉ lưu 1 tab duy nhất được mở
  const [expandedCategory, setExpandedCategory] = useState<string>("");

  const getContactsForSection = (sectionId: string) => {
    const filtered = mockContacts.filter((c) => c.scope === sectionId);
    return filtered.reduce(
      (acc, contact) => {
        if (!acc[contact.category])
          acc[contact.category] = { desc: contact.categoryDesc, items: [] };
        acc[contact.category].items.push(contact);
        return acc;
      },
      {} as Record<string, { desc: string; items: typeof mockContacts }>,
    );
  };

  // SỬA ĐỔI 2: Hàm toggle chỉ giữ lại 1 trạng thái
  const toggleCategory = (catKey: string) => {
    setExpandedCategory((prev) => (prev === catKey ? "" : catKey));
  };

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-gray-800">
      <header className="bg-[#122A54] text-white p-3 md:p-4 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm">
          <Building2 className="text-[#122A54] w-full h-full" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-[15px] leading-tight uppercase tracking-wide">
            Phương Viên
          </h1>
          <span className="text-[12px] text-blue-200 font-medium">
            Cổng Danh bạ Điện tử
          </span>
        </div>
      </header>

      <section className="bg-gradient-to-b from-[#1a365d] to-[#2a4365] pt-10 pb-24 px-4 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        ></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 p-2 border-4 border-white/20">
            <div className="w-full h-full rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center text-blue-900 font-bold text-xs">
              LOGO
            </div>
          </div>
          <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-wide uppercase shadow-sm">
            LÀNG PHƯƠNG VIÊN
          </h2>
          <p className="text-blue-100 mt-2 font-medium text-base md:text-lg">
            Xã Sơn Đồng, Thành phố Hà Nội
          </p>
          <div className="mt-4 px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-sm shadow-sm">
            Cổng Danh bạ Điện tử
          </div>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        {/* KHẨN CẤP */}
        <section className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-md space-y-4">
          <h2 className="text-red-600 font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide">
            <ShieldAlert size={20} /> Số điện thoại khẩn cấp
          </h2>
          <div className="flex flex-col gap-3">
            <a
              href="tel:02433221668"
              className="flex items-center justify-between p-4 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700"
            >
              <div className="flex items-center gap-3 font-semibold text-[15px]">
                <ShieldAlert size={22} /> Gọi Công an Xã
              </div>
              <PhoneCall size={20} className="opacity-90" />
            </a>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="tel:0912345678"
                className="flex flex-col items-center justify-center p-3 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-[#0284C7]"
              >
                <ShieldAlert size={22} className="mb-1 opacity-90" />
                <span className="font-semibold text-[13px] md:text-sm text-center">
                  CSKV Phụ trách
                </span>
              </a>
              <a
                href="tel:0987654321"
                className="flex flex-col items-center justify-center p-3 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-[#F59E0B]"
              >
                <Activity size={22} className="mb-1 opacity-90" />
                <span className="font-semibold text-[13px] md:text-sm text-center">
                  Trạm Y Tế Xã
                </span>
              </a>
            </div>
            <p className="text-center text-xs text-gray-500 mt-1 font-medium">
              Công an xã (SĐT2): 024.3322.1668
            </p>
          </div>
        </section>

        {/* QUICK LINKS & VAUL DRAWER */}
        <div className="grid grid-cols-2 gap-4">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 border border-gray-100 active:scale-95">
                <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                  <MessageCircle size={26} />
                </div>
                <span className="font-bold text-[14px] text-gray-700">
                  Zalo Cư Dân
                </span>
              </button>
            </Drawer.Trigger>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
              <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[24px] mt-24 fixed bottom-0 left-0 right-0 z-[70] max-h-[85vh]">
                <div className="p-4 bg-white rounded-t-[24px] flex-1 overflow-y-auto">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-6" />
                  <Drawer.Title className="font-black text-xl mb-1 text-center text-gray-800">
                    Chọn Nhóm Zalo
                  </Drawer.Title>
                  <Drawer.Description className="text-center text-gray-500 text-sm mb-6">
                    Tham gia nhóm cư dân để cập nhật thông tin
                  </Drawer.Description>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl font-bold text-gray-400 border border-gray-100 cursor-not-allowed select-none">
                      <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
                        <span>Nhóm Zalo Toàn Làng</span>
                        <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          Đang cập nhật
                        </span>
                      </div>
                      <LockIcon size={18} className="text-gray-300" />
                    </div>
                    {[1, 2, 3, 4].map((num) => (
                      <a
                        key={num}
                        href={`#`}
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-xl font-semibold text-gray-700 active:bg-gray-50 active:scale-95 transition-transform"
                      >
                        <span>Nhóm Zalo Phương Viên {num}</span>{" "}
                        <ChevronRight size={20} className="text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <a
            href="https://facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 border border-gray-100 active:scale-95"
          >
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <Facebook size={26} />
            </div>
            <span className="font-bold text-[14px] text-gray-700">
              Fanpage Làng
            </span>
          </a>
        </div>

        {/* ACCORDION CHÍNH */}
        <div className="space-y-4 pt-2">
          <div className="bg-[#E0F2FE] text-[#0369A1] text-center text-[13px] md:text-sm p-4 rounded-xl font-bold uppercase tracking-wide border border-blue-100 shadow-sm">
            NHÂN DÂN VUI LÒNG BẤM VÀO MỤC THÔNG TIN BÊN DƯỚI ĐỂ XEM CHI TIẾT
          </div>

          {SECTIONS.map((section) => {
            const isThonExpanded = expandedThon === section.id;
            const groupedData = getContactsForSection(section.id);
            const categories = Object.keys(groupedData);
            const isDisabled = section.disabled;

            return (
              <div
                key={section.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 ${isDisabled ? "opacity-75 grayscale-[30%]" : ""}`}
              >
                <button
                  onClick={() => {
                    if (isDisabled) return;
                    setExpandedThon(isThonExpanded ? "" : section.id);
                  }}
                  className={`w-full p-4 flex items-center justify-between transition-colors ${
                    isDisabled
                      ? "bg-gray-50/80 cursor-not-allowed"
                      : isThonExpanded
                        ? "bg-blue-600"
                        : "hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl transition-colors ${
                        isDisabled
                          ? "bg-gray-200 text-gray-400"
                          : isThonExpanded
                            ? "bg-blue-500/50 text-white"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Building2 size={20} />
                    </div>
                    <div className="text-left flex flex-col items-start gap-1">
                      <span
                        className={`block font-extrabold text-[15px] uppercase tracking-wide ${
                          isDisabled
                            ? "text-gray-400"
                            : isThonExpanded
                              ? "text-white"
                              : "text-gray-800"
                        }`}
                      >
                        {section.label}
                      </span>
                      {isDisabled ? (
                        <span className="text-[11px] font-bold bg-gray-200 text-gray-500 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                          {section.message || "Đang cập nhật"}
                        </span>
                      ) : (
                        !isThonExpanded &&
                        categories.length > 0 && (
                          <span className="text-xs text-gray-500 font-medium">
                            {categories.length} ban ngành
                          </span>
                        )
                      )}
                    </div>
                  </div>
                  {!isDisabled && (
                    <motion.div
                      animate={{ rotate: isThonExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown
                        className={
                          isThonExpanded ? "text-white" : "text-gray-400"
                        }
                      />
                    </motion.div>
                  )}
                </button>

                <AnimatePresence>
                  {isThonExpanded && !isDisabled && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden bg-[#F8FAFC]"
                    >
                      {categories.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 font-medium text-sm">
                          Đang cập nhật dữ liệu...
                        </div>
                      ) : (
                        // SỬA ĐỔI 3: Thêm items-start để Grid không kéo dãn chiều cao các Card khác cùng hàng
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 items-start">
                          {categories.map((catName) => {
                            const style =
                              CATEGORY_STYLES[catName] ||
                              CATEGORY_STYLES["default"];
                            const Icon = style.icon;
                            const catKey = `${section.id}-${catName}`;

                            // Kiểm tra trạng thái mở của Ban Ngành
                            const isCatExpanded = expandedCategory === catKey;

                            return (
                              <div
                                key={catName}
                                className={`rounded-2xl border transition-all ${style.bg} ${style.border}`}
                              >
                                <button
                                  onClick={() => toggleCategory(catKey)}
                                  className="w-full p-3.5 flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3 text-left">
                                    <div
                                      className={`p-2 rounded-lg ${style.iconBg} ${style.iconColor}`}
                                    >
                                      <Icon size={18} />
                                    </div>
                                    <div>
                                      <h3
                                        className={`font-black text-[13px] uppercase tracking-wide ${style.text}`}
                                      >
                                        {catName}
                                      </h3>
                                      <p className="text-[12px] text-gray-500 font-medium mt-0.5">
                                        {groupedData[catName].desc}
                                      </p>
                                    </div>
                                  </div>

                                  {/* SỬA ĐỔI 4: ChevronRight thay cho ChevronDown, xoay 90 độ khi mở */}
                                  <motion.div
                                    animate={{ rotate: isCatExpanded ? 90 : 0 }}
                                  >
                                    <ChevronRight
                                      className={style.iconColor}
                                      size={20}
                                    />
                                  </motion.div>
                                </button>

                                <AnimatePresence>
                                  {isCatExpanded && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: "auto", opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="p-3 pt-0 space-y-3">
                                        {groupedData[catName].items.map(
                                          (contact) => (
                                            <ContactCard
                                              key={contact.id}
                                              contact={contact}
                                            />
                                          ),
                                        )}
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-[#122A54] text-white pt-10 pb-8 mt-12 border-t-4 border-blue-900">
        <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 text-center md:text-left md:flex md:justify-between md:gap-12 md:space-y-0">
          <div className="md:flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-3 text-white">
              Làng Phương Viên
            </h2>
            <p className="text-blue-200 text-[14px] leading-relaxed">
              Một làng quê giàu truyền thống văn hóa, lịch sử lâu đời thuộc xã
              Sơn Đồng, thành phố Hà Nội.
            </p>
          </div>
          <div className="md:flex-1">
            <h3 className="text-lg font-bold mb-4 text-white text-center md:text-left">
              Khám phá
            </h3>
            <div className="flex flex-col gap-3 px-2 md:px-0">
              <a
                href="#"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl border border-white/10 text-white font-semibold text-sm"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-blue-300" /> Nhóm
                  Zalo Làng
                </div>
                <ExternalLink size={16} className="text-blue-300/70" />
              </a>
              <a
                href="#"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl border border-white/10 text-white font-semibold text-sm"
              >
                <div className="flex items-center gap-3">
                  <Facebook size={18} className="text-blue-400" /> Fanpage Đoàn
                  Thanh niên
                </div>
                <ExternalLink size={16} className="text-blue-300/70" />
              </a>
            </div>
          </div>
          <div className="md:flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-3 text-white">Liên hệ</h3>
            <p className="text-blue-200 text-[14px] leading-relaxed">
              Làng Phương Viên, Xã Sơn Đồng
              <br />
              Thành phố Hà Nội
            </p>
            <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-[15px] font-medium text-white">
              <Phone size={16} className="text-red-400" /> Ban tổ chức:
              0987.654.321
            </div>
          </div>
        </div>
        <div className="max-w-4xl mx-auto px-4 md:px-8 mt-8 pt-6 border-t border-white/10 text-center space-y-2">
          <p className="text-blue-300/80 text-[12px]">
            © 2026 Làng Phương Viên. Bảo lưu mọi quyền.
          </p>
          <p className="text-blue-300/80 text-[12px]">
            Được thực hiện bởi{" "}
            <span className="font-bold text-white">Chi đoàn Phương Viên 4</span>
          </p>
          <p className="text-blue-400/60 text-[11px] mt-2 font-medium">
            Cổng Danh bạ Điện tử – Phiên bản 1.0
          </p>
        </div>
      </footer>
    </div>
  );
}
