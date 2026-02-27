import React from "react";

interface AvatarProps {
  url?: string;
  name: string;
  size?: "sm" | "md" | "lg";
}

export const Avatar: React.FC<AvatarProps> = ({ url, name, size = "md" }) => {
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: "w-10 h-10 text-sm",
    md: "w-12 h-12 text-base",
    lg: "w-16 h-16 text-xl",
  };

  if (url) {
    return (
      <img
        src={url}
        alt={name}
        className={`${sizeClasses[size]} rounded-full object-cover border border-gray-200`}
      />
    );
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full bg-blue-100 text-blue-600 font-bold flex items-center justify-center border border-blue-200`}
    >
      {getInitial(name)}
    </div>
  );
};
