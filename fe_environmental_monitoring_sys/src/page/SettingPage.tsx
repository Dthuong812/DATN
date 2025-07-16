import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thông báo</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <span>Bật thông báo cảnh báo môi trường</span>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin cá nhân</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Tên người dùng" />
          <Input type="email" placeholder="Email" />
          <Button>Cập nhật</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Chế độ hiển thị</CardTitle>
        </CardHeader>
        <CardContent>
          <select className="border p-2 rounded w-full">
            <option>Sáng</option>
            <option>Tối</option>
          </select>
        </CardContent>
      </Card>
    </div>
  );
}
