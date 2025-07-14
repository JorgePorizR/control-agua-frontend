import React, { useState, useEffect } from "react";
import { createComunidad, listMunicipios } from "../services/ubicacionService";
import type { Municipio } from "../services/ubicacionService";

interface ComunidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComunidadCreated: () => void;
}

const initialState = {
  nombre: "",
  descripcion: "",
  id_municipio: 0,
};

const ComunidadModal: React.FC<ComunidadModalProps> = ({
  isOpen,
  onClose,
  onComunidadCreated,
}) => {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [municipios, setMunicipios] = useState<Municipio[]>([]);

  useEffect(() => {
    const fetchMunicipios = async () => {
      try {
        const data = await listMunicipios();
        setMunicipios(data);
      } catch {
        setError("No se pudieron cargar los municipios");
      }
    };

    if (isOpen) {
      fetchMunicipios();
    }
  }, [isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      await createComunidad(form);
      setForm(initialState);
      onComunidadCreated();
      onClose();
    } catch {
      setError("Error al crear la comunidad");
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
        <h2 className="text-xl font-semibold mb-4">Crear Comunidad</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Municipio</label>
            <select
              name="id_municipio"
              value={form.id_municipio}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Seleccione un municipio</option>
              {municipios.map((m) => (
                <option key={m.id_municipio} value={m.id_municipio}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full p-2 bg-blue-500 text-white rounded ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Creando..." : "Crear Comunidad"}
          </button>
        </form>
      </div>
    </div>
  );
}
export default ComunidadModal;