// src/components/ContactSection.tsx
import React from "react";
import { Flag, Users } from "lucide-react";

interface ContactSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  title,
  subtitle,
  children,
}) => {
  // Mock icon logic: Dựa vào title để render icon tương ứng cho đẹp
  const renderIcon = () => {
    if (title.toLowerCase().includes("cấp ủy"))
      return <Flag size={20} className="text-gray-500" />;
    return <Users size={20} className="text-green-600" />;
  };

  return (
    <section className="bg-slate-50 border border-gray-200 rounded-xl overflow-hidden mb-6">
      <div className="bg-slate-100/50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-gray-200/50 rounded-lg">{renderIcon()}</div>
          <div>
            <h2 className="font-bold text-gray-800 uppercase text-sm">
              {title}
            </h2>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
      </div>

      <div className="p-3">{children}</div>
    </section>
  );
};
