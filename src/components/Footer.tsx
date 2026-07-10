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

  // Fetch settings directly from the database server-side
  const response = await getStoreSettings();
  const settings = response.success ? response.settings : null;

  // Fallback defaults if database fails or is empty
  const storeName = settings?.storeName || "Cosmatics";
  const storeDescription =
    settings?.storeDescription ||
    "Premium cosmetics and beauty products for everyone.";
  const phone = settings?.phone || "+92 (300) 123-4567";
  const email = settings?.email || "hello@cosmatics.com";
  const address = `${settings?.address || "Karachi"}, ${settings?.city || "Pakistan"}`;

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold mb-4">{storeName}</h3>
            <p className="text-gray-400 text-sm">{storeDescription}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="hover:text-white transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/shipping"
                  className="hover:text-white transition-colors"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  href="/returns"
                  className="hover:text-white transition-colors"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get In Touch</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              {settings?.phone && (
                <li className="flex items-center gap-2">
                  <Phone size={16} />
                  {phone}
                </li>
              )}
              {settings?.email && (
                <li className="flex items-center gap-2">
                  <Mail size={16} />
                  {email}
                </li>
              )}
              {(settings?.address || settings?.city) && (
                <li className="flex items-center gap-2">
                  <MapPin size={16} />
                  {address}
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; {currentYear} {storeName}. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {settings?.socialLinks?.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings?.socialLinks?.instagram && (
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings?.socialLinks?.twitter && (
                <a
                  href={settings.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2"
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
