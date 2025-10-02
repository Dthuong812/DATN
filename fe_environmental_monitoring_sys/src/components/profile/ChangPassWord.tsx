import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import authService from "@/services/auth.service";
import type { ChangePasswordPayload } from "@/types/types";

const schema = yup.object().shape({
  OldPassWord: yup
    .string()
    .min(8, "Mật khẩu cũ phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu cũ"),
  PassWord: yup
    .string()
    .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
    .required("Vui lòng nhập mật khẩu mới"),
  PassWordAgain: yup
    .string()
    .oneOf([yup.ref("PassWord")], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng nhập lại mật khẩu"),
});

export default function ChangePasswordForm({
  userId,
  onSuccess,
}: {
  userId: number;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<ChangePasswordPayload>({
    resolver: yupResolver(schema),
    defaultValues: {
      Id:"",
      OldPassWord: "",
      PassWord: "",
      PassWordAgain: "",
    },
  });

  const onSubmit = async (values: ChangePasswordPayload) => {
    try {
      setLoading(true);
      
      await authService.change_password({ ...values, Id: userId });
      toast.success("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");

      localStorage.removeItem("token");
      onSuccess?.();
      navigate("/login", { replace: true });
    } catch  {
    
        toast.error("Đổi mật khẩu thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const PasswordField = ({
    id,
    label,
    show,
    setShow,
    register,
    error,
  }: {
    id: keyof ChangePasswordPayload;
    label: string;
    show: boolean;
    setShow: (v: boolean) => void;
    register: any;
    error?: string;
  }) => (
    <div className="relative space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={show ? "text" : "password"}
          className="pr-10"
          {...register(id)}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
          onClick={() => setShow(!show)}
        >
          {show ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-2">
      <PasswordField
        id="OldPassWord"
        label="Mật khẩu cũ"
        show={showOldPassword}
        setShow={setShowOldPassword}
        register={form.register}
        error={form.formState.errors.OldPassWord?.message}
      />

      <PasswordField
        id="PassWord"
        label="Mật khẩu mới"
        show={showNewPassword}
        setShow={setShowNewPassword}
        register={form.register}
        error={form.formState.errors.PassWord?.message}
      />

      <PasswordField
        id="PassWordAgain"
        label="Nhập lại mật khẩu"
        show={showConfirmPassword}
        setShow={setShowConfirmPassword}
        register={form.register}
        error={form.formState.errors.PassWordAgain?.message}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess?.()}
          className="cursor-pointer"
        >
          Hủy
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-green-700 hover:bg-green-600 text-white px-6 cursor-pointer"
        >
          {loading ? "Đang cập nhật..." : "Cập nhật"}
        </Button>
      </div>
    </form>
  );
}
