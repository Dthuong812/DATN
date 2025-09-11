import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import Pagination from "../Pagination"; // Đường dẫn tùy vào cấu trúc thư mục

export default function AssignRoleComponent() {
  const roles = [
    {
      id: 1,
     
      roleName: "Admin",
      function: "Manage Users",
    },
    {
      id: 2,
      
      roleName: "Editor",
      function: "Edit Content",
    },
    {
      id: 3,
     
      roleName: "Viewer",
      function: "View Reports",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(roles.length / itemsPerPage);

  const displayedRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
      <div className="flex justify-end mb-4">
        <Button className="bg-green-600 text-white hover:bg-green-700">
          Thêm vai trò
        </Button>
      </div>
      <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Vai trò</TableHead>
            <TableHead>Chức năng</TableHead>
            <TableHead>Số lượng</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedRoles.map((role, index) => (
            <TableRow key={role.id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{role.roleName}</TableCell>
              <TableCell>{role.function}</TableCell>
              <TableCell>{index}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon">
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon">
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
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
