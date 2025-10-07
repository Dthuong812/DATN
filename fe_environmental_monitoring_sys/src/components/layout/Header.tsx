import { Bell, Leaf, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { toast } from "sonner";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const pathname = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Đăng xuất thành công!");
    navigate("/login");
  };

  const navItems = [
    { href: "/map", label: "Quan Trắc" },
    { href: "/report", label: "Thống kê" },
    { href: "/admin", label: "Quản lý" },
  ];
  const [notifications] = useState([
    { id: 1, message: "Có 1 cảnh báo mới về chất lượng không khí" },
    { id: 2, message: "Hệ thống vừa cập nhật dữ liệu quan trắc" },
  ]);
  return (
    <nav className="fixed top-0 w-full bg-white shadow-sm border-b z-1000000">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <Leaf className="h-8 w-8 text-green-600" />
            <Link to="/">
              <h1 className="text-xl font-bold text-green-600">EcoMonitor</h1>
              <p className="text-xs text-gray-500">
                Giám sát môi trường thông minh
              </p>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center gap-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-md text-[16px] font-medium",
                      pathname === item.href
                        ? "text-green-600 dark:text-green-400 font-semibold"
                        : "text-gray-700 hover:text-green-600"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
                <DropdownMenu>
                  <DropdownMenuTrigger className="relative focus:outline-none">
                    <Bell className="h-6 w-6 text-gray-600 hover:text-green-600 cursor-pointer " />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                        {notifications.length}
                      </span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80 bg-white shadow-lg rounded-lg p-2 mr-15 my-4">
                    <DropdownMenuLabel className="font-semibold text-gray-700">
                      Thông báo
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <DropdownMenuItem
                          key={n.id}
                          className="text-sm text-gray-700 hover:bg-gray-100 rounded-md p-2 cursor-pointer"
                        >
                          {n.message}
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-2">
                        Không có thông báo nào
                      </p>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none rounded-full">
                    <Avatar className="cursor-pointer w-8 h-8">
                      <AvatarFallback className="bg-gray-500/25 text-green-900 w-8 h-8 flex items-center justify-center text-xl font-bold rounded-4xl">
                        {localStorage.getItem("user")?.charAt(1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48 p-4 bg-gray-50 rounded-lg shadow-lg mx-8 my-3 ">
                    <DropdownMenuLabel className="pb-2 focus:outline-none text-gray-800 font-xl">
                      Tài khoản của tôi
                    </DropdownMenuLabel>
                    <hr />
                    <DropdownMenuSeparator />
                    <Link to={"/admin/profile"}>
                      <DropdownMenuItem className="flex items-center gap-2 p-1 focus:outline-none cursor-pointer">
                        <User className="h-4 w-4" /> Trang cá nhân
                      </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem
                      className="text-destructive flex items-center gap-2 p-1 focus:outline-none cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" /> Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="p-2 text-white bg-green-600 hover:bg-green-900 rounded-md cursor-pointer hover:text-white"
                onClick={() => {
                  window.location.href = "/login";
                }}
              >
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
