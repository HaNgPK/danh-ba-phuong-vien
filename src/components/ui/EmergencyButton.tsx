// src/components/ui/EmergencyButton.tsx
import React from "react";
import { PhoneCall } from "lucide-react";

interface EmergencyButtonProps {
  title: string;
  phone: string;
  colorClass: string; // Vd: 'bg-red-600', 'bg-blue-500'
  icon?: React.ReactNode;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  phone,
  colorClass,
  icon,
}) => {
  return (
    <a
      href={`tel:${phone}`}
      className={`flex items-center justify-between p-3 rounded-lg text-white shadow-sm active:scale-95 transition-transform ${colorClass}`}
    >
      <div className="flex items-center gap-2 font-semibold">
        {icon}
        <span>{title.toUpperCase()}</span>
      </div>
      <PhoneCall size={20} className="opacity-80" />
    </a>
  );
};
