import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import Pagination from "../Pagination";
import { useGetRolesQuery } from "@/services/role.service";
import type { Role } from "@/types/types";
import { useState } from "react";
import { AddRoleModal } from "./AddRoleModal";
import DeleteRoleButton from "./DeleteRoleButton";
import UpdateRoleModal from "./UpdateRoleModal";

export default function AssignRoleComponent() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, isFetching, refetch } = useGetRolesQuery({});
  const roles = data?.Data || [];
  const totalRoles = roles.length;
  const totalPages = Math.ceil(totalRoles / itemsPerPage);
  const displayedRoles = roles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [open, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const handleEdit = (roleId: number) => {
    setSelectedRoleId(roleId);
    setModalOpen(true);
  }

  if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;

  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
      <div className="flex justify-end mb-4">
        <Button
          className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Thêm vai trò
        </Button>
      </div>
      <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Mã vai trò</TableHead>
            <TableHead>Tên vai trò</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedRoles.map((role: Role, index: number) => (
            <TableRow key={role.Id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{role.Code}</TableCell>
              <TableCell>{role.Name}</TableCell>
              <TableCell>
                {role.Description.length > 50
                  ? role.Description.slice(0, 50) + "..."
                  : role.Description}
              </TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon"
                  className="cursor-pointer"
                  onClick={() => handleEdit(role.Id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon">
                  <DeleteRoleButton id={role.Id} refetch={refetch} />
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
      <AddRoleModal
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
      {selectedRoleId !== null && (
        <UpdateRoleModal
          roleId={selectedRoleId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            refetch();
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
