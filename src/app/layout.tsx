import { Toaster } from "react-hot-toast";
import "./globals.css";
import { getStoreSettings } from "@/actions/settings";
export async function generateMetadata() {
  const res = await getStoreSettings();

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    title: res.success
      ? res.settings?.storeName || "Default Store"
      : "Default Store",
    description: res.settings?.storeDescription || "Default Description",
    openGraph: {
      title: `${res.settings?.storeName || "Default Store"} | ${res.settings?.storeDescription || "Default Description"}`,
      description: res.settings?.storeDescription || "Default Description",
      type: "website",
    },
    icons: {
      icon: res.settings?.logo,
      apple: res.settings?.logo,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
