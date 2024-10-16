import { noto } from "@/config/fonts";
import "./globals.css";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "ANBA-ACADEMICO",
  description: "SISTEMA DE ADMINISTRACION ACADEMICO",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>{children}</body>
    </html>
  );
}
