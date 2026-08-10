import type { ReactNode } from "react";
import "./studio.css";

export const metadata = {
  title: "DormUp Studio",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
