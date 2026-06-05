"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart, Search } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { getStoreSettings } from "@/actions/settings";
import Image from "next/image";
import { StoreSettings } from "@/types";
import { usePathname } from "next/navigation";
import { menuItems } from "@/constants/const";
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const [storeSetting, setStoreSetting] = useState<StoreSettings | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    async function loadSettings() {
      const data = await getStoreSettings("storeName logo");
      setStoreSetting(data.settings);
    }

    loadSettings();
  }, []);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="container  mx-auto px-4">
        <div className="flex justify-between  w-full  items-center py-4">
          <Link
            href="/"
            className="flex items-center gap-2  justify-start col-span-1"
          >
            <Image
              height={40}
              width={40}
              src={storeSetting?.logo || "/logoFallback.png"}
              alt="logo"
            />
            <span className="md:text-2xl font-bold text-black">
              {storeSetting?.storeName || "Store Name"}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 col-span-1">
            {menuItems.map((item) => {
              // 2. Check if the current link is active
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-black" : "text-gray-500 hover:text-black"
                  }`}
                >
                  {item.name}

                  {/* 3. The Active Indicator (Smooth Underline) */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4  justify-end col-span-1 text-gray-700">
            <button className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
              <Search size={20} />
            </button>
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              href="/"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Products
            </Link>
            <Link
              href="/categories"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Categories
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Contact
            </Link>
            <Link
              href="/account"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Account
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
