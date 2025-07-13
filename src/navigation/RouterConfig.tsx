import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import UserGestion from "../pages/UserGestion";

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
