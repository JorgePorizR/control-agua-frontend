import React, { useEffect, useState } from "react";
import { listUsers, deleteUser } from "../services/userService";
import UserModal from "../components/UserModal";
import EditUserModal from "../components/EditUserModal";
import Navbar from "../components/Navbar";

interface Usuario {
  id_usuario: number;
  nombre: string;
  apellido: string;
  email: string;
  es_activo: boolean;
  rol: string;
  es_admin: boolean;
}

const WaterDropIcon = () => (
  <svg
    className="inline-block align-middle mr-2"
    width="28"
    height="28"
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

const PlusIcon = () => (
  <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="12" fill="#38bdf8" />
    <path
      d="M12 7v10M7 12h10"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = () => (
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
      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
    />
  </svg>
);

const DeleteIcon = () => (
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
      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
    />
  </svg>
);

const UserGestion: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<Usuario | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await listUsers();
      setUsuarios(data);
    } catch {
      setError("No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (usuario: Usuario) => {
    setUserToEdit(usuario);
    setEditModalOpen(true);
  };

  const handleDeleteClick = async (usuario: Usuario) => {
    const confirm = window.confirm(
      `¿Estás seguro que deseas eliminar al usuario ${usuario.nombre} ${usuario.apellido}?`
    );
    if (!confirm) return;
    try {
      await deleteUser(usuario.id_usuario);
      fetchUsers();
    } catch {
      alert("No se pudo eliminar el usuario");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-300 to-cyan-200 flex flex-col items-center py-10 relative">
      <Navbar />
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-blue-100 w-full max-w-5xl p-8">
        <h2 className="text-3xl font-extrabold text-blue-700 mb-6 text-center flex items-center justify-center">
          <WaterDropIcon /> Gestión de Usuarios
        </h2>
        {error && (
          <div className="mb-4 text-red-500 text-center font-semibold">
            {error}
          </div>
        )}
        {loading ? (
          <div className="text-blue-500 text-center font-bold">
            Cargando usuarios...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md">
              <thead>
                <tr className="bg-gradient-to-r from-sky-400 to-cyan-500 text-white">
                  <th className="py-3 px-4 rounded-tl-lg">ID</th>
                  <th className="py-3 px-4">Nombre</th>
                  <th className="py-3 px-4">Apellido</th>
                  <th className="py-3 px-4">Correo</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">Activo</th>
                  <th className="py-3 px-4">Editar</th>
                  <th className="py-3 px-4 rounded-tr-lg">Eliminar</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr
                    key={usuario.id_usuario}
                    className="even:bg-blue-50 hover:bg-cyan-100 transition-colors"
                  >
                    <td className="py-2 px-4 text-center font-mono">
                      {usuario.id_usuario}
                    </td>
                    <td className="py-2 px-4">{usuario.nombre}</td>
                    <td className="py-2 px-4">{usuario.apellido}</td>
                    <td className="py-2 px-4">{usuario.email}</td>
                    <td className="py-2 px-4 text-center">
                      <span className="inline-block px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-semibold">
                        {usuario.rol}
                      </span>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {usuario.es_activo ? (
                        <span
                          className="inline-block w-3 h-3 rounded-full bg-green-400"
                          title="Activo"
                        ></span>
                      ) : (
                        <span
                          className="inline-block w-3 h-3 rounded-full bg-red-400"
                          title="Inactivo"
                        ></span>
                      )}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleEditClick(usuario)}
                        className="p-2 rounded-full hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-sky-300"
                        title="Editar usuario"
                      >
                        <EditIcon />
                      </button>
                    </td>
                    <td className="py-2 px-4 text-center">
                      <button
                        onClick={() => handleDeleteClick(usuario)}
                        className="p-2 rounded-full hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-300"
                        title="Eliminar usuario"
                      >
                        <DeleteIcon />
                      </button>
                    </td>
                  </tr>
                ))}
                {usuarios.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-6 text-center text-blue-400">
                      No hay usuarios registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Botón flotante para crear usuario */}
      <button
        onClick={() => setModalOpen(true)}
        className="fixed bottom-8 right-8 bg-sky-400 hover:bg-sky-500 text-white rounded-full shadow-lg p-4 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-sky-300 z-50"
        title="Crear usuario"
      >
        <PlusIcon />
      </button>
      <UserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onUserCreated={fetchUsers}
      />
      <EditUserModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        user={userToEdit}
        onUserUpdated={fetchUsers}
      />
    </div>
  );
};

export default UserGestion;
