import { Pencil} from "lucide-react";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import Pagination from "../common/Pagination";
import { useGetProjectsQuery } from "@/services/project.service";
import type { Project } from "@/types/types";
import { useState } from "react";
import AddProjectModal from "./AddProjectModal";
import UpdateProjectModal from "./UpdateProjectModal";
import DeleteProjectButton from "./DeleteProjectButton";

export default function ProjectTable() {
  const { data, isFetching, refetch } = useGetProjectsQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
    pollingInterval: 30000, 
  });
  const projects = data?.Data ?? [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const displayedProject = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [open, setIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(
    null
  );
//   const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const handleEdit = (id: number) => {
    setSelectedProjectId(id);
    setModalOpen(true);
  };
  if (isFetching) return <p className="text-center p-4">Đang tải dữ liệu...</p>;
  return (
    <div className="flex-1 rounded-xl border overflow-auto h-full scrollbar-hide bg-white shadow p-4 space-y-4">
      <div className="flex justify-end">
        <Button
          className="bg-green-600 text-white hover:bg-green-700 cursor-pointer"
          onClick={() => setIsOpen(true)}
        >
          Thêm dự án
        </Button>
      </div>

      <Table className="flex-1 border overflow-auto h-full scrollbar-hide bg-white shadow p-4">
        <TableHeader>
          <TableRow>
            <TableHead>STT</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Tên dự án</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayedProject.map((project: Project, index: number) => (
            <TableRow key={project.Id}>
              <TableCell>
                {(currentPage - 1) * itemsPerPage + index + 1}
              </TableCell>
              <TableCell>{project.Code}</TableCell>
              <TableCell>{project.Name}</TableCell>
              <TableCell>{project.Description}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="outline" size="icon"onClick={() => handleEdit(project.Id)}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="icon">
                <DeleteProjectButton id={project.Id} refetch={refetch} />
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
      <AddProjectModal
        open={open}
        onClose={() => setIsOpen(false)}
        onSuccess={() => refetch()}
      />
      <UpdateProjectModal
        projectId={selectedProjectId}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => {
          refetch();
          setModalOpen(false);
        }
        }
      />
    </div>
  );
}
