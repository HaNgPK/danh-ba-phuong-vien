// src/components/ContactCard.tsx
"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Copy, Check } from "lucide-react";

interface ContactCardProps {
  contact: any;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const isHighlight = contact.displayType === "highlight";
  const [copied, setCopied] = useState(false);

  // Hàm xử lý copy số điện thoại
  const handleCopy = () => {
    navigator.clipboard.writeText(contact.phone);
    setCopied(true);
    // Báo rung nhẹ trên điện thoại (nếu thiết bị hỗ trợ)
    if (
      typeof window !== "undefined" &&
      window.navigator &&
      window.navigator.vibrate
    ) {
      window.navigator.vibrate(50);
    }
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex flex-col p-4 rounded-2xl border transition-all duration-300 hover:shadow-md ${
        isHighlight
          ? "bg-gradient-to-br from-white to-blue-50/50 border-blue-100 shadow-sm mb-4"
          : "bg-white border-gray-100 mb-3"
      }`}
    >
      {/* Phần Thông tin chung */}
      <div className="flex items-start gap-3 md:gap-4 mb-3">
        <div
          className={`rounded-full overflow-hidden flex items-center justify-center shrink-0 font-bold shadow-inner ${
            isHighlight
              ? "bg-blue-600 text-white w-14 h-14 text-xl"
              : "bg-blue-100 text-blue-700 w-12 h-12 text-base"
          }`}
        >
          {contact.avatarUrl ? (
            <img src={contact.avatarUrl} alt={contact.fullName} className="w-full h-full object-cover" />
          ) : (
            contact.fullName.charAt(0)
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3
            className={`font-bold text-gray-900 break-words ${isHighlight ? "text-lg" : "text-base"}`}
          >
            {contact.fullName}
          </h3>
          <p
            className={`${isHighlight ? "text-blue-600" : "text-gray-500"} font-medium text-[13px] mt-0.5 break-words`}
          >
            {contact.role}
          </p>
        </div>
      </div>

      {/* Đường kẻ ngang */}
      <div className="h-px w-full bg-gray-100 mb-3"></div>

      {/* Nhóm Nút Hành Động (Action Buttons) */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Nút Gọi (Primary) */}
        <a
          href={`tel:${contact.phone}`}
          className={`min-w-[160px] flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all active:scale-95 ${
            isHighlight
              ? "bg-[#22C55E] text-white hover:bg-green-600 shadow-sm"
              : "bg-[#DCFCE7] text-[#166534] hover:bg-green-200"
          }`}
        >
          <Phone size={16} /> Gọi ngay
        </a>

        {/* Nút Nhắn Zalo */}
        <a
          href={`https://zalo.me/${contact.phone}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all active:scale-95 border border-blue-100"
          title="Nhắn qua Zalo"
        >
          <MessageCircle size={20} />
        </a>

        {/* Nút Copy */}
        <button
          onClick={handleCopy}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-all active:scale-95 border ${
            copied
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200"
          }`}
          title="Sao chép số"
        >
          {copied ? <Check size={20} /> : <Copy size={20} />}
        </button>
      </div>
    </div>
  );
};
