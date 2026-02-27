// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Tải font Inter với subset latin (hỗ trợ tốt tiếng Việt)
const inter = Inter({ subsets: ["latin", "vietnamese"] });

export const metadata: Metadata = {
  title: "Danh bạ điện tử - Thôn Phương Viên",
  description: "Cổng thông tin liên hệ Thôn Phương Viên, xã Sơn Đồng",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
