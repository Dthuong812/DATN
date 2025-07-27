import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import HomePage from "./page/HomePage";
import MapPage from "./page/MapPage";
import NotFoundPage from "./page/NotFoundPage";
import AboutPage from "./page/AboutPage";
import ContactPage from "./page/ContactPage";
import AdminPage from "./page/AdminPage";
import RealTimePage from "./page/RealTimePage";
import StationPage from "./page/StationPage";
import ReportPage from "./page/ReportPage";
import LogsPage from "./page/LogsPage";
import UserPage from "./page/UserPage";
import { LoginPage } from "./page/LoginPage";
import DashboardPage from "./page/DashboardPage";
import SettingsPage from "./page/SettingPage";
import HelpPage from "./page/HelpPage";
import SensorsPage from "./page/SensorsPage";
import ProfilePage from "./page/ProfilePage";
import { ForgotPasswordPage } from "./page/ForgotPassWordPage";



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
        path: "about",
        element: <AboutPage/>,
      },
      {
        path: "contact",
        element: <ContactPage/>,
      },
      {
        path: "profile",
        element: <ProfilePage/>,
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
                path: "station",
                element: <StationPage/>,
              },
              {
                path: "sensors",
                element: <SensorsPage/>,
              },
              {
                path: "report",
                element: <ReportPage/>,
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
