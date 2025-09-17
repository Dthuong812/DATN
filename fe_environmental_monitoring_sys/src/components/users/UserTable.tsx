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

import Pagination from "@/components/Pagination";
import { useGetUsersQuery } from "@/services/user.service";
import type { User } from "@/types/types";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import AddUserModal from "./AddUserModal";

export default function UserTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isFetching,refetch } = useGetUsersQuery({});
  const users = data?.Data || [];
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const displayedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [open, setIsOpen] = useState(false);

  if (isFetching) {
    return (
      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="grid gap-2 p-6">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-[90%]" />
            <Skeleton className="h-6 w-[75%]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4 space-y-4">
      <div className="flex justify-end">
        <Button className="bg-green-600 text-white hover:bg-green-700"
          onClick={() => setIsOpen(true)}
        >
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
            <TableHead>Tổ chức</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedUsers.map((user: User, index: number) => (
            <TableRow key={user.Id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{user.UserName}</TableCell>
              <TableCell>{user.FullName}</TableCell>
              <TableCell>{user.Email}</TableCell>
              <TableCell>{user.Phone}</TableCell>
              <TableCell>{user.OrganizationName}</TableCell>
              <TableCell>
                {user.Active === 1 ? "Hoạt động" : "Không hoạt động"}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  // onClick={() => handleDelete(user.id)}
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
      <AddUserModal
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
