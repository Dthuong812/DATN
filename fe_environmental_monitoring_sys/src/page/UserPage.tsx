import AssignRoleComponent from "@/components/AssignRoleComponent";
import PermissionManagementComponent from "@/components/PermissionManagementComponent";
import UserTable from "@/components/UserTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

const tabs = [
  {
    key: "user",
    label: "Người dùng",
    content:  <UserTable />,
  },
  {
    key: "role",
    label: "Vai trò",
    content: <AssignRoleComponent />,
  },
  {
    key: "permission-management",
    label: "Quản lý quyền",
    content: <PermissionManagementComponent />,
  },
];

export default function UserPage() {
  return (
    <div className="max-w-8xl mx-auto px-6 py-6 ">
      <Tabs defaultValue="user" className="w-full">
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
