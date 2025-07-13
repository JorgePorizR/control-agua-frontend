import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "user/login",
    element: "",
  },
  {
    path: "user/register",
    element: "",
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
