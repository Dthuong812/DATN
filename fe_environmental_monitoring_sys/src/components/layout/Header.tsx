import { Leaf, Settings, Bell, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;

  const navItems = [
    { href: "/", label: "Trang chủ" },
    { href: "/map", label: "Quan Trắc" },
    { href: "/about", label: "Giới thiệu" },
    { href: "/contact", label: "Liên hệ" },
  ];

  return (
    <nav
      className="fixed top-0 w-full bg-white shadow-sm border-b z-50"
      aria-label="Main Navigation"
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">EcoMonitor</h1>
              <p className="text-xs text-gray-500">
                Giám sát môi trường thông minh
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "px-3 py-2 rounded-md text-[16px] font-medium",
                  pathname === item.href
                    ? "text-green-600 dark:text-green-400 font-semibold"
                    : "text-gray-700 hover:text-green-600 "
                )}
              >
                {item.label}
              </Link>
            ))}

            {/* {token && ( */}
            <Link
              to="/admin"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              title="Admin"
            >
              <Settings className="w-5 h-5" />
            </Link>
            {/* )} */}

            <Link
              to="/notifications"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
            </Link>

            <Link
              to="/profile"
              className="p-1 rounded-full hover:ring-2 ring-green-500"
              title="Tài khoản"
            >
              <UserCircle className="w-8 h-8 text-gray-600 dark:text-gray-300" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
