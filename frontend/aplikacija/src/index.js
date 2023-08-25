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
import { loaderAutentifikacija, tokenLoader } from "./components/autentifikacija/token";
import Registracija, { actionRegistracija } from "./components/autentifikacija/Registracija";
import { Provider } from 'react-redux'
import store from "./store/store";
import Checkout from "./components/checkout/Checkout";
import UspjesnaTransakcija from "./components/checkout/UspjesnaTransakcija"

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
        action: actionOdjava
      },
      {
        path: "knjige",
        element: <PrikazKnjiga></PrikazKnjiga>,
        loader: loaderKnjige,
      },
      {
        path: "checkout",
        element: <Checkout></Checkout>
      },
      {
        path: "uspjesnaTransakcija",
        element: <UspjesnaTransakcija></UspjesnaTransakcija>
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
