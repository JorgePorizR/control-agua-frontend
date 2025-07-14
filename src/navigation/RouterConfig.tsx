import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserGestion from "../pages/UserGestion";
import UbicacionGestion from "../pages/UbicacionGestion";
import MapComponent from "../components/MapComponent";
import CuerpoAguaGestion from "../pages/CuerpoAguaGestion";

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
    path: "/map",
    element: <MapComponent />,
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
