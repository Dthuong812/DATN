import { useGetUserByIdQuery } from "@/services/user.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

import type { Project, Role } from "@/types/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChangePasswordForm from "@/components/profile/ChangPassWord";
import { useState } from "react";

export default function ProfilePage() {
  const token = localStorage.getItem("token");
  const userId = token ? JSON.parse(atob(token.split(".")[1])).sub : null;
  const [openChangePassword, setOpenChangePassword] = useState(false);

  const {
    data: userData,
    isLoading,
    error,
  } = useGetUserByIdQuery(userId, {
    skip: !userId,
  });

  const user = userData?.Data;

  if (isLoading) return <p>Đang tải thông tin...</p>;
  if (error) return <p>Có lỗi xảy ra khi tải thông tin người dùng.</p>;

  return (
    <div className="max-w-8xl mx-auto px-6 py-8">
      {user ? (
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="bg-gray-500/25 text-green-900 w-full h-full flex items-center justify-center text-4xl font-bold rounded-4xl">
                  {user.FullName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{user.FullName}</CardTitle>
                <p className="text-sm text-muted-foreground">{user.Email}</p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setOpenChangePassword(true)}>
                  Đổi mật khẩu
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog
              open={openChangePassword}
              onOpenChange={setOpenChangePassword}
            >
              <DialogContent
                className="sm:max-w-md"
                onInteractOutside={(e) => e.preventDefault()}
              >
                <DialogHeader>
                  <DialogTitle className="cursor-pointer">
                    Đổi mật khẩu
                  </DialogTitle>
                </DialogHeader>
                <ChangePasswordForm
                userId={user.Id}
                  onSuccess={() => setOpenChangePassword(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>

          <Separator />
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm">Tên đầy đủ</Label>
                <Input value={user.FullName} readOnly />
              </div>
              <div>
                <Label className="text-sm">Tên đăng nhập</Label>
                <Input value={user.UserName} readOnly />
              </div>
              <div>
                <Label className="text-sm">Email</Label>
                <Input value={user.Email} readOnly />
              </div>
              <div>
                <Label className="text-sm">Số điện thoại</Label>
                <Input value={user.Phone || "Chưa cập nhật"} readOnly />
              </div>
              <div>
                <Label className="text-sm">Công ty</Label>
                <Input value={user.Organization|| "Chưa cập nhật"} readOnly />
              </div>
              <div>
                <Label className="text-sm">Phòng ban</Label>
                <Input value={user.Department || "Chưa cập nhật"} readOnly />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Dự án</h3>
              <div className="space-y-4">
                {user.Projects.map((project: Project) => (
                  <Card key={project.Id} className="p-4">
                    <h4 className="font-semibold">{project.Name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Mã: {project.Code}
                    </p>
                    <div className="mt-3 space-y-2">
                      <h5 className="text-sm font-medium">Vai trò:</h5>
                      <div className="flex flex-wrap gap-2">
                        {project.Roles.map((role: Role) => (
                          <Badge key={role.Id} variant="secondary">
                            {role.Name}
                          </Badge>
                        ))}
                      </div>
                      <ul className="list-disc list-inside text-xs text-muted-foreground">
                        {project.Roles.map(
                          (role: Role) =>
                            role.Description && (
                              <li key={role.Id}>{role.Description}</li>
                            )
                        )}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <p>Không tìm thấy thông tin người dùng.</p>
      )}
    </div>
  );
}
