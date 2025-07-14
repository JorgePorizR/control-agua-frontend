import React, { useEffect, useState } from "react";
import { logout } from "../services/authService";

export interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  es_admin: boolean;
}

const WaterDropIcon = () => (
  <svg
    className="inline-block align-middle mr-2"
    width="32"
    height="32"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M24 4C24 4 10 20.5 10 30C10 38.2843 16.7157 45 25 45C33.2843 45 40 38.2843 40 30C40 20.5 24 4 24 4Z"
      fill="url(#paint0_linear)"
    />
    <defs>
      <linearGradient
        id="paint0_linear"
        x1="24"
        y1="4"
        x2="24"
        y2="45"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#38bdf8" />
        <stop offset="1" stopColor="#0ea5e9" />
      </linearGradient>
    </defs>
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const Navbar: React.FC = () => {
  const [user, setUser] = useState<Usuario>();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(undefined);
    }
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md shadow-md border-b border-blue-100 px-6 py-2 flex items-center justify-between">
      {/* Izquierda: Logo y título */}
      <div className="flex items-center min-w-[180px] justify-end">
        <WaterDropIcon />
        <span className="text-2xl font-extrabold text-blue-700 ml-2 tracking-tight">
          Control de Agua
        </span>
      </div>
      {/* Centro: Navegación */}
      {user ? (
        <div className="flex-1 flex justify-center gap-4">
          <a
            href="/usuarios"
            className="text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Usuarios
          </a>
          <a
            href="/ubicaciones"
            className="text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Ubicaciones
          </a>
          <a
            href="/cuerpos-agua"
            className="text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Cuerpos de Agua
          </a>
          <a
            href="/salidas-campo"
            className="text-blue-700 font-semibold px-4 py-2 rounded hover:bg-blue-100 transition-colors"
          >
            Salidas de Campo
          </a>
        </div>
      ) : (
        <> </>
      )}
      {/* Derecha: Login o usuario */}
      <div className="flex items-center min-w-[120px]">
        {!user ? (
          <a
            href="/login"
            className="text-blue-600 font-semibold px-4 py-2 rounded hover:bg-blue-50 transition-colors"
          >
            Iniciar sesión
          </a>
        ) : (
          <div className="relative">
            <button
              onClick={() => setShowMenu((v) => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded hover:bg-blue-50 transition-colors"
            >
              <UserIcon />
              <span className="font-medium text-blue-700 hidden sm:inline">
                {user.nombre}
              </span>
            </button>
            {showMenu && (
              <div className="absolute left-0 mt-2 w-40 bg-white border border-blue-100 rounded shadow-lg z-50">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-blue-50 rounded"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
