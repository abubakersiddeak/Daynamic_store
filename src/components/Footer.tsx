import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { getStoreSettings } from "@/actions/settings";

export async function Footer() {
  const currentYear = new Date().getFullYear();

  const response = await getStoreSettings();
  const settings = response.success ? response.settings : null;

  const storeName = settings?.storeName || "Cosmatics";
  const storeDescription =
    settings?.storeDescription ||
    "Premium cosmetics and beauty products for everyone.";
  const phone = settings?.phone || "+92 (300) 123-4567";
  const email = settings?.email || "hello@cosmatics.com";
  const address = `${settings?.address || "Karachi"}, ${settings?.city || "Pakistan"}`;

  return (
    <footer className="bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-3">{storeName}</h3>
            <p className="text-gray-400 text-sm">{storeDescription}</p>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                { label: "Home", href: "/" },
                { label: "Products", href: "/products" },
                { label: "Categories", href: "/categories" },
                { label: "About", href: "/about" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white block py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "FAQ", href: "/faq" },
                { label: "Shipping Info", href: "/shipping" },
                { label: "Returns", href: "/returns" },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition hover:text-white block py-1"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3 text-white">Get In Touch</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <Phone size={16} />
                {phone}
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} />
                {email}
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} />
                {address}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {storeName}. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition hover:text-white"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition hover:text-white"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 transition hover:text-white"
                >
                  <Twitter size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
