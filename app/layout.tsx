import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import ConditionalLayout from "@/components/ConditionalLayout";

export const metadata: Metadata = {
  title: "ASD Drones – Precision in Every Flight",
  description:
    "India's premier destination for drone components, FPV gear, motors, frames, electronics and more. Building the Indian Drone Ecosystem.",
  keywords: "drones, FPV, drone parts, motors, frames, flight controller, ESC, propellers, India",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  );
}
