// src/components/ContactCard.tsx
import React from "react";
import { Phone } from "lucide-react";
import { Avatar } from "./ui/Avatar";
import { Contact } from "@/types"; // Import interface Contact đã định nghĩa trước đó

interface ContactCardProps {
  contact: Contact;
}

export const ContactCard: React.FC<ContactCardProps> = ({ contact }) => {
  const isHighlight = contact.displayType === "highlight";

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border ${
        isHighlight
          ? "bg-gray-100/80 border-gray-200 mb-3"
          : "bg-white border-transparent border-b-gray-100 last:border-none"
      }`}
    >
      <div className="flex items-center gap-4">
        <Avatar
          url={contact.avatarUrl}
          name={contact.fullName}
          size={isHighlight ? "lg" : "md"}
        />

        <div className="flex flex-col">
          <h3
            className={`font-semibold text-gray-900 ${isHighlight ? "text-lg" : "text-base"}`}
          >
            {contact.fullName}
          </h3>
          <p
            className={`${isHighlight ? "text-blue-600 font-medium" : "text-gray-500"} text-sm`}
          >
            {contact.role}
          </p>
          {isHighlight && (
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <Phone size={12} /> {contact.phone}
            </p>
          )}
        </div>
      </div>

      <a
        href={`tel:${contact.phone}`}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-medium transition-colors ${
          isHighlight
            ? "bg-green-500 text-white hover:bg-green-600 shadow-sm"
            : "bg-green-100 text-green-700 hover:bg-green-200"
        }`}
      >
        <Phone size={isHighlight ? 16 : 14} />
        {isHighlight ? "Gọi ngay" : "Gọi"}
      </a>
    </div>
  );
};
