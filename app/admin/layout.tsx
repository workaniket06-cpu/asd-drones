import { ReactNode } from "react";

// Root admin layout — no sidebar here.
// Sidebar is only in (protected)/layout.tsx
// Login page uses this clean layout (no sidebar, no hamburger)
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
