import Sidebar from "@/components/layout/SideBar";
import { Outlet } from "react-router-dom";

export default function AdminPage() {
    return (
        <div className="h-full flex flex-col">
        <Sidebar/>
        <main className="max-w-8xl py-15">
            <Outlet />
        </main>
        </div>

    );
}