import UspjesnaTransakcija from "./components/checkout/UspjesnaTransakcija"
import ErrorPage from "./routes/ErrorPage/ErrorPage";
import MainLayout from "./routes/MainLayout";
import { loaderKnjige, PrikazKnjiga } from "./components/knjiga/PrikazKnjiga";
import { Prijava } from "./components/autentifikacija/Prijava";
import { actionOdjava } from "./components/autentifikacija/Odjava";
import { loaderAutentifikacija, tokenLoader } from "./components/autentifikacija/token";
import Registracija, { actionRegistracija } from "./components/autentifikacija/Registracija";
import App from "./App";
import { createBrowserRouter } from "react-router-dom";


export const kreirajRouter = () => {
    const router = createBrowserRouter([
        {
          path: "/",
          loader: tokenLoader,
          element: <MainLayout></MainLayout>,
          errorElement: <ErrorPage></ErrorPage>,
          id:'root',
          children: [
            {
              index: true,
              element: <App></App>
            },
            {
              path: "prijava",
              element: <Prijava></Prijava>,
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
              path: "uspjesnaTransakcija",
              element: <UspjesnaTransakcija></UspjesnaTransakcija>
            }
          ],
        },
      ]);
      return router; 
}