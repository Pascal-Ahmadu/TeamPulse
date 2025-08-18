import "./globals.css";
import { Inter } from "next/font/google";
import AuthProvider from "@/components/auth/auth-provider";
import AppLayout from "@/components/layout/app-layout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "TeamPlus",
  description: "TeamPlus helps teams collaborate and manage projects efficiently.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} text-sm antialiased`}>
        <AuthProvider>
          <AppLayout>{children}</AppLayout>
        </AuthProvider>
      </body>
    </html>
  );
}