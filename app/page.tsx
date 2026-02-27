// src/app/page.tsx
"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  Activity,
  PhoneCall,
  Phone,
  MessageCircle,
  Facebook,
  Map,
  ChevronUp,
  ChevronDown,
  Building2,
} from "lucide-react";

// --- MOCK DATA RÚT GỌN ĐỂ DEMO GIAO DIỆN ---
const mockContacts = [
  {
    id: "1",
    fullName: "Ông Nguyễn Chí Luận",
    role: "Bí thư Chi bộ",
    phone: "0904358480",
    category: "Cấp ủy chi bộ thôn Phương Viên",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    displayType: "highlight",
  },
  {
    id: "2",
    fullName: "Ông Đàm Thế Việt",
    role: "Phó Bí thư Chi bộ",
    phone: "0705745216",
    category: "Cấp ủy chi bộ thôn Phương Viên",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    displayType: "highlight",
  },
  {
    id: "3",
    fullName: "Bà Đàm Thị Đông Hà",
    role: "Chi ủy viên",
    phone: "0911223344",
    category: "Cấp ủy chi bộ thôn Phương Viên",
    categoryDesc: "Cơ quan lãnh đạo toàn diện",
    displayType: "normal",
  },
  {
    id: "4",
    fullName: "Ông Đàm Thế Việt",
    role: "Trưởng Ban Công tác Mặt trận",
    phone: "0705745216",
    category: "Trưởng các chi hội đoàn thể",
    categoryDesc: "Hệ thống chính trị - xã hội",
    displayType: "normal",
  },
  {
    id: "5",
    fullName: "Ông Đàm Phượng Sào",
    role: "Chi hội trưởng Hội NCT",
    phone: "0933445566",
    category: "Trưởng các chi hội đoàn thể",
    categoryDesc: "Hệ thống chính trị - xã hội",
    displayType: "normal",
  },
];

export default function DirectoryLandingPage() {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    "Cấp ủy chi bộ thôn Phương Viên": true,
    "Trưởng các chi hội đoàn thể": true,
  });

  const toggleSection = (category: string) => {
    setOpenSections((prev) => ({ ...prev, [category]: !prev[category] }));
  };

  const groupedContacts = mockContacts.reduce(
    (acc, contact) => {
      if (!acc[contact.category]) {
        acc[contact.category] = {
          title: contact.category,
          desc: contact.categoryDesc,
          items: [],
        };
      }
      acc[contact.category].items.push(contact);
      return acc;
    },
    {} as Record<
      string,
      { title: string; desc: string; items: typeof mockContacts }
    >,
  );

  return (
    <div className="min-h-screen bg-[#F4F7FB] pb-12 font-sans text-gray-800">
      {/* --- THÊM MỚI: HEADER STICKY Ở TRÊN CÙNG --- */}
      <header className="bg-[#122A54] text-white p-3 md:p-4 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-sm">
          {/* Thay icon này bằng thẻ <img src="/logo.png" /> nếu bạn có ảnh logo thật của thôn */}
          <Building2 className="text-[#122A54] w-full h-full" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-[15px] md:text-lg leading-tight uppercase tracking-wide">
            Thôn Phương Viên
          </h1>
          <span className="text-[12px] md:text-sm text-blue-200 font-medium">
            Cổng Danh bạ Điện tử
          </span>
        </div>
      </header>
      {/* ------------------------------------------- */}

      {/* HERO SECTION */}
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
            THÔN PHƯƠNG VIÊN
          </h2>
          <p className="text-blue-100 mt-2 font-medium text-base md:text-lg">
            Xã Sơn Đồng, Thành phố Hà Nội
          </p>
          <div className="mt-4 px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-sm shadow-sm">
            Cổng Danh bạ Điện tử
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        {/* Quick Links */}
        <div className="grid grid-cols-3 gap-3 md:gap-6">
          {[
            {
              icon: <MessageCircle className="text-blue-500" size={28} />,
              name: "Zalo Thôn",
            },
            {
              icon: <Facebook className="text-blue-600" size={28} />,
              name: "Fanpage",
            },
            {
              icon: <Map className="text-red-500" size={28} />,
              name: "Tour thực tế ảo",
            },
          ].map((link, idx) => (
            <a
              key={idx}
              href="#"
              className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 group border border-gray-100"
            >
              <div className="p-3 bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                {link.icon}
              </div>
              <span className="font-semibold text-[13px] md:text-sm text-gray-700">
                {link.name}
              </span>
            </a>
          ))}
        </div>

        {/* Khẩn Cấp */}
        <section className="bg-[#FFF5F5] p-5 rounded-2xl border border-red-100 shadow-sm space-y-4">
          <h2 className="text-red-600 font-bold text-sm flex items-center gap-2">
            <ShieldAlert size={20} /> SỐ ĐIỆN THOẠI KHẨN CẤP
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <a
              href="tel:02433221668"
              className="flex items-center justify-between p-4 rounded-xl text-white shadow-sm hover:opacity-90 transition-all bg-[#DC2626]"
            >
              <div className="flex items-center gap-3 font-semibold">
                <ShieldAlert size={22} /> GỌI CÔNG AN XÃ
              </div>
              <PhoneCall size={20} className="opacity-80" />
            </a>
            <a
              href="tel:0912345670"
              className="flex items-center justify-between p-4 rounded-xl text-white shadow-sm hover:opacity-90 transition-all bg-[#0284C7]"
            >
              <div className="flex items-center gap-3 font-semibold">
                <Activity size={22} /> GỌI TRẠM Y TẾ
              </div>
              <PhoneCall size={20} className="opacity-80" />
            </a>
            <a
              href="tel:0987654321"
              className="flex items-center justify-between p-4 rounded-xl text-white shadow-sm hover:opacity-90 transition-all bg-[#F59E0B]"
            >
              <div className="flex items-center gap-3 font-semibold">
                <Phone size={22} /> GỌI TRƯỞNG THÔN
              </div>
              <PhoneCall size={20} className="opacity-80" />
            </a>
          </div>
          <p className="text-center text-xs text-gray-500 mt-2 font-medium">
            Công an xã (SĐT2): 024.3322.1668
          </p>
        </section>

        {/* Banner Hướng dẫn */}
        <div className="bg-[#E0F2FE] text-[#0369A1] text-center text-[13px] md:text-sm p-4 rounded-xl font-bold uppercase tracking-wide border border-blue-100 shadow-sm">
          Nhân dân vui lòng bấm vào mục thông tin bên dưới để xem chi tiết danh
          bạ liên hệ
        </div>

        {/* Danh bạ chi tiết */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.values(groupedContacts).map((section, idx) => {
            const isOpen = openSections[section.title];

            return (
              <div
                key={idx}
                className="bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl overflow-hidden shadow-sm h-fit"
              >
                {/* Header của từng Section */}
                <button
                  onClick={() => toggleSection(section.title)}
                  className="w-full bg-[#F8FAFC] px-5 py-4 border-b border-gray-200 flex items-center justify-between hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 text-left">
                    <div className="p-2 bg-gray-200/70 rounded-lg text-gray-600">
                      <ShieldAlert size={20} />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-gray-800 uppercase text-[13px] md:text-sm">
                        {section.title}
                      </h3>
                      {section.desc && (
                        <p className="text-[12px] md:text-[13px] text-gray-500 font-medium mt-0.5">
                          {section.desc}
                        </p>
                      )}
                    </div>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="text-gray-400" />
                  ) : (
                    <ChevronDown className="text-gray-400" />
                  )}
                </button>

                {/* Nội dung danh sách */}
                {isOpen && (
                  <div className="p-4 space-y-3">
                    {section.items.map((contact) => (
                      <div
                        key={contact.id}
                        className={`flex items-center justify-between p-3 rounded-xl border transition-all hover:border-gray-300 ${
                          contact.displayType === "highlight"
                            ? "bg-gray-100/80 border-gray-200"
                            : "bg-white border-transparent border-b-gray-100 last:border-none"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0 ${contact.displayType === "highlight" ? "w-14 h-14 md:w-16 md:h-16 text-xl" : "w-12 h-12 text-base"}`}
                          >
                            {contact.fullName.charAt(0)}
                          </div>

                          <div className="flex flex-col">
                            <h4
                              className={`font-bold text-gray-900 ${contact.displayType === "highlight" ? "text-base md:text-lg" : "text-[15px] md:text-base"}`}
                            >
                              {contact.fullName}
                            </h4>
                            <p
                              className={`${contact.displayType === "highlight" ? "text-blue-700 font-semibold" : "text-gray-600 font-medium"} text-[13px] mt-0.5`}
                            >
                              {contact.role}
                            </p>
                            {contact.displayType === "highlight" && (
                              <p className="text-gray-500 text-[13px] flex items-center gap-1.5 mt-1.5 font-medium">
                                <Phone size={13} className="text-red-500" />{" "}
                                {contact.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        <a
                          href={`tel:${contact.phone}`}
                          className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full font-bold transition-all shrink-0 active:scale-95 ${
                            contact.displayType === "highlight"
                              ? "bg-[#22C55E] text-white hover:bg-green-600 shadow-md min-w-[100px] text-sm"
                              : "bg-[#DCFCE7] text-[#166534] hover:bg-green-200 text-sm"
                          }`}
                        >
                          <Phone size={15} />
                          {contact.displayType === "highlight"
                            ? "Gọi ngay"
                            : "Gọi"}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
