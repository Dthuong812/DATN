import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Leaf, Loader2, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";

import { toast } from "sonner";
import { loginUser } from "@/store/middleware/auth.middleware";

export function LoginPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const [UserName, setUserName] = useState("");
  const [PassWord, setPassWord] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!UserName || !PassWord) {
      toast.error("Vui lòng nhập đầy đủ thông tin đăng nhập.");
      return;
    }
  
    try {
      const response = await dispatch(loginUser({ UserName, PassWord })).unwrap(); 
      toast.success(response.Message); 
  
      // Chuyển hướng đến trang chủ
      navigate("/");
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại! Vui lòng thử lại."); 
    }
  };
  useEffect(() => {
    if (auth.isSuccess && auth.user) {
      navigate("/"); 
    } else if (auth.isError) {
      toast.error(auth.error || "Đăng nhập thất bại!"); 
    }
  }, [auth.isSuccess, auth.isError, auth.user, auth.error, navigate]);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-xl font-bold text-green-900 dark:text-white">
            EcoMonitor
          </h1>
        </Link>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Xin chào</CardTitle>
              <CardDescription>Chào mừng đến với EcoMonitor</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="grid gap-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="username">Tên đăng nhập</Label>
                      <Input
                        id="username"
                        placeholder="thuongkute"
                        onChange={(e) => setUserName(e.target.value)}
                        disabled={auth.isLoading}
                      />
                    </div>
                    <div className="grid gap-3">
                      <div className="flex items-center">
                        <Label htmlFor="password">Mật khẩu</Label>
                        <Link
                          to="/forgot-password"
                          className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                          Quên mật khẩu?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu"
                          onChange={(e) => setPassWord(e.target.value)}
                          disabled={auth.isLoading}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-500 cursor-pointer" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-500 cursor-pointer" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" disabled={auth.isLoading}  className="bg-green-800 hover:bg-green-700 cursor-pointer">
                      {auth.isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang đăng nhập...
                        </>
                      ) : (
                        "Đăng nhập"
                      )}
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Quay lại{" "}
                    <Link to="/" className="text-green-700">
                      Trang Chủ
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary">
            <Link to="/terms">Điều khoản dịch vụ</Link> và{" "}
            <Link to="/privacy">Chính sách bảo mật</Link> của chúng tôi.
          </div>
        </div>
      </div>
    </div>
  );
}
