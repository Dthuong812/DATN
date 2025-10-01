import { FileText, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import type { Object } from "@/types/types";
import Pagination from "../common/Pagination";
import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import DeleteObjectButton from "./DeleteObjectButton";
import UpdateObjectDraw from "./UpdateObjectDraw";
import { useState } from "react";

interface ObjectProps {
  objects: Object[];
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (size: string) => void;
}
export default function ObjectTable({
  objects,
  isFetching,
  currentPage,
  totalPages = 1,
  onPageChange,
}: ObjectProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedObjectId, setSelectedObjectId] = useState<number | null>(null);
  const handleEdit = (objectId: number) => {
    setSelectedObjectId(objectId);
    setModalOpen(true);
  };
  if (isFetching) {
    return (
      <Card>
        <CardContent className="p-6 space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="">
        <Card className="p-4 min-w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã code</TableHead>
                <TableHead>Mã dự án</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Ngày lắp đặt</TableHead>
                <TableHead>Ngày bảo trì</TableHead>
                <TableHead>Kết nối</TableHead>
                <TableHead>Nguồn cấp</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ghi chú</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {objects.length > 0 ? (
                objects.map((object: Object) => (
                  <TableRow key={object.Id} className="hover:bg-muted/50">
                    <TableCell>
                      {object.Code}
                      <br></br>
                      <span>{object.Name}</span>
                    </TableCell>
                    <TableCell>
                      {object.Project_Code}
                      <br></br>
                      <span className="text-sm font-medium">
                        {object.Organization_Code}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="block">
                        {object.Details_Value.Address.split(" ")
                          .slice(0, 5)
                          .join(" ")}{" "}
                      </span>
                      <span className="block">
                        {object.Details_Value.Address.split(" ")
                          .slice(5)
                          .join(" ")}{" "}
                      </span>
                    </TableCell>
                    <TableCell>
                      {new Date(
                        object.Details_Value.Installation_Date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {new Date(
                        object.Details_Value.Last_Maintenance_Date
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {object.Details_Value.Connection_Type}
                    </TableCell>
                    <TableCell>{object.Details_Value.Power_Supply}V</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 ml-6">
                        <span
                          className={`inline-block w-3 h-3 rounded-full  ${
                            object.Status === 1
                              ? "bg-green-500"
                              : object.Status === 2
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="block">
                        {object.Details_Value.Note.split(" ")
                          .slice(0, 5)
                          .join(" ")}{" "}
                      </span>
                      <span className="block">
                        {object.Details_Value.Note.split(" ")
                          .slice(5)
                          .join(" ")}{" "}
                      </span>
                    </TableCell>
                    <TableCell className="space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(object.Id)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="icon">
                        <DeleteObjectButton id={object.Id} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex flex-col items-center space-y-2">
                      <FileText className="h-12 w-12 text-muted-foreground" />
                      <div>
                        <p className="text-lg font-medium">Không có dữ liệu</p>
                        <p className="text-sm text-muted-foreground">
                          Thử thay đổi bộ lọc hoặc kiểm tra lại kết nối
                        </p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
      {selectedObjectId !== null && (
        <UpdateObjectDraw
          objectId={selectedObjectId}
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => {
            setModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
