import "./globals.css";

import SessionProviderWrapper
  from "@/components/SessionProvider";

export const metadata = {
  title: "ClassShare",
  description:
    "Share classrooms and learning resources",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}