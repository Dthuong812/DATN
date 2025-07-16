import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2 } from "lucide-react";
import type { User } from "@/types/types";
import Pagination from "@/components/Pagination";

const initialUsers: User[] = [
  {
    id: 1,
    userName: "admin",
    fullName: "Administrator",
    email: "admin@example.com",
    phone: "1234567890",
    isDieuHanh: true,
    active: true,
  },
  {
    id: 2,
    userName: "john",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "0987654321",
    isDieuHanh: false,
    active: false,
  },
];

export default function UserTable() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4 space-y-4">
      <div className="flex justify-end">
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Thêm người dùng
        </Button>
      </div>

      <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Tên đăng nhập</TableHead>
            <TableHead>Họ tên</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedUsers.map((user, index) => (
            <TableRow key={user.id}>
              <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
              <TableCell>{user.userName}</TableCell>
              <TableCell>{user.fullName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                {user.isDieuHanh ? "Điều hành" : "Nhân viên"}
              </TableCell>
              <TableCell>
                {user.active ? "Hoạt động" : "Không hoạt động"}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(user.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
