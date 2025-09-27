import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./page/HomePage";
import MapPage from "./page/MapPage";
import NotFoundPage from "./page/NotFoundPage";
import AdminPage from "./page/AdminPage";
import RealTimePage from "./page/RealTimePage";
import ReportPage from "./page/ReportPage";
import LogsPage from "./page/LogsPage";
import UserPage from "./page/UserPage";
import { LoginPage } from "./page/LoginPage";
import DashboardPage from "./page/DashboardPage";
import SettingsPage from "./page/SettingPage";
import HelpPage from "./page/HelpPage";
import ProfilePage from "./page/ProfilePage";
import { ForgotPasswordPage } from "./page/ForgotPassWordPage";
import Project_Organization from "./page/Project_Organization";
import ObjectPage from "./page/ObjectPage";
import DevicePage from "./page/DevicePage";



const router = createBrowserRouter([
    {path: "/login",
        element: <LoginPage />, },
    {path: "/forgot-password",
        element: <ForgotPasswordPage />, },
  {
    path: "/",
    element: <App />, 
    children: [
      {
        index: true, 
        element: <HomePage />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "profile",
        element: <ProfilePage/>,
      },
      {
        path: "report",
        element: <ReportPage/>,
      },
      {
        path: "admin",
        element: <AdminPage/>,
        children: [
          {
            index: true, 
            element: <DashboardPage />,
          },
            {
                path: "realtime",
                element: <RealTimePage/>,
              },
              {
                path: "logs",
                element: <LogsPage/>,
              },
              {
                path: "user",
                element: <UserPage/>,
              },
              {
                path: "settings",
                element: <SettingsPage/>,
              },
              {
                path: "help",
                element: <HelpPage/>,
              },
              {
                path: "project_organization",
                element: <Project_Organization/>,
              },
              {
                path: "object",
                element: <ObjectPage/>,
              },
              {
                path: "device",
                element: <DevicePage/>,
              },
        ]
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />, 
  },
]);

export default router;
