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
import { Leaf, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "@/store/middleware/auth.middleware";


export function ForgotPasswordPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Vui lòng nhập email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Email không hợp lệ.");
      return;
    }
  dispatch(forgotPassword({ Email: email }))
  };
  useEffect(() => {
    if (auth.forgotSuccess) {
      toast.success("Vui lòng kiểm tra email của bạn.");
      navigate("/login");
    } else if (auth.isError) {
      toast.error(auth.error || "Khôi phục mật khẩu thất bại! Vui lòng thử lại.");
    }
  }, [auth.forgotSuccess, auth.isError, auth.error,navigate]);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 self-center font-medium"
        >
          <Leaf className="h-8 w-8 text-green-600" />
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            EcoMonitor
          </h1>
        </Link>

        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Quên mật khẩu</CardTitle>
              <CardDescription>
                Nhập email của bạn để khôi phục mật khẩu.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword} className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="abc@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={auth.isLoading}
                  />
                </div>

                <Button type="submit"disabled={auth.isLoading} className="cursor-pointer">
                  {auth.isLoading? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi liên kết khôi phục"
                  )}
                </Button>

                <div className="text-center text-sm">
                  <Link to="/login" className="text-green-700 hover:underline">
                    Quay lại Đăng nhập
                  </Link>
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
