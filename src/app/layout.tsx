import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "내 주변 도서관 책 찾기",
  description:
    "읽고 싶은 주제를 입력하면, 주변 도서관에서 대출 가능한 책을 찾아드립니다.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
