import React, { useState, useEffect } from "react";
import { updateComunidad, listMunicipios } from "../services/ubicacionService";
import type { Comunidad, Municipio } from "../services/ubicacionService";

interface EditComunidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  comunidad: Comunidad | null;
  onComunidadUpdated: () => void;
}

const EditComunidadModal: React.FC<EditComunidadModalProps> = ({
  isOpen,
  onClose,
  comunidad,
  onComunidadUpdated,
}) => {
  const [form, setForm] = useState<Comunidad | null>(comunidad);
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

  useEffect(() => {
    if (comunidad) setForm(comunidad);
  }, [comunidad]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    setError("");
    try {
      await updateComunidad(form.id_comunidad, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        id_municipio: form.id_municipio,
      });
      onComunidadUpdated();
      onClose();
    } catch {
      setError("No se pudo actualizar la comunidad");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !form) return null;

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
          Editar Comunidad
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
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            />
          </div>
          <div>
            <label className="block text-blue-700 mb-1 font-medium">
              Municipio
            </label>
            <select
              name="id_municipio"
              value={form.id_municipio}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            >
              <option value="" disabled>
                Seleccione un municipio
              </option>
              {municipios.map((municipio) => (
                <option key={municipio.id_municipio} value={municipio.id_municipio}>
                  {municipio.nombre}
                </option>
              ))}
            </select>
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
            {loading ? "Actualizando..." : "Actualizar Comunidad"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditComunidadModal;
