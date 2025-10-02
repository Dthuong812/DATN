import { useGetOrganizationsQuery } from "@/services/organization.service";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Dialog, DialogTrigger } from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import type { Department, Organization } from "@/types/types";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Pencil } from "lucide-react";
import { useGetDepartmentsQuery } from "@/services/department.service";
import Pagination from "../common/Pagination";
import DeleteDepartmentButton from "./DeleteDepartmentButton";
import AddDepartmentDraw from "./AddDepartmentDraw";
import UpdateDepartmentDraw from "./UpdateDepartmentDraw";

export default function DepartmentTable() {
  const [organizationId, setOrganizationId] = useState<number | null>(null);
  const itemsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isFetching, refetch } = useGetDepartmentsQuery(
    {
      page: currentPage,
      pageSize: itemsPerPage,
    },
    { skip: !organizationId }
  );
  const list  = data?.Data?.data ?? [];
  const departments = list.filter((dept: Department) => dept.Organization_Id === organizationId);
  useEffect(() => {
    setCurrentPage(1);
  }, [organizationId]);
  const totalPages = Math.ceil((data?.Data?.total ?? 0) / itemsPerPage);
  const displayedDepartment = departments;
  const [open, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { data: listOrgs } = useGetOrganizationsQuery({});
  const orgs = listOrgs?.Data;
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const handleEdit = (id: number) => {
      setSelectedDepartmentId(id);
      setModalOpen(true);
  }
  if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;
  return (
    <Card className="w-full p-4">
      <CardContent className="space-y-2 px-0">
        <div className="flex justify-between items-center">
          <Select
           value={organizationId?.toString()}
            onValueChange={(value) => {
              setOrganizationId(Number(value));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Chọn công ty" />
            </SelectTrigger>
            <SelectContent>
              {orgs?.map((p: Organization) => (
                <SelectItem key={p.Id} value={p.Id.toString()}>
                  {p.Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                disabled={!organizationId}
                onClick={() => setIsOpen(true)}
              >
                Thêm phòng ban
              </Button>
            </DialogTrigger>
          </Dialog>
        </div>

        <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
          <TableHeader>
            <TableRow>
              <TableHead>STT</TableHead>
              <TableHead>Mã phòng ban</TableHead>
              <TableHead>Tên phòng ban</TableHead>
              <TableHead>Thuộc phòng ban</TableHead>
              <TableHead>Điện thoại</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedDepartment.map(
              (department: Department, index: number) => (
                <TableRow key={department.Id}>
                  <TableCell>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </TableCell>
                  <TableCell>{department.Code}</TableCell>
                  <TableCell>{department.Name}</TableCell>
                  <TableCell>{department.ParentName}</TableCell>
                  <TableCell>{department.Phone}</TableCell>
                  <TableCell>{department.Email}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleEdit(department.Id)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="cursor-pointer"
                      variant="destructive"
                    >
                      <DeleteDepartmentButton
                        id={department.Id}
                        refetch={refetch}
                      />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        <AddDepartmentDraw
          open={open}
          onClose={() => setIsOpen(false)}
          onSuccess={() => refetch()}
          organizationId={organizationId!}
        />
         <UpdateDepartmentDraw
        departmentId={selectedDepartmentId}
        organizationId={organizationId!}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
        }}
      />
      </CardContent>
    </Card>
  );
}
