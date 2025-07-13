import React, { useState } from "react";
import { updateUser } from "../services/userService";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id_usuario: number;
    nombre: string;
    apellido: string;
    email: string;
    es_activo: boolean;
    rol: string;
    es_admin: boolean;
  } | null;
  onUserUpdated: () => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}) => {
  const [form, setForm] = useState(
    user || {
      id_usuario: 0,
      nombre: "",
      apellido: "",
      email: "",
      es_activo: true,
      rol: "USER",
      es_admin: false,
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  React.useEffect(() => {
    if (user) setForm(user);
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const { name, value } = target;
    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateUser(form.id_usuario, {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        es_activo: form.es_activo,
        rol: form.rol,
        es_admin: form.es_admin,
      });
      onUserUpdated();
      onClose();
    } catch {
      setError("No se pudo actualizar el usuario");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-2xl font-bold text-blue-700 mb-4 text-center">
          Editar Usuario
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-blue-700 mb-1 font-medium">
              Nombre
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1 font-medium">
              Apellido
            </label>
            <input
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1 font-medium">
              Correo
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1 font-medium">Rol</label>
            <select
              name="rol"
              value={form.rol}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            >
              <option value="USER">Usuario</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              name="es_admin"
              type="checkbox"
              checked={form.es_admin}
              onChange={handleChange}
              id="es_admin_edit"
              className="mr-2"
            />
            <label
              htmlFor="es_admin_edit"
              className="text-blue-700 font-medium"
            >
              ¿Es administrador?
            </label>
          </div>
          <div className="flex items-center">
            <input
              name="es_activo"
              type="checkbox"
              checked={form.es_activo}
              onChange={handleChange}
              id="es_activo_edit"
              className="mr-2"
            />
            <label
              htmlFor="es_activo_edit"
              className="text-blue-700 font-medium"
            >
              ¿Activo?
            </label>
          </div>
          {error && (
            <div className="text-red-500 text-center font-semibold">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-sky-400 to-cyan-500 text-white py-2 rounded-lg font-bold shadow hover:from-sky-500 hover:to-cyan-600 transition-colors disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Actualizar Usuario"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
