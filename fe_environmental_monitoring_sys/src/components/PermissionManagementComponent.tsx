import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PermissionManagementComponent() {
  const [permissions, setPermissions] = useState([
    {
      name: "Quản lý người dùng",
      actions: { view: true, create: false, update: false, delete: false },
    },
    {
      name: "Quản lý bài viết",
      actions: { view: false, create: false, update: false, delete: false },
    },
  ]);

  const [selectAll, setSelectAll] = useState({
    view: false,
    create: false,
    update: false,
    delete: false,
  });

  const handleToggle = (index: number, action: keyof typeof selectAll) => {
    const updated = [...permissions];
    updated[index].actions[action] = !updated[index].actions[action];
    setPermissions(updated);
  };

  const handleToggleAll = (action: keyof typeof selectAll) => {
    const updatedValue = !selectAll[action];
    setSelectAll((prev) => ({ ...prev, [action]: updatedValue }));
    const updated = permissions.map((p) => ({
      ...p,
      actions: { ...p.actions, [action]: updatedValue },
    }));
    setPermissions(updated);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Quản lý quyền cho vai trò</CardTitle>
        <Button variant="outline" className="bg-green-600 text-white hover:bg-green-700">
          Thêm quyền mới
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="max-w-xs">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Chọn vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="editor">Editor</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="overflow-auto rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left border">Chức năng</th>
                {["view", "create", "update", "delete"].map((action, i) => (
                  <th key={i} className="p-2 text-center border">
                    <div className="flex flex-col items-center gap-1">
                      <span className="capitalize">{action}</span>
                      <Checkbox
                        checked={selectAll[action as keyof typeof selectAll]}
                        onCheckedChange={() =>
                          handleToggleAll(action as keyof typeof selectAll)
                        }
                      />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {permissions.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-2 border">{item.name}</td>
                  {["view", "create", "update", "delete"].map((action, i) => (
                    <td key={i} className="text-center border">
                      <Checkbox
                        checked={item.actions[action as keyof typeof selectAll]}
                        onCheckedChange={() =>
                          handleToggle(index, action as keyof typeof selectAll)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Button>Lưu quyền</Button>
      </CardContent>
    </Card>
  );
}
