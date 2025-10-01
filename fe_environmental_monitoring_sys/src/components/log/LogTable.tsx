import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Log } from "@/types/types";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, FileText, Server } from "lucide-react";
import Pagination from "../common/Pagination";

interface LogTableProps {
  logs: Log[];
  isFetching: boolean;
  currentPage: number;
  pageSize: number;
  totalPages?: number;
  totalRecords?: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange?: (size: string) => void;
}

export default function LogTable({
  logs,
  isFetching,
  currentPage,
  totalPages = 1,
  onPageChange,
}: LogTableProps) {
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
                  <TableHead>Thời gian </TableHead>
                  <TableHead>Loại log</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Dữ liệu</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.length > 0 ? (
                  logs.map((log: Log) => (
                    <TableRow key={log.Id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="text-sm font-medium">
                              {new Date(log.CreatedAt).toLocaleString("vi-VN")}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{log.LogTypeName}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Server className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm pl-2">{log.Service}</span>
                        </div>
                      </TableCell>
                      <TableCell>{log.Method}</TableCell>
                      <TableCell>
                        <span className="text-sm font-medium">
                          {log.Action}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{log.Content}</span>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm truncate cursor-pointer"
                          title={log.Data}
                        >
                          {log.Data.length > 50
                            ? `${log.Data.substring(0, 50)}...`
                            : log.Data}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <FileText className="h-12 w-12 text-muted-foreground" />
                        <div>
                          <p className="text-lg font-medium">
                            Không có dữ liệu nhật ký
                          </p>
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
    </div>
  );
}
