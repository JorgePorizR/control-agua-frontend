import React, { useState, useEffect } from "react";
import { createMunicipio, listDepartamentos } from "../services/ubicacionService";
import type { Departamento } from "../services/ubicacionService";

interface MunicipioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMunicipioCreated: () => void;
}

const initialState = {
  nombre: "",
  descripcion: "",
  id_departamento: 0,
};

const MunicipioModal: React.FC<MunicipioModalProps> = ({
  isOpen,
  onClose,
  onMunicipioCreated,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      try {
        const data = await listDepartamentos();
        setDepartamentos(data);
      } catch {
        setError("No se pudieron cargar los departamentos");
      }
    };

    if (isOpen) {
      fetchDepartamentos();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "id_departamento" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      console.log("Datos enviados:", form);
      await createMunicipio(form);
      setForm(initialState);
      onMunicipioCreated();
      onClose();
    } catch {
      setError("No se pudo crear el municipio");
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
        <h2 className="text-xl font-semibold mb-4">Crear Municipio</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              rows={3}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Departamento</label>
            <select
              name="id_departamento"
              value={form.id_departamento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            >
              <option value={0} disabled>
                Seleccione un departamento
              </option>
              {departamentos.map((departamento) => (
                <option key={departamento.id_departamento} value={departamento.id_departamento}>
                  {departamento.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creando..." : "Crear Municipio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MunicipioModal;