import React, { useState } from "react";
import { createDepartamento } from "../services/ubicacionService";

interface DepartamentoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDepartamentoCreated: () => void;
}

const initialState = {
  nombre: "",
  descripcion: "",
};

const DepartamentoModal: React.FC<DepartamentoModalProps> = ({
  isOpen,
  onClose,
  onDepartamentoCreated,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createDepartamento(form);
      setForm(initialState);
      onDepartamentoCreated();
      onClose();
    } catch {
      setError("No se pudo crear el departamento");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-400 hover:text-blue-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h3 className="text-xl font-semibold mb-4">Crear Departamento</h3>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="nombre">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1" htmlFor="descripcion">
              Descripción
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded ${
              loading ? "bg-gray-400" : "bg-cyan-500 hover:bg-cyan-600"
            }`}
          >
            {loading ? "Creando..." : "Crear Departamento"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default DepartamentoModal;

