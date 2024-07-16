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
import SignalGenerator from "./Pages/Signal_Generator";
import { Capacitor } from "./Pages/Capacitor";
import { Inductor } from "./Pages/Inductor";
import Oscilloscope from "./Pages/Oscilloscope";
import IVX from "./Pages/IVX";
import Bode from "./Pages/Bode";
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
        path: "signalGenerator",
        element: <SignalGenerator />
      },
      {
        path: "capacitor",
        element: <Capacitor />
      },
      {
        path: "inductor",
        element: <Inductor />
      },
      {
        path: "oscilloscope",
        element: <Oscilloscope />
      },
      {
        path: "ivx",
        element: <IVX />
      },
      {
        path: "bode",
        element: <Bode />
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
