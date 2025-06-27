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
import SernsorsPage from "./page/SersorsPage";
import ReportPage from "./page/ReportPage";
import LogsPage from "./page/LogsPage";
import UserPage from "./page/UserPage";
import { LoginPage } from "./page/LoginPage";


const router = createBrowserRouter([
    {path: "/login",
        element: <LoginPage />, },
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
        path: "admin",
        element: <AdminPage/>,
        children: [
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
                element: <SernsorsPage/>,
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
