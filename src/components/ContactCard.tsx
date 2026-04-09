// src/components/ContactCard.tsx
"use client";

import React, { useState } from "react";
import { Phone, MessageCircle, Copy, Check, MapPin, Users } from "lucide-react";

interface ContactCardProps {
  contact: any;
}

const GROUP_COLORS: Record<string, string> = {
  "Cấp uỷ chi bộ": "bg-red-50/80 text-red-700 border-red-200",
  "Ban lãnh đạo thôn": "bg-blue-50/80 text-blue-700 border-blue-200",
  "Trưởng các chi hội đoàn thể": "bg-emerald-50/80 text-emerald-700 border-emerald-200",
  "An ninh trật tự": "bg-amber-50/80 text-amber-700 border-amber-200",
  "Trưởng các xóm, tổ": "bg-purple-50/80 text-purple-700 border-purple-200",
};

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const isHighlight = contact.displayType === "highlight";
  const [copied, setCopied] = useState(false);
  
  const additionalGroups = (contact.additionalRoles || [])
    .map((roleStr: string) => roleStr.includes("|::|") ? roleStr.split("|::|")[0] : "Chung");
  
  const allGroups = Array.from(new Set([contact.category, ...additionalGroups]))
    .filter(g => g && g !== "Chung");
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
      className={`group relative w-full overflow-hidden rounded-[24px] bg-white p-5 sm:p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] ${
        isHighlight
          ? "border border-blue-100 shadow-[0_8px_30px_-12px_rgba(59,130,246,0.15)] bg-gradient-to-br from-white to-blue-50/40 mb-4 ring-1 ring-blue-500/10"
          : "border border-slate-100 shadow-sm mb-3"
      }`}
    >
      {/* Decorative top gradient line for highlight */}
      {isHighlight && (
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-90" />
      )}

      {/* Group Badges (Side Mác / Edge Tab Style) */}
      {allGroups.length > 0 && (
        <div className="absolute top-4 right-0 hidden sm:flex flex-col items-end gap-1.5 z-10 transition-all duration-300">
          {allGroups.map((g, i) => (
            <div 
              key={i} 
              className={`inline-flex items-center gap-1.5 pl-3 pr-2.5 py-1.5 rounded-l-full text-[10px] font-extrabold uppercase tracking-wide border-y border-l shadow-sm backdrop-blur-md transition-transform hover:-translate-x-1 cursor-default
              ${GROUP_COLORS[g] || "bg-slate-50/90 text-slate-700 border-slate-200"}
              `}
            >
              <Users size={12} className="opacity-75" />
              <span>{g}</span>
            </div>
          ))}
        </div>
      )}

      {/* For mobile, flex wrap below highlight line */}
      {allGroups.length > 0 && (
        <div className="sm:hidden w-full flex flex-wrap justify-end gap-1.5 mb-2 mt-1">
          {allGroups.map((g, i) => (
            <span key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide border shadow-sm backdrop-blur-sm transition-all hover:scale-105 active:scale-95 ${GROUP_COLORS[g] || "bg-slate-50/90 text-slate-700 border-slate-200"}`}>
              <Users size={10} className="opacity-70" />
              {g}
            </span>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
        {/* Avatar Section */}
        <div className="relative shrink-0">
          <div
            className={`flex items-center justify-center overflow-hidden rounded-full font-bold shadow-md ring-4 ring-white ${
              isHighlight
                ? "h-24 w-24 sm:h-20 sm:w-20 bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-3xl sm:text-2xl"
                : "h-20 w-20 sm:h-16 sm:w-16 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 text-2xl sm:text-xl"
            }`}
          >
            {contact.avatarUrl ? (
              <img
                src={contact.avatarUrl}
                alt={contact.fullName}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            ) : (
              contact.fullName.charAt(0).toUpperCase()
            )}
          </div>
          {/* Status Indicator */}
          <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-[2.5px] border-white bg-emerald-500 shadow-sm"></div>
        </div>

        {/* Info Section */}
        <div className="flex w-full flex-col items-center sm:items-start text-center sm:text-left min-w-0 flex-1">
          <h3
            className={`font-extrabold tracking-tight truncate w-full mt-1 sm:mt-0 pr-0 sm:pr-24 ${
              isHighlight
                ? "text-xl sm:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-800 to-blue-600"
                : "text-lg sm:text-xl text-slate-800"
            }`}
          >
            {contact.fullName}
          </h3>

          <div className="mt-2 flex flex-col items-center sm:items-start gap-2 w-full">
            <p
              className={`font-semibold text-[13px] sm:text-[14px] px-3.5 py-1 rounded-full w-fit transition-transform hover:scale-105 cursor-default shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] ${
                isHighlight
                  ? "bg-blue-100/80 text-blue-800 border border-blue-200"
                  : "bg-slate-100 text-slate-700 border border-slate-200/60"
              }`}
            >
              {contact.role}
            </p>

            {contact.additionalRoles && contact.additionalRoles.length > 0 && (
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 mt-0.5 max-w-full sm:max-w-[70%]">
                {contact.additionalRoles.map((r: string, idx: number) => {
                  const roleName = r.includes("|::|") ? r.split("|::|")[1] : r;
                  if (!roleName) return null;
                  return (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] sm:text-[12px] font-medium border border-slate-200/60 bg-white/60 text-slate-500"
                    >
                      {roleName}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Full-width Footer: Contact Info & Action Buttons */}
      <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-slate-100/80 pt-5">
        
        {/* Contact Details */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2.5 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-slate-700 bg-slate-50/80 px-3.5 py-2 sm:py-1.5 rounded-xl border border-slate-200/50 justify-center w-full sm:w-auto">
            <Phone className="h-4 w-4 text-emerald-600/80" />
            <span className="text-[14.5px] font-bold tracking-wide">{contact.phone}</span>
          </div>

          {contact.address && (
            <div
              className="flex items-center gap-2 text-slate-600 bg-slate-50/80 px-3.5 py-2 sm:py-1.5 rounded-xl border border-slate-200/50 justify-center w-full sm:w-auto shrink-0 max-w-full sm:max-w-[200px]"
              title={contact.address}
            >
              <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
              <span className="truncate text-[13px] font-medium">{contact.address}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center gap-2.5 w-full sm:w-auto shrink-0">
          <a
            href={`tel:${contact.phone}`}
            className="flex-1 sm:flex-none group flex h-11 sm:h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 sm:px-6 text-[15px] font-bold text-white shadow-md shadow-emerald-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Phone className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span>Gọi điện</span>
          </a>

          <a
            href={`sms:${contact.phone}`}
            className="flex h-11 w-11 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-all hover:bg-blue-100 hover:-translate-y-0.5 shadow-sm"
            title="Nhắn tin SMS"
          >
            <MessageCircle className="h-5 w-5" />
          </a>

          <button
            onClick={handleCopy}
            className={`flex h-11 w-11 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl transition-all hover:-translate-y-0.5 shadow-sm ${
              copied
                ? "bg-green-100 text-green-600 ring-1 ring-green-200"
                : "bg-slate-50 border border-slate-100 text-slate-500 hover:bg-slate-100"
            }`}
            title="Sao chép số"
          >
            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
          </button>
        </div>

      </div>
    </div>
  );
};
