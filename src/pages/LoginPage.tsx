import React, { useState } from "react";
import { login } from "../services/authService";
import type { LoginCredentials } from "../services/authService";

const WaterDropIcon = () => (
  <svg
    className="mx-auto mb-4"
    width="48"
    height="48"
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

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const credentials: LoginCredentials = { email, password };
      const receivedToken = await login(credentials);

      // guardar en el sessionStorage
      sessionStorage.setItem("token", receivedToken.token);
      sessionStorage.setItem(
        "user",
        JSON.stringify({
          id_usuario: receivedToken.id,
          nombre: receivedToken.nombre,
          apellido: receivedToken.apellido,
          email: receivedToken.email,
          rol: receivedToken.rol,
          es_admin: receivedToken.es_admin,
        })
      );

      //console.log(receivedToken);
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response
          ?.data?.message === "string"
      ) {
        setError(
          (err as { response: { data: { message: string } } }).response.data
            .message
        );
      } else {
        setError("Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200">
      <form
        onSubmit={handleSubmit}
        className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
      >
        <WaterDropIcon />
        <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700 drop-shadow">
          Control de Agua
        </h2>
        <p className="text-center text-blue-400 mb-6">
          Inicia sesión para gestionar el sistema
        </p>
        <div className="mb-4">
          <label
            className="block text-blue-700 mb-2 font-medium"
            htmlFor="email"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 placeholder-blue-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="usuario@ejemplo.com"
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-blue-700 mb-2 font-medium"
            htmlFor="password"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            className="w-full px-4 py-2 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50 placeholder-blue-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />
        </div>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white py-2 rounded-lg font-bold shadow hover:from-sky-500 hover:to-cyan-600 transition-colors disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
