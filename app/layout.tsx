import "@/app/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "Assistant Notices Sécurité & Accessibilité",
  description:
    "Générez vos notices de sécurité incendie et d'accessibilité en conformité avec la réglementation française."
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
