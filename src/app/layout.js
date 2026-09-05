import "./globals.css";

import SessionProviderWrapper
  from "../components/SessionProvider";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
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
      <body className={poppins.className}>
        <SessionProviderWrapper>
          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}