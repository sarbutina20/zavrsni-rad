import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import MainLayout from "./routes/MainLayout";
import { loaderKnjige, PrikazKnjiga } from "./components/knjiga/PrikazKnjiga";
import { actionPrijava, Prijava } from "./components/autentifikacija/Prijava";
import { actionOdjava } from "./components/autentifikacija/Odjava";
import { tokenLoader } from "./components/autentifikacija/token";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    errorElement: <ErrorPage></ErrorPage>,
    loader: tokenLoader,
    id:'root',
    children: [
      {
        index: true,
        element: <App></App>,
      },
      {
        path: "prijava",
        element: <Prijava></Prijava>,
        action: actionPrijava,
      },
      {
        path: "odjava",
        action: actionOdjava
      },
      {
        path: "knjige",
        element: <PrikazKnjiga></PrikazKnjiga>,
        loader: loaderKnjige,
      }
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
