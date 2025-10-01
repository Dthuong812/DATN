import { Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import Pagination from "../common/Pagination";
import { useState } from "react";
import { useGetOrganizationsQuery } from "@/services/organization.service";
import type { Organization } from "@/types/types";
import AddOrganizationDraw from "./AddOrganizationDraw";
import UpdateOrganizationDraw from "./UpdateOrganizationDraw";
import DeleteOrganizationButton from "./DeleteOrganizationButton";

export default function OrganizationTable() {
    const { data, isFetching,refetch } = useGetOrganizationsQuery({});
  const organizations = data?.Data ?? [];
  const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(organizations.length / itemsPerPage);
    const displayedOrganization = organizations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const [open, setIsOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedOrganizationId, setSelectedOrganizationId] = useState<number | null>(null);
    const handleEdit = (id: number) => {
        setSelectedOrganizationId(id);
        setModalOpen(true);
    }
    if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;
    
  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4 space-y-4">
      <div className="flex justify-end">
        <Button
          className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Thêm tổ chức
        </Button>
      </div>

      <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Mã tổ chức</TableHead>
            <TableHead>Tên tổ chức</TableHead>
            <TableHead>Công ty cha</TableHead>
            <TableHead>Tỉnh/Thành phố</TableHead>
            <TableHead>Điện thoại</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedOrganization.map((organization: Organization, index: number) => (
            <TableRow key={organization.Id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{organization.Code}</TableCell>
              <TableCell>{organization.Name}</TableCell>
              <TableCell>{organization.ParentName}</TableCell>
              <TableCell>{organization.LocalName}</TableCell>
              <TableCell>{organization.Phone}</TableCell>
              <TableCell>{organization.Email}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="cursor-pointer"
                  onClick={() => handleEdit(organization.Id)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button size="icon" className="cursor-pointer" variant="destructive">
                  <DeleteOrganizationButton id={organization.Id} refetch={refetch} />
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
      <AddOrganizationDraw
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
      <UpdateOrganizationDraw
        organizationId={selectedOrganizationId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
