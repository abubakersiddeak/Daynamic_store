"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { getStoreSettings } from "@/actions/settings";
import Image from "next/image";
import { StoreSettings } from "@/types";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constants/const";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const items = useCartStore((state) => state.items);
  const [storeSetting, setStoreSetting] = useState<StoreSettings | null>(null);
  const pathname = usePathname();

  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    async function loadSettings() {
      const data = await getStoreSettings("storeName logo");
      setStoreSetting(data.settings);
    }

    loadSettings();
  }, []);

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-rose-50 shadow-sm">
            <Image
              height={40}
              width={40}
              src={storeSetting?.logo || "/logoFallback.png"}
              alt="logo"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold text-black sm:text-base md:text-lg">
              {storeSetting?.storeName || "Store Name"}
            </span>
            <span className="text-[11px] text-gray-500">Beauty & skincare</span>
          </div>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-3 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? "text-black"
                    : "text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              >
                {item.name}
                {isActive && (
                  <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-rose-500" />
                )}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-2 text-gray-600 transition hover:border-rose-300 hover:bg-rose-50"
            aria-label="Cart"
          >
            <ShoppingCart size={18} />
            <span className="hidden text-sm font-medium md:inline">Cart</span>
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden rounded-full border border-gray-200 bg-white p-2 text-gray-600 transition hover:border-rose-300 hover:bg-rose-50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white/95 px-4 pb-4 pt-2 shadow-sm">
          <div className="flex flex-col gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-3 text-base font-medium transition ${
                  pathname === item.href
                    ? "bg-rose-50 text-rose-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
