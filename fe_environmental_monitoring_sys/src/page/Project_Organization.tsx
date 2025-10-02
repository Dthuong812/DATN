import DepartmentTable from "@/components/departments/DepartmentTable";
import OrganizationTable from "@/components/organizations/OrganizationTable";
import ProjectTable from "@/components/projects/ProjectTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const tabs = [
  {
    key: "project",
    label: "Dự án",
    content: <ProjectTable/>,
  },
  {
    key: "organization",
    label: "Tổ chức",
    content: <OrganizationTable/>,
  },
  {
    key: "department",
    label: "Phòng ban",
    content: <DepartmentTable/>,
  },
];
export default function Project_Organization() {
  return (
    <div className="max-w-8xl mx-auto px-6 py-6 ">
      <Tabs defaultValue="project"  className="w-full">
        <TabsList className="pt-4 justify-start border-b rounded-none mb-4 w-full bg-gray-50">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.key}
              value={tab.key}
              className="rounded-none h-full border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:text-green-600 text-md font-medium mr-8"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.key} value={tab.key}>
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
