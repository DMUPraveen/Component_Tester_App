import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import About from "./Pages/About";
import Parent from "./Pages/Parent";
import IV from "./Pages/IV";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Parent />,
    children: [
      {
        path: "about",
        element: <About />,
      },
      {
        path: "iv",
        element: <IV />
      },
      {
        path: "",
        element: <App />
      }
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
