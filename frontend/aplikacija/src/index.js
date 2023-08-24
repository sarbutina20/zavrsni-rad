import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { createBrowserRouter, redirect, RouterProvider } from "react-router-dom";
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import MainLayout from "./routes/MainLayout";
import { loaderKnjige, PrikazKnjiga } from "./components/knjiga/PrikazKnjiga";
import { actionPrijava, Prijava } from "./components/autentifikacija/Prijava";
import { actionOdjava } from "./components/autentifikacija/Odjava";
import { loaderAutentifikacija, tokenLoader } from "./components/autentifikacija/token";
import Registracija, { actionRegistracija } from "./components/autentifikacija/Registracija";
import { Provider } from 'react-redux'
import store from "./store/store";

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
        loader: loaderAutentifikacija
      },
      {
        path: "registracija",
        element: <Registracija></Registracija>,
        action: actionRegistracija,
        loader: loaderAutentifikacija
      },
      {
        path: "odjava",
        action: actionOdjava,
        loader: () => {
          return redirect('/')
        }
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
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
