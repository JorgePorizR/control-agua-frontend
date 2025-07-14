import React, { useState, useEffect } from "react";
import { updateMunicipio, listDepartamentos } from "../services/ubicacionService";
import type { Municipio, Departamento } from "../services/ubicacionService";

interface EditMunicipioModalProps {
  isOpen: boolean;
  onClose: () => void;
  municipio: Municipio | null;
  onMunicipioUpdated: () => void;
}

const EditMunicipioModal: React.FC<EditMunicipioModalProps> = ({
  isOpen,
  onClose,
  municipio,
  onMunicipioUpdated,
}) => {
  const [form, setForm] = useState<Municipio | null>(municipio);
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

  useEffect(() => {
    if (municipio) setForm(municipio);
  }, [municipio]);

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
      await updateMunicipio(form.id_municipio, {
        nombre: form.nombre,
        descripcion: form.descripcion,
        id_departamento: form.id_departamento,
      });
      onMunicipioUpdated();
      onClose();
    } catch {
      setError("No se pudo actualizar el municipio");
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
          Editar Municipio
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
              Departamento
            </label>
            <select
              name="id_departamento"
              value={form.id_departamento}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-blue-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-50"
            >
              <option value="" disabled>
                Seleccione un departamento
              </option>
              {departamentos.map((departamento) => (
                <option key={departamento.id_departamento} value={departamento.id_departamento}>
                  {departamento.nombre}
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
            {loading ? "Actualizando..." : "Actualizar Municipio"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditMunicipioModal;
