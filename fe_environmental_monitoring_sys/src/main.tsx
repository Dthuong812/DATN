import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store"; 

import "./index.css";
import router from "./routes";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
     <Toaster richColors position="top-center" />
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
