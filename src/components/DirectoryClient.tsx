"use client";

import React, { useState, useMemo } from "react";
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
  List,
  LayoutGrid,
} from "lucide-react";
import { ContactCard } from "@/src/components/ContactCard";

const FALLBACK_SECTIONS = [
  { id: "lang", label: "Cấp toàn làng", disabled: true, message: "Đang cập nhật" },
  { id: "thon1", label: "Thôn 1" },
  { id: "thon2", label: "Thôn 2" },
  { id: "thon3", label: "Thôn 3" },
  { id: "thon4", label: "Thôn 4" },
];

const CATEGORY_STYLES: Record<string, any> = {
  "Cap uy chi bo": {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-800",
    iconBg: "bg-slate-200",
    iconColor: "text-slate-600",
    icon: Flag,
  },
  "Ban lanh dao thon": {
    bg: "bg-blue-50/50",
    border: "border-blue-200",
    text: "text-blue-800",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    icon: Building,
  },
  "An ninh trat tu": {
    bg: "bg-red-50/50",
    border: "border-red-200",
    text: "text-red-800",
    iconBg: "bg-red-100",
    iconColor: "text-red-600",
    icon: Shield,
  },
  "Truong cac chi hoi doan the": {
    bg: "bg-emerald-50/50",
    border: "border-emerald-200",
    text: "text-emerald-800",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    icon: Users,
  },
  "Ban tri su": {
    bg: "bg-teal-50/50",
    border: "border-teal-200",
    text: "text-teal-800",
    iconBg: "bg-teal-100",
    iconColor: "text-teal-600",
    icon: Landmark,
  },
  "Truong cac xom": {
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

function normalizeSections(scopes?: any[]) {
  if (!scopes || scopes.length === 0) return FALLBACK_SECTIONS;

  return scopes.map((scope) => ({
    id: scope.code,
    label: scope.name,
    disabled: scope.disabled,
    message: scope.message,
  }));
}

const GROUP_OPTIONS = [
  "Cấp uỷ chi bộ",
  "Ban lãnh đạo thôn",
  "Trưởng các chi hội đoàn thể",
  "An ninh trật tự",
  "Trưởng các xóm, tổ",
];

const GROUP_DESCRIPTIONS: Record<string, string> = {
  "Cap uy chi bo": "Cơ quan lãnh đạo toàn diện",
  "Ban lanh dao thon": "Cơ quan quản lý hành chính nhà nước tại cơ sở",
  "An ninh trat tu": "Lực lượng nòng cốt bảo vệ bình yên xóm làng",
  "Truong cac chi hoi doan the": "Hệ thống chính trị - xã hội",
  "Ban tri su": "Quản lý di tích văn hóa tín ngưỡng",
  "Truong cac xom": "Cánh tay nối dài của chính quyền thôn",
  default: "Các bộ phận và liên hệ khác",
};

const GROUP_TO_STYLE_KEY: Record<string, string> = {
  "Cấp uỷ chi bộ": "Cap uy chi bo",
  "Cấp ủy chi bộ": "Cap uy chi bo",
  "Ban lãnh đạo thôn": "Ban lanh dao thon",
  "An ninh trật tự": "An ninh trat tu",
  "Trưởng các chi hội đoàn thể": "Truong cac chi hoi doan the",
  "Ban trị sự": "Ban tri su",
  "Trưởng các xóm, tổ": "Truong cac xom",
  "Trưởng các xóm": "Truong cac xom"
};

const getStyleForGroup = (groupName: string) => {
  const key = GROUP_TO_STYLE_KEY[groupName];
  if (key && CATEGORY_STYLES[key]) {
    return { ...CATEGORY_STYLES[key], description: GROUP_DESCRIPTIONS[key] };
  }
  
  const normalized = groupName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D');
  if (CATEGORY_STYLES[normalized]) {
    return { ...CATEGORY_STYLES[normalized], description: GROUP_DESCRIPTIONS[normalized] || GROUP_DESCRIPTIONS.default };
  }
  
  return { ...CATEGORY_STYLES.default, description: GROUP_DESCRIPTIONS.default };
};

export default function DirectoryClient({
  village,
  contacts,
  scopes,
  buttons,
}: {
  village?: any;
  contacts: any[];
  scopes?: any[];
  buttons?: any[];
}) {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"list" | "group">("list");
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const toggleExpand = (groupName: string) => {
    setExpandedGroup(prev => prev === groupName ? null : groupName);
  };

  const socialButtons = (buttons ?? []).filter((button: any) => button.type !== "emergency");
  const primarySocialButton = socialButtons[0];
  const secondarySocialButton = socialButtons[1];

  const filteredContacts = contacts.filter((c) => {
    const matchSearch =
      c.fullName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.role.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      c.phone.includes(searchKeyword);
      
    const additionalGroups = (c.additionalRoles || [])
      .map((roleStr: string) => roleStr.includes("|::|") ? roleStr.split("|::|")[0] : "Chung");
    const allGroups = [c.category, ...additionalGroups];
      
    const matchGroup = selectedGroups.length === 0 || selectedGroups.some(g => allGroups.includes(g));
    
    return matchSearch && matchGroup;
  });

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) =>
      prev.includes(group) ? prev.filter((g) => g !== group) : [...prev, group]
    );
  };

  const groupedContacts = useMemo(() => {
    const groups = new Map<string, any[]>();
    
    filteredContacts.forEach((contact) => {
      const additionalGroups = (contact.additionalRoles || [])
        .map((roleStr: string) => roleStr.includes("|::|") ? roleStr.split("|::|")[0] : "Khác");
      
      const allGroups = Array.from(new Set([contact.category || "Khác", ...additionalGroups]));
      
      allGroups.forEach(g => {
        if (!groups.has(g)) groups.set(g, []);
        groups.get(g)!.push(contact);
      });
    });
    
    const sortedGroups = Array.from(groups.entries()).sort((a, b) => {
      const indexA = GROUP_OPTIONS.indexOf(a[0]);
      const indexB = GROUP_OPTIONS.indexOf(b[0]);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a[0].localeCompare(b[0]);
    });

    return sortedGroups;
  }, [filteredContacts]);

  return (
    <div className="min-h-screen bg-[#F4F7FB] font-sans text-gray-800">
      <header className="bg-[#122A54] text-white p-3 md:p-4 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden">
          {village?.logoUrl ? (
            <img src={village.logoUrl} alt={village.fullName} className="w-full h-full object-cover" />
          ) : (
            <Building2 className="text-[#122A54] w-2/3 h-2/3" />
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="font-extrabold text-[15px] leading-tight uppercase tracking-wide">
            {village?.name || "Danh bạ điện tử"}
          </h1>
          <span className="text-[12px] text-blue-200 font-medium">
            Cổng thông tin liên hệ
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
        />

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-lg mb-4 border-4 border-white/20 overflow-hidden">
            {village?.logoUrl ? (
              <img src={village.logoUrl} alt={village.fullName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full rounded-full border-2 border-dashed border-blue-900 flex items-center justify-center text-blue-900 font-bold text-xs p-2">
                LOGO
              </div>
            )}
          </div>

          <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-wide uppercase shadow-sm">
            {village?.fullName || "Danh bạ điện tử"}
          </h2>
          <p className="text-blue-100 mt-2 font-medium text-base md:text-lg">
            {village?.address || "Địa chỉ đang cập nhật"}
          </p>
          <div className="mt-4 px-6 py-2.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white font-semibold text-sm shadow-sm">
            Danh Bạ Điện Tử Địa Phương
          </div>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-4 -mt-10 relative z-20 space-y-6">
        <section className="bg-white p-4 md:p-5 rounded-2xl border border-gray-100 shadow-md space-y-4">
          <h2 className="text-red-600 font-bold text-sm flex items-center justify-center gap-2 uppercase tracking-wide">
            <ShieldAlert size={20} /> Số điện thoại khẩn cấp
          </h2>

          <div className="flex flex-col gap-3">
            <a
              href={village?.emergencyPolicePhone ? `tel:${village.emergencyPolicePhone}` : "#"}
              className="flex items-center justify-between p-4 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700"
            >
              <div className="flex items-center gap-3 font-semibold text-[15px]">
                <ShieldAlert size={22} /> Gọi Công An Khu Vực
              </div>
              <PhoneCall size={20} className="opacity-90" />
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={primarySocialButton?.url || village?.zaloUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center justify-center p-3 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-[#0284C7]"
              >
                <MessageCircle size={22} className="mb-1 opacity-90" />
                <span className="font-semibold text-[13px] md:text-sm text-center">
                  {primarySocialButton?.label || "Nhóm Zalo"}
                </span>
              </a>
              <a
                href={village?.emergencyHealthPhone ? `tel:${village.emergencyHealthPhone}` : "#"}
                className="flex flex-col items-center justify-center p-3 rounded-xl text-white shadow-sm active:scale-95 transition-transform bg-[#F59E0B]"
              >
                <Activity size={22} className="mb-1 opacity-90" />
                <span className="font-semibold text-[13px] md:text-sm text-center">
                  Trạm y tế
                </span>
              </a>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <button className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 border border-gray-100 active:scale-95">
                <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                  <MessageCircle size={26} />
                </div>
                <span className="font-bold text-[14px] text-gray-700">
                  {primarySocialButton?.label || "Liên kết cộng đồng"}
                </span>
              </button>
            </Drawer.Trigger>

            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 z-[60]" />
              <Drawer.Content className="bg-gray-100 flex flex-col rounded-t-[24px] mt-24 fixed bottom-0 left-0 right-0 z-[70] max-h-[85vh]">
                <div className="p-4 bg-white rounded-t-[24px] flex-1 overflow-y-auto">
                  <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-gray-300 mb-6" />
                  <Drawer.Title className="font-black text-xl mb-1 text-center text-gray-800">
                    Liên kết nhanh
                  </Drawer.Title>
                  <Drawer.Description className="text-center text-gray-500 text-sm mb-6">
                    Các nhóm và kênh thông tin của làng hiện tại
                  </Drawer.Description>
                  <div className="space-y-3">
                    {socialButtons.length === 0 && (
                      <div className="flex items-center justify-between p-4 bg-gray-50/80 rounded-xl font-bold text-gray-400 border border-gray-100 cursor-not-allowed select-none">
                        <div className="flex flex-col items-start gap-1 md:flex-row md:items-center md:gap-3">
                          <span>Đang cập nhật liên kết</span>
                        </div>
                        <LockIcon size={18} className="text-gray-300" />
                      </div>
                    )}

                    {socialButtons.map((button: any) => (
                      <a
                        key={button.id}
                        href={button.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-4 bg-white border border-gray-200 shadow-sm rounded-xl font-semibold text-gray-700 active:bg-gray-50 active:scale-95 transition-transform"
                      >
                        <span>{button.label}</span>
                        <ChevronRight size={20} className="text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>

          <a
            href={secondarySocialButton?.url || village?.facebookUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col items-center justify-center text-center gap-2 border border-gray-100 active:scale-95"
          >
            <div className="p-3 bg-blue-50 rounded-full text-blue-600">
              <Facebook size={26} />
            </div>
            <span className="font-bold text-[14px] text-gray-700">
              {secondarySocialButton?.label || "Fanpage"}
            </span>
          </a>
        </div>

        <div className="pt-6 space-y-4">
          <div className="px-2 mb-2 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl md:text-2xl font-black text-[#122A54] uppercase tracking-wide">
                Danh bạ liên hệ
              </h2>
              <p className="text-[13px] md:text-sm text-gray-500 font-medium mt-1 leading-relaxed">
                Thông tin liên lạc của các cấp ủy, ban lãnh đạo, cán bộ và người phụ trách trong làng.
              </p>
            </div>
            <div className="flex bg-slate-200/60 p-1 rounded-xl self-start md:self-auto border border-slate-200">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <List size={16} /> Danh sách
              </button>
              <button
                onClick={() => setViewMode('group')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-all ${viewMode === 'group' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                <LayoutGrid size={16} /> Nhóm
              </button>
            </div>
          </div>

          <div className="sticky top-[80px] z-40 bg-[#F4F7FB] pt-2 pb-4 border-b border-transparent">
            {/* Search Bar */}
            <div className="relative z-50">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="Tìm kiếm tên, chức vụ..."
                className="w-full bg-white rounded-[20px] md:rounded-[24px] border border-gray-200 px-5 py-4 pl-12 text-[15px] font-semibold text-slate-800 placeholder:text-gray-400 placeholder:font-medium shadow-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                <Users size={20} />
              </div>
            </div>

            {/* Group Filter */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
              <button
                onClick={() => setSelectedGroups([])}
                className={`snap-start shrink-0 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
                  selectedGroups.length === 0
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                Tất cả
              </button>
              {GROUP_OPTIONS.map((g) => {
                const isActive = selectedGroups.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGroup(g)}
                    className={`snap-start shrink-0 px-4 py-2 rounded-full text-[13px] font-bold border transition-all ${
                      isActive
                        ? "bg-blue-100 text-blue-700 border-blue-200 shadow-sm"
                        : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-[20px] md:rounded-[28px] border border-slate-200 p-4 shadow-sm min-h-[300px]">
            {filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
                  <Users size={28} className="text-slate-300" />
                </div>
                <p className="font-bold text-slate-600 text-lg">Không tìm thấy liên hệ</p>
                <p className="text-sm mt-1 text-slate-400">Hãy thử nhập từ khóa khác</p>
              </div>
            ) : viewMode === "list" ? (
              <div className="flex flex-col gap-3">
                {filteredContacts.map((contact) => (
                  <ContactCard key={contact.id} contact={contact} />
                ))}
              </div>
            ) : (
              <div className="columns-1 md:columns-2 gap-4 w-full">
                {groupedContacts.map(([groupName, groupContacts]) => {
                  const styleToUse = getStyleForGroup(groupName);
                  const isExpanded = expandedGroup === groupName;
                  
                  return (
                    <div 
                      key={groupName} 
                      className={`break-inside-avoid mb-4 border rounded-[20px] transition-all duration-300 shadow-sm hover:shadow-md ${styleToUse.bg} ${styleToUse.border}`}
                    >
                      <button 
                        onClick={() => toggleExpand(groupName)}
                        className="w-full text-left p-4 flex items-center justify-between gap-4 focus:outline-none"
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className={`p-3 rounded-xl flex-shrink-0 ${styleToUse.iconBg} ${styleToUse.iconColor}`}>
                            {React.createElement(styleToUse.icon, { size: 22 })}
                          </div>
                          <div>
                            <h3 className={`font-bold text-[14px] md:text-[15px] uppercase tracking-wide leading-tight ${styleToUse.text}`}>
                              {groupName} {village?.name ? ` ${village.name}` : ""}
                            </h3>
                            <p className="text-xs font-medium text-slate-500 mt-1">
                              {styleToUse.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {/* Show contact count on collapsed mode */}
                          {!isExpanded && (
                            <span className="bg-white/60 text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm">
                              {groupContacts.length}
                            </span>
                          )}
                          <div className={`p-1 rounded-full bg-white/50 text-slate-400 transition-transform duration-300 ${isExpanded ? "rotate-180 bg-white shadow-sm" : ""}`}>
                            <ChevronDown size={18} />
                          </div>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={`p-4 pt-2 border-t ${styleToUse.border} flex flex-col gap-3 bg-white/40`}>
                              {groupContacts.map((contact) => (
                                <ContactCard key={`${contact.id}-${groupName}`} contact={contact} />
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-[#122A54] text-white pt-10 pb-8 mt-12 border-t-4 border-blue-900">
        <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8 text-center md:text-left md:flex md:justify-between md:gap-12 md:space-y-0">
          <div className="md:flex-1 text-center md:text-left">
            <h2 className="text-xl font-bold mb-3 text-white">
              {village?.fullName || "Danh bạ điện tử"}
            </h2>
            <p className="text-blue-200 text-[14px] leading-relaxed">
              Cổng thông tin liên lạc chính thức, giúp kết nối nhanh chóng và hiệu quả giữa cộng đồng cư dân và cán bộ phụ trách.
            </p>
          </div>

          <div className="md:flex-1">
            <h3 className="text-lg font-bold mb-4 text-white text-center md:text-left">
              Khám phá
            </h3>
            <div className="flex flex-col gap-3 px-2 md:px-0">
              <a
                href={primarySocialButton?.url || village?.zaloUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl border border-white/10 text-white font-semibold text-sm"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle size={18} className="text-blue-300" />
                  {primarySocialButton?.label || "Nhóm cộng đồng"}
                </div>
                <ExternalLink size={16} className="text-blue-300/70" />
              </a>
              <a
                href={secondarySocialButton?.url || village?.facebookUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-white/10 hover:bg-white/20 transition-colors rounded-xl border border-white/10 text-white font-semibold text-sm"
              >
                <div className="flex items-center gap-3">
                  <Facebook size={18} className="text-blue-400" />
                  {secondarySocialButton?.label || "Fanpage"}
                </div>
                <ExternalLink size={16} className="text-blue-300/70" />
              </a>
            </div>
          </div>

          <div className="md:flex-1 text-center md:text-left">
            <h3 className="text-lg font-bold mb-3 text-white">Liên hệ</h3>
            <p className="text-blue-200 text-[14px] leading-relaxed">
              {village?.address || "Chưa có thông tin địa chỉ"}
            </p>
            {village?.emergencyPolicePhone && (
              <div className="mt-3 flex items-center justify-center md:justify-start gap-2 text-[15px] font-medium text-white">
                <Phone size={16} className="text-red-400" />
                Liên hệ nhanh: {village.emergencyPolicePhone}
              </div>
            )}
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 md:px-8 mt-8 pt-6 border-t border-white/10 text-center space-y-2">
          <p className="text-blue-300/80 text-[12px]">
            &copy; {new Date().getFullYear()} {village?.fullName || "Danh bạ điện tử"}. Thiết kế để phục vụ cộng đồng.
          </p>
          <p className="text-blue-400/60 text-[11px] mt-2 font-medium">
            Thông tin được quản lý và cập nhật thường xuyên bởi ban quản trị.
          </p>
        </div>
      </footer>
    </div>
  );
}
