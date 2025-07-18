import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserGestion from "../pages/UserGestion";
import UbicacionGestion from "../pages/UbicacionGestion";
import CuerpoAguaGestion from "../pages/CuerpoAguaGestion";
import GaleriaCuerpoAgua from "../pages/GaleriaCuerpoAgua";
import SalidaCampoGestion from "../pages/SalidaCampoGestion";
import TecnicoGestion from "../pages/TecnicoGestion";
import AnalisisMuestreo from "../pages/AnalisisMuestreo";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/usuarios",
    element: <UserGestion />,
  },
  {
    path: "/ubicaciones",
    element: <UbicacionGestion />,
  },
  {
    path: "/cuerpos-agua",
    element: <CuerpoAguaGestion />,
  },
  {
    path: "/cuerpos-agua/:id",
    element: <GaleriaCuerpoAgua />,
  },
  {
    path: "/salidas-campo",
    element: <SalidaCampoGestion />,
  },
  {
    path: "/mis-salidas",
    element: <TecnicoGestion />,
  },
  {
    path: "/analisis-muestreo/:id",
    element: <AnalisisMuestreo />,
  },
  {
    path: "*",
    element: (
      <div className="bg-black h-screen">
        <h1 className="text-white text-center text-4xl pt-6 font-bold">
          404 Not Found
        </h1>
      </div>
    ),
  },
]);
