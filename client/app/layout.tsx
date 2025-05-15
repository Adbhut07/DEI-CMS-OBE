// import type { Metadata } from "next";
// import localFont from "next/font/local";
// import "./globals.css";
// import { SiteHeader } from "@/components/navbar/site-header";
// import StoreProvider from "./storeProvider";

// const geistSans = localFont({
//   src: "./fonts/GeistVF.woff",
//   variable: "--font-geist-sans",
//   weight: "100 900",
// });
// const geistMono = localFont({
//   src: "./fonts/GeistMonoVF.woff",
//   variable: "--font-geist-mono",
//   weight: "100 900",
// });

// export const metadata: Metadata = {
//   title: "Outcome Magic",
//   description: "Developed by Adbhut Satsangi",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased`}
//       >
//         <StoreProvider>
//         {children}
//         </StoreProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteHeader } from "@/components/navbar/site-header";
import StoreProvider from "./storeProvider";
import ClientHydrationWrapper from "./components/client-hydration-wrapper";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Outcome Magic",
  description: "Developed by Adbhut Satsangi",
};

// Server component layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <StoreProvider>
          <ClientHydrationWrapper>
            {children}
          </ClientHydrationWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}