// app/(protected)/layout.tsx
"use client";

import { useAuth } from "@/components/auth/auth-provider";
import Sidebar from "@/components/layout/sidebar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return null; // Or loading spinner
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar onLogout={logout} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
