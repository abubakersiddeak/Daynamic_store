import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getStoreSettings } from "@/actions/settings";
export async function generateMetadata() {
  const res = await getStoreSettings();

  return {
    title: res.success
      ? res.settings?.storeName || "Default Store"
      : "Default Store",
  };
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
